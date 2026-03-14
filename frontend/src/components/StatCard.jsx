import { useEffect, useState } from 'react'
import { motion as Motion } from 'framer-motion'

function StatCard({ label, value, icon: Icon, accent = 'cyan', suffix = '' }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (typeof value !== 'number') {
      return
    }

    let startTime
    const duration = 820

    const animate = (time) => {
      if (!startTime) {
        startTime = time
      }
      const progress = Math.min((time - startTime) / duration, 1)
      setDisplayValue(Math.round(progress * value))
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [value])

  const accentStyles = {
    cyan: {
      gradient: 'linear-gradient(160deg, rgba(255,255,255,0.98), rgba(239,246,255,0.95))',
      border: 'rgba(37,99,235,0.14)',
      iconBg: 'linear-gradient(120deg, rgba(37,99,235,0.1), rgba(99,102,241,0.08))',
      iconColor: '#2563eb',
      valueColor: '#0f172a',
      bar: 'linear-gradient(90deg, #2563eb, #6366f1)',
    },
    amber: {
      gradient: 'linear-gradient(160deg, rgba(255,255,255,0.98), rgba(238,242,255,0.95))',
      border: 'rgba(99,102,241,0.14)',
      iconBg: 'linear-gradient(120deg, rgba(99,102,241,0.1), rgba(37,99,235,0.08))',
      iconColor: '#6366f1',
      valueColor: '#0f172a',
      bar: 'linear-gradient(90deg, #6366f1, #2563eb)',
    },
    rose: {
      gradient: 'linear-gradient(160deg, rgba(255,255,255,0.98), rgba(254,242,242,0.95))',
      border: 'rgba(239,68,68,0.12)',
      iconBg: 'linear-gradient(120deg, rgba(239,68,68,0.08), rgba(245,158,11,0.08))',
      iconColor: '#ef4444',
      valueColor: '#0f172a',
      bar: 'linear-gradient(90deg, #ef4444, #f59e0b)',
    },
    lime: {
      gradient: 'linear-gradient(160deg, rgba(255,255,255,0.98), rgba(240,253,250,0.95))',
      border: 'rgba(20,184,166,0.14)',
      iconBg: 'linear-gradient(120deg, rgba(20,184,166,0.1), rgba(13,148,136,0.08))',
      iconColor: '#14b8a6',
      valueColor: '#0f172a',
      bar: 'linear-gradient(90deg, #14b8a6, #2563eb)',
    },
  }

  const style = accentStyles[accent] || accentStyles.cyan

  return (
    <Motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 180, damping: 18 }}
      className="glass-card rounded-xl p-4"
      style={{
        background: style.gradient,
        border: `1px solid ${style.border}`,
      }}
    >
      <div className="mb-3 h-1.5 rounded-full" style={{ background: style.bar }} />
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">{label}</p>
        {Icon ? (
          <Motion.div
            whileHover={{ rotate: 8, scale: 1.08 }}
            className="rounded-lg p-1.5"
            style={{ background: style.iconBg, border: '1px solid rgba(148,163,184,0.16)' }}
          >
            <Icon className="h-4 w-4" style={{ color: style.iconColor }} />
          </Motion.div>
        ) : null}
      </div>
      <Motion.p
        key={String(value)}
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 0.45 }}
        className="font-['Orbitron',sans-serif] text-3xl font-semibold"
        style={{ color: style.valueColor }}
      >
        {typeof value === 'number' ? displayValue : value}
        {suffix}
      </Motion.p>
    </Motion.div>
  )
}

export default StatCard
