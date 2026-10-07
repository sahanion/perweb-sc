import { ReticularFramework3D } from './ReticularFramework3D'
import { researcher } from '../data/researcher'

export function Hero() {
  return (
    <section className="hero container" id="top" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow reveal">Research portfolio · 2026</p>
        <h1 id="hero-title" className="reveal reveal-delay-1">
          Dr. Sumanta<br /><em>Chowdhury</em>
        </h1>

        <div className="hero-focus-points reveal reveal-delay-2" aria-label="Research Focus Areas">
          {researcher.focusPoints.map((point) => (
            <div key={point.index} className="focus-point-item">
              <span className="focus-point-num">{point.index}</span>
              <div className="focus-point-body">
                <span className="focus-point-title">{point.title}</span>
                <span className="focus-point-subtitle">{point.subtitle}</span>
              </div>
            </div>
          ))}
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
