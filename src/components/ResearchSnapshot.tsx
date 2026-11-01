import { useState } from 'react'
import { researchThemes } from '../data/researcher'

export function ResearchSnapshot() {
  const [activeTheme, setActiveTheme] = useState(0)
  const selectedTheme = researchThemes[activeTheme]

  return (
    <section className="snapshot section" id="research" aria-labelledby="research-heading">
      <div className="container">
        <div className="section-heading">
          <p className="eyebrow">01 / Research focus</p>
          <h2 id="research-heading">Tiny Pores. Big Possibilities.</h2>
        </div>
        <div className="theme-grid" role="tablist" aria-label="Research focus areas">
          {researchThemes.map((theme, index) => (
            <button
              aria-controls={`research-detail-${index}`}
              aria-selected={activeTheme === index}
              className={`theme-card ${activeTheme === index ? 'is-active' : ''}`}
              id={`research-tab-${index}`}
              key={theme.title}
              onClick={() => setActiveTheme(index)}
              onFocus={() => setActiveTheme(index)}
              onMouseEnter={() => setActiveTheme(index)}
              role="tab"
              type="button"
            >
              <div className="theme-card-bg" aria-hidden="true">
                <img
                  src={theme.bgImage}
                  alt=""
                  className="theme-card-img"
                  loading="lazy"
                />
              </div>
              <div className="theme-card-overlay" aria-hidden="true" />
              <div className="theme-card-body">
                <span className="theme-index">{theme.index}</span>
                <span className="theme-title">{theme.title}</span>
                <span className="theme-detail">{theme.detail}</span>
                <span className="theme-arrow" aria-hidden="true">↗</span>
              </div>
            </button>
          ))}
        </div>
        <div
          aria-labelledby={`research-tab-${activeTheme}`}
          className="research-detail"
          id={`research-detail-${activeTheme}`}
          role="tabpanel"
        >
          <div className="research-detail-intro">
            <span className="detail-number">Focus / {selectedTheme.index}</span>
            <h3>{selectedTheme.title}</h3>
            <p className="detail-lead">{selectedTheme.lead}</p>
            <div className="research-detail-context">
              <span className="context-indicator" aria-hidden="true" />
              <p>{selectedTheme.context}</p>
            </div>
          </div>

          <div className="research-detail-areas">
            <div className="areas-heading-row">
              <span className="detail-label">Key Research Directions</span>
              <span className="areas-count-pill">{selectedTheme.areas.length} Thrusts</span>
            </div>
            <ul className="areas-list">
              {selectedTheme.areas.map((area, idx) => (
                <li key={area} className="area-item">
                  <span className="area-num">0{idx + 1}</span>
                  <span className="area-text">{area}</span>
                  <span className="area-arrow" aria-hidden="true">↗</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
