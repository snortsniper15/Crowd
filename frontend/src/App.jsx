import { useMemo, useEffect, useState } from 'react'
import { AnimatePresence, motion as Motion } from 'framer-motion'
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import {
  Bell,
  Bot,
  Gauge,
  LayoutDashboard,
  Menu,
  Settings,
  ShieldAlert,
  Siren,
  UserCircle2,
  Waves,
  X,
} from 'lucide-react'
import Dashboard from './pages/Dashboard'
import Monitoring from './pages/Monitoring'
import AdminPanel from './pages/AdminPanel'
import ThreeDView from './pages/ThreeDView'
import Chatbot from './components/Chatbot'
import SOSButton from './components/SOSButton'
import { useSocket } from './hooks/useSocket'

const menuItems = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Live Monitoring', path: '/monitoring', icon: Gauge },
  { label: '3D Visualization', path: '/three-d', icon: Waves },
  { label: 'SOS Alerts', path: '/sos-alerts', icon: ShieldAlert },
  { label: 'AI Assistant', path: '/assistant', icon: Bot },
  { label: 'Admin Panel', path: '/admin', icon: Siren },
  { label: 'Settings', path: '/settings', icon: Settings },
]

const PARTICLE_COLORS = ['cyan', 'blue', 'purple', 'indigo']
const PARTICLES = Array.from({ length: 34 }, (_, i) => ({
  id: i,
  left: `${(i * 2.9 + Math.random() * 8) % 100}%`,
  size: `${2 + Math.random() * 8}px`,
  duration: `${11 + Math.random() * 24}s`,
  delay: `${Math.random() * 18}s`,
  color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
}))

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sosModalOpen, setSosModalOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const location = useLocation()
  const realtime = useSocket()

  const alertFeed = useMemo(
    () => [...realtime.announcements, ...realtime.alerts].slice(0, 8),
    [realtime.announcements, realtime.alerts],
  )

  const onAnnouncementSend = () => {}

  const pageProps = {
    realtime,
    alertFeed,
    openSos: () => setSosModalOpen(true),
  }

  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 18)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden bg-animated bg-diagonal-shift text-slate-900">
      <div className="absolute inset-0 bg-grid-pattern opacity-35 pointer-events-none" />

      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="orb-breathe absolute -right-24 -top-28 h-140 w-140 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.12), transparent 70%)' }}
        />
        <div
          className="orb-breathe-slow absolute -left-36 bottom-0 h-155 w-155 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.12), transparent 72%)', animationDelay: '2s' }}
        />
        <div
          className="orb-breathe absolute left-1/2 top-[32%] h-95 w-95 -translate-x-1/2 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.08), transparent 72%)', animationDelay: '5s' }}
        />
      </div>

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {PARTICLES.map((p) => (
          <span
            key={p.id}
            className={`particle particle-${p.color}`}
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              animationDuration: p.duration,
              animationDelay: p.delay,
            }}
          />
        ))}
      </div>

      <Motion.header
        initial={{ y: -96 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        className={`sticky top-0 z-50 transition-all duration-200 ${
          scrolled ? 'py-2' : 'py-3'
        }`}
      >
        <div
          className="mx-auto h-14 max-w-7xl rounded-2xl px-4 sm:px-6 lg:px-8"
          style={{
            background: scrolled
              ? 'linear-gradient(135deg, rgba(238,242,247,0.82), rgba(232,236,245,0.78), rgba(243,245,250,0.84))'
              : 'linear-gradient(135deg, rgba(238,242,247,0.72), rgba(232,236,245,0.68), rgba(243,245,250,0.74))',
            border: '1px solid rgba(15,23,42,0.08)',
            backdropFilter: 'blur(12px)',
            boxShadow: scrolled ? '0 10px 22px rgba(15,23,42,0.1)' : '0 6px 14px rgba(15,23,42,0.08)',
          }}
        >
          <div className="relative grid h-full w-full grid-cols-[auto_1fr_auto] items-center gap-3">
            <div className="flex items-center gap-3">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.72)',
                  border: '1px solid rgba(15,23,42,0.1)',
                  boxShadow: '0 4px 12px rgba(15,23,42,0.1)',
                }}
              >
                <Gauge className="h-5 w-5 text-slate-900" />
              </div>
              <div className="min-w-0 shrink-0">
                <p
                  className="font-['Orbitron',sans-serif] whitespace-nowrap text-base font-bold uppercase tracking-[0.12em] sm:text-lg"
                  style={{ color: '#0f172a' }}
                >
                  SafeCrowd
                </p>
              </div>
            </div>
            <nav className="hidden h-full flex-nowrap items-center justify-center gap-2 xl:flex">
              {menuItems.map((item) => {
                const active = location.pathname === item.path
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="group relative px-1.5 py-1 focus:outline-none"
                  >
                    <Motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      className="flex items-center gap-2 px-2.5 py-1.5 text-sm font-semibold text-slate-800 transition-all duration-200"
                    >
                      <Icon className={`h-4 w-4 transition-colors duration-200 ${active ? 'text-slate-900' : 'text-slate-700 group-hover:text-slate-900 group-focus:text-slate-900'}`} />
                      <span
                        className={`whitespace-nowrap transition-all duration-200 ${
                          active
                            ? 'text-slate-900'
                            : 'text-slate-800 group-hover:text-slate-900 group-focus:text-slate-900'
                        }`}
                      >
                        {item.label}
                      </span>
                    </Motion.div>
                    {active ? (
                      <Motion.div
                        layoutId="nav-underline"
                        className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                        style={{ background: 'linear-gradient(90deg, #334155, #0f172a)' }}
                      />
                    ) : (
                      <span className="absolute bottom-0 left-2 h-0.5 w-0 rounded-full bg-linear-to-r from-slate-500 to-slate-900 transition-all duration-200 group-hover:w-[calc(100%-1rem)] group-focus:w-[calc(100%-1rem)]" />
                    )}
                  </Link>
                )
              })}
            </nav>

            <div className="flex items-center gap-2 sm:gap-3 justify-self-end">
              <Motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 14px rgba(51,65,85,0.2)' }}
                whileTap={{ scale: 0.92 }}
                type="button"
                className="relative rounded-full p-2 transition-all duration-200 focus:outline-none"
                style={{
                  background: 'rgba(255,255,255,0.66)',
                  border: '1px solid rgba(15,23,42,0.08)',
                }}
              >
                <Bell className="h-4 w-4 text-slate-800 hover:text-slate-900" />
                <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-slate-700" />
              </Motion.button>

              <Motion.button
                whileHover={{ scale: 1.08, filter: 'drop-shadow(0 0 10px rgba(37,99,235,0.24))' }}
                whileTap={{ scale: 0.95 }}
                type="button"
                className="cursor-pointer rounded-full focus:outline-none"
              >
                <UserCircle2 className="h-8 w-8 text-slate-800 transition-colors duration-200 hover:text-slate-900" />
              </Motion.button>

              <button
                type="button"
                onClick={() => setSidebarOpen((prev) => !prev)}
                className="block rounded-lg p-2 transition-all duration-200 focus:outline-none xl:hidden"
                style={{
                  background: 'rgba(255,255,255,0.66)',
                  border: '1px solid rgba(15,23,42,0.08)',
                }}
              >
                {sidebarOpen ? <X className="h-5 w-5 text-slate-800" /> : <Menu className="h-5 w-5 text-slate-800" />}
              </button>
            </div>
          </div>
        </div>
      </Motion.header>

      <AnimatePresence>
        {sidebarOpen ? (
          <Motion.div
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="fixed inset-0 z-40 flex flex-col px-4 pb-6 pt-20 xl:hidden"
            style={{
              background: 'linear-gradient(160deg, rgba(238,242,247,0.9), rgba(232,236,245,0.88), rgba(243,245,250,0.92))',
              backdropFilter: 'blur(12px)',
            }}
          >
            <nav className="flex flex-col gap-2 overflow-y-auto">
              {menuItems.map((item, index) => {
                const active = location.pathname === item.path
                const Icon = item.icon
                return (
                  <Motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * index }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className="group flex items-center gap-4 px-2 py-3 text-base font-semibold text-slate-800 transition-all duration-200 focus:outline-none"
                    >
                      <Icon className={`h-5 w-5 transition-colors duration-200 ${active ? 'text-slate-900' : 'text-slate-700 group-hover:text-slate-900 group-focus:text-slate-900'}`} />
                      <span
                        className={`relative transition-all duration-200 ${
                          active
                            ? 'text-slate-900'
                            : 'text-slate-800 group-hover:text-slate-900 group-focus:text-slate-900'
                        }`}
                      >
                        {item.label}
                        <span
                          className={`absolute -bottom-1 left-0 h-0.5 rounded-full bg-linear-to-r from-slate-500 to-slate-900 transition-all duration-200 ${
                            active
                              ? 'w-full opacity-100'
                              : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100 group-focus:w-full group-focus:opacity-100'
                          }`}
                        />
                      </span>
                    </Link>
                  </Motion.div>
                )
              })}
            </nav>
          </Motion.div>
        ) : null}
      </AnimatePresence>

      <main className="relative z-10 px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <AnimatePresence mode="wait">
            <Motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.99 }}
              transition={{ duration: 0.26, ease: 'easeOut' }}
            >
              <Routes location={location}>
                <Route path="/" element={<Dashboard {...pageProps} />} />
                <Route path="/monitoring" element={<Monitoring {...pageProps} />} />
                <Route path="/three-d" element={<ThreeDView realtime={realtime} />} />
                <Route path="/sos-alerts" element={<Monitoring {...pageProps} onlyAlerts />} />
                <Route path="/assistant" element={<Dashboard {...pageProps} />} />
                <Route
                  path="/admin"
                  element={<AdminPanel realtime={realtime} onAnnouncementSend={onAnnouncementSend} />}
                />
                <Route path="/settings" element={<Dashboard {...pageProps} minimal />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Motion.div>
          </AnimatePresence>
        </div>
      </main>

      <SOSButton open={sosModalOpen} onOpen={() => setSosModalOpen(true)} onClose={() => setSosModalOpen(false)} />
      <Chatbot open={chatOpen} onToggle={() => setChatOpen((prev) => !prev)} />
    </div>
  )
}

export default App
