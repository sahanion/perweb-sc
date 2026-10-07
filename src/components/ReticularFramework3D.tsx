import { useEffect, useRef } from 'react'
import * as THREE from 'three'

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

    // Camera perspective: framed so the left side is fully visible with safe margins,
    // and the right side gracefully overflows beyond the screen
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 1000)
    camera.position.set(0, 0, 35)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    container.appendChild(renderer.domElement)

    // --- Subtle, Diffused Gallery Lighting ---
    const ambientLight = new THREE.AmbientLight('#f5efe6', 1.4)
    scene.add(ambientLight)

    const keyLight = new THREE.DirectionalLight('#ffffff', 1.5)
    keyLight.position.set(24, 30, 26)
    scene.add(keyLight)

    const fillLight = new THREE.DirectionalLight('#dde4ec', 0.95)
    fillLight.position.set(-20, -14, 16)
    scene.add(fillLight)

    const bounceLight = new THREE.DirectionalLight('#ece2d0', 0.75)
    bounceLight.position.set(10, -20, -16)
    scene.add(bounceLight)

    // Gentle central cavity light inside the pore channel
    const cavityLight = new THREE.PointLight('#d8c5a2', 1.1, 45, 1.2)
    cavityLight.position.set(4.6, 0, 4)
    scene.add(cavityLight)

    // --- Pure Ball-and-Socket Materials (Pastel Shades, Matte-Satin) ---
    // 1. Pastel champagne gold (soft, airy, warm sand gold)
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: '#d8c5a2',
      metalness: 0.22,
      roughness: 0.68,
    })

    // 2. Pastel mineral powder slate
    const slateMaterial = new THREE.MeshStandardMaterial({
      color: '#8ea0b5',
      metalness: 0.22,
      roughness: 0.68,
    })

    // 3. Pastel dusty slate navy rods/sticks
    const strutMaterial = new THREE.MeshStandardMaterial({
      color: '#2c3954',
      metalness: 0.18,
      roughness: 0.72,
    })

    // --- Pure Ball-and-Socket Geometry (Strictly Balls & Sticks, NO PLANES) ---
    function buildBallAndSocketFramework(poreRadius: number, layers: number, layerSpacing: number) {
      const group = new THREE.Group()

      // 7 Honeycomb pore centers (1 center + 6 surrounding hexagonal rings)
      const centers: [number, number][] = [[0, 0]]
      const D = poreRadius * Math.sqrt(3)
      for (let j = 0; j < 6; j++) {
        const theta = ((2 * j + 1) * Math.PI) / 6
        centers.push([D * Math.cos(theta), D * Math.sin(theta)])
      }

      // Collect unique 2D vertices
      const vertexMap = new Map<string, { id: number; x: number; y: number }>()
      const pores: number[][] = []

      centers.forEach((c) => {
        const poreVerts: number[] = []
        for (let k = 0; k < 6; k++) {
          const angle = (k * Math.PI) / 3
          const x = +(c[0] + poreRadius * Math.cos(angle)).toFixed(2)
          const y = +(c[1] + poreRadius * Math.sin(angle)).toFixed(2)
          const key = `${x},${y}`
          if (!vertexMap.has(key)) {
            vertexMap.set(key, { id: vertexMap.size, x, y })
          }
          poreVerts.push(vertexMap.get(key)!.id)
        }
        pores.push(poreVerts)
      })

      const vertices2D = Array.from(vertexMap.values())
      const numV = vertices2D.length

      // Generate 3D Node positions
      const nodes3D: THREE.Vector3[] = []
      const zOffset = ((layers - 1) * layerSpacing) / 2
      for (let l = 0; l < layers; l++) {
        const z = l * layerSpacing - zOffset
        for (let i = 0; i < numV; i++) {
          nodes3D.push(new THREE.Vector3(vertices2D[i].x, vertices2D[i].y, z))
        }
      }

      // Collect unique edges (sticks)
      const edgeSet = new Set<string>()
      const edges: [number, number][] = []

      function addEdge(u: number, v: number) {
        const a = Math.min(u, v)
        const b = Math.max(u, v)
        const key = `${a}-${b}`
        if (!edgeSet.has(key)) {
          edgeSet.add(key)
          edges.push([a, b])
        }
      }

      // 1. Intra-layer ring struts
      for (let l = 0; l < layers; l++) {
        pores.forEach((p) => {
          for (let k = 0; k < 6; k++) {
            const u = p[k] + l * numV
            const v = p[(k + 1) % 6] + l * numV
            addEdge(u, v)
          }
        })
      }

      // 2. Inter-layer vertical struts & diagonal cross-struts
      for (let l = 0; l < layers - 1; l++) {
        for (let i = 0; i < numV; i++) {
          const u = i + l * numV
          const v = i + (l + 1) * numV
          addEdge(u, v)
        }

        pores.forEach((p) => {
          for (let k = 0; k < 6; k++) {
            const u1 = p[k] + l * numV
            const u2 = p[(k + 1) % 6] + l * numV
            const v1 = p[k] + (l + 1) * numV
            const v2 = p[(k + 1) % 6] + (l + 1) * numV
            addEdge(u1, v2)
            addEdge(u2, v1)
          }
        })
      }

      // Instanced Meshes for Pure Ball-and-Socket:
      // Balls: Spheres
      // Sockets/Sticks: Cylinders
      const unitSphereGeom = new THREE.SphereGeometry(1, 16, 14)
      const unitCylinderGeom = new THREE.CylinderGeometry(1, 1, 1, 8)
      unitCylinderGeom.translate(0, 0.5, 0)
      unitCylinderGeom.rotateX(Math.PI / 2)

      // Total gold spheres: 1 main ball at each junction (120) + 1 linker bead per stick (~486)
      const goldSphereCount = nodes3D.length + edges.length
      const goldMesh = new THREE.InstancedMesh(unitSphereGeom, goldMaterial, goldSphereCount)

      // Total slate spheres: 1 delicate coordination ball per junction (120)
      const slateSphereCount = nodes3D.length
      const slateMesh = new THREE.InstancedMesh(unitSphereGeom, slateMaterial, slateSphereCount)

      // Strut cylinders (sticks)
      const strutMesh = new THREE.InstancedMesh(unitCylinderGeom, strutMaterial, edges.length)

      const dummy = new THREE.Object3D()
      let goldIdx = 0
      let slateIdx = 0

      // Place Balls at every 3D Junction Node
      nodes3D.forEach((pos, i) => {
        // Main Champagne Gold Ball
        dummy.position.copy(pos)
        dummy.rotation.set(0, 0, 0)
        dummy.scale.setScalar(0.32)
        dummy.updateMatrix()
        goldMesh.setMatrixAt(goldIdx++, dummy.matrix)

        // Subtle Slate Coordination Ball
        const angle = ((i * 1.6) % 2) * Math.PI
        dummy.position.set(pos.x + Math.cos(angle) * 0.38, pos.y + Math.sin(angle) * 0.38, pos.z + 0.12)
        dummy.scale.setScalar(0.18)
        dummy.updateMatrix()
        slateMesh.setMatrixAt(slateIdx++, dummy.matrix)
      })

      // Place Sticks (Cylinders) and Midpoint Beads
      edges.forEach(([u, v], eIdx) => {
        const p1 = nodes3D[u]
        const p2 = nodes3D[v]
        const dir = new THREE.Vector3().subVectors(p2, p1)
        const len = dir.length()

        // Slender Stick / Rod (radius 0.045)
        dummy.position.copy(p1)
        dummy.lookAt(p2)
        dummy.scale.set(0.045, 0.045, len)
        dummy.updateMatrix()
        strutMesh.setMatrixAt(eIdx, dummy.matrix)

        // Single delicate midpoint ball
        const midPoint = new THREE.Vector3().lerpVectors(p1, p2, 0.5)
        dummy.position.copy(midPoint)
        dummy.rotation.set(0, 0, 0)
        dummy.scale.setScalar(0.12)
        dummy.updateMatrix()
        goldMesh.setMatrixAt(goldIdx++, dummy.matrix)
      })

      goldMesh.instanceMatrix.needsUpdate = true
      slateMesh.instanceMatrix.needsUpdate = true
      strutMesh.instanceMatrix.needsUpdate = true

      group.add(strutMesh)
      group.add(goldMesh)
      group.add(slateMesh)

      return group
    }

    // --- Single Hero Particle: Shifted Right & Overflowing Past Right Edge ---
    const tiltGroup = new THREE.Group()
    scene.add(tiltGroup)

    const mainFramework = buildBallAndSocketFramework(3.6, 5, 2.6)
    mainFramework.scale.setScalar(1.32)
    // Shifted to the right: right side bleeds offscreen, left side has ~9 units of breathing room
    mainFramework.position.set(4.6, 0, 0)
    mainFramework.rotation.set(0.38, -0.45, 0.15)

    tiltGroup.add(mainFramework)

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

      // Subtle, elegant responsive rotation following cursor position
      targetTiltY = normX * 0.42
      targetTiltX = normY * 0.30

      if (isPointerDown) {
        const deltaX = e.clientX - prevPointer.x
        const deltaY = e.clientY - prevPointer.y
        prevPointer = { x: e.clientX, y: e.clientY }

        dragVelocity.y += deltaX * 0.0025
        dragVelocity.x += deltaY * 0.0025
      }
    }

    const onPointerDown = (e: PointerEvent) => {
      isPointerDown = true
      prevPointer = { x: e.clientX, y: e.clientY }
      container.setPointerCapture(e.pointerId)
    }

    const onPointerUp = (e: PointerEvent) => {
      isPointerDown = false
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

      // Smooth interpolation for mouse pointer responsiveness
      currentTiltX = THREE.MathUtils.lerp(currentTiltX, targetTiltX, 0.04)
      currentTiltY = THREE.MathUtils.lerp(currentTiltY, targetTiltY, 0.04)

      tiltGroup.rotation.x = currentTiltX
      tiltGroup.rotation.y = currentTiltY

      // Continuous slow, stately rotation of the particle
      mainFramework.rotation.y += delta * 0.10
      mainFramework.rotation.x += Math.sin(time * 0.4) * 0.0005

      // Apply drag momentum with smooth inertia
      mainFramework.rotation.x += dragVelocity.x
      mainFramework.rotation.y += dragVelocity.y
      dragVelocity.x *= 0.92
      dragVelocity.y *= 0.92

      // Subtle cavity light drift
      cavityLight.position.x = 4.6 + Math.sin(time * 0.8) * 0.8
      cavityLight.position.y = Math.cos(time * 0.9) * 0.8

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
    }

    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(container)

    // --- Cleanup on unmount ---
    return () => {
      cancelAnimationFrame(animationFrameId)
      resizeObserver.disconnect()
      window.removeEventListener('pointermove', onWindowPointerMove)
      container.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointerup', onPointerUp)

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }

      renderer.dispose()
      goldMaterial.dispose()
      slateMaterial.dispose()
      strutMaterial.dispose()
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
        aria-label="3D Reticular Framework Particle - Ball and Socket Model"
        role="img"
      />
    </div>
  )
}
