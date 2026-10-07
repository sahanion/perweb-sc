import { academics, positions, presentations, publications } from '../data/researcher'

export function AcademicCV() {
  return (
    <section className="cv-section section" id="cv" aria-labelledby="cv-heading">
      <div className="container">
        <div className="cv-heading">
          <div><p className="eyebrow">03 / Curriculum vitae</p><h2 id="cv-heading">A research career in frameworks, materials and applications.</h2></div>
          <p>Selected academic record, research outputs and scientific presentations.</p>
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
          <div className="cv-block-heading cv-block-heading-with-note"><span>03</span><h3>Publications</h3><p>11 peer-reviewed publications</p></div>
          <ol className="publication-list">
            {publications.map((publication, index) => <li key={publication.title}>
              <span className="publication-number">{String(index + 1).padStart(2, '0')}</span>
              <div><div className="publication-meta"><span>{publication.type}</span><span>{publication.year}</span></div><h4>{publication.title}</h4><p className="publication-authors">{publication.authors}</p><p className="publication-citation">{publication.citation}</p></div>
            </li>)}
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
