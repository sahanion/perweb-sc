import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

type FrameworkProps = {
  className?: string
}

export function ReticularFramework3D({ className = '' }: FrameworkProps) {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    let width = container.clientWidth || 720
    let height = container.clientHeight || 650

    // --- Scene & Camera ---
    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 1000)
    camera.position.set(0, 0, 30)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    container.appendChild(renderer.domElement)

    // --- Studio & Gallery Lighting for Metallic and Crystal Materials ---
    const ambientLight = new THREE.AmbientLight('#ffffff', 1.8)
    scene.add(ambientLight)

    const keyLight = new THREE.DirectionalLight('#fffcf5', 2.2)
    keyLight.position.set(24, 28, 22)
    scene.add(keyLight)

    const fillLight = new THREE.DirectionalLight('#dce9f8', 1.3)
    fillLight.position.set(-22, -12, 18)
    scene.add(fillLight)

    const rimLight = new THREE.DirectionalLight('#faeeda', 1.1)
    rimLight.position.set(8, 20, -22)
    scene.add(rimLight)

    // Subtle warm point light inside the crystal core
    const coreLight = new THREE.PointLight('#ba9c66', 1.4, 45, 1.2)
    coreLight.position.set(0, 0, 0)
    scene.add(coreLight)

    // --- Groups for Tilt & Model Manipulation ---
    const tiltGroup = new THREE.Group()
    scene.add(tiltGroup)

    const modelPivot = new THREE.Group()
    tiltGroup.add(modelPivot)

    // Initial artistic orientation
    modelPivot.rotation.set(0.32, -0.42, 0.12)

    const updatePivotPosition = () => {
      const isMobile = window.innerWidth < 768
      // Shift right on desktop so the crystal frames the hero section beautifully
      modelPivot.position.set(isMobile ? 0 : 2.8, 0, 0)
    }
    updatePivotPosition()

    // --- Load Crystal GLB Model ---
    let isDisposed = false
    const loadedObjects: THREE.Object3D[] = []

    const loader = new GLTFLoader()
    const modelUrl = `${import.meta.env.BASE_URL}crystal.glb`

    loader.load(
      modelUrl,
      (gltf) => {
        if (isDisposed) {
          gltf.scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh
              mesh.geometry?.dispose()
              if (Array.isArray(mesh.material)) {
                mesh.material.forEach((m) => m.dispose())
              } else {
                mesh.material?.dispose()
              }
            }
          })
          return
        }

        const crystal = gltf.scene

        // Calculate bounding box and center geometry
        const box = new THREE.Box3().setFromObject(crystal)
        const center = new THREE.Vector3()
        const size = new THREE.Vector3()
        box.getCenter(center)
        box.getSize(size)

        // Center model geometry at origin
        crystal.position.sub(center)

        // Scale model to harmoniously fill viewport (max dimension ~ 16 units)
        const maxDim = Math.max(size.x, size.y, size.z) || 8.5
        const targetDim = 16.2
        const scale = targetDim / maxDim
        crystal.scale.setScalar(scale)

        crystal.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh
            mesh.castShadow = false
            mesh.receiveShadow = false
          }
        })

        modelPivot.add(crystal)
        loadedObjects.push(crystal)
      },
      undefined,
      (err) => {
        console.error('Failed to load COF crystal model:', err)
      }
    )

    // --- Interactive Mouse Pointer & Drag Handling ---
    let targetTiltX = 0
    let targetTiltY = 0
    let currentTiltX = 0
    let currentTiltY = 0

    let isPointerDown = false
    let prevPointer = { x: 0, y: 0 }
    let dragVelocity = { x: 0, y: 0 }

    const onWindowPointerMove = (e: PointerEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1
      const normY = (e.clientY / window.innerHeight) * 2 - 1

      // Subtle, elegant responsive tilt following cursor
      targetTiltY = normX * 0.35
      targetTiltX = normY * 0.24

      if (isPointerDown) {
        const deltaX = e.clientX - prevPointer.x
        const deltaY = e.clientY - prevPointer.y
        prevPointer = { x: e.clientX, y: e.clientY }

        dragVelocity.y += deltaX * 0.0028
        dragVelocity.x += deltaY * 0.0028
      }
    }

    const onPointerDown = (e: PointerEvent) => {
      isPointerDown = true
      prevPointer = { x: e.clientX, y: e.clientY }
      container.classList.add('is-dragging')
      container.setPointerCapture(e.pointerId)
    }

    const onPointerUp = (e: PointerEvent) => {
      isPointerDown = false
      container.classList.remove('is-dragging')
      try {
        container.releasePointerCapture(e.pointerId)
      } catch {
        // Ignored
      }
    }

    window.addEventListener('pointermove', onWindowPointerMove, { passive: true })
    container.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointerup', onPointerUp)

    // --- Animation Loop ---
    let animationFrameId: number
    const clock = new THREE.Clock()

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      const delta = clock.getDelta()
      const time = clock.getElapsedTime()

      // Smooth interpolation for subtle pointer tilt
      currentTiltX = THREE.MathUtils.lerp(currentTiltX, targetTiltX, 0.04)
      currentTiltY = THREE.MathUtils.lerp(currentTiltY, targetTiltY, 0.04)

      tiltGroup.rotation.x = currentTiltX
      tiltGroup.rotation.y = currentTiltY

      // Continuous slow, stately rotation of the crystal lattice
      modelPivot.rotation.y += delta * 0.10
      modelPivot.rotation.x += Math.sin(time * 0.4) * 0.0004

      // Apply drag momentum with smooth inertia
      modelPivot.rotation.x += dragVelocity.x
      modelPivot.rotation.y += dragVelocity.y
      dragVelocity.x *= 0.92
      dragVelocity.y *= 0.92

      // Subtle core light drift
      coreLight.position.x = Math.sin(time * 0.8) * 0.6
      coreLight.position.y = Math.cos(time * 0.9) * 0.6

      renderer.render(scene, camera)
    }

    animate()

    // --- Responsive ResizeObserver ---
    const handleResize = () => {
      if (!container) return
      width = container.clientWidth
      height = container.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
      updatePivotPosition()
    }

    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(container)

    // --- Cleanup on unmount ---
    return () => {
      isDisposed = true
      cancelAnimationFrame(animationFrameId)
      resizeObserver.disconnect()
      window.removeEventListener('pointermove', onWindowPointerMove)
      container.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointerup', onPointerUp)

      loadedObjects.forEach((obj) => {
        obj.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh
            mesh.geometry?.dispose()
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach((m) => m.dispose())
            } else {
              mesh.material?.dispose()
            }
          }
        })
      })

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }

      renderer.dispose()
    }
  }, [])

  return (
    <div
      className={`framework-3d-wrapper ${className}`}
      style={{
        background: 'transparent',
        border: 'none',
        boxShadow: 'none',
      }}
    >
      <div
        ref={mountRef}
        className="framework-3d-viewport"
        style={{
          background: 'transparent',
        }}
        aria-label="3D Reticular Framework - Interactive COF Crystal Model"
        role="img"
      />
    </div>
  )
}
