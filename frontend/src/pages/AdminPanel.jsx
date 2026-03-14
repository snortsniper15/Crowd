import { useState } from 'react'
import { sendAnnouncement } from '../services/api'
import GradientButton from '../components/GradientButton'

function AdminPanel({ realtime, onAnnouncementSend }) {
  const [message, setMessage] = useState('Gate B temporarily closed')
  const [status, setStatus] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!message.trim()) {
      return
    }

    try {
      const response = await sendAnnouncement(message.trim())
      if (response.success) {
        onAnnouncementSend(message.trim())
        setStatus('Announcement published to dashboard alerts panel.')
        setMessage('')
      }
    } catch {
      setStatus('Failed to publish announcement. Verify backend connection.')
    }
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
      <section
        className="glass-card gradient-border rounded-xl p-5 shadow-sm"
        style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.98), rgba(248,250,252,0.94))' }}
      >
        <h3 className="mb-4 font-['Orbitron',sans-serif] text-lg font-bold text-slate-900">
          Admin Control Panel
        </h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block text-sm font-semibold text-slate-800">Send Announcement</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full resize-none rounded-xl p-3 text-sm text-slate-900 outline-none"
            style={{
              background: 'rgba(255,255,255,0.94)',
              border: '1px solid rgba(148,163,184,0.2)',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'rgba(37,99,235,0.35)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(148,163,184,0.2)'
            }}
          />
          <GradientButton type="submit" variant="sunset">
            Broadcast Message
          </GradientButton>
          {status ? <p className="text-sm font-medium text-emerald-600">✓ {status}</p> : null}
        </form>
      </section>

      <section
        className="glass-card gradient-border rounded-xl p-5 shadow-sm"
        style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.98), rgba(239,246,255,0.94))' }}
      >
        <h4 className="mb-4 font-['Orbitron',sans-serif] text-sm uppercase tracking-[0.16em] text-slate-900">
          Control Metrics
        </h4>
        <div className="space-y-3">
          {[
            { label: 'Live People Count', value: realtime.peopleCount, color: '#2563eb' },
            { label: 'Current Density', value: realtime.densityLevel, color: '#6366f1' },
            { label: 'Open Alerts', value: realtime.activeAlerts, color: '#f59e0b' },
            { label: 'Pending SOS', value: realtime.sosRequests, color: '#14b8a6' },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="flex items-center justify-between rounded-xl px-4 py-3 text-sm"
              style={{
                background: 'rgba(255,255,255,0.9)',
                border: '1px solid rgba(148,163,184,0.14)',
              }}
            >
              <span className="text-slate-700">{label}</span>
              <span className="font-['Orbitron',sans-serif] text-base font-bold" style={{ color }}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default AdminPanel