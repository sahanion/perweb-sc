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
              <div className="publications-subhead">
                <span>11 peer-reviewed articles</span>
                <span className="subhead-sep">•</span>
                <span>≈ 150 citations</span>
                <span className="subhead-sep">•</span>
                <span>h-index: 8</span>
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
                  <h4>{publication.title}</h4>
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
