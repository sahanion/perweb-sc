import { useState } from 'react'
import { mentorshipColleagues, type MentorshipColleague } from '../data/mentoring'

type MentoringPageProps = {
  onBackToHome: (targetHash?: string) => void
}

// Fallback avatar placeholder
const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'

function formatPeriod(from?: string, till?: string): string {
  if (from && till) return `${from} — ${till}`
  if (from) return `Since ${from}`
  if (till) return `Until ${till}`
  return ''
}

function getPublisherLabel(url: string, index: number): string {
  try {
    const hostname = new URL(url).hostname.toLowerCase()
    if (hostname.includes('sciencedirect')) return 'ScienceDirect Article'
    if (hostname.includes('acs.org')) return 'ACS Publications Article'
    if (hostname.includes('rsc.org')) return 'RSC Publishing Article'
    if (hostname.includes('nature.com')) return 'Nature Article'
    if (hostname.includes('wiley.com')) return 'Wiley Article'
    if (hostname.includes('springer.com')) return 'Springer Article'
    return `Publication ${index + 1}`
  } catch {
    return `Publication ${index + 1}`
  }
}

/**
 * Individual Collaborator Card
 * - Default state: Exact square card displaying only Photo, Name, Position, Department, Affiliation
 * - Bottom-right button: Compact down arrowhead (▼) that expands on hover to show "Click to expand"
 * - Expanded state: Smoothly reveals Connection Timeline, Collaborative Projects, Publications, Google Scholar
 */
function ColleagueCard({ colleague }: { colleague: MentorshipColleague }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const period = formatPeriod(colleague.yearFrom, colleague.yearTill)
  const hasProjects = colleague.projects && colleague.projects.length > 0
  const hasPubs = colleague.publications && colleague.publications.length > 0
  const hasExtraDetails = Boolean(period || hasProjects || hasPubs || colleague.googleScholar)

  return (
    <article className={`mentoring-card ${isExpanded ? 'is-expanded' : ''}`}>
      {/* Colleague Profile Header: Photo, Name, Position, Department, Affiliation */}
      <div className="mentoring-card-header">
        <div className="colleague-photo-wrap">
          <img
            src={colleague.photo || DEFAULT_AVATAR}
            alt={colleague.name}
            className="colleague-photo"
            onError={(e) => {
              const target = e.currentTarget
              target.src = DEFAULT_AVATAR
            }}
          />
          <span className="colleague-status-indicator" title="Collaborative Partner" />
        </div>

        <div className="colleague-meta">
          <h3 className="colleague-name">{colleague.name}</h3>
          {colleague.position && <p className="colleague-role">{colleague.position}</p>}
          {colleague.department && <p className="colleague-dept">{colleague.department}</p>}
          {colleague.institute && <p className="colleague-institution">{colleague.institute}</p>}
        </div>
      </div>

      {/* Expanded details container */}
      {isExpanded && (
        <div className="mentoring-card-expanded">
          <div className="mentoring-divider" />

          {/* Connection Timeline / Years */}
          {period && (
            <div className="colleague-period-block">
              <span className="period-label">Connected:</span>
              <span className="period-value">{period}</span>
            </div>
          )}

          {/* Collaborative Projects */}
          {hasProjects && (
            <div className="mentoring-project-body">
              <div className="project-badge-line">
                <span className="project-eyebrow">
                  {colleague.projects!.length > 1 ? 'COLLABORATIVE PROJECTS' : 'COLLABORATIVE PROJECT'}
                </span>
              </div>

              {colleague.projects!.length === 1 ? (
                <h4 className="project-title">{colleague.projects![0]}</h4>
              ) : (
                <ul className="project-multi-list">
                  {colleague.projects!.map((proj, idx) => (
                    <li key={idx} className="project-multi-item">
                      <span className="project-item-num">{idx + 1}.</span>
                      <span>{proj.replace(/^\d+\.\s*/, '')}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Joint Publications */}
          {hasPubs && (
            <div className="joint-outcomes-box">
              <div className="outcomes-header">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
                <span>Joint Publications</span>
              </div>
              <div className="publication-links-list">
                {colleague.publications!.map((link, idx) => (
                  <a
                    key={link}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="publication-link-item"
                  >
                    <span className="pub-link-title">{getPublisherLabel(link, idx)}</span>
                    <span className="pub-link-arrow" aria-hidden="true">↗</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Google Scholar Link */}
          {colleague.googleScholar && (
            <div className="colleague-scholar-wrap">
              <a
                href={colleague.googleScholar}
                target="_blank"
                rel="noopener noreferrer"
                className="colleague-scholar-btn"
                title={`Google Scholar profile of ${colleague.name}`}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 24a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm0-24L0 9.5l4.838 3.94A8 8 0 0 1 12 9a8 8 0 0 1 7.162 4.44L24 9.5z" />
                </svg>
                <span>Google Scholar</span>
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          )}

          {!hasExtraDetails && (
            <p className="no-extra-details-note">
              Active research collaborator. Additional project information and joint outputs will be updated soon.
            </p>
          )}
        </div>
      )}

      {/* Bottom-right expand button: Down arrowhead that expands on hover */}
      <div className="card-expand-btn-wrap">
        <button
          type="button"
          className={`card-expand-btn ${isExpanded ? 'is-expanded' : ''}`}
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          aria-label={isExpanded ? `Collapse details for ${colleague.name}` : `Expand details for ${colleague.name}`}
        >
          <span className="expand-btn-text">
            {isExpanded ? 'Click to collapse' : 'Click to expand'}
          </span>
          <span className="expand-arrow" aria-hidden="true">
            {isExpanded ? (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="18 15 12 9 6 15" />
              </svg>
            ) : (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            )}
          </span>
        </button>
      </div>
    </article>
  )
}

export function MentoringPage({ onBackToHome }: MentoringPageProps) {
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
            Mentoring and collaborative partnerships are at the core of advancing reticular chemistry. Over the years, I have had the privilege to work alongside talented faculty members, research directors, and colleagues across international institutions—collaborating on precision framework synthesis, advanced characterization, and impactful scientific publications.
          </p>
        </div>

        {/* Colleagues & Related Projects Section */}
        <div className="mentoring-colleagues-section">
          <div className="section-heading">
            <p className="eyebrow">Colleagues &amp; Collaborators</p>
            <h2>Research colleagues &amp; collaborative network</h2>
            <p className="colleagues-subheading">
              Select professors, research directors, and scientists I collaborate with across interdisciplinary porous materials and catalysis research.
            </p>
          </div>

          {/* Collaborator Cards Grid (Square Cards with Hover-Expanding Bottom-Right Button) */}
          <div className="mentoring-grid">
            {mentorshipColleagues.map((colleague: MentorshipColleague) => (
              <ColleagueCard key={colleague.id} colleague={colleague} />
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
            Get in touch with Dr. Chowdhury <span>→</span>
          </button>
        </div>
      </div>
    </div>
  )
}
