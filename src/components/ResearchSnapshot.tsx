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
          <h2 id="research-heading">Frameworks with purpose.</h2>
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
              <span className="theme-index">{theme.index}</span>
              <span className="theme-title">{theme.title}</span>
              <span className="theme-detail">{theme.detail}</span>
              <span className="theme-arrow" aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
        <div aria-labelledby={`research-tab-${activeTheme}`} className="research-detail" id={`research-detail-${activeTheme}`} role="tabpanel">
          <div className="research-detail-intro">
            <span className="detail-number">Focus / {selectedTheme.index}</span>
            <h3>{selectedTheme.title}</h3>
            <p>{selectedTheme.lead}</p>
          </div>
          <div className="research-detail-areas">
            <span className="detail-label">Research directions</span>
            <ul>
              {selectedTheme.areas.map((area) => <li key={area}>{area}</li>)}
            </ul>
          </div>
          <p className="research-detail-context">{selectedTheme.context}</p>
        </div>
      </div>
    </section>
  )
}
