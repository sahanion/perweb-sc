import { useState, useRef, useEffect, useCallback } from 'react'
import powerCo2Img from '../assets/power-co2-project.jpg'

type AnimationStatus = 'idle' | 'running' | 'completed'

interface TimelinePhase {
  sunRays: boolean         // 0 - 3 sec: sunrays moving
  co2Moving: boolean       // 0 - 1.5 sec: CO2 molecules move deep into framework
  co2Absorbed: boolean     // after 1.5 sec: CO2 absorbed inside framework
  electronsMoving: boolean // 0.5 - 2 sec: electrons start moving along framework
  fuelsMoving: boolean     // 1 - 3 sec: solar fuel molecules moving from framework towards outside
  circleFormed: boolean    // at 3 sec: circle forms and label "Solar fuels" appears
}

export function InteractivePowerCo2() {
  const [isHovered, setIsHovered] = useState(false)
  const [animStatus, setAnimStatus] = useState<AnimationStatus>('idle')
  const [phase, setPhase] = useState<TimelinePhase>({
    sunRays: false,
    co2Moving: false,
    co2Absorbed: false,
    electronsMoving: false,
    fuelsMoving: false,
    circleFormed: true,
  })

  const timersRef = useRef<number[]>([])

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach((t) => clearTimeout(t))
    timersRef.current = []
  }, [])

  const resetSimulation = useCallback(() => {
    clearAllTimers()
    setAnimStatus('idle')
    setPhase({
      sunRays: false,
      co2Moving: false,
      co2Absorbed: false,
      electronsMoving: false,
      fuelsMoving: false,
      circleFormed: true,
    })
  }, [clearAllTimers])

  // =========================================================================
  // ANIMATION TIMELINE (Strictly matching user specification):
  // 0 - 1.5 sec: CO2 molecules move deep into the framework.
  // 0.5 - 2 sec: electrons start moving
  // 1 - 3 sec: solar fuel molecules moving from framework towards outside
  // 0 - 3 sec: sunrays moving
  // At 3 sec: circle forms and label "Solar fuels" appears
  // 3 - 5 sec: display complete synthesis state
  // At 5 sec: auto-reset to idle
  // =========================================================================
  const startSimulation = useCallback(() => {
    clearAllTimers()
    setAnimStatus('running')

    // t = 0s:
    // - 0 to 3s: Sunrays moving
    // - 0 to 1.5s: CO2 molecules move deep into the framework
    // - Solar fuels circle & molecules hidden
    setPhase({
      sunRays: true,
      co2Moving: true,
      co2Absorbed: false,
      electronsMoving: false,
      fuelsMoving: false,
      circleFormed: false,
    })

    // t = 0.5s (500ms): Electrons start moving along framework (0.5 - 2.0s)
    const t1 = window.setTimeout(() => {
      setPhase((p) => ({ ...p, electronsMoving: true }))
    }, 500)

    // t = 1.0s (1000ms): Solar fuel molecules start moving from framework towards outside (1 - 3s)
    const t2 = window.setTimeout(() => {
      setPhase((p) => ({ ...p, fuelsMoving: true }))
    }, 1000)

    // t = 1.5s (1500ms): CO2 molecules have finished moving deep into framework pores
    const t3 = window.setTimeout(() => {
      setPhase((p) => ({ ...p, co2Absorbed: true }))
    }, 1500)

    // t = 2.0s (2000ms): Electrons finish active surge across framework
    const t4 = window.setTimeout(() => {
      setPhase((p) => ({ ...p, electronsMoving: false }))
    }, 2000)

    // t = 3.0s (3000ms):
    // - Sunrays stop moving
    // - Fuel molecules have arrived
    // - Circle forms and label "Solar fuels" appears!
    const t5 = window.setTimeout(() => {
      setPhase((p) => ({
        ...p,
        sunRays: false,
        fuelsMoving: false,
        circleFormed: true,
      }))
      setAnimStatus('completed')
    }, 3000)

    // t = 5.2s: Auto reset back to idle
    const t6 = window.setTimeout(() => {
      setAnimStatus('idle')
      setPhase({
        sunRays: false,
        co2Moving: false,
        co2Absorbed: false,
        electronsMoving: false,
        fuelsMoving: false,
        circleFormed: true,
      })
    }, 5200)

    timersRef.current = [t1, t2, t3, t4, t5, t6]
  }, [clearAllTimers])

  useEffect(() => {
    return () => clearAllTimers()
  }, [clearAllTimers])



  // Exact curved spline path for electron streamline
  const electronCurvePath =
    'M 270 550 L 336 527 C 360 520, 370 470, 376 401 C 382 350, 400 324, 426 318 C 480 308, 570 305, 638 304 L 675 302'

  // Green trajectory for fuel release from framework
  const fuelEgressPath = 'M 645 320 C 700 310, 760 280, 810 255'



  // The circular envelope and label "Solar fuels" appear at t = 3s (or at idle)
  const showCircleAndLabel =
    animStatus === 'idle' || phase.circleFormed

  return (
    <div
      className={`interactive-powerco2-frame ${isHovered ? 'is-hovered' : ''} ${animStatus === 'running' ? 'is-running' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={animStatus === 'running' ? undefined : startSimulation}
      role="button"
      tabIndex={0}
      aria-label="Interactive POWER-CO2 Photocatalytic Reaction Simulation. Click to simulate the reaction."
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          startSimulation()
        }
      }}
    >
      {/* Pristine 3D Scientific Illustration Base */}
      <img
        src={powerCo2Img}
        alt="POWER-CO2 Project: Solar-driven photocatalytic and photoelectrochemical CO2 reduction over MOF/COF thin films on semiconductor electrodes"
        className="powerco2-base-img"
        loading="lazy"
      />

      {/* SVG Interactive Overlay (1024 x 682 exact pixel coordinate mapping) */}
      <svg
        className="powerco2-svg-overlay"
        viewBox="0 0 1024 682"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          {/* Arrowhead Markers for Perfectly Aligned Direction Vectors */}
          <marker
            id="co2ArrowheadClean"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#64748b" />
          </marker>

          <marker
            id="greenFuelArrowhead"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#22c55e" />
          </marker>

          {/* Glow Filters */}
          <filter id="pco2SunGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="12" result="blur1" />
            <feGaussianBlur stdDeviation="26" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="pco2ElectronGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5.5" result="blur1" />
            <feGaussianBlur stdDeviation="14" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="pco2FuelGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="7" result="blur1" />
            <feGaussianBlur stdDeviation="16" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="pco2SparkGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* 3D Sphere Specular Shaders */}
          <radialGradient id="sphereCarbon" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#64748b" />
            <stop offset="35%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#090d16" />
          </radialGradient>

          <radialGradient id="sphereOxygen" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#fca5a5" />
            <stop offset="35%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#991b1b" />
          </radialGradient>

          <radialGradient id="sphereHydrogen" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="55%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#94a3b8" />
          </radialGradient>

          {/* Sun Rays Gradient */}
          <linearGradient id="pco2SunRayGrad" x1="0%" y1="0%" x2="30%" y2="90%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.55" />
            <stop offset="40%" stopColor="#fcd34d" stopOpacity="0.25" />
            <stop offset="75%" stopColor="#fbbf24" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#d8c5a2" stopOpacity="0.0" />
          </linearGradient>

          {/* Solar Fuel Green Beam Gradient */}
          <linearGradient id="pco2FuelTrail" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#4ade80" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#86efac" stopOpacity="1" />
          </linearGradient>

          {/* Solar Fuel Circle Interior Background Tint */}
          <radialGradient id="solarCircleBg" cx="45%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#f4fbf5" stopOpacity="0.96" />
            <stop offset="70%" stopColor="#e8f5ea" stopOpacity="0.94" />
            <stop offset="100%" stopColor="#ddedd0" stopOpacity="0.92" />
          </radialGradient>
        </defs>

        {/* =================================================================== */}
        {/* 1. SUN & SUNRAYS MOVING (0 - 3 sec) */}
        {/* =================================================================== */}
        <g id="interactive-sun-group">
          {/* Sun Core & Corona Disk Group (Locked at 935, 72) */}
          <g transform="translate(935, 72)" className="sun-disks-cluster">
            <circle
              cx="0"
              cy="0"
              r="44"
              className="sun-corona-halo"
              fill="#f59e0b"
              filter="url(#pco2SunGlow)"
            />
            <circle
              cx="0"
              cy="0"
              r="36"
              className="sun-core-pulse"
              fill="#fcd34d"
              filter="url(#pco2SunGlow)"
            />

            {/* Rotating Solar Dashed Ring */}
            <circle
              cx="0"
              cy="0"
              r="55"
              className="sun-spin-ring"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="1.5"
              strokeDasharray="4 6"
            />
          </g>

          {/* SUNRAYS MOVING: Active from 0 to 3 sec */}
          {phase.sunRays && (
            <g className="animated-solar-rays">
              <polygon
                points="935 72, 420 330, 700 290, 790 390"
                fill="url(#pco2SunRayGrad)"
                className="solar-light-cone"
              />

              <line
                x1="935"
                y1="72"
                x2="480"
                y2="330"
                className="photon-beam beam-1"
                stroke="#fcd34d"
                strokeWidth="2.5"
                strokeDasharray="12 18"
              />
              <line
                x1="935"
                y1="72"
                x2="590"
                y2="310"
                className="photon-beam beam-2"
                stroke="#fffbeb"
                strokeWidth="3"
                strokeDasharray="16 22"
              />
              <line
                x1="935"
                y1="72"
                x2="690"
                y2="350"
                className="photon-beam beam-3"
                stroke="#f59e0b"
                strokeWidth="2"
                strokeDasharray="10 16"
              />

              {/* Cascading Photon Energy Packets */}
              <g className="photon-packet-cascade">
                <circle cx="935" cy="72" r="5" fill="#ffffff" filter="url(#pco2SparkGlow)" className="photon-wave wave-1" />
                <circle cx="935" cy="72" r="6" fill="#fcd34d" filter="url(#pco2SparkGlow)" className="photon-wave wave-2" />
                <circle cx="935" cy="72" r="4.5" fill="#ffffff" filter="url(#pco2SparkGlow)" className="photon-wave wave-3" />
              </g>

              {/* Tag Annotation - Prominent & High-Legibility */}
              <g transform="translate(775, 105)" className="photon-annotation">
                <rect x="0" y="0" width="148" height="30" rx="6" fill="rgba(17, 23, 38, 0.94)" stroke="#fcd34d" strokeWidth="1.6" />
                <text x="74" y="16" fill="#fcd34d" fontFamily="'Space Mono', monospace" fontSize="13.5" fontWeight="800" letterSpacing="0.06em" textAnchor="middle" dominantBaseline="central">hν PHOTONS</text>
              </g>
            </g>
          )}
        </g>

        {/* =================================================================== */}
        {/* 2. CO2 MOLECULES MOVE DEEP INTO FRAMEWORK (0 - 1.5 sec) */}
        {/* =================================================================== */}
        <g id="interactive-co2-group">
          {/* Label "CO2" */}
          <text
            x="52"
            y="152"
            fontFamily="'Cormorant Garamond', Georgia, serif"
            fontSize="26"
            fontStyle="italic"
            fontWeight="600"
            fill="#1e293b"
          >
            CO<tspan fontSize="18" dy="4">2</tspan>
          </text>

          {/* Clean, Non-Glowing Influx Direction Arrows (Aligned arrowheads, ZERO glow) */}
          <path
            d="M 115 165 C 160 185, 195 215, 238 250"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="2.5"
            strokeOpacity="0.75"
            strokeLinecap="round"
            markerEnd="url(#co2ArrowheadClean)"
            className="co2-influx-arrow-clean"
          />

          <path
            d="M 145 240 C 185 260, 215 280, 248 305"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="2.5"
            strokeOpacity="0.75"
            strokeLinecap="round"
            markerEnd="url(#co2ArrowheadClean)"
            className="co2-influx-arrow-clean"
          />

          {/* CO2 MOLECULES:
              - 0 - 1.5s: Move deep into framework pore openings
              - 1.5s+: fully absorbed inside cavities (opacity: 0) */}
          <g className={`co2-molecules-cluster ${phase.co2Moving ? 'is-gliding-deep-0to15' : ''} ${phase.co2Absorbed ? 'is-absorbed' : ''}`}>
            {/* CO2 Molecule 1 */}
            <g className="co2-unit unit-1">
              <line x1="-16" y1="0" x2="16" y2="0" stroke="#cbd5e1" strokeWidth="2.5" />
              <circle cx="0" cy="0" r="10.5" fill="url(#sphereCarbon)" />
              <circle cx="-18" cy="0" r="9.5" fill="url(#sphereOxygen)" />
              <circle cx="18" cy="0" r="9.5" fill="url(#sphereOxygen)" />
            </g>

            {/* CO2 Molecule 2 */}
            <g className="co2-unit unit-2">
              <line x1="-15" y1="0" x2="15" y2="0" stroke="#cbd5e1" strokeWidth="2.5" />
              <circle cx="0" cy="0" r="10" fill="url(#sphereCarbon)" />
              <circle cx="-17" cy="0" r="9" fill="url(#sphereOxygen)" />
              <circle cx="17" cy="0" r="9" fill="url(#sphereOxygen)" />
            </g>

            {/* CO2 Molecule 3 */}
            <g className="co2-unit unit-3">
              <line x1="-15" y1="0" x2="15" y2="0" stroke="#cbd5e1" strokeWidth="2.5" />
              <circle cx="0" cy="0" r="9.5" fill="url(#sphereCarbon)" />
              <circle cx="-16" cy="0" r="8.5" fill="url(#sphereOxygen)" />
              <circle cx="16" cy="0" r="8.5" fill="url(#sphereOxygen)" />
            </g>

            {/* CO2 Molecule 4 */}
            <g className="co2-unit unit-4">
              <line x1="-15" y1="0" x2="15" y2="0" stroke="#cbd5e1" strokeWidth="2.5" />
              <circle cx="0" cy="0" r="10" fill="url(#sphereCarbon)" />
              <circle cx="-17" cy="0" r="9" fill="url(#sphereOxygen)" />
              <circle cx="17" cy="0" r="9" fill="url(#sphereOxygen)" />
            </g>

            {/* CO2 Molecule 5 */}
            <g className="co2-unit unit-5">
              <line x1="-15" y1="0" x2="15" y2="0" stroke="#cbd5e1" strokeWidth="2.5" />
              <circle cx="0" cy="0" r="9.5" fill="url(#sphereCarbon)" />
              <circle cx="-16" cy="0" r="8.5" fill="url(#sphereOxygen)" />
              <circle cx="16" cy="0" r="8.5" fill="url(#sphereOxygen)" />
            </g>
          </g>
        </g>

        {/* =================================================================== */}
        {/* 3. ELECTRONS START MOVING (0.5 - 2 sec) & LARGE READABLE MARKERS */}
        {/* =================================================================== */}
        <g id="interactive-electron-group">
          {/* Main Glowing Streamline Path (Electric Blue) */}
          <path
            d={electronCurvePath}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="electron-glow-path"
            filter="url(#pco2ElectronGlow)"
          />
          <path
            d={electronCurvePath}
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="electron-core-path"
          />

          {/* Arrowhead at path terminus on top of framework */}
          <polygon points="670 295, 686 302, 670 309" fill="#38bdf8" />
          <polygon points="670 297, 682 302, 670 307" fill="#ffffff" />

          {/* 4 PROMINENT, HIGH-CONTRAST, EXTRA-LARGE READABLE ELECTRON (e⁻) MARKERS */}
          {/* Marker 1: Semiconductor base surface */}
          <g transform="translate(336, 527)" className="electron-bead bead-1">
            <circle cx="0" cy="0" r="34" className="bead-ripple" fill="#38bdf8" />
            <circle cx="0" cy="0" r="26" className="bead-core-bg" fill="#070e1e" stroke="#ffffff" strokeWidth="3" filter="url(#pco2ElectronGlow)" />
            <circle cx="0" cy="0" r="26" className="bead-core" fill="#0284c7" stroke="#ffffff" strokeWidth="3" />
            <text x="0" y="0.5" fill="#ffffff" fontFamily="'Space Mono', monospace" fontSize="22" fontWeight="900" letterSpacing="-0.04em" textAnchor="middle" dominantBaseline="central">e⁻</text>
          </g>

          {/* Marker 2: Framework front-left corner pillar */}
          <g transform="translate(376, 401)" className="electron-bead bead-2">
            <circle cx="0" cy="0" r="34" className="bead-ripple" fill="#38bdf8" />
            <circle cx="0" cy="0" r="26" className="bead-core-bg" fill="#070e1e" stroke="#ffffff" strokeWidth="3" filter="url(#pco2ElectronGlow)" />
            <circle cx="0" cy="0" r="26" className="bead-core" fill="#0284c7" stroke="#ffffff" strokeWidth="3" />
            <text x="0" y="0.5" fill="#ffffff" fontFamily="'Space Mono', monospace" fontSize="22" fontWeight="900" letterSpacing="-0.04em" textAnchor="middle" dominantBaseline="central">e⁻</text>
          </g>

          {/* Marker 3: Top-left framework corner */}
          <g transform="translate(426, 318)" className="electron-bead bead-3">
            <circle cx="0" cy="0" r="34" className="bead-ripple" fill="#38bdf8" />
            <circle cx="0" cy="0" r="26" className="bead-core-bg" fill="#070e1e" stroke="#ffffff" strokeWidth="3" filter="url(#pco2ElectronGlow)" />
            <circle cx="0" cy="0" r="26" className="bead-core" fill="#0284c7" stroke="#ffffff" strokeWidth="3" />
            <text x="0" y="0.5" fill="#ffffff" fontFamily="'Space Mono', monospace" fontSize="22" fontWeight="900" letterSpacing="-0.04em" textAnchor="middle" dominantBaseline="central">e⁻</text>
          </g>

          {/* Marker 4: Top-right framework surface */}
          <g transform="translate(638, 304)" className="electron-bead bead-4">
            <circle cx="0" cy="0" r="34" className="bead-ripple" fill="#38bdf8" />
            <circle cx="0" cy="0" r="26" className="bead-core-bg" fill="#070e1e" stroke="#ffffff" strokeWidth="3" filter="url(#pco2ElectronGlow)" />
            <circle cx="0" cy="0" r="26" className="bead-core" fill="#0284c7" stroke="#ffffff" strokeWidth="3" />
            <text x="0" y="0.5" fill="#ffffff" fontFamily="'Space Mono', monospace" fontSize="22" fontWeight="900" letterSpacing="-0.04em" textAnchor="middle" dominantBaseline="central">e⁻</text>
          </g>

          {/* ELECTRONS MOVING (0.5 - 2 sec): Electric charge surge along the exact curve path */}
          {phase.electronsMoving && (
            <g className="animated-electron-stream">
              <path
                d={electronCurvePath}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="electron-charge-surge-glow"
                filter="url(#pco2ElectronGlow)"
              />
              <path
                d={electronCurvePath}
                fill="none"
                stroke="#ffffff"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="electron-charge-surge-core"
              />
            </g>
          )}
        </g>



        {/* =================================================================== */}
        {/* 5. SOLAR FUEL MOLECULES MOVING FROM FRAMEWORK (1 - 3 sec) */}
        {/* =================================================================== */}
        <g id="interactive-solar-fuels-group">
          {/* Green Trajectory Egress Arrow */}
          <path
            d={fuelEgressPath}
            fill="none"
            stroke="#22c55e"
            strokeWidth="4.5"
            strokeLinecap="round"
            markerEnd="url(#greenFuelArrowhead)"
            className={`green-egress-arrow ${phase.fuelsMoving ? 'is-active' : ''}`}
          />

          {/* Clean Glassmorphic Solar Fuel Circle Badge (Forms at t = 3 sec!) */}
          <g
            className={`solar-fuels-circle-envelope ${showCircleAndLabel ? 'is-visible' : 'is-hidden'}`}
            style={{ display: showCircleAndLabel ? 'block' : 'none' }}
          >
            <circle
              cx="885"
              cy="250"
              r="115"
              fill="url(#solarCircleBg)"
              stroke="#22c55e"
              strokeWidth="2.5"
              className="solar-fuels-circle-border"
            />

            {/* Outer Pulsing Halo */}
            <circle
              cx="885"
              cy="250"
              r="118"
              className="solar-fuels-halo"
              fill="none"
              stroke="#4ade80"
              strokeWidth="3.5"
              filter="url(#pco2FuelGlow)"
            />

            {/* Heading ONLY: "Solar fuels" (NO individual labels) */}
            <text
              x="885"
              y="172"
              fontFamily="'Cormorant Garamond', Georgia, serif"
              fontSize="21"
              fontStyle="italic"
              fontWeight="600"
              textAnchor="middle"
              fill="#1e293b"
              letterSpacing="0.02em"
              className="solar-fuels-title"
            >
              Solar fuels
            </text>
          </g>

          {/* SOLAR FUEL MOLECULES (CO, CH3COOH, CH3OH, C2H5OH):
              - 0 to 1 sec: COMPLETELY HIDDEN via display: none
              - 1 to 3 sec: Glide smoothly from framework towards outside to their places
              - 3 sec+: In place inside the formed circle */}
          <g
            className={`biofuel-molecules-zone ${animStatus === 'running' && !phase.fuelsMoving ? 'is-hidden-0to1s' : ''} ${phase.fuelsMoving ? 'is-traveling-1to3s' : ''}`}
          >
              
              {/* 1. CO (Carbon monoxide, top-left quadrant) */}
              <g transform="translate(830, 212)" className="biofuel-unit fuel-co">
                <line x1="-5" y1="-3" x2="8" y2="-3" stroke="#94a3b8" strokeWidth="2" />
                <line x1="-5" y1="0" x2="8" y2="0" stroke="#94a3b8" strokeWidth="2.2" />
                <line x1="-5" y1="3" x2="8" y2="3" stroke="#94a3b8" strokeWidth="2" />
                <circle cx="-7" cy="0" r="11" fill="url(#sphereCarbon)" />
                <circle cx="9" cy="0" r="10" fill="url(#sphereOxygen)" />
              </g>

              {/* 2. CH3OH (Methanol, top-right quadrant) */}
              <g transform="translate(936, 210)" className="biofuel-unit fuel-meoh">
                <line x1="-12" y1="0" x2="-20" y2="-10" stroke="#94a3b8" strokeWidth="2.2" />
                <line x1="-12" y1="0" x2="-20" y2="10" stroke="#94a3b8" strokeWidth="2.2" />
                <line x1="-12" y1="0" x2="-6" y2="-12" stroke="#94a3b8" strokeWidth="2.2" />
                <line x1="-12" y1="0" x2="8" y2="0" stroke="#94a3b8" strokeWidth="2.5" />
                <line x1="8" y1="0" x2="20" y2="-8" stroke="#94a3b8" strokeWidth="2" />
                <circle cx="-12" cy="0" r="10.5" fill="url(#sphereCarbon)" />
                <circle cx="-20" cy="-10" r="5.2" fill="url(#sphereHydrogen)" />
                <circle cx="-20" cy="10" r="5.2" fill="url(#sphereHydrogen)" />
                <circle cx="-6" cy="-12" r="5.2" fill="url(#sphereHydrogen)" />
                <circle cx="8" cy="0" r="9.5" fill="url(#sphereOxygen)" />
                <circle cx="20" cy="-8" r="4.8" fill="url(#sphereHydrogen)" />
              </g>

              {/* 3. CH3COOH (Acetic acid, bottom-left quadrant) */}
              <g transform="translate(830, 298)" className="biofuel-unit fuel-aa">
                <line x1="-16" y1="0" x2="-25" y2="-8" stroke="#94a3b8" strokeWidth="2.2" />
                <line x1="-16" y1="0" x2="-25" y2="8" stroke="#94a3b8" strokeWidth="2.2" />
                <line x1="-16" y1="0" x2="-14" y2="13" stroke="#94a3b8" strokeWidth="2.2" />
                <line x1="-16" y1="0" x2="6" y2="0" stroke="#94a3b8" strokeWidth="2.5" />
                <line x1="4" y1="-2" x2="16" y2="-13" stroke="#94a3b8" strokeWidth="2" />
                <line x1="8" y1="2" x2="20" y2="-9" stroke="#94a3b8" strokeWidth="2" />
                <line x1="6" y1="0" x2="15" y2="11" stroke="#94a3b8" strokeWidth="2.2" />
                <line x1="15" y1="11" x2="25" y2="14" stroke="#94a3b8" strokeWidth="1.8" />
                <circle cx="-16" cy="0" r="10" fill="url(#sphereCarbon)" />
                <circle cx="-25" cy="-8" r="4.8" fill="url(#sphereHydrogen)" />
                <circle cx="-25" cy="8" r="4.8" fill="url(#sphereHydrogen)" />
                <circle cx="-14" cy="13" r="4.8" fill="url(#sphereHydrogen)" />
                <circle cx="6" cy="0" r="10" fill="url(#sphereCarbon)" />
                <circle cx="18" cy="-11" r="9" fill="url(#sphereOxygen)" />
                <circle cx="15" cy="11" r="8.5" fill="url(#sphereOxygen)" />
                <circle cx="25" cy="14" r="4.5" fill="url(#sphereHydrogen)" />
              </g>

              {/* 4. C2H5OH (Ethanol, bottom-right quadrant) */}
              <g transform="translate(936, 298)" className="biofuel-unit fuel-etoh">
                <line x1="-18" y1="0" x2="-27" y2="-8" stroke="#94a3b8" strokeWidth="2.2" />
                <line x1="-18" y1="0" x2="-27" y2="8" stroke="#94a3b8" strokeWidth="2.2" />
                <line x1="-18" y1="0" x2="-18" y2="-13" stroke="#94a3b8" strokeWidth="2.2" />
                <line x1="-18" y1="0" x2="2" y2="0" stroke="#94a3b8" strokeWidth="2.5" />
                <line x1="2" y1="0" x2="2" y2="-12" stroke="#94a3b8" strokeWidth="2.2" />
                <line x1="2" y1="0" x2="2" y2="12" stroke="#94a3b8" strokeWidth="2.2" />
                <line x1="2" y1="0" x2="18" y2="0" stroke="#94a3b8" strokeWidth="2.5" />
                <line x1="18" y1="0" x2="28" y2="-8" stroke="#94a3b8" strokeWidth="1.8" />
                <circle cx="-18" cy="0" r="9.5" fill="url(#sphereCarbon)" />
                <circle cx="-27" cy="-8" r="4.6" fill="url(#sphereHydrogen)" />
                <circle cx="-27" cy="8" r="4.6" fill="url(#sphereHydrogen)" />
                <circle cx="-18" cy="-13" r="4.6" fill="url(#sphereHydrogen)" />
                <circle cx="2" cy="0" r="9.5" fill="url(#sphereCarbon)" />
                <circle cx="2" cy="-12" r="4.6" fill="url(#sphereHydrogen)" />
                <circle cx="2" cy="12" r="4.6" fill="url(#sphereHydrogen)" />
                <circle cx="18" cy="0" r="8.8" fill="url(#sphereOxygen)" />
                <circle cx="28" cy="-8" r="4.5" fill="url(#sphereHydrogen)" />
              </g>
            </g>

          {/* Emergence Sparkle Wave inside Circle when Formed at t = 3 sec */}
          {phase.circleFormed && animStatus !== 'idle' && (
            <g transform="translate(885, 250)">
              <circle
                cx="0"
                cy="0"
                r="25"
                className="fuel-synthesis-burst"
                fill="#22c55e"
                filter="url(#pco2FuelGlow)"
              />
            </g>
          )}
        </g>
      </svg>

    </div>
  )
}
