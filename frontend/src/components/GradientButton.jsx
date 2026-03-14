import { useMemo, useState } from 'react'
import { motion as Motion } from 'framer-motion'

const variantStyles = {
  sunset: {
    gradient: 'linear-gradient(110deg, #2563eb, #6366f1)',
    shadow: '0 8px 18px rgba(37,99,235,0.18)',
  },
  neon: {
    gradient: 'linear-gradient(110deg, #6366f1, #14b8a6)',
    shadow: '0 8px 18px rgba(99,102,241,0.16)',
  },
  amber: {
    gradient: 'linear-gradient(110deg, #0f766e, #14b8a6)',
    shadow: '0 8px 18px rgba(20,184,166,0.16)',
  },
  danger: {
    gradient: 'linear-gradient(110deg, #ef4444, #fb923c)',
    shadow: '0 8px 18px rgba(239,68,68,0.16)',
  },
}

function GradientButton({
  children,
  onClick,
  type = 'button',
  variant = 'sunset',
  className = '',
  disabled = false,
}) {
  const [ripples, setRipples] = useState([])
  const style = useMemo(() => variantStyles[variant] || variantStyles.sunset, [variant])

  const handleClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = event.clientX - rect.left - size / 2
    const y = event.clientY - rect.top - size / 2

    const ripple = {
      id: Date.now() + Math.random(),
      x,
      y,
      size,
    }

    setRipples((prev) => [...prev, ripple])
    window.setTimeout(() => {
      setRipples((prev) => prev.filter((item) => item.id !== ripple.id))
    }, 500)

    onClick?.(event)
  }

  return (
    <Motion.button
      type={type}
      disabled={disabled}
      whileHover={disabled ? undefined : { scale: 1.03, y: -1 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      onClick={handleClick}
      className={`relative overflow-hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 ${disabled ? 'opacity-60 cursor-not-allowed' : ''} ${className}`}
      style={{
        background: style.gradient,
        border: '1px solid rgba(255,255,255,0.22)',
        boxShadow: style.shadow,
      }}
    >
      <span className="relative z-10">{children}</span>
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="pointer-events-none absolute rounded-full"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            background: 'rgba(255,255,255,0.35)',
            transform: 'scale(0)',
            animation: 'ripple-expand 0.5s ease-out forwards',
          }}
        />
      ))}
      <style>
        {`@keyframes ripple-expand {
            to {
              transform: scale(2.3);
              opacity: 0;
            }
          }`}
      </style>
    </Motion.button>
  )
}

export default GradientButton
