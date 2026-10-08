import { Suspense, useRef, useState, useEffect, useMemo, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

// ============================================================================
// SEMANTIC OBJECT METADATA
// ============================================================================

export interface ComponentMetadata {
  label: string
  symbol?: string
  type: string
  category: string
  description?: string
  accentColor: string
}

// ============================================================================
// THEME MATERIALS DEFINITIONS (Matched to Website Palette)
// --paper: #f8f5ee, --ink: #222d47, --accent: #ba9c66, --accent-soft: #d8c5a2
// ============================================================================

export const themeMaterials: Record<
  string,
  {
    color: string
    metalness: number
    roughness: number
  }
> = {
  // ZrNode: Warm signature metallic gold coordination clusters
  ZrNode: {
    color: '#ba9c66',
    metalness: 0.48,
    roughness: 0.32,
  },
  // BlueCollar: Soft champagne gold coordination collar
  BlueCollar: {
    color: '#d8c5a2',
    metalness: 0.28,
    roughness: 0.44,
  },
  // Carbon: Deep slate ink aromatic rings (matching website --ink)
  Carbon: {
    color: '#222d47',
    metalness: 0.12,
    roughness: 0.52,
  },
  // C-C_Bond: Delocalized conjugated bonds in antique satin bronze/gold
  'C-C_Bond': {
    color: '#a88d59',
    metalness: 0.42,
    roughness: 0.40,
  },
  // LinkRod: Framework linker struts in mineral slate
  LinkRod: {
    color: '#4a5b78',
    metalness: 0.30,
    roughness: 0.48,
  },
  // Icosphere: Active surface clusters in warm amber/terracotta
  Icosphere: {
    color: '#c27944',
    metalness: 0.35,
    roughness: 0.38,
  },
  // TagStem: Functional pendant stems in warm copper/bronze
  TagStem: {
    color: '#b06a3b',
    metalness: 0.30,
    roughness: 0.40,
  },
  // Central_Seam: Boundary seam in soft champagne gold
  Central_Seam: {
    color: '#ba9c66',
    metalness: 0.35,
    roughness: 0.40,
  },
}

export const objectMetadata: Record<string, ComponentMetadata> = {
  Carbon: {
    label: 'Carbon Atom',
    symbol: 'C',
    type: 'Framework Node',
    category: 'Aromatic Conjugated Carbon',
    description: 'sp²-hybridized carbon core forming the π-conjugated macrocycle',
    accentColor: '#ba9c66',
  },
  'C-C_Bond': {
    label: 'C–C Bond',
    symbol: 'C—C',
    type: 'Covalent Bond',
    category: 'π-Conjugated Linkage',
    description: 'Delocalized covalent bond providing high structural stability',
    accentColor: '#ba9c66',
  },
  ZrNode: {
    label: 'Zr Node',
    symbol: 'Zr',
    type: 'Secondary Building Unit (SBU)',
    category: 'Metal-Oxo Coordination Cluster',
    description: 'Coordinating metallic junction connecting organic linker struts',
    accentColor: '#ba9c66',
  },
  BlueCollar: {
    label: 'Coordination Collar',
    symbol: 'Collar',
    type: 'Interface Junction',
    category: 'Pore Aperture Ring',
    description: 'Coordinating boundary ring framing the microporous aperture',
    accentColor: '#d8c5a2',
  },
  LinkRod: {
    label: 'Linker Strut',
    symbol: 'Link',
    type: 'Framework Strut',
    category: 'Rigid Reticular Linker',
    description: 'Conjugated linear pillar defining pore diameter and geometry',
    accentColor: '#64728f',
  },
  Icosphere: {
    label: 'Functional Cluster',
    symbol: 'Cluster',
    type: 'Active Surface Site',
    category: 'High-Density Catalytic SBU',
    description: 'Surface-exposed coordination sphere for gas adsorption and catalysis',
    accentColor: '#c27944',
  },
  TagStem: {
    label: 'Functional Pendant',
    symbol: 'Tag',
    type: 'Pendant Group',
    category: 'Pore Surface Modification',
    description: 'Tailored chemical tag projecting into pores for selective capture',
    accentColor: '#b06a3b',
  },
  Central_Seam: {
    label: 'Central Seam',
    symbol: 'Seam',
    type: 'Lattice Interface',
    category: 'Channel Boundary',
    description: 'Symmetry interface across reticular periodic unit cells',
    accentColor: '#ba9c66',
  },
}

// Fallback resolver for arbitrary Blender object names
export function resolveSemanticMetadata(object: THREE.Object3D | null): {
  key: string
  meta: ComponentMetadata
  objectName: string
  mesh: THREE.Mesh | null
} | null {
  if (!object) return null

  let curr: THREE.Object3D | null = object
  let targetMesh: THREE.Mesh | null = (object as THREE.Mesh).isMesh ? (object as THREE.Mesh) : null

  while (curr) {
    const rawName = curr.name || ''
    if (rawName && rawName !== 'Scene') {
      // 1. Exact or prefix match against known metadata map
      for (const [key, meta] of Object.entries(objectMetadata)) {
        if (rawName.startsWith(key)) {
          return { key, meta, objectName: rawName, mesh: targetMesh || (curr as THREE.Mesh) }
        }
      }

      // 2. Generic prefix match before digits/dots
      const match = rawName.match(/^([A-Za-z_-]+)/)
      if (match) {
        const base = match[1].replace(/[-_]+$/, '')
        if (objectMetadata[base]) {
          return { key: base, meta: objectMetadata[base], objectName: rawName, mesh: targetMesh || (curr as THREE.Mesh) }
        }

        // Clean human-readable fallback
        const humanReadable = base
          .replace(/([A-Z])/g, ' $1')
          .replace(/[_-]+/g, ' ')
          .trim()

        return {
          key: base,
          meta: {
            label: humanReadable,
            type: 'Structural Element',
            category: 'COF Lattice Component',
            accentColor: '#ba9c66',
          },
          objectName: rawName,
          mesh: targetMesh || (curr as THREE.Mesh),
        }
      }
    }
    curr = curr.parent
  }

  return null
}

// ============================================================================
// INNER 3D CRYSTAL SCENE
// ============================================================================

interface CrystalSceneProps {
  onHover: (info: { meta: ComponentMetadata; objectName: string } | null, screenPos?: { x: number; y: number }) => void
  onClickSelect: (info: { meta: ComponentMetadata; objectName: string } | null, screenPos?: { x: number; y: number }) => void
  onPointerMissed: () => void
  isLocked: boolean
  isPointerInsideCanvas: boolean
  prefersReducedMotion: boolean
}

function CrystalScene({
  onHover,
  onClickSelect,
  onPointerMissed,
  isLocked,
  isPointerInsideCanvas,
  prefersReducedMotion,
}: CrystalSceneProps) {
  const modelUrl = `${import.meta.env.BASE_URL}models/cof-crystal.glb`
  const gltf = useGLTF(modelUrl)

  const { camera, size: viewportSize } = useThree()

  // References
  const tiltGroupRef = useRef<THREE.Group>(null)
  const rotationGroupRef = useRef<THREE.Group>(null)

  // Tracking hovered & locked meshes
  const hoveredMeshRef = useRef<THREE.Mesh | null>(null)
  const lockedMeshRef = useRef<THREE.Mesh | null>(null)

  // Interactive motion state
  const targetTilt = useRef({ x: 0, y: 0 })
  const currentTilt = useRef({ x: 0, y: 0 })
  const dragVelocity = useRef({ x: 0, y: 0 })
  const pointerStart = useRef({ x: 0, y: 0 })
  const isDragging = useRef(false)

  // Memoize prepared crystal scene with centered geometry & stored original materials
  const { preparedScene, radius } = useMemo(() => {
    const sceneClone = gltf.scene.clone(true)

    // Compute bounding box
    const box = new THREE.Box3().setFromObject(sceneClone)
    const center = new THREE.Vector3()
    const sizeVec = new THREE.Vector3()
    box.getCenter(center)
    box.getSize(sizeVec)

    // Center geometry at (0, 0, 0)
    sceneClone.position.set(-center.x, -center.y, -center.z)

    // Scale model to heroic dimensions (like before: max dimension ~ 16.2 units)
    const rawMaxDim = Math.max(sizeVec.x, sizeVec.y, sizeVec.z) || 8.5
    const targetDim = 16.2
    const scaleFactor = targetDim / rawMaxDim
    sceneClone.scale.setScalar(scaleFactor)

    const sphere = new THREE.Sphere()
    box.getBoundingSphere(sphere)
    const radius = (sphere.radius || rawMaxDim / 2) * scaleFactor

    // Initialize shared theme materials cache so meshes of the same category share a single standard material
    const materialCache = new Map<string, THREE.MeshStandardMaterial>()

    // Apply website theme palette to all meshes
    sceneClone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh

        // Match category prefix
        let cat = ''
        for (const key of Object.keys(themeMaterials)) {
          if (mesh.name.startsWith(key)) {
            cat = key
            break
          }
        }
        if (!cat) {
          const match = mesh.name.match(/^([A-Za-z_-]+)/)
          if (match) {
            const base = match[1].replace(/[-_]+$/, '')
            if (themeMaterials[base]) cat = base
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
                side: THREE.DoubleSide,
              })
            )
          }
          mesh.material = materialCache.get(cat)!
        }

        mesh.userData.origMaterial = mesh.material
        mesh.userData.origScale = mesh.scale.clone()
        mesh.castShadow = false
        mesh.receiveShadow = false
      }
    })

    return { preparedScene: sceneClone, radius }
  }, [gltf.scene])

  // Responsive camera framing based on bounding sphere
  useEffect(() => {
    const fov = (camera as THREE.PerspectiveCamera).fov || 35
    const isMobile = viewportSize.width < 768

    // Frame camera so the crystal is prominently showcased ("a lil bit bigger like before")
    const verticalFovRad = (fov * Math.PI) / 360
    const distanceNeeded = (radius / Math.sin(verticalFovRad)) * (isMobile ? 1.08 : 0.94)

    camera.position.set(0, 0, distanceNeeded)
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()

    // Offset position: shift right on desktop to frame hero text cleanly, center on mobile
    if (rotationGroupRef.current) {
      rotationGroupRef.current.position.set(isMobile ? 0 : 2.5, 0, 0)
    }
  }, [camera, radius, viewportSize])

  // Helper: Apply subtle scientific highlight to an individual mesh
  const applyHighlight = useCallback((mesh: THREE.Mesh, accentColor: string = '#ba9c66') => {
    if (!mesh.userData.origMaterial) {
      mesh.userData.origMaterial = mesh.material
    }
    if (!mesh.userData.origScale) {
      mesh.userData.origScale = mesh.scale.clone()
    }

    const origMat = mesh.userData.origMaterial as THREE.MeshStandardMaterial
    const highlightMat = origMat.clone()

    // Subtle, elegant scientific emissive glow (no blinding neon)
    highlightMat.emissive = new THREE.Color(accentColor)
    highlightMat.emissiveIntensity = 0.52
    highlightMat.roughness = Math.max(0.12, origMat.roughness - 0.15)
    mesh.material = highlightMat

    // Slight 1.05x non-distorting scale bump
    mesh.scale.copy(mesh.userData.origScale).multiplyScalar(1.05)
  }, [])

  // Helper: Remove highlight from a mesh
  const removeHighlight = useCallback((mesh: THREE.Mesh) => {
    if (mesh.userData.origMaterial) {
      if (mesh.material && mesh.material !== mesh.userData.origMaterial) {
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => m.dispose())
        } else {
          mesh.material.dispose()
        }
      }
      mesh.material = mesh.userData.origMaterial
    }
    if (mesh.userData.origScale) {
      mesh.scale.copy(mesh.userData.origScale)
    }
  }, [])

  // Handle pointer hover on individual meshes
  const handlePointerOver = useCallback(
    (e: any) => {
      e.stopPropagation()
      const resolved = resolveSemanticMetadata(e.object)
      if (!resolved || !resolved.mesh) return

      const mesh = resolved.mesh
      if (hoveredMeshRef.current === mesh) return

      // Clean up previous hover if not locked
      if (hoveredMeshRef.current && hoveredMeshRef.current !== lockedMeshRef.current) {
        removeHighlight(hoveredMeshRef.current)
      }

      hoveredMeshRef.current = mesh

      // Apply subtle highlight
      applyHighlight(mesh, resolved.meta.accentColor)

      // Report hover info with screen position
      onHover(
        { meta: resolved.meta, objectName: resolved.objectName },
        { x: e.nativeEvent.clientX, y: e.nativeEvent.clientY }
      )
    },
    [applyHighlight, removeHighlight, onHover]
  )

  // Handle pointer move over same object to update tooltip position
  const handlePointerMove = useCallback(
    (e: any) => {
      e.stopPropagation()
      if (hoveredMeshRef.current) {
        const resolved = resolveSemanticMetadata(hoveredMeshRef.current)
        if (resolved) {
          onHover(
            { meta: resolved.meta, objectName: resolved.objectName },
            { x: e.nativeEvent.clientX, y: e.nativeEvent.clientY }
          )
        }
      }
    },
    [onHover]
  )

  // Handle pointer leave
  const handlePointerOut = useCallback(
    (e: any) => {
      e.stopPropagation()
      if (hoveredMeshRef.current) {
        // If not locked, remove highlight
        if (hoveredMeshRef.current !== lockedMeshRef.current) {
          removeHighlight(hoveredMeshRef.current)
        }
        hoveredMeshRef.current = null
      }
      if (!isLocked) {
        onHover(null)
      }
    },
    [removeHighlight, isLocked, onHover]
  )

  // Handle click on atom/bond to lock selection
  const handleClick = useCallback(
    (e: any) => {
      e.stopPropagation()
      // Ignore click if it was a substantial drag gesture
      if (isDragging.current) return

      const resolved = resolveSemanticMetadata(e.object)
      if (!resolved || !resolved.mesh) return

      const mesh = resolved.mesh

      // If clicked the currently locked mesh, toggle/unlock
      if (lockedMeshRef.current === mesh) {
        removeHighlight(mesh)
        lockedMeshRef.current = null
        onClickSelect(null)
        return
      }

      // If a different mesh was locked, clear it
      if (lockedMeshRef.current && lockedMeshRef.current !== mesh) {
        removeHighlight(lockedMeshRef.current)
      }

      lockedMeshRef.current = mesh
      applyHighlight(mesh, resolved.meta.accentColor)

      onClickSelect(
        { meta: resolved.meta, objectName: resolved.objectName },
        { x: e.nativeEvent.clientX, y: e.nativeEvent.clientY }
      )
    },
    [applyHighlight, removeHighlight, onClickSelect]
  )

  // Handle canvas deselect / click empty space
  const handleEmptyClick = useCallback(() => {
    if (lockedMeshRef.current) {
      removeHighlight(lockedMeshRef.current)
      lockedMeshRef.current = null
    }
    if (hoveredMeshRef.current) {
      removeHighlight(hoveredMeshRef.current)
      hoveredMeshRef.current = null
    }
    onPointerMissed()
  }, [removeHighlight, onPointerMissed])

  // Track pointer on window for parallax tilt & drag interaction
  useEffect(() => {
    const onWindowPointerMove = (e: PointerEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1
      const normY = (e.clientY / window.innerHeight) * 2 - 1

      // Subtle, restrained parallax tilt
      targetTilt.current = {
        x: normY * 0.22,
        y: normX * 0.32,
      }

      // Dragging logic
      if (pointerStart.current.x !== 0 || pointerStart.current.y !== 0) {
        const dx = e.clientX - pointerStart.current.x
        const dy = e.clientY - pointerStart.current.y
        if (Math.hypot(dx, dy) > 4) {
          isDragging.current = true
        }
        if (isDragging.current) {
          dragVelocity.current.x += dx * 0.0024
          dragVelocity.current.y += dy * 0.0024
          pointerStart.current = { x: e.clientX, y: e.clientY }
        }
      }
    }

    const onPointerDown = (e: PointerEvent) => {
      pointerStart.current = { x: e.clientX, y: e.clientY }
      isDragging.current = false
    }

    const onPointerUp = () => {
      pointerStart.current = { x: 0, y: 0 }
      setTimeout(() => {
        isDragging.current = false
      }, 50)
    }

    window.addEventListener('pointermove', onWindowPointerMove, { passive: true })
    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointerup', onPointerUp)

    return () => {
      window.removeEventListener('pointermove', onWindowPointerMove)
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointerup', onPointerUp)
    }
  }, [])

  // Animation Loop: slow idle rotation (20-30s per turn), pause on hover/lock, inertia damping
  useFrame((_, delta) => {
    if (!rotationGroupRef.current || !tiltGroupRef.current) return

    // Parallax interpolation
    currentTilt.current.x = THREE.MathUtils.lerp(currentTilt.current.x, targetTilt.current.x, 0.05)
    currentTilt.current.y = THREE.MathUtils.lerp(currentTilt.current.y, targetTilt.current.y, 0.05)
    tiltGroupRef.current.rotation.x = currentTilt.current.x
    tiltGroupRef.current.rotation.y = currentTilt.current.y

    // Check interaction status: pause rotation when mouse is interacting or locked
    const isPaused = isPointerInsideCanvas || hoveredMeshRef.current !== null || isLocked

    if (!prefersReducedMotion && !isPaused) {
      // ~25 seconds per full rotation (2 * PI / 25 ≈ 0.25 rad/s)
      rotationGroupRef.current.rotation.y += delta * 0.22
    }

    // Apply drag inertia momentum
    if (Math.abs(dragVelocity.current.x) > 0.0001 || Math.abs(dragVelocity.current.y) > 0.0001) {
      rotationGroupRef.current.rotation.y += dragVelocity.current.x
      rotationGroupRef.current.rotation.x += dragVelocity.current.y
      dragVelocity.current.x *= 0.92
      dragVelocity.current.y *= 0.92
    }
  })

  // Clean up any remaining highlights on unmount
  useEffect(() => {
    return () => {
      if (hoveredMeshRef.current) removeHighlight(hoveredMeshRef.current)
      if (lockedMeshRef.current) removeHighlight(lockedMeshRef.current)
    }
  }, [removeHighlight])

  return (
    <>
      {/* Studio & Scientific Lighting Setup */}
      <ambientLight intensity={1.75} color="#ffffff" />
      <directionalLight position={[24, 28, 22]} intensity={2.1} color="#fffcf5" />
      <directionalLight position={[-20, -12, 18]} intensity={1.25} color="#dce9f8" />
      <directionalLight position={[8, 18, -22]} intensity={1.1} color="#faeed8" />
      <pointLight position={[0, 0, 0]} intensity={1.3} distance={40} color="#ba9c66" />

      {/* Tilt & Rotation Groups */}
      <group ref={tiltGroupRef}>
        <group ref={rotationGroupRef} rotation={[0.32, -0.4, 0.12]}>
          <primitive
            object={preparedScene}
            onPointerOver={handlePointerOver}
            onPointerMove={handlePointerMove}
            onPointerOut={handlePointerOut}
            onClick={handleClick}
            onPointerMissed={handleEmptyClick}
          />
        </group>
      </group>
    </>
  )
}

// ============================================================================
// LOADING & ERROR FALLBACKS
// ============================================================================

function StructureLoadingFallback() {
  return (
    <div className="cof-structure-loader" role="status" aria-live="polite">
      <div className="cof-loader-spinner" aria-hidden="true" />
      <span>Loading structure…</span>
    </div>
  )
}

// ============================================================================
// MAIN EXPORTED COMPONENT: COFCrystal
// ============================================================================

export interface COFCrystalProps {
  className?: string
}

export function COFCrystal({ className = '' }: COFCrystalProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // State
  const [activeInfo, setActiveInfo] = useState<{
    meta: ComponentMetadata
    objectName: string
  } | null>(null)
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null)
  const [isLocked, setIsLocked] = useState(false)
  const [isPointerInside, setIsPointerInside] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [hasError, setHasError] = useState(false)

  // Detect prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Position calculation relative to container
  const updateTooltipPosition = useCallback((screenPos?: { x: number; y: number }) => {
    if (!containerRef.current || !screenPos) return
    const rect = containerRef.current.getBoundingClientRect()
    setTooltipPos({
      x: Math.max(16, Math.min(rect.width - 16, screenPos.x - rect.left)),
      y: Math.max(16, Math.min(rect.height - 16, screenPos.y - rect.top)),
    })
  }, [])

  // Handle hover from 3D scene
  const handleHover = useCallback(
    (info: { meta: ComponentMetadata; objectName: string } | null, screenPos?: { x: number; y: number }) => {
      if (isLocked) return // Do not overwrite locked selection
      setActiveInfo(info)
      if (info && screenPos) {
        updateTooltipPosition(screenPos)
      } else if (!info) {
        setTooltipPos(null)
      }
    },
    [isLocked, updateTooltipPosition]
  )

  // Handle click / tap selection
  const handleClickSelect = useCallback(
    (info: { meta: ComponentMetadata; objectName: string } | null, screenPos?: { x: number; y: number }) => {
      if (info) {
        setActiveInfo(info)
        setIsLocked(true)
        if (screenPos) updateTooltipPosition(screenPos)
      } else {
        setActiveInfo(null)
        setIsLocked(false)
        setTooltipPos(null)
      }
    },
    [updateTooltipPosition]
  )

  // Handle clicking empty space
  const handlePointerMissed = useCallback(() => {
    setActiveInfo(null)
    setIsLocked(false)
    setTooltipPos(null)
  }, [])

  return (
    <div
      ref={containerRef}
      className={`cof-crystal-container ${className}`}
      onPointerEnter={() => setIsPointerInside(true)}
      onPointerLeave={() => {
        setIsPointerInside(false)
        if (!isLocked) {
          setActiveInfo(null)
          setTooltipPos(null)
        }
      }}
      aria-label="Interactive 3D COF Crystal Structure Model"
      role="region"
    >
      {hasError ? (
        <div className="cof-error-fallback">
          <p>3D COF Crystal Structure Model</p>
          <small>Interactive WebGL visualization unavailable</small>
        </div>
      ) : (
        <Suspense fallback={<StructureLoadingFallback />}>
          <Canvas
            className="cof-crystal-canvas"
            camera={{ fov: 35, position: [0, 0, 22] }}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: 'high-performance',
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.15,
            }}
            onPointerMissed={handlePointerMissed}
            onError={() => setHasError(true)}
          >
            <CrystalScene
              onHover={handleHover}
              onClickSelect={handleClickSelect}
              onPointerMissed={handlePointerMissed}
              isLocked={isLocked}
              isPointerInsideCanvas={isPointerInside}
              prefersReducedMotion={prefersReducedMotion}
            />
          </Canvas>
        </Suspense>
      )}

      {/* Floating Scientific Label */}
      {activeInfo && tooltipPos && (
        <aside
          className={`cof-floating-badge ${isLocked ? 'is-locked' : ''}`}
          style={{
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y}px`,
          }}
          aria-live="polite"
        >
          <div className="cof-badge-top">
            <span className="cof-badge-label">{activeInfo.meta.label}</span>
            {activeInfo.meta.symbol && (
              <span className="cof-badge-symbol" style={{ borderColor: activeInfo.meta.accentColor }}>
                {activeInfo.meta.symbol}
              </span>
            )}
          </div>
          <div className="cof-badge-sub">
            <span className="cof-badge-type">{activeInfo.meta.type}</span>
            <span className="cof-badge-id">{activeInfo.objectName}</span>
          </div>
          {isLocked && (
            <div className="cof-badge-pin-hint">
              <span className="pin-dot">●</span> Pinned · Click space to resume
            </div>
          )}
        </aside>
      )}

      {/* Subtle interaction cue indicator at bottom-right of model */}
      <div className="cof-hud-status" aria-hidden="true">
        <span className="hud-pulse" />
        <span className="hud-text">
          {isLocked ? 'Structure Pinned' : isPointerInside ? 'Hover to inspect atom/bond' : '3D COF Crystal · Interactive'}
        </span>
      </div>
    </div>
  )
}

// Preload the crystal model for instant rendering
useGLTF.preload(`${import.meta.env.BASE_URL}models/cof-crystal.glb`)

