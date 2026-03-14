import CameraFeed from '../components/CameraFeed'
import AlertPanel from '../components/AlertPanel'
import MapView from '../components/MapView'

function Monitoring({ realtime, alertFeed, onlyAlerts }) {
  if (onlyAlerts) {
    return (
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <AlertPanel alerts={alertFeed} />
        <MapView />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <CameraFeed peopleCount={realtime.peopleCount} densityLevel={realtime.densityLevel} />
        <AlertPanel alerts={alertFeed} />
      </div>
      <MapView />
    </div>
  )
}

export default Monitoring
