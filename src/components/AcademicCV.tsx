import { academics, positions, presentations, publications } from '../data/researcher'

export function AcademicCV() {
  return (
    <section className="cv-section section" id="cv" aria-labelledby="cv-heading">
      <div className="container">
        <div className="cv-heading">
          <div><p className="eyebrow">03 / Curriculum vitae</p><h2 id="cv-heading">Tuning empty spaces to solve larger challenges. </h2></div>
        </div>

        <div className="cv-block" id="positions">
          <div className="cv-block-heading"><span>01</span><h3>Positions</h3></div>
          <ol className="position-list">
            {positions.map((position) => <li key={`${position.period}-${position.role}`}>
              <div className="position-period"><span>{position.period}</span><em className={position.status === 'Current' ? 'is-current' : ''}>{position.status}</em></div>
              <div><h4>{position.role}</h4><p className="position-institution">{position.institution}</p><p>{position.detail}</p></div>
            </li>)}
          </ol>
        </div>

        <div className="cv-block" id="academics">
          <div className="cv-block-heading"><span>02</span><h3>Academics</h3></div>
          <div className="academic-grid">
            {academics.map((academic) => <article key={academic.degree} className="academic-card"><span>{academic.period}</span><h4>{academic.degree}</h4><p className="position-institution">{academic.institution}</p>{academic.detail && <p>{academic.detail}</p>}</article>)}
          </div>
        </div>

        <div className="cv-block" id="publications">
          <div className="cv-block-heading cv-block-heading-with-note">
            <span>03</span>
            <div>
              <h3>Publications</h3>
              <div className="publications-subhead" aria-label="Publication metrics">
                <div className="pub-stat-chip">
                  <svg className="pub-stat-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                  <span className="pub-stat-value">11</span>
                  <span className="pub-stat-label">Peer-reviewed articles</span>
                </div>

                <div className="pub-stat-chip">
                  <svg className="pub-stat-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                    <polyline points="16 7 22 7 22 13" />
                  </svg>
                  <span className="pub-stat-value">≈ 300</span>
                  <span className="pub-stat-label">Citations</span>
                </div>

                <div className="pub-stat-chip">
                  <svg className="pub-stat-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="8" r="6" />
                    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
                  </svg>
                  <span className="pub-stat-label">h-index:</span>
                  <span className="pub-stat-value">11</span>
                </div>

                <a
                  href="https://scholar.google.com/citations?user=KWxvCz0AAAAJ&hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pub-stat-chip is-scholar-link"
                  title="View Google Scholar profile & citations"
                >
                  <svg className="pub-stat-icon is-scholar-icon" width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 24a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm0-24L0 9.5l4.838 3.94A8 8 0 0 1 12 10a8 8 0 0 1 7.162 3.44L24 9.5 12 0z"/>
                  </svg>
                  <span className="pub-stat-label">Google Scholar</span>
                  <svg className="pub-stat-arrow" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="publications-legend">
              <span className="legend-item"><strong className="legend-mark">*</strong> Joint-corresponding author</span>
              <span className="legend-item"><strong className="legend-mark">‡</strong> Equally contributed first author</span>
            </div>
          </div>
          <ol className="publication-list">
            {publications.map((publication, index) => (
              <li key={publication.title}>
                <span className="publication-number">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <div className="publication-meta">
                    <span className="publication-type">{publication.type}</span>
                    <span className="publication-year">{publication.year}</span>
                    {publication.badges?.map((badge) => {
                      const isCorresponding = badge.toLowerCase().includes('corresponding')
                      const isEqual = badge.toLowerCase().includes('equal')
                      const isCover = badge.toLowerCase().includes('cover')
                      const glyph = isCorresponding ? '*' : isEqual ? '‡' : isCover ? '✦' : null
                      return (
                        <span
                          key={badge}
                          className={`pub-role-annotation ${
                            isCorresponding
                              ? 'role-corresponding'
                              : isEqual
                              ? 'role-equal'
                              : isCover
                              ? 'role-cover'
                              : 'role-first'
                          }`}
                        >
                          {glyph && <span className="pub-role-glyph" aria-hidden="true">{glyph}</span>}
                          <span className="pub-role-text">{badge}</span>
                        </span>
                      )
                    })}
                  </div>
                  <h4>
                    {publication.url || publication.doi ? (
                      <a
                        href={publication.url || `https://doi.org/${publication.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="publication-title-link"
                      >
                        {publication.title} <span className="link-arrow-icon" aria-hidden="true">↗</span>
                      </a>
                    ) : (
                      publication.title
                    )}
                  </h4>
                  <p className="publication-authors">
                    {publication.authors.split(/(Chowdhury,\s*S\.[*‡]*)/g).map((part, idx) =>
                      part.startsWith('Chowdhury, S.') ? (
                        <strong key={idx} className="author-self">{part}</strong>
                      ) : (
                        part
                      )
                    )}
                  </p>
                  <p className="publication-citation">{publication.citation}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="cv-block" id="presentations">
          <div className="cv-block-heading cv-block-heading-with-note"><span>04</span><h3>Seminar presentations</h3><p>Talks, posters, seminars & workshops</p></div>
          <ol className="presentation-list">
            {presentations.map((presentation) => <li key={`${presentation.year}-${presentation.title}`}><span>{presentation.year}</span><div><em>{presentation.type}</em><h4>{presentation.title}</h4><p>{presentation.venue}</p></div></li>)}
          </ol>
        </div>
      </div>
    </section>
  )
}
