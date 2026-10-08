import { researcher } from '../data/researcher'
import { InteractivePowerCo2 } from './InteractivePowerCo2'

export function CurrentResearch() {
  return (
    <section className="current section" id="current-research" aria-labelledby="current-heading">
      <div className="container current-card">
        <div className="current-card-top">
          <p className="eyebrow">02 / Current research</p>
        </div>

        <div className="current-content">
          <p className="current-program">PEPR SPLEEN</p>
          <h2 id="current-heading">{researcher.currentResearch.project}</h2>
          <p>{researcher.currentResearch.description}</p>
          <div className="current-affiliations">
            <span>CNRS</span>
            <span className="current-affil-sep">·</span>
            <span>CEISAM</span>
            <span className="current-affil-sep">·</span>
            <span>University of Nantes</span>
          </div>
        </div>

        <div className="current-diagram-frame">
          <InteractivePowerCo2 />
        </div>
      </div>
    </section>
  )
}
