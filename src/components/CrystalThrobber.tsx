import React from 'react'

export interface CrystalThrobberProps {
  /** Size variant */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  /** Optional accessible status label */
  label?: string
  /** Custom extra CSS classes */
  className?: string
  /** Whether to show a pulse glow beneath the crystal */
  glow?: boolean
}

/**
 * Universal Rotating Crystal Structure Throbber for Dr. Sumanta Chowdhury's Portfolio.
 * Renders a 3D isometric reticular framework crystal unit cell with coordinated nodes
 * and conjugated struts, rotating smoothly in 3D perspective space.
 */
export function CrystalThrobber({
  size = 'md',
  label,
  className = '',
  glow = true,
}: CrystalThrobberProps) {
  return (
    <div
      className={`crystal-throbber-wrapper size-${size} ${className}`}
      role="status"
      aria-live="polite"
      aria-label={label || 'Loading...'}
    >
      <div className="crystal-throbber-viewport">
        {glow && <div className="crystal-throbber-ambient-glow" aria-hidden="true" />}
        <div className="crystal-throbber-scene">
          <div className="crystal-throbber-pivot">
            {/* Core Equatorial Framework Struts */}
            <div className="crystal-strut strut-xy" />
            <div className="crystal-strut strut-xz" />
            <div className="crystal-strut strut-yz" />

            {/* Inner Diagonal Lattice Braces */}
            <div className="crystal-diagonal-brace brace-1" />
            <div className="crystal-diagonal-brace brace-2" />

            {/* 6 Coordinated Metal/Carbon Nodes (Zr/C Coordination Centers) */}
            <div className="crystal-node node-top" title="Coordination Node" />
            <div className="crystal-node node-bottom" title="Coordination Node" />
            <div className="crystal-node node-left" title="Coordination Node" />
            <div className="crystal-node node-right" title="Coordination Node" />
            <div className="crystal-node node-front" title="Coordination Node" />
            <div className="crystal-node node-back" title="Coordination Node" />

            {/* Center Core Dot */}
            <div className="crystal-node node-center" />
          </div>
        </div>
      </div>

      {label && <span className="crystal-throbber-label">{label}</span>}
    </div>
  )
}
