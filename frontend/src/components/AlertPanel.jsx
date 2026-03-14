import { AnimatePresence, motion as Motion } from 'framer-motion'
import { AlertTriangle, ShieldAlert, Zap } from 'lucide-react'

function AlertPanel({ alerts = [] }) {
  return (
    <div
      className="glass-card gradient-border rounded-xl p-4 shadow-sm"
      style={{
        background: 'linear-gradient(160deg, rgba(255,255,255,0.96), rgba(248,250,252,0.92))',
      }}
    >
      <div className="mb-3 flex items-center gap-2">
        <div className="rounded-lg p-1.5" style={{ background: 'rgba(239,68,68,0.08)' }}>
          <ShieldAlert className="h-4 w-4" style={{ color: '#ef4444' }} />
        </div>
        <h3
          className="font-['Orbitron',sans-serif] text-sm uppercase tracking-[0.18em]"
          style={{ color: '#0f172a' }}
        >
          Security Alerts
        </h3>
        {alerts.length > 0 ? (
          <span
            className="ml-auto rounded-full px-2 py-0.5 text-xs font-bold"
            style={{ background: 'rgba(239,68,68,0.08)', color: '#b91c1c', border: '1px solid rgba(239,68,68,0.16)' }}
          >
            {alerts.length}
          </span>
        ) : null}
      </div>

      <div className="neon-scroll max-h-64 space-y-2 overflow-auto pr-1">
        <AnimatePresence>
          {alerts.length === 0 ? (
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center gap-2 py-8 text-center"
            >
              <Zap className="h-6 w-6 text-slate-500" />
              <p className="text-sm text-slate-700">No active alerts</p>
            </Motion.div>
          ) : (
            alerts.map((alert, index) => (
              <Motion.div
                key={alert.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.03 }}
                className="alert-pulse rounded-xl p-3"
                style={{
                  background: 'linear-gradient(110deg, rgba(254,242,242,1), rgba(255,247,237,1))',
                  border: '1px solid rgba(239,68,68,0.14)',
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-medium text-slate-800">{`⚠ ${alert.text}`}</p>
                  <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
                </div>
                <p className="mt-1 text-xs text-slate-600">{alert.timestamp}</p>
              </Motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default AlertPanel
