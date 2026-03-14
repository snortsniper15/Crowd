import { motion as Motion } from 'framer-motion'

const getZoneStyle = (value) => {
  if (value < 25) {
    return {
      fill: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
      border: 'rgba(34,197,94,0.22)',
      label: 'Low',
    }
  }

  if (value < 50) {
    return {
      fill: 'linear-gradient(135deg, #fef9c3, #fde68a)',
      border: 'rgba(245,158,11,0.24)',
      label: 'Medium',
    }
  }

  if (value < 75) {
    return {
      fill: 'linear-gradient(135deg, #ffedd5, #fdba74)',
      border: 'rgba(249,115,22,0.24)',
      label: 'High',
    }
  }

  return {
    fill: 'linear-gradient(135deg, #fee2e2, #fca5a5)',
    border: 'rgba(239,68,68,0.26)',
    label: 'Critical',
  }
}

function Heatmap({ values = [] }) {
  return (
    <section
      className="glass-card gradient-border rounded-xl p-4 shadow-sm"
      style={{
        background: 'linear-gradient(160deg, rgba(255,255,255,0.98), rgba(248,250,252,0.94))',
      }}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-['Orbitron',sans-serif] text-sm uppercase tracking-[0.18em] text-slate-900">
          Crowd Density Heatmap
        </h3>
        <span className="text-xs font-medium text-slate-700">Zone Risk Overview</span>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
        {values.map((value, index) => {
          const style = getZoneStyle(value)

          return (
            <Motion.div
              key={`${value}-${index}`}
              initial={{ opacity: 0.4, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -2, scale: 1.02 }}
              transition={{ duration: 0.24, delay: index * 0.02 }}
              className="relative h-16 rounded-xl"
              style={{
                background: style.fill,
                border: `1px solid ${style.border}`,
              }}
            >
              <span className="absolute left-2 top-1 text-[10px] font-semibold text-slate-700">{style.label}</span>
              <span className="absolute bottom-1 right-2 text-xs font-bold text-slate-900">{value}</span>
            </Motion.div>
          )
        })}
      </div>
    </section>
  )
}

export default Heatmap