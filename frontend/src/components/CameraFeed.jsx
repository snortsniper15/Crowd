import { motion as Motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Camera, Radio, ShieldCheck } from 'lucide-react'
import { getVideoFeedUrl } from '../services/api'

function CameraFeed({ peopleCount = 42, densityLevel = 'High' }) {
  const [streamError, setStreamError] = useState(false)
  const [retryKey, setRetryKey] = useState(0)
  const videoFeedUrl = getVideoFeedUrl()

  useEffect(() => {
    if (!streamError) {
      return undefined
    }

    const retryTimer = window.setTimeout(() => {
      setRetryKey((currentKey) => currentKey + 1)
    }, 3000)

    return () => window.clearTimeout(retryTimer)
  }, [streamError])

  return (
    <Motion.section
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card gradient-border relative rounded-xl p-4 shadow-sm"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2
          className="font-['Orbitron',sans-serif] text-sm uppercase tracking-[0.2em]"
          style={{ color: '#0f172a' }}
        >
          Smart Surveillance Console
        </h2>
        <div
          className="flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
          style={
            streamError
              ? { background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.18)', color: '#92400e' }
              : { background: 'rgba(20,184,166,0.08)', border: '1px solid rgba(20,184,166,0.18)', color: '#115e59' }
          }
        >
          <Radio className={`h-3.5 w-3.5 ${streamError ? '' : 'animate-pulse'}`} />
          {streamError ? 'Reconnecting Stream' : 'Live Stream Online'}
        </div>
      </div>

      <div
        className="scan-overlay relative h-72 overflow-hidden rounded-xl sm:h-80"
        style={{
          border: '1px solid rgba(148,163,184,0.18)',
          background: 'linear-gradient(145deg, #e2e8f0, #cbd5e1)',
        }}
      >
        <img
          key={retryKey}
          src={`${videoFeedUrl}?retry=${retryKey}`}
          alt="Live camera feed"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
            streamError ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={() => setStreamError(false)}
          onError={() => setStreamError(true)}
        />

        {streamError ? (
          <div
            className="absolute inset-0 flex h-full flex-col items-center justify-center gap-3 px-6 text-center"
            style={{
              background:
                'radial-gradient(circle at 20% 20%, rgba(99,102,241,0.1), transparent 40%), radial-gradient(circle at 80% 70%, rgba(20,184,166,0.08), transparent 40%), #e2e8f0',
            }}
          >
            <Camera className="h-8 w-8 text-slate-700" />
            <div
              className="font-['Orbitron',sans-serif] text-sm uppercase tracking-[0.2em]"
              style={{ color: '#334155' }}
            >
              Camera feed unavailable
            </div>
            <p className="max-w-md text-sm text-slate-700">
              Waiting for the backend stream. Auto reconnect is active.
            </p>
          </div>
        ) : null}

        <div
          className="absolute left-3 top-3 rounded-xl px-3 py-2 text-xs"
          style={{
            background: 'rgba(255,255,255,0.88)',
            border: '1px solid rgba(148,163,184,0.18)',
            color: '#0f172a',
          }}
        >
          <p className="font-semibold">{`People detected: ${peopleCount}`}</p>
          <p className="text-slate-700">{`Density level: ${typeof densityLevel === 'string' ? densityLevel.toUpperCase() : densityLevel}`}</p>
        </div>

        <div
          className="absolute right-3 top-3 rounded-xl px-3 py-2 text-[11px]"
          style={{
            background: 'rgba(255,255,255,0.88)',
            border: '1px solid rgba(148,163,184,0.18)',
            color: '#0f766e',
          }}
        >
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" />
            AI Tracking Enabled
          </div>
        </div>
      </div>
    </Motion.section>
  )
}

export default CameraFeed
