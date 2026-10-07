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
        <div aria-labelledby={`research-tab-${activeTheme}`} className="research-detail" id={`research-detail-${activeTheme}`} role="tabpanel">
          <div className="research-detail-intro">
            <span className="detail-number">Focus / {selectedTheme.index}</span>
            <h3>{selectedTheme.title}</h3>
            <p className="detail-lead">{selectedTheme.lead}</p>
            <p className="research-detail-context">{selectedTheme.context}</p>
          </div>
          <div className="research-detail-areas">
            <span className="detail-label">Research directions</span>
            <ul>
              {selectedTheme.areas.map((area) => <li key={area}>{area}</li>)}
            </ul>
          </div>
          <div className="research-detail-publications">
            <span className="detail-label">Related publications (placeholders)</span>
            <ul className="theme-pub-list">
              {selectedTheme.publications?.map((pub, idx) => (
                <li key={idx} className="theme-pub-item">
                  <span className="theme-pub-index">[{idx + 1}]</span>
                  <div className="theme-pub-info">
                    <span className="theme-pub-title">{pub.title}</span>
                    <span className="theme-pub-meta">
                      <em>{pub.journal}</em> ({pub.year}) {pub.doi && <>· <span className="theme-pub-doi">DOI: {pub.doi}</span></>}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
