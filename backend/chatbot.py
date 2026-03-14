import os

from openai import OpenAI


SYSTEM_PROMPT = (
    "You are SafeCrowd AI Assistant for crowd safety operations. "
    "Answer with concise, factual safety guidance. "
    "Use provided operational context first, do not invent emergencies."
)


def _fallback_answer(question, context):
    crowd = context.get("crowd") or {}
    density = crowd.get("density_level", "UNKNOWN")
    count = crowd.get("people_count", "N/A")

    if "emergency" in question.lower() and density in {"LOW", "MEDIUM"}:
        return (
            "No emergency has been officially reported. "
            f"Current density is {density} with approximately {count} people detected."
        )

    if density in {"HIGH", "CRITICAL"}:
        return (
            f"Crowd pressure is currently {density}. "
            "Security teams should continue gate control and monitor surge points."
        )

    return "System is monitoring normally. No high-priority incident is currently flagged."


def generate_chatbot_answer(question, context):
    api_key = os.getenv("OPENAI_API_KEY", "").strip()
    if not api_key:
        return _fallback_answer(question, context)

    client = OpenAI(api_key=api_key)

    user_context = {
        "crowd_data": context.get("crowd"),
        "recent_announcements": context.get("announcements", []),
        "recent_alerts": context.get("alerts", []),
        "safety_policy": "Prioritize accurate, non-alarmist communication and emergency escalation when needed.",
    }

    response = client.chat.completions.create(
        model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
        temperature=0.2,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {
                "role": "user",
                "content": f"Context: {user_context}\n\nQuestion: {question}",
            },
        ],
    )

    return response.choices[0].message.content.strip()
