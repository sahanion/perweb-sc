import { useState, useRef, useEffect, useCallback } from 'react'
import powerCo2Img from '../assets/power-co2-project.jpg'

type SimulationStep = 0 | 1 | 2 | 3 | 4
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
    setCurrentStep(1) // Step 1: Solar photons irradiation

    // Step 2: CO2 gas streams into porous framework (after 800ms)
    const t1 = window.setTimeout(() => {
      setCurrentStep(2)
    }, 850)

    // Step 3: Electron injection from semiconductor (after 1850ms)
    const t2 = window.setTimeout(() => {
      setCurrentStep(3)
    }, 1850)

    // Step 4: Catalytic reduction & solar fuels generation (after 2900ms)
    const t3 = window.setTimeout(() => {
      setCurrentStep(4)
    }, 2900)

    // Completed pulse state (after 4800ms)
    const t4 = window.setTimeout(() => {
      setAnimState('completed')
    }, 4800)

    // Automatic reset back to idle (after 7000ms - as requested by user)
    const t5 = window.setTimeout(() => {
      setAnimState('idle')
      setCurrentStep(0)
    }, 7200)

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
        return '1/4 · Solar Irradiation: Photons (hν) excite framework'
      case 2:
        return '2/4 · Adsorption: CO₂ gas streams into porous channels'
      case 3:
        return '3/4 · Charge Injection: Electrons (e⁻) transport from semiconductor'
      case 4:
        return '4/4 · Catalysis: Solar fuel molecules (CO, CH₃COOH, CH₃OH, C₂H₅OH) synthesized'
      default:
        return 'Reaction Cycle Complete · Auto-resetting...'
    }
  }

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
          {/* Sun & Photon Glow Filters */}
          <filter id="pco2SunGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="12" result="blur1" />
            <feGaussianBlur stdDeviation="26" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Electric Cyan/Blue Glow Filter for Electrons */}
          <filter id="pco2ElectronGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4.5" result="blur1" />
            <feGaussianBlur stdDeviation="10" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Green Glow Filter for Solar Fuels */}
          <filter id="pco2FuelGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="7" result="blur1" />
            <feGaussianBlur stdDeviation="16" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Catalytic Spark Glow Filter */}
          <filter id="pco2SparkGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* 3D Sphere Specular Highlight Shaders */}
          {/* Carbon (Black / Charcoal) */}
          <radialGradient id="sphereCarbon" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#64748b" />
            <stop offset="35%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#090d16" />
          </radialGradient>

          {/* Oxygen (Coral Red) */}
          <radialGradient id="sphereOxygen" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#fca5a5" />
            <stop offset="35%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#991b1b" />
          </radialGradient>

          {/* Hydrogen (Clean White) */}
          <radialGradient id="sphereHydrogen" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="55%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#94a3b8" />
          </radialGradient>

          {/* Sun Rays Gradient Falling upon the Framework */}
          <linearGradient id="pco2SunRayGrad" x1="0%" y1="0%" x2="35%" y2="90%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.55" />
            <stop offset="35%" stopColor="#fcd34d" stopOpacity="0.28" />
            <stop offset="70%" stopColor="#fbbf24" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#d8c5a2" stopOpacity="0.0" />
          </linearGradient>

          {/* Electron Streamline Core Gradient */}
          <linearGradient id="pco2ElectronGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="45%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#93c5fd" />
          </linearGradient>

          {/* Influx Arrow Blue Gradient */}
          <linearGradient id="pco2ArrowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.95" />
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
              <polygon
                points="935 72, 260 380, 680 320, 790 420"
                fill="url(#pco2SunRayGrad)"
                className="solar-light-cone"
              />

              <line
                x1="935"
                y1="72"
                x2="380"
                y2="370"
                className="photon-beam beam-1"
                stroke="#fcd34d"
                strokeWidth="2.5"
                strokeDasharray="12 18"
              />
              <line
                x1="935"
                y1="72"
                x2="520"
                y2="340"
                className="photon-beam beam-2"
                stroke="#fffbeb"
                strokeWidth="3"
                strokeDasharray="16 22"
              />
              <line
                x1="935"
                y1="72"
                x2="650"
                y2="380"
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
                <circle cx="935" cy="72" r="5.5" fill="#fcd34d" filter="url(#pco2SparkGlow)" className="photon-wave wave-4" />
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
        {/* 2. CO2 MOLECULES & INFLUX ARROWS (Upper Left) */}
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

          {/* Influx Flow Streamlines */}
          <path
            d="M 110 160 C 150 170, 185 200, 225 240"
            fill="none"
            stroke="url(#pco2ArrowGrad)"
            strokeWidth="5"
            strokeLinecap="round"
            className="co2-influx-arrow-1"
          />
          <polygon points="222 230, 234 246, 218 248" fill="#3b82f6" opacity="0.9" />

          <path
            d="M 155 240 C 180 260, 210 275, 235 295"
            fill="none"
            stroke="url(#pco2ArrowGrad)"
            strokeWidth="5"
            strokeLinecap="round"
            className="co2-influx-arrow-2"
          />
          <polygon points="230 286, 243 302, 227 304" fill="#3b82f6" opacity="0.9" />

          {/* DYNAMIC CO2 MOLECULES (Glides into framework during simulation, clean reset) */}
          <g className={`co2-molecules-cluster ${animState === 'running' ? 'is-animating' : ''}`}>
            {/* CO2 Molecule 1 (Top) */}
            <g className="co2-unit unit-1">
              <line x1="-16" y1="0" x2="16" y2="0" stroke="#cbd5e1" strokeWidth="2.5" />
              <circle cx="0" cy="0" r="10.5" fill="url(#sphereCarbon)" />
              <circle cx="-18" cy="0" r="9.5" fill="url(#sphereOxygen)" />
              <circle cx="18" cy="0" r="9.5" fill="url(#sphereOxygen)" />
            </g>

            {/* CO2 Molecule 2 (Upper Mid) */}
            <g className="co2-unit unit-2">
              <line x1="-15" y1="0" x2="15" y2="0" stroke="#cbd5e1" strokeWidth="2.5" />
              <circle cx="0" cy="0" r="10" fill="url(#sphereCarbon)" />
              <circle cx="-17" cy="0" r="9" fill="url(#sphereOxygen)" />
              <circle cx="17" cy="0" r="9" fill="url(#sphereOxygen)" />
            </g>

            {/* CO2 Molecule 3 (Left Mid) */}
            <g className="co2-unit unit-3">
              <line x1="-15" y1="0" x2="15" y2="0" stroke="#cbd5e1" strokeWidth="2.5" />
              <circle cx="0" cy="0" r="9.5" fill="url(#sphereCarbon)" />
              <circle cx="-16" cy="0" r="8.5" fill="url(#sphereOxygen)" />
              <circle cx="16" cy="0" r="8.5" fill="url(#sphereOxygen)" />
            </g>

            {/* CO2 Molecule 4 (Center Mid) */}
            <g className="co2-unit unit-4">
              <line x1="-15" y1="0" x2="15" y2="0" stroke="#cbd5e1" strokeWidth="2.5" />
              <circle cx="0" cy="0" r="10" fill="url(#sphereCarbon)" />
              <circle cx="-17" cy="0" r="9" fill="url(#sphereOxygen)" />
              <circle cx="17" cy="0" r="9" fill="url(#sphereOxygen)" />
            </g>

            {/* CO2 Molecule 5 (Lower Left) */}
            <g className="co2-unit unit-5">
              <line x1="-15" y1="0" x2="15" y2="0" stroke="#cbd5e1" strokeWidth="2.5" />
              <circle cx="0" cy="0" r="9.5" fill="url(#sphereCarbon)" />
              <circle cx="-16" cy="0" r="8.5" fill="url(#sphereOxygen)" />
              <circle cx="16" cy="0" r="8.5" fill="url(#sphereOxygen)" />
            </g>
          </g>
        </g>

        {/* =================================================================== */}
        {/* 3. ELECTRON STREAMLINE & MARKERS (Semiconductor -> Pillar -> Top) */}
        {/* =================================================================== */}
        <g id="interactive-electron-group">
          {/* Main Glowing Streamline Path (Electric Blue) */}
          <path
            d="M 280 545 L 336 527 C 360 520, 370 470, 376 401 C 382 350, 400 324, 426 318 C 480 308, 570 305, 638 304 L 675 302"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="electron-glow-path"
            filter="url(#pco2ElectronGlow)"
          />
          <path
            d="M 280 545 L 336 527 C 360 520, 370 470, 376 401 C 382 350, 400 324, 426 318 C 480 308, 570 305, 638 304 L 675 302"
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

          {/* 4 Electron Markers with Concentric Ripple Halos */}
          {/* Marker 1: Semiconductor base surface */}
          <g transform="translate(336, 527)" className="electron-bead bead-1">
            <circle cx="0" cy="0" r="16" className="bead-ripple" fill="#38bdf8" />
            <circle cx="0" cy="0" r="10.5" className="bead-core" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
            <text x="-4" y="3.5" fill="#ffffff" fontFamily="'Space Mono', monospace" fontSize="8.5" fontWeight="700">e⁻</text>
          </g>

          {/* Marker 2: Framework front-left corner pillar */}
          <g transform="translate(376, 401)" className="electron-bead bead-2">
            <circle cx="0" cy="0" r="16" className="bead-ripple" fill="#38bdf8" />
            <circle cx="0" cy="0" r="10.5" className="bead-core" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
            <text x="-4" y="3.5" fill="#ffffff" fontFamily="'Space Mono', monospace" fontSize="8.5" fontWeight="700">e⁻</text>
          </g>

          {/* Marker 3: Top-left framework corner */}
          <g transform="translate(426, 318)" className="electron-bead bead-3">
            <circle cx="0" cy="0" r="16" className="bead-ripple" fill="#38bdf8" />
            <circle cx="0" cy="0" r="10.5" className="bead-core" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
            <text x="-4" y="3.5" fill="#ffffff" fontFamily="'Space Mono', monospace" fontSize="8.5" fontWeight="700">e⁻</text>
          </g>

          {/* Marker 4: Top-right framework surface */}
          <g transform="translate(638, 304)" className="electron-bead bead-4">
            <circle cx="0" cy="0" r="16" className="bead-ripple" fill="#38bdf8" />
            <circle cx="0" cy="0" r="10.5" className="bead-core" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
            <text x="-4" y="3.5" fill="#ffffff" fontFamily="'Space Mono', monospace" fontSize="8.5" fontWeight="700">e⁻</text>
          </g>

          {/* ANIMATED ELECTRON CHARGE SURGES (Step 3: Semiconductor -> Framework) */}
          {(animState === 'running' && currentStep >= 3) && (
            <g className="animated-electron-stream">
              <g className="traveling-electron packet-1">
                <circle cx="0" cy="0" r="12" fill="#38bdf8" filter="url(#pco2ElectronGlow)" />
                <circle cx="0" cy="0" r="7.5" fill="#ffffff" />
                <text x="-4" y="3" fill="#0f172a" fontFamily="'Space Mono', monospace" fontSize="8" fontWeight="700">e⁻</text>
              </g>
              <g className="traveling-electron packet-2">
                <circle cx="0" cy="0" r="12" fill="#38bdf8" filter="url(#pco2ElectronGlow)" />
                <circle cx="0" cy="0" r="7.5" fill="#ffffff" />
                <text x="-4" y="3" fill="#0f172a" fontFamily="'Space Mono', monospace" fontSize="8" fontWeight="700">e⁻</text>
              </g>
              <g className="traveling-electron packet-3">
                <circle cx="0" cy="0" r="12" fill="#38bdf8" filter="url(#pco2ElectronGlow)" />
                <circle cx="0" cy="0" r="7.5" fill="#ffffff" />
                <text x="-4" y="3" fill="#0f172a" fontFamily="'Space Mono', monospace" fontSize="8" fontWeight="700">e⁻</text>
              </g>
            </g>
          )}
        </g>

        {/* =================================================================== */}
        {/* 4. FRAMEWORK CATALYTIC REACTION SPARKS */}
        {/* =================================================================== */}
        {(animState === 'running' && currentStep >= 3) && (
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
        {/* 5. SOLAR FUEL CIRCLE & BIOFUEL MOLECULES (cx=885, cy=250, r=115) */}
        {/* =================================================================== */}
        <g id="interactive-solar-fuels-group">
          {/* Egress Green Transition Trajectory Arrow */}
          <path
            d="M 680 310 C 740 300, 780 270, 810 245"
            fill="none"
            stroke="#22c55e"
            strokeWidth="5"
            strokeLinecap="round"
            className="green-egress-arrow"
          />
          <polygon points="805 235, 822 242, 812 254" fill="#22c55e" />

          {/* Clean Glassmorphic Solar Fuel Circular Badge */}
          <circle
            cx="885"
            cy="250"
            r="115"
            fill="url(#solarCircleBg)"
            stroke="#22c55e"
            strokeWidth="2.5"
            className="solar-fuels-circle-border"
          />

          {/* Outer Pulsing Halo on Hover / Generating */}
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

          {/* Heading ONLY: "Solar fuels" (NO individual molecule labels per request) */}
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
          >
            Solar fuels
          </text>

          {/* CAREFULLY CONSTRUCTED 3D BIOFUEL MOLECULES (CO, CH3COOH, CH3OH, C2H5OH) */}
          <g className={`biofuel-molecules-zone ${animState === 'running' && currentStep >= 4 ? 'is-generating' : ''}`}>
            
            {/* 1. CO (Carbon monoxide, top-left quadrant) */}
            <g transform="translate(830, 212)" className="biofuel-unit fuel-co">
              {/* C≡O Triple Bond */}
              <line x1="-5" y1="-3" x2="8" y2="-3" stroke="#94a3b8" strokeWidth="2" />
              <line x1="-5" y1="0" x2="8" y2="0" stroke="#94a3b8" strokeWidth="2.2" />
              <line x1="-5" y1="3" x2="8" y2="3" stroke="#94a3b8" strokeWidth="2" />
              {/* Carbon */}
              <circle cx="-7" cy="0" r="11" fill="url(#sphereCarbon)" />
              {/* Oxygen */}
              <circle cx="9" cy="0" r="10" fill="url(#sphereOxygen)" />
            </g>

            {/* 2. CH3OH (Methanol, top-right quadrant) */}
            <g transform="translate(936, 210)" className="biofuel-unit fuel-meoh">
              {/* C-H Bonds */}
              <line x1="-12" y1="0" x2="-20" y2="-10" stroke="#94a3b8" strokeWidth="2.2" />
              <line x1="-12" y1="0" x2="-20" y2="10" stroke="#94a3b8" strokeWidth="2.2" />
              <line x1="-12" y1="0" x2="-6" y2="-12" stroke="#94a3b8" strokeWidth="2.2" />
              {/* C-O Bond */}
              <line x1="-12" y1="0" x2="8" y2="0" stroke="#94a3b8" strokeWidth="2.5" />
              {/* O-H Bond */}
              <line x1="8" y1="0" x2="20" y2="-8" stroke="#94a3b8" strokeWidth="2" />

              {/* Carbon */}
              <circle cx="-12" cy="0" r="10.5" fill="url(#sphereCarbon)" />
              {/* Hydrogens on carbon */}
              <circle cx="-20" cy="-10" r="5.2" fill="url(#sphereHydrogen)" />
              <circle cx="-20" cy="10" r="5.2" fill="url(#sphereHydrogen)" />
              <circle cx="-6" cy="-12" r="5.2" fill="url(#sphereHydrogen)" />
              {/* Oxygen */}
              <circle cx="8" cy="0" r="9.5" fill="url(#sphereOxygen)" />
              {/* Hydroxyl Hydrogen */}
              <circle cx="20" cy="-8" r="4.8" fill="url(#sphereHydrogen)" />
            </g>

            {/* 3. CH3COOH (Acetic acid, bottom-left quadrant) */}
            <g transform="translate(830, 298)" className="biofuel-unit fuel-aa">
              {/* Methyl C-H bonds */}
              <line x1="-16" y1="0" x2="-25" y2="-8" stroke="#94a3b8" strokeWidth="2.2" />
              <line x1="-16" y1="0" x2="-25" y2="8" stroke="#94a3b8" strokeWidth="2.2" />
              <line x1="-16" y1="0" x2="-14" y2="13" stroke="#94a3b8" strokeWidth="2.2" />
              {/* C-C Bond */}
              <line x1="-16" y1="0" x2="6" y2="0" stroke="#94a3b8" strokeWidth="2.5" />
              {/* C=O Double Bond to Carbonyl Oxygen */}
              <line x1="4" y1="-2" x2="16" y2="-13" stroke="#94a3b8" strokeWidth="2" />
              <line x1="8" y1="2" x2="20" y2="-9" stroke="#94a3b8" strokeWidth="2" />
              {/* C-O Single Bond to Hydroxyl Oxygen */}
              <line x1="6" y1="0" x2="15" y2="11" stroke="#94a3b8" strokeWidth="2.2" />
              {/* O-H Bond */}
              <line x1="15" y1="11" x2="25" y2="14" stroke="#94a3b8" strokeWidth="1.8" />

              {/* Methyl Carbon */}
              <circle cx="-16" cy="0" r="10" fill="url(#sphereCarbon)" />
              <circle cx="-25" cy="-8" r="4.8" fill="url(#sphereHydrogen)" />
              <circle cx="-25" cy="8" r="4.8" fill="url(#sphereHydrogen)" />
              <circle cx="-14" cy="13" r="4.8" fill="url(#sphereHydrogen)" />

              {/* Carboxyl Carbon */}
              <circle cx="6" cy="0" r="10" fill="url(#sphereCarbon)" />
              {/* Carbonyl Oxygen */}
              <circle cx="18" cy="-11" r="9" fill="url(#sphereOxygen)" />
              {/* Hydroxyl Oxygen */}
              <circle cx="15" cy="11" r="8.5" fill="url(#sphereOxygen)" />
              {/* Hydroxyl Hydrogen */}
              <circle cx="25" cy="14" r="4.5" fill="url(#sphereHydrogen)" />
            </g>

            {/* 4. C2H5OH (Ethanol, bottom-right quadrant) */}
            <g transform="translate(936, 298)" className="biofuel-unit fuel-etoh">
              {/* C1-H Bonds */}
              <line x1="-18" y1="0" x2="-27" y2="-8" stroke="#94a3b8" strokeWidth="2.2" />
              <line x1="-18" y1="0" x2="-27" y2="8" stroke="#94a3b8" strokeWidth="2.2" />
              <line x1="-18" y1="0" x2="-18" y2="-13" stroke="#94a3b8" strokeWidth="2.2" />
              {/* C1-C2 Bond */}
              <line x1="-18" y1="0" x2="2" y2="0" stroke="#94a3b8" strokeWidth="2.5" />
              {/* C2-H Bonds */}
              <line x1="2" y1="0" x2="2" y2="-12" stroke="#94a3b8" strokeWidth="2.2" />
              <line x1="2" y1="0" x2="2" y2="12" stroke="#94a3b8" strokeWidth="2.2" />
              {/* C2-O Bond */}
              <line x1="2" y1="0" x2="18" y2="0" stroke="#94a3b8" strokeWidth="2.5" />
              {/* O-H Bond */}
              <line x1="18" y1="0" x2="28" y2="-8" stroke="#94a3b8" strokeWidth="1.8" />

              {/* Carbon 1 */}
              <circle cx="-18" cy="0" r="9.5" fill="url(#sphereCarbon)" />
              <circle cx="-27" cy="-8" r="4.6" fill="url(#sphereHydrogen)" />
              <circle cx="-27" cy="8" r="4.6" fill="url(#sphereHydrogen)" />
              <circle cx="-18" cy="-13" r="4.6" fill="url(#sphereHydrogen)" />

              {/* Carbon 2 */}
              <circle cx="2" cy="0" r="9.5" fill="url(#sphereCarbon)" />
              <circle cx="2" cy="-12" r="4.6" fill="url(#sphereHydrogen)" />
              <circle cx="2" cy="12" r="4.6" fill="url(#sphereHydrogen)" />

              {/* Oxygen */}
              <circle cx="18" cy="0" r="8.8" fill="url(#sphereOxygen)" />
              {/* Hydroxyl Hydrogen */}
              <circle cx="28" cy="-8" r="4.5" fill="url(#sphereHydrogen)" />
            </g>
          </g>

          {/* ACTIVE SYNTHESIS STREAM (Generating from framework into circle during Step 4) */}
          {(animState === 'running' && currentStep >= 4) && (
            <g id="animated-solar-fuels-stream">
              <path
                d="M 660 320 C 720 310, 770 280, 815 250"
                fill="none"
                stroke="url(#pco2FuelTrail)"
                strokeWidth="6"
                strokeLinecap="round"
                className="fuel-flow-stream"
                filter="url(#pco2FuelGlow)"
              />

              {/* Emerging Product Packets */}
              <g className="traveling-fuel-molecule fuel-packet-1">
                <circle cx="0" cy="0" r="14" fill="#22c55e" opacity="0.3" filter="url(#pco2FuelGlow)" />
                <circle cx="-4" cy="0" r="6" fill="#1e293b" />
                <circle cx="5" cy="0" r="5.5" fill="#ef4444" />
              </g>
              <g className="traveling-fuel-molecule fuel-packet-2">
                <circle cx="0" cy="0" r="15" fill="#22c55e" opacity="0.3" filter="url(#pco2FuelGlow)" />
                <circle cx="-5" cy="0" r="6" fill="#1e293b" />
                <circle cx="5" cy="0" r="5.5" fill="#ef4444" />
                <circle cx="11" cy="3" r="3.5" fill="#ffffff" />
              </g>

              {/* Synthesis Success Ripple Wave */}
              <circle
                cx="885"
                cy="250"
                r="25"
                className="fuel-synthesis-burst"
                fill="#22c55e"
                filter="url(#pco2FuelGlow)"
              />
            </g>
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
              <span className="hud-btn-icon">↻</span> Replay
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
