import sqlite3
import threading
from contextlib import contextmanager
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent / "safecrowd.db"
_LOCK = threading.Lock()


@contextmanager
def get_connection():
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    try:
        yield connection
        connection.commit()
    finally:
        connection.close()


def init_db():
    with _LOCK, get_connection() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS CrowdData (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                people_count INTEGER NOT NULL,
                density_level TEXT NOT NULL,
                timestamp TEXT NOT NULL
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS SOSRequests (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                location TEXT NOT NULL,
                time TEXT NOT NULL,
                status TEXT NOT NULL
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS Alerts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                message TEXT NOT NULL,
                timestamp TEXT NOT NULL
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS Announcements (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                message TEXT NOT NULL,
                timestamp TEXT NOT NULL
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS ChatLogs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                question TEXT NOT NULL,
                answer TEXT NOT NULL,
                timestamp TEXT NOT NULL
            )
            """
        )


def insert_crowd_data(people_count, density_level, timestamp):
    with _LOCK, get_connection() as conn:
        conn.execute(
            "INSERT INTO CrowdData (people_count, density_level, timestamp) VALUES (?, ?, ?)",
            (people_count, density_level, timestamp),
        )


def insert_alert(message, timestamp):
    with _LOCK, get_connection() as conn:
        conn.execute("INSERT INTO Alerts (message, timestamp) VALUES (?, ?)", (message, timestamp))


def insert_sos(location, event_time, status="OPEN"):
    with _LOCK, get_connection() as conn:
        cursor = conn.execute(
            "INSERT INTO SOSRequests (location, time, status) VALUES (?, ?, ?)",
            (location, event_time, status),
        )
        return cursor.lastrowid


def insert_announcement(message, timestamp):
    with _LOCK, get_connection() as conn:
        cursor = conn.execute(
            "INSERT INTO Announcements (message, timestamp) VALUES (?, ?)",
            (message, timestamp),
        )
        return cursor.lastrowid


def insert_chat_log(question, answer, timestamp):
    with _LOCK, get_connection() as conn:
        conn.execute(
            "INSERT INTO ChatLogs (question, answer, timestamp) VALUES (?, ?, ?)",
            (question, answer, timestamp),
        )


def fetch_recent_announcements(limit=5):
    with _LOCK, get_connection() as conn:
        rows = conn.execute(
            "SELECT id, message, timestamp FROM Announcements ORDER BY id DESC LIMIT ?",
            (limit,),
        ).fetchall()
        return [dict(row) for row in rows]


def fetch_recent_alerts(limit=10):
    with _LOCK, get_connection() as conn:
        rows = conn.execute(
            "SELECT id, message, timestamp FROM Alerts ORDER BY id DESC LIMIT ?",
            (limit,),
        ).fetchall()
        return [dict(row) for row in rows]


def fetch_latest_crowd_data():
    with _LOCK, get_connection() as conn:
        row = conn.execute(
            "SELECT people_count, density_level, timestamp FROM CrowdData ORDER BY id DESC LIMIT 1"
        ).fetchone()
        return dict(row) if row else None


def fetch_analytics(limit=100):
    with _LOCK, get_connection() as conn:
        rows = conn.execute(
            "SELECT id, people_count, density_level, timestamp FROM CrowdData ORDER BY id DESC LIMIT ?",
            (limit,),
        ).fetchall()
        return [dict(row) for row in rows]
