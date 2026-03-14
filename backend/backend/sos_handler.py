from datetime import datetime, timezone

from database import insert_sos


def create_sos_request(location):
    event_time = datetime.now(timezone.utc).isoformat()
    sos_id = insert_sos(location=location, event_time=event_time, status="OPEN")
    return {
        "id": sos_id,
        "location": location,
        "time": event_time,
        "status": "OPEN",
    }
