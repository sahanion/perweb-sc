import { useState } from 'react'
import { ReticularFramework3D } from './ReticularFramework3D'
import { researcher, heroPillars } from '../data/researcher'

export function Hero() {
  const [activePillarIndex, setActivePillarIndex] = useState<number | null>(null)

  const activePillar = activePillarIndex !== null ? heroPillars[activePillarIndex] : null

  return (
    <section className="hero container" id="top" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow reveal">Research portfolio · 2026</p>
        <h1 id="hero-title" className="reveal reveal-delay-1">
          Dr. Sumanta<br /><em>Chowdhury</em>
        </h1>

        <div className="hero-topics-wrapper reveal reveal-delay-2" aria-label="Research pillars">
          <div className="hero-topics-line" role="tablist">
            {heroPillars.map((pillar, idx) => {
              const isHovered = activePillarIndex === idx
              return (
                <span key={pillar.id} className="topic-group">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={isHovered}
                    className={`topic-item-btn ${isHovered ? 'is-active' : ''}`}
                    onMouseEnter={() => setActivePillarIndex(idx)}
                    onMouseLeave={() => setActivePillarIndex(null)}
                    onFocus={() => setActivePillarIndex(idx)}
                    onBlur={() => setActivePillarIndex(null)}
                    onClick={() => setActivePillarIndex(activePillarIndex === idx ? null : idx)}
                  >
                    {pillar.title}
                  </button>
                  {idx < heroPillars.length - 1 && (
                    <span className="topic-bullet" aria-hidden="true">•</span>
                  )}
                </span>
              )
            })}
          </div>

          <div className="topic-sentence-box" aria-live="polite">
            <p className={`topic-sentence ${activePillar ? 'is-expanded' : 'is-default'}`}>
              {activePillar ? (
                <span>
                  <strong className="topic-sentence-label">{activePillar.title}:</strong>{' '}
                  {activePillar.overview}
                </span>
              ) : (
                <span className="topic-hint">
                  <span className="hint-bullet" aria-hidden="true">✦</span> Hover over any topic above to explore key research directions.
                </span>
              )}
            </p>
          </div>
        </div>

        <p className="hero-intro reveal reveal-delay-3">{researcher.introduction}</p>

        <div className="hero-meta reveal reveal-delay-4">
          <span>{researcher.role}</span>
          <span>{researcher.affiliation}</span>
        </div>

        <div className="actions reveal reveal-delay-4">
          <a className="button button-primary" href="#research">Explore research <span aria-hidden="true">↘</span></a>
          <a className="button button-quiet" href="#cv">View CV <span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <div className="hero-art reveal reveal-delay-2">
        <ReticularFramework3D />
      </div>
    </section>
  )
}
