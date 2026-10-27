import { useState, useEffect } from 'react'
import {
  mentorshipColleagues,
  MentorshipColleague,
} from '../data/mentoring'
import { fetchAllCollaborators } from '../lib/supabase'

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
  const [colleagues, setColleagues] = useState<MentorshipColleague[]>(mentorshipColleagues)

  useEffect(() => {
    fetchAllCollaborators().then((data) => {
      if (data && data.length > 0) {
        setColleagues(data)
      }
    })
  }, [])

  return (
    <div className="mentoring-page">
      <div className="container">
        {/* Clean Header */}
        <div className="mentoring-page-header reveal">
          <p className="eyebrow">RESEARCH NETWORK</p>
          <h1 className="mentoring-page-title">Collaborations</h1>
          <p className="mentoring-page-desc">
            International research alliances and academic partnerships advancing reticular frameworks,
            sustainable solar fuels, and molecular materials chemistry across global institutions.
          </p>
        </div>

        {/* Collaborator Cards Grid (Rectangular cards with 3D flip) */}
        <div className="mentoring-grid reveal reveal-delay-1">
          {colleagues.map((colleague: MentorshipColleague) => (
            <ColleagueCard key={colleague.id} colleague={colleague} />
          ))}
        </div>
      </div>
    </div>
  )
}
