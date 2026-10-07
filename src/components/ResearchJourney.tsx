import { researchJourney } from '../data/researcher'

export function ResearchJourney() {
  return (
    <section className="journey section" aria-labelledby="journey-heading">
      <div className="container journey-layout">
        <div className="section-heading"><p className="eyebrow">02 / Research approach</p><h2 id="journey-heading">From the molecular scale to meaningful use.</h2></div>
        <ol className="journey-list">
          {researchJourney.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item}</strong>{index < researchJourney.length - 1 && <i aria-hidden="true">→</i>}</li>)}
        </ol>
      </div>
    </section>
  )
}
