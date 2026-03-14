import { useEffect, useMemo, useState } from 'react'
import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'https://safecrowd-backend.onrender.com'

const toTitleCase = (value) => {
  const lower = String(value || '').toLowerCase()
  return lower ? `${lower[0].toUpperCase()}${lower.slice(1)}` : 'Low'
}

export function useSocket() {
  const [isLoading, setIsLoading] = useState(true)
  const [peopleCount, setPeopleCount] = useState(0)
  const [densityLevel, setDensityLevel] = useState('Low')
  const [activeAlerts, setActiveAlerts] = useState(0)
  const [sosRequests, setSosRequests] = useState(0)
  const [alerts, setAlerts] = useState([])
  const [announcements, setAnnouncements] = useState([])

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    })

    const onCrowdUpdate = (data) => {
      setPeopleCount(Number(data?.people_count ?? 0))
      setDensityLevel(toTitleCase(data?.density_level))

      if (Array.isArray(data?.alerts) && data.alerts.length > 0) {
        setAlerts((prev) => {
          const normalized = data.alerts.map((item) => ({
            id: item.id || `alert-${Date.now()}`,
            text: item.text || item.message || 'Alert raised',
            timestamp: item.timestamp || new Date().toLocaleTimeString(),
          }))
          return [...normalized, ...prev].slice(0, 12)
        })
      }

      setIsLoading(false)
    }

    const onAlert = (data) => {
      setAlerts((prev) => [
        {
          id: data?.id || `alert-${Date.now()}`,
          text: data?.text || data?.message || 'Overcrowding detected near camera',
          timestamp: data?.timestamp || new Date().toLocaleTimeString(),
        },
        ...prev,
      ].slice(0, 12))
    }

    const onSOS = () => {
      setSosRequests((prev) => prev + 1)
    }

    const onAnnouncement = (data) => {
      const entry = {
        id: data?.id || `announce-${Date.now()}`,
        text: data?.message || 'Announcement issued',
        timestamp: data?.timestamp || new Date().toLocaleTimeString(),
      }
      setAnnouncements((prev) => [entry, ...prev].slice(0, 12))
      setAlerts((prev) => [entry, ...prev].slice(0, 12))
    }

    socket.on('crowd_update', onCrowdUpdate)
    socket.on('alert', onAlert)
    socket.on('sos_alert', onSOS)
    socket.on('announcement', onAnnouncement)

    const failSafe = setTimeout(() => setIsLoading(false), 2500)

    return () => {
      clearTimeout(failSafe)
      socket.off('crowd_update', onCrowdUpdate)
      socket.off('alert', onAlert)
      socket.off('sos_alert', onSOS)
      socket.off('announcement', onAnnouncement)
      socket.close()
    }
  }, [])

  useEffect(() => {
    setActiveAlerts(alerts.length)
  }, [alerts])

  const metrics = useMemo(
    () => ({ peopleCount, densityLevel, activeAlerts, sosRequests }),
    [peopleCount, densityLevel, activeAlerts, sosRequests],
  )

  return {
    ...metrics,
    alerts,
    announcements,
    isLoading,
  }
}
