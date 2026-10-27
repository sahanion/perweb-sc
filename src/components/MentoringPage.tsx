import { useState } from 'react'
import {
  mentorshipColleagues,
  mentoringPillars,
  MentorshipColleague,
  MentoringPillar,
} from '../data/mentoring'

interface MentoringPageProps {
  onBackToHome: (target?: string) => void
}

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'

function formatPeriod(from?: string, till?: string): string {
  if (!from && !till) return ''
  const tillLower = till?.toLowerCase()
  if (from && (!till || tillLower === 'ongoing')) return `${from} – Ongoing`
  if (from && tillLower === 'lifetime') return `${from} – Lifetime`
  if (from && till) return `${from} – ${till}`
  return from || till || ''
}

function getPublisherLabel(url: string, index: number): string {
  try {
    const parsed = new URL(url)
    const host = parsed.hostname.toLowerCase()
    if (host.includes('sciencedirect')) return 'ScienceDirect Article'
    if (host.includes('acs.org')) return 'ACS Publications Article'
    if (host.includes('rsc.org')) return 'RSC Publishing Article'
    if (host.includes('wiley')) return 'Wiley Online Library'
    if (host.includes('nature')) return 'Nature Research'
    if (host.includes('springer')) return 'Springer Link'
    return `Publication #${index + 1}`
  } catch {
    return `Publication #${index + 1}`
  }
}

/**
 * Rectangular 3D Flip Collaborator Card
 * - Front: Big portrait photo occupying at least half the length of the card,
 *          Name, Position, Department, Affiliation, Connection timeline badge,
 *          and bottom bar with publication/project count & 3-dots button
 * - Back: Full connection details, all collaborative projects, clickable publication
 *         links, Google Scholar link, and back button
 */
function ColleagueCard({ colleague }: { colleague: MentorshipColleague }) {
  const [isFlipped, setIsFlipped] = useState(false)
  const period = formatPeriod(colleague.yearFrom, colleague.yearTill)
  const hasProjects = Boolean(colleague.projects && colleague.projects.length > 0)
  const hasPubs = Boolean(colleague.publications && colleague.publications.length > 0)
  const hasExtraDetails = Boolean(period || hasProjects || hasPubs || colleague.googleScholar)

  return (
    <div className={`mentoring-card-wrapper ${isFlipped ? 'is-flipped' : ''}`}>
      <div className="mentoring-card-inner">
        {/* ================= FRONT FACE ================= */}
        <div className="mentoring-card-front">
          {/* Big Profile Photo: At least half length of card */}
          <div className="colleague-photo-wrap-large">
            <img
              src={colleague.photo || DEFAULT_AVATAR}
              alt={colleague.name}
              className="colleague-photo-large"
              onError={(e) => {
                const target = e.currentTarget
                target.src = DEFAULT_AVATAR
              }}
            />
            <span className="colleague-status-indicator-large" title="Active Collaborator" />
          </div>

          {/* Primary Profile Details: Name, Position, Department, Institution */}
          <div className="colleague-front-meta">
            <h3 className="colleague-name">{colleague.name}</h3>
            {colleague.position && <p className="colleague-role">{colleague.position}</p>}
            {colleague.department && <p className="colleague-dept">{colleague.department}</p>}
            {colleague.institute && <p className="colleague-institution">{colleague.institute}</p>}
          </div>

          {/* Connection Period Badge */}
          {period ? (
            <div className="colleague-front-period" title={`Connected: ${period}`}>
              <span className="period-dot" aria-hidden="true" />
              <span>{period}</span>
            </div>
          ) : (
            <div className="colleague-front-period is-network" title="Collaborative Network">
              <span className="period-dot" aria-hidden="true" />
              <span>Research Partner</span>
            </div>
          )}

          {/* Bottom Bar: Stats Pill (left) + 3-Dots Button (right) */}
          <div className="card-front-bottom-bar">
            {hasPubs ? (
              <span className="front-meta-pill" title={`${colleague.publications!.length} joint publications`}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
                <span>{colleague.publications!.length} {colleague.publications!.length === 1 ? 'Publication' : 'Publications'}</span>
              </span>
            ) : hasProjects ? (
              <span className="front-meta-pill" title={`${colleague.projects!.length} collaborative projects`}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                <span>{colleague.projects!.length} {colleague.projects!.length === 1 ? 'Project' : 'Projects'}</span>
              </span>
            ) : (
              <span className="front-meta-pill is-subtle">
                <span>Active Partner</span>
              </span>
            )}

            {/* Right arrowhead button: expands on hover, flips on click */}
            <button
              type="button"
              className="card-dots-btn"
              onClick={() => setIsFlipped(true)}
              aria-label={`More details about ${colleague.name}`}
            >
              <span className="dots-btn-text">More details</span>
              <span className="dots-icon" aria-hidden="true">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </span>
            </button>
          </div>
        </div>

        {/* ================= BACK FACE ================= */}
        <div className="mentoring-card-back">
          {/* Back Header */}
          <div className="card-back-header">
            <div className="back-header-meta">
              <span className="back-eyebrow">COLLABORATOR</span>
              <h4 className="back-colleague-name">{colleague.name}</h4>
            </div>
            {period && (
              <div className="back-period-pill" title="Connection Period">
                <span>{period}</span>
              </div>
            )}
          </div>

          {/* Scrollable Details Area */}
          <div className="card-back-scrollable">
            {/* Collaborative Projects */}
            {hasProjects && (
              <div className="mentoring-project-body">
                <div className="project-badge-line">
                  <span className="project-eyebrow">
                    {colleague.projects!.length > 1 ? 'COLLABORATIVE PROJECTS' : 'COLLABORATIVE PROJECT'}
                  </span>
                </div>

                {colleague.projects!.length === 1 ? (
                  <h5 className="project-title">{colleague.projects![0]}</h5>
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
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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

          {/* Flip Back Button at bottom-right */}
          <div className="card-expand-btn-wrap">
            <button
              type="button"
              className="card-dots-btn is-back-btn"
              onClick={() => setIsFlipped(false)}
              aria-label={`Back to profile of ${colleague.name}`}
            >
              <span className="dots-btn-text">Back</span>
              <span className="dots-icon" aria-hidden="true">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function MentoringPage({ onBackToHome }: MentoringPageProps) {
  return (
    <div className="mentoring-page">
      <div className="container">
        {/* Navigation & Header */}
        <div className="mentoring-header-nav reveal">
          <button
            type="button"
            className="mentoring-back-btn"
            onClick={() => onBackToHome('#top')}
          >
            <span aria-hidden="true">←</span> Back to Portfolio
          </button>
        </div>

        {/* Hero Section */}
        <div className="mentoring-hero reveal reveal-delay-1">
          <p className="eyebrow">RESEARCH NETWORK & MENTORSHIP</p>
          <h1 className="mentoring-title">
            Collaborations &<br /><em>Academic Mentorship</em>
          </h1>
          <p className="mentoring-subtitle">
            Advancing reticular chemistry, functional frameworks, and solar conversion through
            rigorous international partnerships, multidisciplinary scholarship, and dedicated researcher guidance.
          </p>
        </div>

        {/* Mentorship Pillars */}
        <section className="mentoring-pillars-section reveal reveal-delay-2" aria-labelledby="mentoring-pillars-heading">
          <div className="section-header-compact">
            <span className="section-label">CORE METHODOLOGY</span>
            <h2 id="mentoring-pillars-heading" className="section-subheading">
              Pillars of Collaborative Excellence
            </h2>
          </div>

          <div className="mentoring-pillars-grid">
            {mentoringPillars.map((pillar: MentoringPillar) => (
              <div key={pillar.title} className="mentoring-pillar-card">
                <div className="pillar-icon-box">
                  {pillar.iconType === 'flask' && (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M10 2v7.31L4.36 20.3A2 2 0 0 0 6.1 23h11.8a2 2 0 0 0 1.74-2.7L14 9.31V2" />
                      <line x1="8.5" y1="2" x2="15.5" y2="2" />
                      <line x1="14" y1="9" x2="10" y2="9" />
                    </svg>
                  )}
                  {pillar.iconType === 'microscope' && (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M6 18h8" />
                      <path d="M3 22h18" />
                      <path d="M14 22a7 7 0 1 0-14 0" />
                      <path d="M9 14h2" />
                      <path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" />
                      <path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" />
                    </svg>
                  )}
                  {pillar.iconType === 'book' && (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    </svg>
                  )}
                </div>
                <span className="pillar-badge">{pillar.subtitle}</span>
                <h3 className="pillar-title">{pillar.title}</h3>
                <p className="pillar-desc">{pillar.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Collaborators & Mentorship Grid */}
        <section className="mentoring-colleagues-section reveal reveal-delay-3" aria-labelledby="colleagues-heading">
          <div className="section-header-compact">
            <span className="section-label">GLOBAL SCIENTIFIC ALLIANCES</span>
            <h2 id="colleagues-heading" className="section-subheading">
              Collaborators & Research Partners
            </h2>
            <p className="section-intro-text">
              Key faculty, senior research directors, and postdoctoral fellows partnered across international research centers on reticular framework design, clean solar fuels, and molecular materials.
            </p>
          </div>

          {/* Collaborator Cards Grid (Rectangular cards with 3D flip) */}
          <div className="mentoring-grid">
            {mentorshipColleagues.map((colleague: MentorshipColleague) => (
              <ColleagueCard key={colleague.id} colleague={colleague} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
