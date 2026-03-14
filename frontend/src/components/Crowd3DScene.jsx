import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, OrbitControls, Plane, Text } from '@react-three/drei'
import * as THREE from 'three'

const zones = [
  { id: 'entry-a', label: 'Entry A', pos: [-3, 0.03, -2], count: 24, density: 'low',      color: '#00ff78', emissive: '#00ff78' },
  { id: 'entry-b', label: 'Entry B', pos: [3, 0.03, -2],  count: 41, density: 'medium',   color: '#fde047', emissive: '#fbbf24' },
  { id: 'stage',   label: 'Stage',   pos: [0, 0.03, 2],   count: 78, density: 'critical', color: '#ef4444', emissive: '#dc2626' },
]

function CrowdParticles({ count = 120 }) {
  const refs = useRef([])
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, idx) => ({
        id: idx,
        x: Math.sin(idx * 1.7) * 3.2,
        z: Math.cos(idx * 1.3) * 2.8,
        speed: 0.006 + (idx % 8) * 0.001,
      })),
    [count],
  )

  useFrame((state) => {
    refs.current.forEach((mesh, idx) => {
      if (!mesh) {
        return
      }
      const p = particles[idx]
      mesh.position.x = p.x + Math.sin(state.clock.elapsedTime * (1 + p.speed * 100) + idx) * 0.35
      mesh.position.z = p.z + Math.cos(state.clock.elapsedTime * (1.2 + p.speed * 120) + idx) * 0.35
      mesh.position.y = 0.1 + Math.abs(Math.sin(state.clock.elapsedTime + idx)) * 0.03

      /* Dynamic color based on position */
      const isCritical = mesh.position.z > 1.4
      const isHigh     = mesh.position.z > 0
      mesh.material.color.setStyle(isCritical ? '#ef4444' : isHigh ? '#f97316' : '#22d3ee')
      mesh.material.emissive.setStyle(isCritical ? '#dc2626' : isHigh ? '#ea580c' : '#0891b2')
      mesh.material.emissiveIntensity = isCritical ? 2.0 : isHigh ? 1.4 : 1.6
    })
  })

  return particles.map((particle, idx) => (
    <mesh
      key={particle.id}
      ref={(node) => {
        refs.current[idx] = node
      }}
      position={[particle.x, 0.1, particle.z]}
    >
      <sphereGeometry args={[0.07, 10, 10]} />
      <meshStandardMaterial color="#22d3ee" emissive="#0891b2" emissiveIntensity={1.6} />
    </mesh>
  ))
}

function SceneContent({ peopleCount = 42, sosCount = 2 }) {
  return (
    <>
      <ambientLight intensity={0.35} color="#0a1628" />
      {/* Neon lighting */}
      <pointLight position={[5, 6, 5]}   intensity={2.2} color="#22d3ee" />
      <pointLight position={[-4, 4, -3]} intensity={1.4} color="#7c3aed" />
      <pointLight position={[0, 5, 0]}   intensity={0.8} color="#3b82f6" />
      <pointLight position={[0, 2, 3]}   intensity={1.6} color="#ef4444" />

      {/* Ground */}
      <Plane args={[10, 8]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <meshStandardMaterial color="#030712" metalness={0.7} roughness={0.3} />
      </Plane>

      {/* Entry A gate */}
      <mesh position={[-3, 0.3, -2]}>
        <boxGeometry args={[1.6, 0.5, 0.8]} />
        <meshStandardMaterial color="#0c1a2e" emissive="#22d3ee" emissiveIntensity={0.45} metalness={0.8} />
      </mesh>

      {/* Entry B gate */}
      <mesh position={[3, 0.3, -2]}>
        <boxGeometry args={[1.6, 0.5, 0.8]} />
        <meshStandardMaterial color="#0c1a2e" emissive="#22d3ee" emissiveIntensity={0.45} metalness={0.8} />
      </mesh>

      {/* Stage */}
      <mesh position={[0, 0.3, 2]}>
        <boxGeometry args={[3, 0.6, 1.6]} />
        <meshStandardMaterial color="#1a0a0a" emissive="#ef4444" emissiveIntensity={0.5} metalness={0.7} />
      </mesh>

      {/* Zone indicators */}
      {zones.map((zone) => (
        <group key={zone.id} position={zone.pos}>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.75, 0.75, 0.05, 32]} />
            <meshStandardMaterial color={zone.color} emissive={zone.emissive} emissiveIntensity={0.75} />
          </mesh>
          <Html center position={[0, 0.9, 0]}>
            <div
              style={{
                borderRadius: '8px',
                padding: '3px 8px',
                fontSize: '11px',
                background: 'rgba(2,6,23,0.9)',
                border: `1px solid ${zone.color}88`,
                color: zone.color,
                textShadow: `0 0 8px ${zone.color}`,
                whiteSpace: 'nowrap',
              }}
            >
              {`${zone.label}: ${zone.count}`}
            </div>
          </Html>
        </group>
      ))}

      {/* People count label */}
      <Text position={[0, 2.8, -3.4]} color="#22d3ee" fontSize={0.3} outlineColor="#0891b2" outlineWidth={0.01}>
        {`People: ${peopleCount}`}
      </Text>

      {/* Cone markers */}
      <mesh position={[2.4, 0.25, 1.8]}>
        <coneGeometry args={[0.12, 0.4, 10]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={2.0} />
      </mesh>
      <mesh position={[-2.4, 0.25, 1.8]}>
        <coneGeometry args={[0.12, 0.4, 10]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={2.0} />
      </mesh>

      {/* SOS markers – glowing red */}
      {Array.from({ length: sosCount }).map((_, idx) => (
        <mesh key={`sos-${idx}`} position={[-0.8 + idx * 0.8, 0.2, 2.5]}>
          <sphereGeometry args={[0.14, 14, 14]} />
          <meshStandardMaterial color="#f43f5e" emissive="#f43f5e" emissiveIntensity={2.5} />
        </mesh>
      ))}

      <CrowdParticles count={120} />
      <OrbitControls enablePan enableZoom enableRotate maxPolarAngle={Math.PI / 2.15} />
    </>
  )
}

function Crowd3DScene({ peopleCount, sosRequests }) {
  return (
    <section
      className="glass-card gradient-border h-110 overflow-hidden rounded-xl shadow-sm"
      style={{
        background: 'linear-gradient(160deg, rgba(255,255,255,0.98), rgba(239,246,255,0.94))',
      }}
    >
      <div
        className="border-b px-4 py-3"
        style={{ borderColor: 'rgba(148,163,184,0.18)' }}
      >
        <h3
          className="font-['Orbitron',sans-serif] text-sm uppercase tracking-[0.18em]"
          style={{ color: '#0f172a' }}
        >
          3D Crowd Simulation
        </h3>
      </div>
      <Canvas camera={{ position: [0, 6, 8], fov: 45 }}>
        <SceneContent peopleCount={peopleCount} sosCount={sosRequests} />
      </Canvas>
    </section>
  )
}

export default Crowd3DScene
