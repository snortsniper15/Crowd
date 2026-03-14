import { motion as Motion } from 'framer-motion'
import Crowd3DScene from '../components/Crowd3DScene'

function ThreeDView({ realtime }) {
  return (
    <div className="space-y-4">
      <Crowd3DScene peopleCount={realtime.peopleCount} sosRequests={realtime.sosRequests} />

      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <Motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card gradient-border rounded-xl border p-4 text-sm font-medium text-slate-800 shadow-sm"
        >
          <p>
            Interactive controls enabled: zoom, rotate, and pan. Zone colors shift with dynamic crowd pressure and SOS
            markers flash in red.
          </p>
        </Motion.section>

        <Motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
          className="glass-card gradient-border rounded-xl border p-4 shadow-sm"
        >
          <h4 className="mb-3 font-['Orbitron',sans-serif] text-xs uppercase tracking-[0.18em] text-slate-900">
            Zone Legend
          </h4>
          <div className="space-y-2 text-xs font-medium text-slate-700">
            <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />Low</div>
            <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-amber-400" />Medium</div>
            <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-orange-400" />High</div>
            <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-rose-500" />Critical / SOS</div>
          </div>
        </Motion.section>
      </div>
    </div>
  )
}

export default ThreeDView
