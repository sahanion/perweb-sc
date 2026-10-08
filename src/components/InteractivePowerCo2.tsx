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

  const startSimulation = useCallback(() => {
    clearAllTimers()
    setAnimState('running')
    setCurrentStep(1) // Step 1: Solar photons irradiation

    // Step 2: CO2 gas movement into porous framework
    const t1 = window.setTimeout(() => {
      setCurrentStep(2)
    }, 800)

    // Step 3: Electron injection from semiconductor up framework
    const t2 = window.setTimeout(() => {
      setCurrentStep(3)
    }, 1800)

    // Step 4: Catalytic reduction & solar fuels generation
    const t3 = window.setTimeout(() => {
      setCurrentStep(4)
    }, 2800)

    // Complete
    const t4 = window.setTimeout(() => {
      setAnimState('completed')
    }, 4500)

    timersRef.current = [t1, t2, t3, t4]
  }, [clearAllTimers])

  const resetSimulation = useCallback(() => {
    clearAllTimers()
    setAnimState('idle')
    setCurrentStep(0)
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
        return '2/4 · Adsorption: CO₂ gas streams into porous lattice'
      case 3:
        return '3/4 · Charge Injection: Electrons (e⁻) transport from semiconductor'
      case 4:
        return '4/4 · Catalysis: Solar fuels (CO, CH₃OH, C₂H₅OH) synthesized'
      default:
        return 'Reaction Cycle Complete · Click to replay simulation'
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
      {/* Base Clean Scientific Illustration (3D Reticular Framework + Semiconductor) */}
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
            <feGaussianBlur stdDeviation="10" result="blur1" />
            <feGaussianBlur stdDeviation="24" result="blur2" />
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
            <feGaussianBlur stdDeviation="15" result="blur2" />
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
          <radialGradient id="sphereCarbon" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#64748b" />
            <stop offset="40%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#090d16" />
          </radialGradient>

          <radialGradient id="sphereOxygen" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#fca5a5" />
            <stop offset="40%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#991b1b" />
          </radialGradient>

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
            <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.9" />
          </linearGradient>

          {/* Solar Fuel Green Beam Gradient */}
          <linearGradient id="pco2FuelTrail" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#4ade80" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#86efac" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* =================================================================== */}
        {/* 1. SUN & SOLAR PHOTON RAYS (Upper Right, cx=912, cy=70, r=38) */}
        {/* =================================================================== */}
        <g id="interactive-sun-group">
          {/* Ambient Corona Halo on Hover / Click */}
          <circle
            cx="912"
            cy="70"
            r="44"
            className="sun-corona-halo"
            fill="#f59e0b"
            filter="url(#pco2SunGlow)"
          />
          <circle
            cx="912"
            cy="70"
            r="38"
            className="sun-core-pulse"
            fill="#fcd34d"
            filter="url(#pco2SunGlow)"
          />

          {/* Radiating Flare Spokes */}
          <g className="sun-flares" stroke="#fcd34d" strokeWidth="2.5" strokeLinecap="round">
            <line x1="912" y1="22" x2="912" y2="10" />
            <line x1="912" y1="118" x2="912" y2="130" />
            <line x1="864" y1="70" x2="852" y2="70" />
            <line x1="960" y1="70" x2="972" y2="70" />
            <line x1="878" y1="36" x2="868" y2="26" />
            <line x1="946" y1="104" x2="956" y2="114" />
            <line x1="878" y1="104" x2="868" y2="114" />
            <line x1="946" y1="36" x2="956" y2="26" />
          </g>

          {/* Rotating Solar Dashed Ring */}
          <circle
            cx="912"
            cy="70"
            r="54"
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
                points="912 70, 260 380, 680 320, 790 420"
                fill="url(#pco2SunRayGrad)"
                className="solar-light-cone"
              />

              <line
                x1="912"
                y1="70"
                x2="380"
                y2="370"
                className="photon-beam beam-1"
                stroke="#fcd34d"
                strokeWidth="2.5"
                strokeDasharray="12 18"
              />
              <line
                x1="912"
                y1="70"
                x2="520"
                y2="340"
                className="photon-beam beam-2"
                stroke="#fffbeb"
                strokeWidth="3"
                strokeDasharray="16 22"
              />
              <line
                x1="912"
                y1="70"
                x2="650"
                y2="380"
                className="photon-beam beam-3"
                stroke="#f59e0b"
                strokeWidth="2"
                strokeDasharray="10 16"
              />

              {/* Cascading Photon Energy Packets */}
              <g className="photon-packet-cascade">
                <circle cx="912" cy="70" r="5" fill="#ffffff" filter="url(#pco2SparkGlow)" className="photon-wave wave-1" />
                <circle cx="912" cy="70" r="6" fill="#fcd34d" filter="url(#pco2SparkGlow)" className="photon-wave wave-2" />
                <circle cx="912" cy="70" r="4.5" fill="#ffffff" filter="url(#pco2SparkGlow)" className="photon-wave wave-3" />
                <circle cx="912" cy="70" r="5.5" fill="#fcd34d" filter="url(#pco2SparkGlow)" className="photon-wave wave-4" />
              </g>

              {/* Tag Annotation */}
              <g transform="translate(805, 120)" className="photon-annotation">
                <rect x="-8" y="-12" width="112" height="20" rx="3" fill="rgba(24, 33, 54, 0.88)" stroke="#fcd34d" strokeWidth="1" />
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

          {/* DYNAMIC CO2 MOLECULES (No static duplicates!) */}
          {/* When idle: positioned at rest. When running: animated into pores! */}
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
        {/* 5. BIOFUEL MOLECULES & SOLAR FUELS CIRCLE (Right, cx=900, cy=245) */}
        {/* =================================================================== */}
        <g id="interactive-solar-fuels-group">
          {/* Circular Zone Glow Halo */}
          <circle
            cx="900"
            cy="245"
            r="119"
            className="solar-fuels-halo"
            fill="none"
            stroke="#22c55e"
            strokeWidth="3.5"
            filter="url(#pco2FuelGlow)"
          />

          {/* DYNAMIC BIOFUEL MOLECULES INSIDE CIRCLE (Cleanly rendered with 3D Spheres!) */}
          <g className={`biofuel-molecules-zone ${animState === 'running' && currentStep >= 4 ? 'is-generating' : ''}`}>
            {/* Molecule 1: CO (Carbon monoxide, top-left of circle) */}
            <g transform="translate(826, 206)" className="biofuel-unit fuel-co">
              <circle cx="-5" cy="0" r="9.5" fill="url(#sphereCarbon)" />
              <circle cx="7" cy="0" r="8.5" fill="url(#sphereOxygen)" />
              <text x="-6" y="24" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="11" fontWeight="700" fill="#1e293b">CO</text>
            </g>

            {/* Molecule 2: CH3OH (Methanol, top-right of circle) */}
            <g transform="translate(930, 202)" className="biofuel-unit fuel-meoh">
              <line x1="-10" y1="0" x2="8" y2="0" stroke="#cbd5e1" strokeWidth="2.5" />
              <line x1="8" y1="0" x2="18" y2="-6" stroke="#cbd5e1" strokeWidth="2" />
              {/* Carbon */}
              <circle cx="-10" cy="0" r="9.5" fill="url(#sphereCarbon)" />
              {/* Hydrogens on carbon */}
              <circle cx="-16" cy="-8" r="4.5" fill="url(#sphereHydrogen)" />
              <circle cx="-16" cy="8" r="4.5" fill="url(#sphereHydrogen)" />
              <circle cx="-5" cy="-9" r="4.5" fill="url(#sphereHydrogen)" />
              {/* Oxygen */}
              <circle cx="8" cy="0" r="8.5" fill="url(#sphereOxygen)" />
              {/* Hydrogen on oxygen */}
              <circle cx="18" cy="-6" r="4" fill="url(#sphereHydrogen)" />
              <text x="-16" y="28" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="11" fontWeight="700" fill="#1e293b">CH₃OH</text>
            </g>

            {/* Molecule 3: CH3COOH (Acetic acid, bottom-left of circle) */}
            <g transform="translate(826, 288)" className="biofuel-unit fuel-aa">
              <line x1="-12" y1="0" x2="6" y2="0" stroke="#cbd5e1" strokeWidth="2.5" />
              <line x1="6" y1="0" x2="16" y2="-9" stroke="#cbd5e1" strokeWidth="2.2" />
              <line x1="6" y1="0" x2="14" y2="9" stroke="#cbd5e1" strokeWidth="2.2" />
              {/* Methyl carbon */}
              <circle cx="-12" cy="0" r="9" fill="url(#sphereCarbon)" />
              <circle cx="-19" cy="-6" r="4" fill="url(#sphereHydrogen)" />
              <circle cx="-19" cy="6" r="4" fill="url(#sphereHydrogen)" />
              {/* Carboxyl carbon */}
              <circle cx="6" cy="0" r="9" fill="url(#sphereCarbon)" />
              {/* Carbonyl oxygen */}
              <circle cx="16" cy="-9" r="8" fill="url(#sphereOxygen)" />
              {/* Hydroxyl oxygen */}
              <circle cx="14" cy="9" r="7.5" fill="url(#sphereOxygen)" />
              <circle cx="22" cy="11" r="3.5" fill="url(#sphereHydrogen)" />
              <text x="-22" y="28" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="11" fontWeight="700" fill="#1e293b">CH₃COOH</text>
            </g>

            {/* Molecule 4: C2H5OH (Ethanol, bottom-right of circle) */}
            <g transform="translate(930, 288)" className="biofuel-unit fuel-etoh">
              <line x1="-14" y1="0" x2="2" y2="0" stroke="#cbd5e1" strokeWidth="2.5" />
              <line x1="2" y1="0" x2="15" y2="0" stroke="#cbd5e1" strokeWidth="2.2" />
              <line x1="15" y1="0" x2="23" y2="-7" stroke="#cbd5e1" strokeWidth="2" />
              {/* Carbon 1 */}
              <circle cx="-14" cy="0" r="9" fill="url(#sphereCarbon)" />
              <circle cx="-20" cy="-6" r="4" fill="url(#sphereHydrogen)" />
              <circle cx="-20" cy="6" r="4" fill="url(#sphereHydrogen)" />
              {/* Carbon 2 */}
              <circle cx="2" cy="0" r="9" fill="url(#sphereCarbon)" />
              <circle cx="2" cy="-9" r="4" fill="url(#sphereHydrogen)" />
              <circle cx="2" cy="9" r="4" fill="url(#sphereHydrogen)" />
              {/* Oxygen */}
              <circle cx="15" cy="0" r="8" fill="url(#sphereOxygen)" />
              {/* Hydrogen */}
              <circle cx="23" cy="-7" r="3.8" fill="url(#sphereHydrogen)" />
              <text x="-16" y="28" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="11" fontWeight="700" fill="#1e293b">C₂H₅OH</text>
            </g>
          </g>

          {/* ACTIVE SYNTHESIS STREAM (Generating from framework into circle during Step 4) */}
          {(animState === 'running' && currentStep >= 4) && (
            <g id="animated-solar-fuels-stream">
              <path
                d="M 640 330 C 700 325, 750 300, 800 270"
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
                cx="900"
                cy="245"
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
