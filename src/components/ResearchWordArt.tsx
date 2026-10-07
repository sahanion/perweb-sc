import React from 'react'

export function ResearchWordArt() {
  return (
    <div
      className="cv-wordart"
      role="img"
      aria-label="Scientific word art depicting key research areas: Reticular Chemistry, MOFs & COFs, Photocatalysis, CO2 Reduction, Adsorption, Aerogels, and Therapeutic NanoCOFs"
    >
      {/* Background Reticular & Chemical Vector Graphics */}
      <svg
        className="cv-wordart-svg"
        viewBox="0 0 420 190"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          {/* Subtle warm glow filter */}
          <filter id="node-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          {/* Subtle radial gradient for pore center */}
          <radialGradient id="pore-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ba9c66" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#ba9c66" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Technical Coordinate Grid Marks & Precision Registration */}
        <g className="grid-marks" opacity="0.38" stroke="currentColor" strokeWidth="0.8">
          {/* Top-left registration mark */}
          <path d="M 12 18 L 18 18 M 15 15 L 15 21" />
          {/* Bottom-right registration mark */}
          <path d="M 402 172 L 408 172 M 405 169 L 405 175" />
          {/* Crystallographic Miller indices notation */}
          <text x="14" y="32" className="svg-micro-mono" fill="currentColor">⟨h k l⟩</text>
          <text x="365" y="176" className="svg-micro-mono" fill="currentColor">2.4 nm ⬡</text>
        </g>

        {/* Reticular Pore Hexagon 1 (Central pore) */}
        <polygon
          points="255,42 300,68 300,120 255,146 210,120 210,68"
          fill="url(#pore-gradient)"
          stroke="#ba9c66"
          strokeWidth="1"
          strokeDasharray="3 3"
          className="pore-lattice-poly"
          opacity="0.55"
        />

        {/* Reticular Pore Hexagon 2 (Interlocking adjacent pore) */}
        <polygon
          points="300,68 345,42 390,68 390,120 345,146 300,120"
          stroke="#222d47"
          strokeWidth="0.8"
          strokeDasharray="2 3"
          opacity="0.25"
          className="pore-lattice-secondary"
        />

        {/* Coordination Linkers & Organic Struts */}
        <g stroke="#ba9c66" strokeWidth="0.9" opacity="0.5">
          <line x1="210" y1="68" x2="160" y2="48" strokeDasharray="3 2" />
          <line x1="210" y1="120" x2="160" y2="140" strokeDasharray="3 2" />
          <line x1="255" y1="146" x2="255" y2="175" strokeDasharray="2 2" />
          <line x1="255" y1="42" x2="255" y2="18" strokeDasharray="2 2" />
        </g>

        {/* Light Wave / Photon hν trajectory for photocatalysis */}
        <path
          d="M 28 85 Q 44 72 60 85 T 92 85 T 124 85"
          fill="none"
          stroke="#ba9c66"
          strokeWidth="1.2"
          opacity="0.45"
          className="photon-wave"
        />
        <text x="70" y="73" className="svg-micro-mono" fill="#ba9c66" opacity="0.85">hν</text>

        {/* CO2 to Fuel Catalytic Conversion Arc */}
        <path
          d="M 320 22 C 342 16, 362 26, 375 35"
          fill="none"
          stroke="#222d47"
          strokeWidth="0.9"
          strokeDasharray="2 2"
          opacity="0.4"
        />
        <text x="325" y="16" className="svg-micro-mono" fill="currentColor" opacity="0.6">CO₂ → CH₄</text>

        {/* Metal-Node Vertices with coordination halos */}
        <g className="pore-nodes">
          <circle cx="255" cy="42" r="3" fill="#ba9c66" filter="url(#node-glow)" />
          <circle cx="255" cy="42" r="1.5" fill="#f8f5ee" />

          <circle cx="300" cy="68" r="3" fill="#ba9c66" />
          <circle cx="300" cy="68" r="1.5" fill="#f8f5ee" />

          <circle cx="300" cy="120" r="3" fill="#ba9c66" />
          <circle cx="300" cy="120" r="1.5" fill="#f8f5ee" />

          <circle cx="255" cy="146" r="3" fill="#ba9c66" filter="url(#node-glow)" />
          <circle cx="255" cy="146" r="1.5" fill="#f8f5ee" />

          <circle cx="210" cy="120" r="3" fill="#ba9c66" />
          <circle cx="210" cy="120" r="1.5" fill="#f8f5ee" />

          <circle cx="210" cy="68" r="3" fill="#ba9c66" />
          <circle cx="210" cy="68" r="1.5" fill="#f8f5ee" />

          {/* Secondary vertex nodes */}
          <circle cx="345" cy="42" r="2" fill="#222d47" opacity="0.4" />
          <circle cx="390" cy="68" r="2" fill="#222d47" opacity="0.4" />
          <circle cx="345" cy="146" r="2" fill="#222d47" opacity="0.4" />
        </g>
      </svg>

      {/* Layered Typographic Word-Art Badges & Scientific Terms */}
      <div className="cv-wordart-content">
        {/* Row 1: Top badges */}
        <div className="wordart-row wordart-row-top">
          <span className="wa-chip wa-chip-ghost">Porphyrin Frameworks</span>
          <span className="wa-chip wa-chip-accent">
            <span className="wa-chip-dot"></span>CO₂ Photocatalysis
          </span>
        </div>

        {/* Centerpiece: Reticular Core Anchor */}
        <div className="wordart-row wordart-row-center">
          <div className="wa-hero-anchor">
            <span className="wa-primary-title">RETICULAR CHEMISTRY</span>
            <div className="wa-sub-line">
              <span className="wa-highlight">MOFs &amp; COFs</span>
              <span className="wa-sep">/</span>
              <span className="wa-lead-desc">Porous Networks</span>
            </div>
          </div>
        </div>

        {/* Row 2: Middle floating terms */}
        <div className="wordart-row wordart-row-middle">
          <span className="wa-chip wa-chip-sm">Adsorption &amp; Separation</span>
          <span className="wa-chip wa-chip-mono">Gels · Aerogels · Films</span>
        </div>

        {/* Row 3: Bottom foundational terms */}
        <div className="wordart-row wordart-row-bottom">
          <span className="wa-chip wa-chip-sm wa-chip-outline">Precision Pore Tuning</span>
          <span className="wa-chip wa-chip-accent-light">NanoCOF Therapy</span>
          <span className="wa-chip wa-chip-micro">TEM &amp; SEM</span>
        </div>
      </div>
    </div>
  )
}

