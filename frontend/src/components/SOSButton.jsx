import { motion as Motion, AnimatePresence } from 'framer-motion'
import { Siren, X } from 'lucide-react'
import { triggerEmergency } from '../services/api'
import GradientButton from './GradientButton'

function SOSButton({ open, onOpen, onClose }) {
  const submitSOS = async () => {
    await triggerEmergency({ location: 'Gate B' })
  }

  return (
    <>
      <Motion.button
        type="button"
        onClick={onOpen}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        className="fixed bottom-6 right-6 z-30 h-14 w-14 rounded-full text-white transition-all duration-200"
        style={{
          background: 'linear-gradient(120deg, #ef4444, #f59e0b)',
          border: '1px solid rgba(255,255,255,0.3)',
          boxShadow: '0 10px 20px rgba(239,68,68,0.18)',
        }}
      >
        <span className="pulse-ring absolute inset-0 rounded-full border-2 border-orange-300/55" />
        <span className="relative z-10 m-auto flex h-full w-full items-center justify-center">
          <Siren className="h-6 w-6" />
        </span>
      </Motion.button>

      <AnimatePresence>
        {open ? (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 grid place-items-center p-4"
            style={{ background: 'rgba(15,23,42,0.18)', backdropFilter: 'blur(6px)' }}
          >
            <Motion.div
              initial={{ y: 24, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 24, opacity: 0, scale: 0.97 }}
              className="glass-card gradient-border w-full max-w-md rounded-2xl p-6"
              style={{
                background: 'linear-gradient(160deg, rgba(255,255,255,0.98), rgba(254,242,242,0.95))',
                boxShadow: '0 12px 30px rgba(15,23,42,0.14)',
              }}
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl p-2" style={{ background: 'rgba(239,68,68,0.08)' }}>
                    <Siren className="h-6 w-6 text-rose-500" />
                  </div>
                  <h3 className="font-['Orbitron',sans-serif] text-lg font-bold text-slate-900">
                    Emergency Activated
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg p-1.5 transition-all duration-200 hover:bg-slate-100"
                  style={{ border: '1px solid rgba(148,163,184,0.2)' }}
                >
                  <X className="h-4 w-4 text-slate-700" />
                </button>
              </div>

              <div
                className="mb-4 space-y-2 rounded-xl p-4"
                style={{ background: '#fef2f2', border: '1px solid rgba(239,68,68,0.14)' }}
              >
                <p className="font-medium text-slate-900">Emergency request sent.</p>
                <p className="text-sm text-slate-700">Location detected: Gate B perimeter.</p>
                <p className="text-sm font-semibold text-emerald-600">✓ Help is on the way.</p>
              </div>

              <GradientButton
                type="button"
                variant="danger"
                className="mt-2 w-full"
                onClick={async () => {
                  await submitSOS()
                  onClose()
                }}
              >
                Confirm SOS Dispatch
              </GradientButton>
            </Motion.div>
          </Motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}

export default SOSButton