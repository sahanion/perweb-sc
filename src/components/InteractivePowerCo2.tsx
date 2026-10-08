import { useState, useRef, useEffect, useCallback } from 'react'
import powerCo2Img from '../assets/power-co2-project.jpg'

type SimulationStep = 0 | 1 | 2 | 3 | 4
type AnimationState = 'idle' | 'running' | 'completed'

export function InteractivePowerCo2() {
  const [isHovered, setIsHovered] = useState(false)
  const [animState, setAnimState] = useState<AnimationState>('idle')
  const [currentStep, setCurrentStep] = useState<SimulationStep>(0)
  const [hasInteracted, setHasInteracted] = useState(false)
  const timersRef = useRef<number[]>([])

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach((t) => clearTimeout(t))
    timersRef.current = []
  }, [])

  const startSimulation = useCallback(() => {
    clearAllTimers()
    setHasInteracted(true)
    setAnimState('running')
    setCurrentStep(1) // Step 1: Solar photons irradiation

    // Step 2: CO2 adsorption (after 800ms)
    const t1 = window.setTimeout(() => {
      setCurrentStep(2)
    }, 850)

    // Step 3: Electron injection from semiconductor (after 1800ms)
    const t2 = window.setTimeout(() => {
      setCurrentStep(3)
    }, 1850)

    // Step 4: Catalytic conversion & solar fuel desorption (after 2900ms)
    const t3 = window.setTimeout(() => {
      setCurrentStep(4)
    }, 2900)

    // Complete (after 4500ms)
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

  // Status message for simulation progress
  const getStatusText = () => {
    if (animState === 'idle') {
      return isHovered ? 'Click to trigger solar catalytic cycle' : 'Interactive model · Hover or click to simulate'
    }
    switch (currentStep) {
      case 1:
        return '1/4 · Solar Irradiation: Solar photons (hν) excite the framework'
      case 2:
        return '2/4 · Adsorption: CO₂ gas streams into porous channels'
      case 3:
        return '3/4 · Charge Injection: Electrons (e⁻) transport from semiconductor'
      case 4:
        return '4/4 · Catalysis & Desorption: Solar fuels (CO, CH₃OH, C₂H₅OH) generated'
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
      {/* Base Scientific Illustration Image */}
      <img
        src={powerCo2Img}
        alt="POWER-CO2 Project Scheme: Solar-driven photocatalytic and photoelectrochemical CO2 reduction over MOF/COF thin films on semiconductor electrodes"
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
            <feGaussianBlur stdDeviation="22" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Electron Electric Cyan/Blue Glow Filter */}
          <filter id="pco2ElectronGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur1" />
            <feGaussianBlur stdDeviation="12" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Green Solar Fuel Glow Filter */}
          <filter id="pco2FuelGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="8" result="blur1" />
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

          {/* Sun Rays Gradient Falling upon the Framework */}
          <linearGradient id="pco2SunRayGrad" x1="0%" y1="0%" x2="40%" y2="85%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.55" />
            <stop offset="30%" stopColor="#fcd34d" stopOpacity="0.30" />
            <stop offset="70%" stopColor="#fbbf24" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#d8c5a2" stopOpacity="0.0" />
          </linearGradient>

          {/* Electron Core Gradient */}
          <linearGradient id="pco2ElectronTrail" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#93c5fd" />
          </linearGradient>

          {/* Solar Fuel Green Beam Gradient */}
          <linearGradient id="pco2FuelTrail" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#4ade80" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#86efac" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* =================================================================== */}
        {/* 1. SUN GLOW & SOLAR PHOTON RAYS */}
        {/* =================================================================== */}
        <g id="interactive-sun-group">
          {/* Ambient Corona Halo on Hover / Click */}
          <circle
            cx="914"
            cy="76"
            r="44"
            className="sun-corona-halo"
            fill="#f59e0b"
            filter="url(#pco2SunGlow)"
          />
          <circle
            cx="914"
            cy="76"
            r="38"
            className="sun-core-pulse"
            fill="#fcd34d"
            filter="url(#pco2SunGlow)"
          />

          {/* Radiating Flare Spokes (Hover + Animation) */}
          <g className="sun-flares" stroke="#fcd34d" strokeWidth="2.5" strokeLinecap="round">
            <line x1="914" y1="28" x2="914" y2="16" />
            <line x1="914" y1="124" x2="914" y2="136" />
            <line x1="866" y1="76" x2="854" y2="76" />
            <line x1="962" y1="76" x2="974" y2="76" />
            <line x1="880" y1="42" x2="870" y2="32" />
            <line x1="948" y1="110" x2="958" y2="120" />
            <line x1="880" y1="110" x2="870" y2="120" />
            <line x1="948" y1="42" x2="958" y2="32" />
          </g>

          {/* Rotating Solar Ring */}
          <circle
            cx="914"
            cy="76"
            r="54"
            className="sun-spin-ring"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="1.5"
            strokeDasharray="4 6"
          />

          {/* ANIMATED SUN RAYS FALLING UPON THE FRAMEWORK (During Step 1 & 2) */}
          {(animState === 'running' || animState === 'completed') && (
            <g className="animated-solar-rays">
              {/* Volumetric Light Cone */}
              <polygon
                points="914 76, 260 380, 680 330, 800 430"
                fill="url(#pco2SunRayGrad)"
                className="solar-light-cone"
              />

              {/* Streaming Photon Beams */}
              <line
                x1="914"
                y1="76"
                x2="380"
                y2="370"
                className="photon-beam beam-1"
                stroke="#fcd34d"
                strokeWidth="2.5"
                strokeDasharray="12 18"
              />
              <line
                x1="914"
                y1="76"
                x2="520"
                y2="350"
                className="photon-beam beam-2"
                stroke="#fffbeb"
                strokeWidth="3"
                strokeDasharray="16 22"
              />
              <line
                x1="914"
                y1="76"
                x2="650"
                y2="390"
                className="photon-beam beam-3"
                stroke="#f59e0b"
                strokeWidth="2"
                strokeDasharray="10 16"
              />

              {/* Photon Wave Packets Falling from Sun to Framework */}
              <g className="photon-packet-cascade">
                <circle cx="914" cy="76" r="5" fill="#ffffff" filter="url(#pco2SparkGlow)" className="photon-wave wave-1" />
                <circle cx="914" cy="76" r="6" fill="#fcd34d" filter="url(#pco2SparkGlow)" className="photon-wave wave-2" />
                <circle cx="914" cy="76" r="4.5" fill="#ffffff" filter="url(#pco2SparkGlow)" className="photon-wave wave-3" />
                <circle cx="914" cy="76" r="5.5" fill="#fcd34d" filter="url(#pco2SparkGlow)" className="photon-wave wave-4" />
              </g>

              {/* Solar Photon Annotation Tag */}
              <g transform="translate(805, 125)" className="photon-annotation">
                <rect x="-8" y="-12" width="112" height="20" rx="3" fill="rgba(24, 33, 54, 0.85)" stroke="#fcd34d" strokeWidth="1" />
                <text x="4" y="2" fill="#fcd34d" fontFamily="'Space Mono', monospace" fontSize="9.5" fontWeight="700">hν PHOTONS</text>
              </g>
            </g>
          )}
        </g>

        {/* =================================================================== */}
        {/* 2. ELECTRON STREAMLINE & MARKERS GLOW */}
        {/* =================================================================== */}
        <g id="interactive-electron-group">
          {/* Glowing Streamline Path (Electric Blue on Hover & Run) */}
          <path
            d="M 840 492 L 628 510 L 475 515 L 430 460 L 380 395 L 288 305"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="electron-glow-path"
            filter="url(#pco2ElectronGlow)"
          />
          <path
            d="M 840 492 L 628 510 L 475 515 L 430 460 L 380 395 L 288 305"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="electron-core-path"
          />

          {/* Individual Electron Beads with Concentric Pulsing Ripples */}
          {/* Bead 1 (Semiconductor far right) */}
          <g transform="translate(835, 492)" className="electron-bead bead-1">
            <circle cx="0" cy="0" r="14" className="bead-ripple" fill="#38bdf8" />
            <circle cx="0" cy="0" r="9" className="bead-core" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
          </g>

          {/* Bead 2 (Semiconductor mid) */}
          <g transform="translate(628, 510)" className="electron-bead bead-2">
            <circle cx="0" cy="0" r="14" className="bead-ripple" fill="#38bdf8" />
            <circle cx="0" cy="0" r="9" className="bead-core" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
          </g>

          {/* Bead 3 (Framework base junction) */}
          <g transform="translate(430, 460)" className="electron-bead bead-3">
            <circle cx="0" cy="0" r="14" className="bead-ripple" fill="#38bdf8" />
            <circle cx="0" cy="0" r="9" className="bead-core" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
          </g>

          {/* Bead 4 (Framework middle layer) */}
          <g transform="translate(380, 395)" className="electron-bead bead-4">
            <circle cx="0" cy="0" r="14" className="bead-ripple" fill="#38bdf8" />
            <circle cx="0" cy="0" r="9" className="bead-core" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
          </g>

          {/* Bead 5 (Framework top surface) */}
          <g transform="translate(288, 305)" className="electron-bead bead-5">
            <circle cx="0" cy="0" r="14" className="bead-ripple" fill="#38bdf8" />
            <circle cx="0" cy="0" r="9" className="bead-core" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
          </g>

          {/* ANIMATED ELECTRON FLOW (Step 3: Semiconductor -> Framework) */}
          {(animState === 'running' && currentStep >= 3) && (
            <g className="animated-electron-stream">
              {/* Multiple Traveling Charge Packets (e-) Racing up the Lattice */}
              <g className="traveling-electron packet-1">
                <circle cx="0" cy="0" r="11" fill="#38bdf8" filter="url(#pco2ElectronGlow)" />
                <circle cx="0" cy="0" r="7" fill="#ffffff" />
                <text x="-4" y="3" fill="#0f172a" fontFamily="'Space Mono', monospace" fontSize="8" fontWeight="700">e⁻</text>
              </g>
              <g className="traveling-electron packet-2">
                <circle cx="0" cy="0" r="11" fill="#38bdf8" filter="url(#pco2ElectronGlow)" />
                <circle cx="0" cy="0" r="7" fill="#ffffff" />
                <text x="-4" y="3" fill="#0f172a" fontFamily="'Space Mono', monospace" fontSize="8" fontWeight="700">e⁻</text>
              </g>
              <g className="traveling-electron packet-3">
                <circle cx="0" cy="0" r="11" fill="#38bdf8" filter="url(#pco2ElectronGlow)" />
                <circle cx="0" cy="0" r="7" fill="#ffffff" />
                <text x="-4" y="3" fill="#0f172a" fontFamily="'Space Mono', monospace" fontSize="8" fontWeight="700">e⁻</text>
              </g>
            </g>
          )}
        </g>

        {/* =================================================================== */}
        {/* 3. ANIMATED CO2 MOLECULES MOVEMENT TO THE FRAMEWORK */}
        {/* =================================================================== */}
        {(animState === 'running' && currentStep >= 2) && (
          <g id="animated-co2-group">
            {/* Guide Influx Streams */}
            <path
              d="M 160 140 C 200 190, 220 250, 250 310"
              fill="none"
              stroke="#60a5fa"
              strokeWidth="2.5"
              strokeDasharray="6 6"
              className="co2-guide-path-1"
            />
            <path
              d="M 120 220 C 160 270, 190 310, 235 365"
              fill="none"
              stroke="#60a5fa"
              strokeWidth="2.5"
              strokeDasharray="6 6"
              className="co2-guide-path-2"
            />

            {/* Traveling CO2 Molecule 1 */}
            <g className="traveling-co2 mol-1">
              <line x1="-12" y1="0" x2="12" y2="0" stroke="#cbd5e1" strokeWidth="2.2" />
              <circle cx="0" cy="0" r="6" fill="#1e293b" />
              <circle cx="-12" cy="0" r="5" fill="#ef4444" />
              <circle cx="12" cy="0" r="5" fill="#ef4444" />
              <text x="-9" y="-9" fill="#ef4444" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="9" fontWeight="700">CO₂</text>
            </g>

            {/* Traveling CO2 Molecule 2 */}
            <g className="traveling-co2 mol-2">
              <line x1="-10" y1="0" x2="10" y2="0" stroke="#cbd5e1" strokeWidth="2" />
              <circle cx="0" cy="0" r="5.5" fill="#1e293b" />
              <circle cx="-10" cy="0" r="4.5" fill="#ef4444" />
              <circle cx="10" cy="0" r="4.5" fill="#ef4444" />
              <text x="-9" y="-8" fill="#ef4444" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="8.5" fontWeight="700">CO₂</text>
            </g>

            {/* Traveling CO2 Molecule 3 */}
            <g className="traveling-co2 mol-3">
              <line x1="-11" y1="0" x2="11" y2="0" stroke="#cbd5e1" strokeWidth="2" />
              <circle cx="0" cy="0" r="5.5" fill="#1e293b" />
              <circle cx="-11" cy="0" r="4.5" fill="#ef4444" />
              <circle cx="11" cy="0" r="4.5" fill="#ef4444" />
            </g>
          </g>
        )}

        {/* =================================================================== */}
        {/* 4. FRAMEWORK CATALYTIC REACTION FLASHES */}
        {/* =================================================================== */}
        {(animState === 'running' && currentStep >= 3) && (
          <g id="framework-catalytic-reactions">
            {/* Active pore catalytic reaction bursts */}
            <g transform="translate(320, 330)" className="catalytic-burst burst-1">
              <circle cx="0" cy="0" r="16" fill="#f59e0b" filter="url(#pco2SparkGlow)" opacity="0.8" />
              <circle cx="0" cy="0" r="8" fill="#fffbeb" />
            </g>
            <g transform="translate(420, 370)" className="catalytic-burst burst-2">
              <circle cx="0" cy="0" r="18" fill="#22c55e" filter="url(#pco2SparkGlow)" opacity="0.8" />
              <circle cx="0" cy="0" r="9" fill="#ffffff" />
            </g>
            <g transform="translate(530, 340)" className="catalytic-burst burst-3">
              <circle cx="0" cy="0" r="16" fill="#f59e0b" filter="url(#pco2SparkGlow)" opacity="0.8" />
              <circle cx="0" cy="0" r="8" fill="#fffbeb" />
            </g>
          </g>
        )}

        {/* =================================================================== */}
        {/* 5. MOVEMENT OF SOLAR FUELS GENERATING FROM FRAMEWORK */}
        {/* =================================================================== */}
        {/* Solar Fuels Circle Halo (Upper Right) */}
        <circle
          cx="895"
          cy="275"
          r="120"
          className="solar-fuels-halo"
          fill="none"
          stroke="#22c55e"
          strokeWidth="3"
          filter="url(#pco2FuelGlow)"
        />

        {(animState === 'running' && currentStep >= 4) && (
          <g id="animated-solar-fuels-stream">
            {/* Illuminated Green Egress Stream */}
            <path
              d="M 640 370 C 710 375, 780 345, 820 310"
              fill="none"
              stroke="url(#pco2FuelTrail)"
              strokeWidth="6"
              strokeLinecap="round"
              className="fuel-flow-stream"
              filter="url(#pco2FuelGlow)"
            />

            {/* Generated Solar Fuel Packet 1: CO */}
            <g className="traveling-fuel-molecule fuel-1">
              <circle cx="0" cy="0" r="15" fill="#22c55e" opacity="0.3" filter="url(#pco2FuelGlow)" />
              <circle cx="-5" cy="0" r="6" fill="#1e293b" />
              <circle cx="5" cy="0" r="6" fill="#ef4444" />
              <rect x="-14" y="-22" width="28" height="14" rx="2" fill="rgba(15, 23, 42, 0.9)" />
              <text x="-8" y="-12" fill="#86efac" fontFamily="'Space Mono', monospace" fontSize="8" fontWeight="700">CO</text>
            </g>

            {/* Generated Solar Fuel Packet 2: CH3OH (Methanol) */}
            <g className="traveling-fuel-molecule fuel-2">
              <circle cx="0" cy="0" r="16" fill="#22c55e" opacity="0.3" filter="url(#pco2FuelGlow)" />
              <circle cx="-6" cy="0" r="6" fill="#1e293b" />
              <circle cx="6" cy="0" r="6" fill="#ef4444" />
              <circle cx="13" cy="4" r="3.5" fill="#ffffff" />
              <rect x="-22" y="-22" width="44" height="14" rx="2" fill="rgba(15, 23, 42, 0.9)" />
              <text x="-16" y="-12" fill="#86efac" fontFamily="'Space Mono', monospace" fontSize="7.5" fontWeight="700">CH₃OH</text>
            </g>

            {/* Generated Solar Fuel Packet 3: C2H5OH (Ethanol) */}
            <g className="traveling-fuel-molecule fuel-3">
              <circle cx="0" cy="0" r="16" fill="#22c55e" opacity="0.3" filter="url(#pco2FuelGlow)" />
              <circle cx="-8" cy="0" r="5.5" fill="#1e293b" />
              <circle cx="0" cy="0" r="5.5" fill="#1e293b" />
              <circle cx="8" cy="0" r="5.5" fill="#ef4444" />
              <rect x="-24" y="-22" width="48" height="14" rx="2" fill="rgba(15, 23, 42, 0.9)" />
              <text x="-19" y="-12" fill="#86efac" fontFamily="'Space Mono', monospace" fontSize="7.5" fontWeight="700">C₂H₅OH</text>
            </g>

            {/* Synthesis Success Expanding Ripple inside Solar Fuels Circle */}
            <circle
              cx="895"
              cy="275"
              r="20"
              className="fuel-synthesis-burst"
              fill="#22c55e"
              filter="url(#pco2FuelGlow)"
            />
          </g>
        )}
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
