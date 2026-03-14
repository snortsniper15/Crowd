import { Activity, AlertCircle, ShieldAlert, Users } from 'lucide-react'
import StatCard from '../components/StatCard'
import CameraFeed from '../components/CameraFeed'
import AlertPanel from '../components/AlertPanel'
import Heatmap from '../components/Heatmap'

function Dashboard({ realtime, alertFeed, minimal }) {
  if (minimal) {
    return (
      <section className="glass-card gradient-border rounded-xl border p-6 text-slate-900 shadow-sm">
        <h2 className="font-['Orbitron',sans-serif] text-lg text-slate-900">Settings Panel</h2>
        <p className="mt-2 text-slate-700">Control room preferences, thresholds, and camera profiles are configurable from this area.</p>
      </section>
    )
  }

  if (realtime.isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={`sk-${idx}`} className="glass-card h-28 animate-pulse rounded-xl border border-slate-200" />
          ))}
        </div>
        <div className="glass-card h-72 animate-pulse rounded-xl border border-slate-200" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="People Count" value={realtime.peopleCount} icon={Users} accent="cyan" />
        <StatCard label="Crowd Density" value={realtime.densityLevel} icon={Activity} accent="amber" />
        <StatCard label="Active Alerts" value={realtime.activeAlerts} icon={AlertCircle} accent="rose" />
        <StatCard label="SOS Requests" value={realtime.sosRequests} icon={ShieldAlert} accent="lime" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <CameraFeed peopleCount={realtime.peopleCount} densityLevel={realtime.densityLevel} />
        <AlertPanel alerts={alertFeed} />
      </div>

      <Heatmap values={[12, 34, 58, 83, 71, 40, 24, 47, 66, 93, 61, 22]} />
    </div>
  )
}

export default Dashboard
