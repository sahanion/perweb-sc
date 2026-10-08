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
          <h2 id="current-heading">{researcher.currentResearch.project}</h2>
          <p>{researcher.currentResearch.description}</p>
          <div className="current-tags">
            <span>{researcher.currentResearch.funder}</span>
            <span>PEPR SPLEEN</span>
            <span>CEISAM</span>
            <span>University of Nantes</span>
          </div>
          <div className="reaction" aria-label="Carbon dioxide plus water and light converts to carbon-based fuels">
            <span>CO₂</span><b>+</b><span>H₂O</span><i>light</i><strong>→</strong><span>carbon-based<br />fuels</span>
          </div>
        </div>

        <div className="current-diagram-frame">
          <InteractivePowerCo2 />
        </div>
      </div>
    </section>
  )
}
