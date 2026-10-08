import { useState, useRef, useEffect, useCallback } from 'react'
import powerCo2Img from '../assets/power-co2-project.jpg'

type SimulationStep = 0 | 1 | 2 | 3 | 4 | 5
type AnimationState = 'idle' | 'running' | 'completed'

export function InteractivePowerCo2() {
  const [isHovered, setIsHovered] = useState(false)
  const [animState, setAnimState] = useState<AnimationState>('idle')
  const [currentStep, setCurrentStep] = useState<SimulationStep>(0)
  const timersRef = useRef<number[]>([])

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach((t) => clearTimeout(t))
    timersRef.current = []
  }, [])

  const resetSimulation = useCallback(() => {
    clearAllTimers()
    setAnimState('idle')
    setCurrentStep(0)
  }, [clearAllTimers])

  const startSimulation = useCallback(() => {
    clearAllTimers()
    setAnimState('running')
    setCurrentStep(1) // Step 1: Solar photons irradiation (Solar fuels group hidden)

    // Step 2: SIMULTANEOUS CO2 adsorption into framework pores AND electron flow (after 800ms)
    const t1 = window.setTimeout(() => {
      setCurrentStep(2)
    }, 800)

    // Step 3: Framework catalytic reaction sparks (after 2200ms)
    const t2 = window.setTimeout(() => {
      setCurrentStep(3)
    }, 2200)

    // Step 4: Solar fuel molecules generate from framework and travel to place (after 3200ms)
    const t3 = window.setTimeout(() => {
      setCurrentStep(4)
    }, 3200)

    // Step 5: All molecules come together -> Circle forms and label "Solar fuels" appears! (after 4800ms)
    const t4 = window.setTimeout(() => {
      setCurrentStep(5)
      setAnimState('completed')
    }, 4800)

    // Automatic reset back to idle after displaying complete state (after 7400ms)
    const t5 = window.setTimeout(() => {
      setAnimState('idle')
      setCurrentStep(0)
    }, 7400)

    timersRef.current = [t1, t2, t3, t4, t5]
  }, [clearAllTimers])

  useEffect(() => {
    return () => clearAllTimers()
  }, [clearAllTimers])

  const getStatusText = () => {
    if (animState === 'idle') {
      return isHovered
        ? 'Click to run photoelectrochemical simulation'
        : 'Interactive model · Hover or click to simulate reaction'
    }
    switch (currentStep) {
      case 1:
        return '1/5 · Solar Irradiation: Photons (hν) excite framework'
      case 2:
        return '2/5 · Concurrent Transport: CO₂ adsorbs into pores while e⁻ injects'
      case 3:
        return '3/5 · Catalysis: Charge transfer drives chemical reduction at pores'
      case 4:
        return '4/5 · Fuel Generation: Solar fuel molecules synthesize from framework'
      case 5:
        return '5/5 · Synthesis Complete: Solar fuels assembled · Auto-resetting...'
      default:
        return 'Reaction Cycle Complete · Auto-resetting...'
    }
  }

  // Exact curved spline path for electron streamline
  const electronCurvePath =
    'M 270 550 L 336 527 C 360 520, 370 470, 376 401 C 382 350, 400 324, 426 318 C 480 308, 570 305, 638 304 L 675 302'

  // Green trajectory for fuel release from framework
  const fuelEgressPath = 'M 645 320 C 700 310, 760 280, 810 255'

  // Strict visibility control:
  // Solar fuels molecules are ONLY visible at idle OR starting from Step 4!
  // In Steps 1, 2, 3: they are COMPLETELY HIDDEN (display: none), zero premature visibility!
  const showSolarFuels = animState === 'idle' || currentStep >= 4

  // The circular badge and "Solar fuels" label are ONLY visible at idle OR starting from Step 5!
  const showCircleAndLabel = animState === 'idle' || currentStep >= 5

  // Concurrently active electron transport: active in Step 2 and Step 3!
  const isElectronFlowActive =
    animState === 'running' && (currentStep === 2 || currentStep === 3)

  return (
    <div
      className={`interactive-powerco2-frame ${isHovered ? 'is-hovered' : ''} ${animState === 'running' ? 'is-running' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={animState === 'running' ? undefined : startSimulation}
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
            <feGaussianBlur stdDeviation="5" result="blur1" />
            <feGaussianBlur stdDeviation="12" result="blur2" />
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

          {/* Sun Rays Gradient (Focused on framework top, away from top-left) */}
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
        {/* 1. SUN & SOLAR PHOTON RAYS (cx=935, cy=72, r=35) */}
        {/* =================================================================== */}
        <g id="interactive-sun-group">
          {/* Ambient Corona Halo on Hover / Click */}
          <circle
            cx="935"
            cy="72"
            r="44"
            className="sun-corona-halo"
            fill="#f59e0b"
            filter="url(#pco2SunGlow)"
          />
          <circle
            cx="935"
            cy="72"
            r="36"
            className="sun-core-pulse"
            fill="#fcd34d"
            filter="url(#pco2SunGlow)"
          />

          {/* Rotating Solar Dashed Ring */}
          <circle
            cx="935"
            cy="72"
            r="55"
            className="sun-spin-ring"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="1.5"
            strokeDasharray="4 6"
          />

          {/* ANIMATED SUN RAYS FALLING UPON THE FRAMEWORK */}
          {(animState === 'running' || animState === 'completed') && (
            <g className="animated-solar-rays">
              {/* Light cone targeted on the framework, strictly away from top-left */}
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

              {/* Tag Annotation */}
              <g transform="translate(820, 115)" className="photon-annotation">
                <rect x="-8" y="-12" width="108" height="20" rx="3" fill="rgba(24, 33, 54, 0.88)" stroke="#fcd34d" strokeWidth="1" />
                <text x="4" y="2" fill="#fcd34d" fontFamily="'Space Mono', monospace" fontSize="9.5" fontWeight="700">hν PHOTONS</text>
              </g>
            </g>
          )}
        </g>

        {/* =================================================================== */}
        {/* 2. CO2 MOLECULES & CLEAN INFLUX ARROWS (Upper Left - NO GLOW) */}
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

          {/* Clean, Non-Glowing Influx Direction Arrows with Aligned Arrowheads */}
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
              - At idle: rest peacefully in initial cluster
              - At Step 2: glide smoothly DEEP INTO the framework pores and fade out into cavities
              - During rest of simulation: completely hidden inside framework */}
          <g className={`co2-molecules-cluster ${currentStep === 2 ? 'is-gliding-into-pores' : ''} ${currentStep > 2 ? 'is-absorbed' : ''}`}>
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
        {/* 3. ELECTRON STREAMLINE & LARGE READABLE MARKERS (Active in Step 2 & 3) */}
        {/* =================================================================== */}
        <g id="interactive-electron-group">
          {/* Main Glowing Streamline Path (Electric Blue) */}
          <path
            d={electronCurvePath}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="electron-glow-path"
            filter="url(#pco2ElectronGlow)"
          />
          <path
            d={electronCurvePath}
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="electron-core-path"
          />

          {/* Arrowhead at path terminus on top of framework */}
          <polygon points="670 296, 684 302, 670 308" fill="#38bdf8" />
          <polygon points="670 298, 680 302, 670 306" fill="#ffffff" />

          {/* 4 LARGE, HIGH-CONTRAST, HIGHLY READABLE ELECTRON MARKERS (e⁻) */}
          {/* Marker 1: Semiconductor base surface */}
          <g transform="translate(336, 527)" className="electron-bead bead-1">
            <circle cx="0" cy="0" r="22" className="bead-ripple" fill="#38bdf8" />
            <circle cx="0" cy="0" r="16" className="bead-core-bg" fill="#0b1329" stroke="#ffffff" strokeWidth="2" filter="url(#pco2ElectronGlow)" />
            <circle cx="0" cy="0" r="16" className="bead-core" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
            <text x="0" y="0.5" fill="#ffffff" fontFamily="'Space Mono', monospace" fontSize="13.5" fontWeight="800" textAnchor="middle" dominantBaseline="central">e⁻</text>
          </g>

          {/* Marker 2: Framework front-left corner pillar */}
          <g transform="translate(376, 401)" className="electron-bead bead-2">
            <circle cx="0" cy="0" r="22" className="bead-ripple" fill="#38bdf8" />
            <circle cx="0" cy="0" r="16" className="bead-core-bg" fill="#0b1329" stroke="#ffffff" strokeWidth="2" filter="url(#pco2ElectronGlow)" />
            <circle cx="0" cy="0" r="16" className="bead-core" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
            <text x="0" y="0.5" fill="#ffffff" fontFamily="'Space Mono', monospace" fontSize="13.5" fontWeight="800" textAnchor="middle" dominantBaseline="central">e⁻</text>
          </g>

          {/* Marker 3: Top-left framework corner */}
          <g transform="translate(426, 318)" className="electron-bead bead-3">
            <circle cx="0" cy="0" r="22" className="bead-ripple" fill="#38bdf8" />
            <circle cx="0" cy="0" r="16" className="bead-core-bg" fill="#0b1329" stroke="#ffffff" strokeWidth="2" filter="url(#pco2ElectronGlow)" />
            <circle cx="0" cy="0" r="16" className="bead-core" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
            <text x="0" y="0.5" fill="#ffffff" fontFamily="'Space Mono', monospace" fontSize="13.5" fontWeight="800" textAnchor="middle" dominantBaseline="central">e⁻</text>
          </g>

          {/* Marker 4: Top-right framework surface */}
          <g transform="translate(638, 304)" className="electron-bead bead-4">
            <circle cx="0" cy="0" r="22" className="bead-ripple" fill="#38bdf8" />
            <circle cx="0" cy="0" r="16" className="bead-core-bg" fill="#0b1329" stroke="#ffffff" strokeWidth="2" filter="url(#pco2ElectronGlow)" />
            <circle cx="0" cy="0" r="16" className="bead-core" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
            <text x="0" y="0.5" fill="#ffffff" fontFamily="'Space Mono', monospace" fontSize="13.5" fontWeight="800" textAnchor="middle" dominantBaseline="central">e⁻</text>
          </g>

          {/* CONCURRENT TRAVELING ELECTRONS (Active at same time as CO2 in Step 2 & 3!) */}
          {isElectronFlowActive && (
            <g className="animated-electron-stream">
              <g className="traveling-electron-packet pkt-1">
                <circle cx="0" cy="0" r="16" fill="#38bdf8" filter="url(#pco2ElectronGlow)" />
                <circle cx="0" cy="0" r="12" fill="#ffffff" />
                <text x="0" y="0.5" fill="#0284c7" fontFamily="'Space Mono', monospace" fontSize="11" fontWeight="800" textAnchor="middle" dominantBaseline="central">e⁻</text>
              </g>
              <g className="traveling-electron-packet pkt-2">
                <circle cx="0" cy="0" r="16" fill="#38bdf8" filter="url(#pco2ElectronGlow)" />
                <circle cx="0" cy="0" r="12" fill="#ffffff" />
                <text x="0" y="0.5" fill="#0284c7" fontFamily="'Space Mono', monospace" fontSize="11" fontWeight="800" textAnchor="middle" dominantBaseline="central">e⁻</text>
              </g>
              <g className="traveling-electron-packet pkt-3">
                <circle cx="0" cy="0" r="16" fill="#38bdf8" filter="url(#pco2ElectronGlow)" />
                <circle cx="0" cy="0" r="12" fill="#ffffff" />
                <text x="0" y="0.5" fill="#0284c7" fontFamily="'Space Mono', monospace" fontSize="11" fontWeight="800" textAnchor="middle" dominantBaseline="central">e⁻</text>
              </g>
            </g>
          )}
        </g>

        {/* =================================================================== */}
        {/* 4. FRAMEWORK CATALYTIC REACTION SPARKS */}
        {/* =================================================================== */}
        {(animState === 'running' && (currentStep === 2 || currentStep === 3)) && (
          <g id="framework-catalytic-reactions">
            <g transform="translate(380, 340)" className="catalytic-burst burst-1">
              <circle cx="0" cy="0" r="18" fill="#f59e0b" filter="url(#pco2SparkGlow)" opacity="0.85" />
              <circle cx="0" cy="0" r="9" fill="#fffbeb" />
            </g>
            <g transform="translate(480, 320)" className="catalytic-burst burst-2">
              <circle cx="0" cy="0" r="20" fill="#22c55e" filter="url(#pco2SparkGlow)" opacity="0.85" />
              <circle cx="0" cy="0" r="10" fill="#ffffff" />
            </g>
            <g transform="translate(580, 310)" className="catalytic-burst burst-3">
              <circle cx="0" cy="0" r="18" fill="#f59e0b" filter="url(#pco2SparkGlow)" opacity="0.85" />
              <circle cx="0" cy="0" r="9" fill="#fffbeb" />
            </g>
          </g>
        )}

        {/* =================================================================== */}
        {/* 5. SOLAR FUELS NARRATIVE:
            - Steps 1-3: COMPLETELY HIDDEN (display: none), zero premature visibility!
            - Step 4: Molecules synthesize from framework and travel to place
            - Step 5: Circle forms and label "Solar fuels" appears! */}
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
            className={`green-egress-arrow ${currentStep >= 4 ? 'is-active' : ''}`}
          />

          {/* Clean Glassmorphic Solar Fuel Circle Badge (Forms ONLY at Step 5 or Idle) */}
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
              - Rendered ONLY when showSolarFuels is true!
              - During Steps 1, 2, 3: COMPLETELY HIDDEN via display: none
              - During Step 4: Glide smoothly from framework to their places */}
          {showSolarFuels && (
            <g className={`biofuel-molecules-zone ${currentStep === 4 ? 'is-traveling-to-place' : ''}`}>
              
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
          )}

          {/* Emergence Sparkle Wave inside Circle when Formed */}
          {currentStep >= 5 && (
            <circle
              cx="885"
              cy="250"
              r="25"
              className="fuel-synthesis-burst"
              fill="#22c55e"
              filter="url(#pco2FuelGlow)"
            />
          )}
        </g>
      </svg>

      {/* Interactive HUD / Status Control Pill */}
      <div className="powerco2-hud-bar">
        <div className="hud-badge">
          <span className={`hud-dot ${animState === 'running' ? 'is-active' : ''}`} />
          <span className="hud-text">{getStatusText()}</span>
        </div>

        <button
          type="button"
          className="hud-action-btn"
          onClick={(e) => {
            e.stopPropagation()
            if (animState === 'running') {
              resetSimulation()
            } else {
              startSimulation()
            }
          }}
          aria-label={animState === 'running' ? 'Reset Simulation' : 'Run Reaction Simulation'}
        >
          {animState === 'running' ? (
            <>
              <span className="hud-btn-icon">⏹</span> Reset
            </>
          ) : animState === 'completed' ? (
            <>
              <span className="hud-btn-icon">↻</span> Replaying...
            </>
          ) : (
            <>
              <span className="hud-btn-icon">▶</span> Simulate Reaction
            </>
          )}
        </button>
      </div>
    </div>
  )
}
