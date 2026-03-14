import time
from datetime import datetime, timezone
import platform
import threading

import cv2
import numpy as np
from ultralytics import YOLO


def _density_level(count):
    if count <= 10:
        return "LOW"
    if count <= 30:
        return "MEDIUM"
    if count <= 60:
        return "HIGH"
    return "CRITICAL"


class CrowdDetector:
    def __init__(self, on_update, model_path="models/yolov8n.pt", camera_index=0):
        self.on_update = on_update
        self.model_path = model_path
        self.camera_index = camera_index
        self.running = False
        self._frame_lock = threading.Lock()
        self._latest_frame = None

    def _set_latest_frame(self, frame):
        with self._frame_lock:
            self._latest_frame = frame.copy()

    def _build_status_frame(self, title, detail):
        frame = np.zeros((720, 1280, 3), dtype=np.uint8)
        frame[:] = (15, 23, 42)
        cv2.rectangle(frame, (48, 48), (1232, 672), (39, 242, 255), 2)
        cv2.putText(
            frame,
            title,
            (96, 220),
            cv2.FONT_HERSHEY_SIMPLEX,
            1.5,
            (39, 242, 255),
            3,
            cv2.LINE_AA,
        )
        cv2.putText(
            frame,
            detail,
            (96, 300),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.9,
            (203, 213, 225),
            2,
            cv2.LINE_AA,
        )
        cv2.putText(
            frame,
            datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC"),
            (96, 380),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (148, 163, 184),
            2,
            cv2.LINE_AA,
        )
        return frame

    def _open_capture(self):
        candidates = []
        if platform.system() == "Windows":
            candidates = [
                (self.camera_index, cv2.CAP_DSHOW),
                (self.camera_index, cv2.CAP_MSMF),
                (1, cv2.CAP_DSHOW),
                (1, cv2.CAP_MSMF),
            ]
        else:
            candidates = [(self.camera_index, cv2.CAP_ANY), (1, cv2.CAP_ANY)]

        for index, backend in candidates:
            capture = cv2.VideoCapture(index, backend)
            if not capture.isOpened():
                capture.release()
                continue

            capture.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
            capture.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
            capture.set(cv2.CAP_PROP_BUFFERSIZE, 1)

            ok, frame = capture.read()
            if ok and frame is not None:
                self._set_latest_frame(frame)
                return capture

            capture.release()

        return None

    def start(self):
        self.running = True
        self._set_latest_frame(
            self._build_status_frame(
                "Starting camera",
                "Initializing detection pipeline and waiting for webcam frames.",
            )
        )
        model = YOLO(self.model_path)
        capture = self._open_capture()

        if capture is None:
            self._set_latest_frame(
                self._build_status_frame(
                    "Camera unavailable",
                    "No webcam could be opened. Check camera permissions or close apps using the device.",
                )
            )
            self.on_update(
                {
                    "people_count": 0,
                    "density_level": "LOW",
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                    "error": "Webcam unavailable",
                },
                frame=None,
            )
            return

        last_emit = 0.0

        while self.running:
            ok, frame = capture.read()
            if not ok:
                self._set_latest_frame(
                    self._build_status_frame(
                        "Camera signal lost",
                        "The webcam stopped returning frames. SafeCrowd is waiting for the device to recover.",
                    )
                )
                time.sleep(0.05)
                continue

            result = model.predict(frame, verbose=False, classes=[0])[0]
            people_count = 0

            if result.boxes is not None and len(result.boxes) > 0:
                for box in result.boxes:
                    x1, y1, x2, y2 = map(int, box.xyxy[0])
                    people_count += 1
                    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 255), 2)
                    cv2.putText(
                        frame,
                        "person",
                        (x1, max(y1 - 10, 0)),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        0.5,
                        (0, 255, 255),
                        1,
                        cv2.LINE_AA,
                    )

            now = time.time()
            if now - last_emit >= 1.0:
                payload = {
                    "people_count": people_count,
                    "density_level": _density_level(people_count),
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                }

                self._set_latest_frame(frame)

                self.on_update(payload, frame=frame)
                last_emit = now

        capture.release()

    def stop(self):
        self.running = False

    def get_jpeg_frame(self):
        with self._frame_lock:
            if self._latest_frame is None:
                return None
            ok, encoded = cv2.imencode(".jpg", self._latest_frame)
            if not ok:
                return None
            return encoded.tobytes()
