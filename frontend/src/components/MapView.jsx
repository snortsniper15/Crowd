import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import L from 'leaflet'

const cameraIcon = L.divIcon({
  className: '',
  html: '<div class="glow-marker"></div>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
})

const sosIcon = L.divIcon({
  className: '',
  html: '<div class="sos-marker"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
})

const cameraLocations = [
  { id: 'cam-1', name: 'Gate A Camera', position: [28.6139, 77.209] },
  { id: 'cam-2', name: 'Gate B Camera', position: [28.6146, 77.2081] },
  { id: 'cam-3', name: 'Stage Camera', position: [28.6132, 77.2088] },
]

function MapView() {
  return (
    <section className="glass-card gradient-border overflow-hidden rounded-xl border shadow-sm">
      <div className="border-b border-slate-200 p-4">
        <h3 className="font-['Orbitron',sans-serif] text-sm uppercase tracking-[0.18em] text-slate-900">
          Live Geo Monitoring Map
        </h3>
      </div>
      <div className="h-77.5 w-full">
        <MapContainer center={[28.6139, 77.209]} zoom={17} style={{ height: '100%', width: '100%' }}>
          <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {cameraLocations.map((camera) => (
            <Marker key={camera.id} position={camera.position} icon={cameraIcon}>
              <Popup>{camera.name}</Popup>
            </Marker>
          ))}

          <Marker position={[28.6141, 77.2086]} icon={sosIcon}>
            <Popup>Active SOS alert</Popup>
          </Marker>

          <Circle center={[28.6142, 77.2094]} radius={70} pathOptions={{ color: '#2563eb', fillOpacity: 0.16 }} />
          <Circle center={[28.6135, 77.2085]} radius={48} pathOptions={{ color: '#14b8a6', fillOpacity: 0.14 }} />
          <Circle center={[28.6131, 77.2092]} radius={60} pathOptions={{ color: '#ef4444', fillOpacity: 0.18 }} />
        </MapContainer>
      </div>
    </section>
  )
}

export default MapView
