const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://safecrowd-backend.onrender.com'

async function postJSON(path, body) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const payload = await response.json()
  if (!response.ok) {
    throw new Error(payload.error || 'Request failed')
  }
  return payload
}

export function getVideoFeedUrl() {
  return `${API_BASE}/video_feed`
}

export async function sendAnnouncement(message) {
  return postJSON('/announcement', { message })
}

export async function triggerEmergency(payload) {
  return postJSON('/sos', payload)
}

export async function askChatbot(question) {
  return postJSON('/chat', { question })
}
