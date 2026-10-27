import { Suspense, useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { themeMaterials } from './COFCrystal'
import { CrystalThrobber } from './CrystalThrobber'

interface CrystalBufferLoaderProps {
  target: 'home' | 'gallery' | 'mentoring'
  isFadingOut?: boolean
}

/**
 * 3D Rotating Crystal Model for the Buffer Loader
 */
function LoaderCrystalScene() {
  const modelUrl = `${import.meta.env.BASE_URL}models/cof-crystal.glb`
  const gltf = useGLTF(modelUrl)
  const groupRef = useRef<THREE.Group>(null)

  const preparedScene = useMemo(() => {
    const sceneClone = gltf.scene.clone(true)

    // Center geometry at origin
    const box = new THREE.Box3().setFromObject(sceneClone)
    const center = new THREE.Vector3()
    const sizeVec = new THREE.Vector3()
    box.getCenter(center)
    box.getSize(sizeVec)
    sceneClone.position.set(-center.x, -center.y, -center.z)

    // Scale to standard view dimensions
    const rawMaxDim = Math.max(sizeVec.x, sizeVec.y, sizeVec.z) || 8.5
    const targetDim = 14.8
    sceneClone.scale.setScalar(targetDim / rawMaxDim)

    const materialCache = new Map<string, THREE.MeshStandardMaterial>()

    sceneClone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh

        let cat = ''
        for (const key of Object.keys(themeMaterials)) {
          if (mesh.name.startsWith(key)) {
            cat = key
            break
          }
        }
        if (!cat) {
          const match = mesh.name.match(/^([A-Za-z_-]+)/)
          if (match && themeMaterials[match[1].replace(/[-_]+$/, '')]) {
            cat = match[1].replace(/[-_]+$/, '')
          }
        }

        const themeDef = cat ? themeMaterials[cat] : null
        if (themeDef) {
          if (!materialCache.has(cat)) {
            materialCache.set(
              cat,
              new THREE.MeshStandardMaterial({
                color: new THREE.Color(themeDef.color),
                metalness: themeDef.metalness,
                roughness: themeDef.roughness,
              })
            )
          }
          mesh.material = materialCache.get(cat)!
        }
      }
    })

    return sceneClone
  }, [gltf])

  // Continuous smooth 3D rotation
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.92 // Brisk, satisfying spin
      groupRef.current.rotation.x = 0.28 + Math.sin(Date.now() * 0.0016) * 0.12
    }
  })

  return (
    <>
      {/* Warm signature studio lighting */}
      <ambientLight intensity={1.9} color="#ffffff" />
      <directionalLight position={[20, 24, 20]} intensity={2.2} color="#fffcf5" />
      <directionalLight position={[-18, -10, 16]} intensity={1.3} color="#dce9f8" />
      <directionalLight position={[0, 15, -20]} intensity={1.2} color="#faeed8" />
      <pointLight position={[0, 0, 0]} intensity={1.5} distance={35} color="#ba9c66" />

      <group ref={groupRef} rotation={[0.25, -0.3, 0.1]}>
        <primitive object={preparedScene} />
      </group>
    </>
  )
}

/**
 * Geometric Wireframe Fallback while model is buffering into GPU
 */
function WireframeCrystalFallback() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 1.4
      meshRef.current.rotation.x += delta * 0.7
    }
  })

  return (
    <mesh ref={meshRef}>
      <octahedronGeometry args={[4.5, 0]} />
      <meshStandardMaterial color="#ba9c66" wireframe metalness={0.6} roughness={0.3} />
    </mesh>
  )
}

/**
 * Fullscreen Buffer Loader Component with rotating 3D crystal and 5-second progress bar
 */
export function CrystalBufferLoader({ target, isFadingOut = false }: CrystalBufferLoaderProps) {
  const [progress, setProgress] = useState(0)
  const [hasWebGLError, setHasWebGLError] = useState(false)

  // 5-second (5000ms) synchronized progress counter
  useEffect(() => {
    const startTime = Date.now()
    const totalDuration = 5000

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime
      const pct = Math.min(100, Math.floor((elapsed / totalDuration) * 100))
      setProgress(pct)

      if (elapsed >= totalDuration) {
        clearInterval(timer)
      }
    }, 35)

    return () => clearInterval(timer)
  }, [])

  // Dynamic context info based on target page
  const meta = useMemo(() => {
    switch (target) {
      case 'mentoring':
        return {
          tag: 'GLOBAL SCIENTIFIC ALLIANCES',
          title: 'Connecting Collaborations',
          subtitle: 'Loading international research network & academic partners…',
        }
      case 'gallery':
        return {
          tag: 'SCIENTIFIC ART & VISUALIZATIONS',
          title: 'Preparing Gallery',
          subtitle: 'Assembling framework exhibits & molecular cover art…',
        }
      case 'home':
      default:
        return {
          tag: 'DR. SUMANTA CHOWDHURY · CEISAM',
          title: 'Initializing Portfolio',
          subtitle: 'Reticular Chemistry · Solar Fuels · Molecular Materials…',
        }
    }
  }, [target])

  return (
    <div
      className={`crystal-buffer-loader-overlay ${isFadingOut ? 'is-fading-out' : ''}`}
      role="status"
      aria-live="polite"
      aria-label={`${meta.title} — ${progress}% loaded`}
    >
      <div className="crystal-loader-content">
        {/* Top Eyebrow Badge */}
        <div className="crystal-loader-badge">
          <span className="loader-pulse-dot" />
          <span>{meta.tag}</span>
        </div>

        {/* 3D Rotating Crystal Model Canvas */}
        <div className="crystal-loader-canvas-wrap">
          {hasWebGLError ? (
            <CrystalThrobber size="xl" glow={true} />
          ) : (
            <Canvas
              className="crystal-loader-canvas"
              camera={{ fov: 36, position: [0, 0, 24] }}
              gl={{
                antialias: true,
                alpha: true,
                powerPreference: 'high-performance',
                toneMapping: THREE.ACESFilmicToneMapping,
                toneMappingExposure: 1.15,
              }}
              onError={() => setHasWebGLError(true)}
            >
              <Suspense fallback={<WireframeCrystalFallback />}>
                <LoaderCrystalScene />
              </Suspense>
            </Canvas>
          )}
        </div>

        {/* Status Typography */}
        <div className="crystal-loader-meta">
          <h2 className="crystal-loader-title">{meta.title}</h2>
          <p className="crystal-loader-subtitle">{meta.subtitle}</p>
        </div>

        {/* 5-Second Progress Bar */}
        <div className="crystal-loader-progress-wrap">
          <div className="crystal-loader-track">
            <div
              className="crystal-loader-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="crystal-loader-timer">
            <span className="loader-pct">{progress}%</span>
            <span className="loader-dots">
              {progress < 33 ? '●○○' : progress < 66 ? '●●○' : '●●●'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

