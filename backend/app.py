from datetime import datetime, timezone
import os
import threading
import time

from flask import Flask, Response, jsonify, request
from flask_socketio import SocketIO

from chatbot import generate_chatbot_answer
from crowd_detection import CrowdDetector
from database import (
    fetch_analytics,
    fetch_latest_crowd_data,
    fetch_recent_alerts,
    fetch_recent_announcements,
    init_db,
    insert_alert,
    insert_announcement,
    insert_chat_log,
    insert_crowd_data,
)
from sos_handler import create_sos_request

app = Flask(__name__)
app.config["SECRET_KEY"] = "safecrowd-secret"
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="threading")


def utc_now_iso():
    return datetime.now(timezone.utc).isoformat()

latest_crowd_state = {
    "people_count": 0,
    "density_level": "LOW",
    "timestamp": utc_now_iso(),
}
detector = None


@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS"
    return response


@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        return ("", 204)
    return None


def process_detection_update(data, frame=None):
    del frame

    latest_crowd_state.update(data)
    insert_crowd_data(
        people_count=data["people_count"],
        density_level=data["density_level"],
        timestamp=data["timestamp"],
    )

    alerts = []
    if data["density_level"] in {"HIGH", "CRITICAL"}:
        message = "Overcrowding detected near camera"
        alert_payload = {
            "id": f"alert-{int(datetime.now(timezone.utc).timestamp())}",
            "message": message,
            "timestamp": data["timestamp"],
        }
        insert_alert(message=message, timestamp=data["timestamp"])
        socketio.emit("alert", alert_payload)
        alerts.append(alert_payload)

    socketio.emit(
        "crowd_update",
        {
            "people_count": data["people_count"],
            "density_level": data["density_level"],
            "timestamp": data["timestamp"],
            "alerts": alerts,
        },
    )


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"ok": True, "service": "SafeCrowd backend"})


@app.route("/sos", methods=["POST"])
def create_sos():
    payload = request.get_json(silent=True) or {}
    location = (payload.get("location") or "Unknown").strip()

    sos = create_sos_request(location)
    socketio.emit("sos_alert", sos)
    insert_alert(message=f"SOS triggered at {location}", timestamp=sos["time"])

    return jsonify({"success": True, "data": sos}), 201


@app.route("/announcement", methods=["POST"])
def create_announcement():
    payload = request.get_json(silent=True) or {}
    message = (payload.get("message") or "").strip()

    if not message:
        return jsonify({"success": False, "error": "message is required"}), 400

    timestamp = utc_now_iso()
    announcement_id = insert_announcement(message=message, timestamp=timestamp)
    event = {
        "id": announcement_id,
        "message": message,
        "timestamp": timestamp,
    }

    socketio.emit("announcement", event)
    return jsonify({"success": True, "data": event}), 201


@app.route("/chat", methods=["POST"])
def chat():
    payload = request.get_json(silent=True) or {}
    question = (payload.get("question") or "").strip()

    if not question:
        return jsonify({"success": False, "error": "question is required"}), 400

    context = {
        "crowd": fetch_latest_crowd_data() or latest_crowd_state,
        "announcements": fetch_recent_announcements(limit=5),
        "alerts": fetch_recent_alerts(limit=10),
    }

    answer = generate_chatbot_answer(question, context)
    insert_chat_log(question=question, answer=answer, timestamp=utc_now_iso())

    return jsonify({"answer": answer})


@app.route("/analytics", methods=["GET"])
def analytics():
    return jsonify({"data": fetch_analytics(limit=200)})


@app.route("/video_feed", methods=["GET"])
def video_feed():
    def generate_frames():
        while True:
            if detector is None:
                time.sleep(0.15)
                continue

            frame = detector.get_jpeg_frame()
            if frame is None:
                time.sleep(0.05)
                continue

            yield (
                b"--frame\r\n"
                b"Content-Type: image/jpeg\r\n\r\n" + frame + b"\r\n"
            )

    return Response(generate_frames(), mimetype="multipart/x-mixed-replace; boundary=frame")


@socketio.on("connect")
def handle_connect():
    socketio.emit(
        "crowd_update",
        {
            "people_count": latest_crowd_state["people_count"],
            "density_level": latest_crowd_state["density_level"],
            "timestamp": latest_crowd_state["timestamp"],
            "alerts": [],
        },
    )


def start_detection_worker():
    global detector
    detector = CrowdDetector(on_update=process_detection_update)
    detector.start()


# Initialise DB and start detection worker at import time so both
# `python app.py` (local) and gunicorn (production) pick them up.
init_db()
_detection_thread = threading.Thread(target=start_detection_worker, daemon=True)
_detection_thread.start()


if __name__ == "__main__":
    socketio.run(
        app,
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 5000)),
        debug=False,
        allow_unsafe_werkzeug=True,
    )
