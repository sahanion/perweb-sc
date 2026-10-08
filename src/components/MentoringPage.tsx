import { useState } from 'react'
import { mentorshipColleagues } from '../data/mentoring'

type MentoringPageProps = {
  onBackToHome: (targetHash?: string) => void
}

export function MentoringPage({ onBackToHome }: MentoringPageProps) {
  const [selectedTag, setSelectedTag] = useState<string>('All')

  // Extract unique tags for filtering
  const allTags = ['All', 'NanoCOF Drug Delivery', 'Electrospun Nanofibers', 'Heterogeneous Catalysis', 'CO₂ Conversion', 'Wastewater Treatment']

  const filteredColleagues = selectedTag === 'All'
    ? mentorshipColleagues
    : mentorshipColleagues.filter((c) =>
        c.frameworkTags.some((tag) => tag.toLowerCase().includes(selectedTag.toLowerCase()))
      )

  return (
    <div className="mentoring-page">
      <div className="container">
        {/* Navigation Breadcrumb */}
        <div className="gallery-breadcrumb">
          <button type="button" className="gallery-back-btn" onClick={() => onBackToHome('#top')}>
            <span aria-hidden="true">←</span> Back to Portfolio
          </button>
          <span className="gallery-breadcrumb-sep">/</span>
          <span>Mentoring &amp; Collaborations</span>
        </div>

        {/* Hero Section */}
        <div className="mentoring-hero">
          <div className="gallery-badge-wrap">
            <span className="gallery-live-pulse" />
            <span className="gallery-badge">Collaborative Research &amp; Mentorship</span>
          </div>

          <h1 className="gallery-title">
            Fostering Discovery &amp;<br />
            <em>Empowering Researchers</em>
          </h1>

          <p className="gallery-intro">
            Mentoring is at the core of advancing reticular chemistry. Over the years, I have had the privilege to work alongside talented colleagues, Ph.D. scholars, and master’s researchers—guiding them through precision framework synthesis, advanced characterization, and impactful scientific publications.
          </p>
        </div>

        {/* Colleagues & Related Projects Section */}
        <div className="mentoring-colleagues-section">
          <div className="section-heading">
            <p className="eyebrow">Colleagues &amp; Projects</p>
            <h2>Research colleagues &amp; collaborative projects</h2>
            <p className="colleagues-subheading">
              Select individuals and teams I have mentored or co-investigated with across interdisciplinary porous materials research.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="mentoring-filters" role="tablist" aria-label="Filter colleagues by research focus">
            {allTags.map((tag) => (
              <button
                key={tag}
                type="button"
                role="tab"
                aria-selected={selectedTag === tag}
                className={`filter-pill ${selectedTag === tag ? 'is-active' : ''}`}
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Colleagues & Projects Grid */}
          <div className="mentoring-grid">
            {filteredColleagues.map((colleague) => (
              <article key={colleague.id} className="mentoring-card">
                {/* Colleague Profile Header */}
                <div className="mentoring-card-header">
                  <div className="colleague-photo-wrap">
                    <img
                      src={colleague.photo}
                      alt={colleague.name}
                      className="colleague-photo"
                      onError={(e) => {
                        // Fallback avatar if web photo is unavailable
                        const target = e.currentTarget
                        target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
                      }}
                    />
                    <span className="colleague-status-indicator" title="Active Collaboration" />
                  </div>

                  <div className="colleague-meta">
                    <span className="colleague-period">{colleague.period}</span>
                    <h3 className="colleague-name">{colleague.name}</h3>
                    <p className="colleague-role">{colleague.role}</p>
                    <p className="colleague-institution">{colleague.institution}</p>
                  </div>
                </div>

                <div className="mentoring-divider" />

                {/* Collaborative Project Details */}
                <div className="mentoring-project-body">
                  <div className="project-badge-line">
                    <span className="project-eyebrow">COLLABORATIVE PROJECT</span>
                  </div>
                  <h4 className="project-title">{colleague.projectTitle}</h4>
                  <p className="project-description">{colleague.projectScope}</p>

                  {/* Framework & Research Tags */}
                  <div className="colleague-tags">
                    {colleague.frameworkTags.map((tag) => (
                      <span key={tag} className="colleague-tag">{tag}</span>
                    ))}
                  </div>

                  {/* Joint Publications & Outcomes */}
                  {colleague.jointOutputs && colleague.jointOutputs.length > 0 && (
                    <div className="joint-outcomes-box">
                      <div className="outcomes-header">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                        </svg>
                        <span>Joint Research Outcomes</span>
                      </div>
                      <ul className="outcomes-list">
                        {colleague.jointOutputs.map((output) => (
                          <li key={output}>{output}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Bottom Contact & Collaboration Banner */}
        <div className="gallery-footer-banner">
          <div>
            <h3 style={{ margin: '0 0 8px', fontSize: '1.5rem', fontFamily: 'var(--font-serif)' }}>
              Looking for a Research Mentor or Collaboration?
            </h3>
            <p style={{ margin: 0, color: 'var(--muted)', fontSize: '14px' }}>
              I welcome inquiries from motivated graduate students, prospective postdoctoral fellows, and academic collaborators interested in reticular chemistry, MOFs/COFs, and photocatalytic systems.
            </p>
          </div>
          <button
            type="button"
            className="gallery-banner-link"
            style={{ border: 'none', background: 'transparent', cursor: 'pointer', font: 'inherit' }}
            onClick={() => onBackToHome('#contact')}
          >
            Get in touch with Sumanta Chowdhury, PhD <span>→</span>
          </button>
        </div>
      </div>
    </div>
  )
}

