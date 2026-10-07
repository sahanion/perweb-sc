import { useState } from 'react'
import { contactData } from '../data/researcher'
import profilePhoto from '../assets/profile.jpg'

export function Contact() {
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null)

  const handleCopy = (email: string) => {
    navigator.clipboard.writeText(email)
    setCopiedEmail(email)
    setTimeout(() => {
      setCopiedEmail(null)
    }, 2000)
  }

  return (
    <section className="contact-section section" id="contact" aria-labelledby="contact-heading">
      <div className="container">
        {/* Section Header */}
        <div className="section-heading">
          <p className="eyebrow">04 / Contact & Connect</p>
          <h2 id="contact-heading">Get in touch.</h2>
          <p className="contact-intro">
            Open to academic collaborations, discussions on reticular chemistry, MOFs/COFs, photocatalytic CO₂ reduction, and speaking opportunities.
          </p>
        </div>

        <div className="contact-grid">
          {/* Left Column: Identity, Place & Office Address */}
          <div className="contact-card contact-card-main">
            <div className="contact-profile-header">
              <div className="contact-photo-wrapper">
                <img
                  src={profilePhoto}
                  alt={contactData.name}
                  className="contact-profile-photo"
                  onError={(e) => {
                    // Fallback to web URL if local image cannot be found
                    const target = e.currentTarget
                    if (target.src !== 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80') {
                      target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'
                    }
                  }}
                />
                <span className="contact-photo-status" title="Active Researcher">
                  <span className="contact-photo-status-dot" />
                </span>
              </div>

              <div className="contact-identity-block">
                <span className="contact-badge">Researcher Profile</span>
                <h3 className="contact-name">{contactData.name}</h3>
                <p className="contact-role">{contactData.role}</p>
                <p className="contact-affiliation">{contactData.affiliation}</p>
              </div>
            </div>

            <div className="contact-divider" />

            {/* Place / Location */}
            <div className="contact-info-group">
              <span className="contact-group-label">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Current Location
              </span>
              <p className="contact-location-text">
                <strong>{contactData.place}</strong>
              </p>
            </div>

            {/* Office Address */}
            <div className="contact-info-group">
              <span className="contact-group-label">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
                Office Address
              </span>
              <address className="contact-address">
                <p><strong>{contactData.officeAddress.institution}</strong></p>
                <p>{contactData.officeAddress.faculty}</p>
                <p>{contactData.officeAddress.street}</p>
                <p>{contactData.officeAddress.postalCodeCity}</p>
                <p>{contactData.officeAddress.country}</p>
              </address>
            </div>

            {/* Upcoming Appointment */}
            <div className="contact-upcoming">
              <span className="contact-upcoming-pill">Upcoming MSCA Fellowship (2027–2029)</span>
              <p><strong>{contactData.upcomingAppointment.institution}</strong> · {contactData.upcomingAppointment.location}</p>
              <small>{contactData.upcomingAppointment.project}</small>
            </div>
          </div>

          {/* Right Column: Direct Emails & Hyperlinked Academic Links */}
          <div className="contact-right-column">
            {/* Direct Emails (2 Nos) */}
            <div className="contact-card contact-emails-card">
              <h4 className="contact-card-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                Direct Emails
              </h4>

              <div className="emails-list">
                {contactData.emails.map((item) => (
                  <div key={item.email} className={`email-row ${item.primary ? 'is-primary-email' : ''}`}>
                    <div className="email-meta">
                      <span className="email-type">{item.type}</span>
                      <small className="email-note">{item.note}</small>
                    </div>

                    <div className="email-actions">
                      <a href={`mailto:${item.email}`} className="email-link">
                        {item.email}
                      </a>
                      <button
                        type="button"
                        className="copy-btn"
                        onClick={() => handleCopy(item.email)}
                        aria-label={`Copy ${item.email}`}
                        title="Copy to clipboard"
                      >
                        {copiedEmail === item.email ? (
                          <span className="copy-success">✓ Copied</span>
                        ) : (
                          <span>Copy</span>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hyperlinked Buttons: LinkedIn, Google Scholar, ORCID, X */}
            <div className="contact-card contact-socials-card">
              <h4 className="contact-card-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                Academic & Social Profiles
              </h4>

              <div className="social-buttons-grid">
                {/* LinkedIn */}
                <a
                  href={contactData.socials[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn social-btn-linkedin"
                >
                  <div className="social-btn-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </div>
                  <div className="social-btn-content">
                    <span className="social-btn-name">LinkedIn</span>
                    <span className="social-btn-handle">{contactData.socials[0].handle}</span>
                  </div>
                  <span className="social-btn-arrow" aria-hidden="true">↗</span>
                </a>

                {/* Google Scholar */}
                <a
                  href={contactData.socials[1].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn social-btn-scholar"
                >
                  <div className="social-btn-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 24a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm0-24L0 9.5l4.838 3.94A8 8 0 0 1 12 9a8 8 0 0 1 7.162 4.44L24 9.5z" />
                    </svg>
                  </div>
                  <div className="social-btn-content">
                    <span className="social-btn-name">Google Scholar</span>
                    <span className="social-btn-handle">{contactData.socials[1].handle}</span>
                  </div>
                  <span className="social-btn-arrow" aria-hidden="true">↗</span>
                </a>

                {/* ORCID */}
                <a
                  href={contactData.socials[2].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn social-btn-orcid"
                >
                  <div className="social-btn-icon orcid-icon-wrap">
                    <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
                      <path d="M128,0A128,128,0,1,0,256,128,128,128,0,0,0,128,0ZM86.35,186.29H67.4V73.49H86.35ZM76.87,58.7A12.24,12.24,0,1,1,89.12,46.46,12.24,12.24,0,0,1,76.87,58.7ZM199.19,134.4c0,35.43-22.3,51.89-53.71,51.89H106.66V73.49h39.69C178.65,73.49,199.19,92.51,199.19,134.4Zm-73.58,35.48h22.79c22.56,0,32.48-15.68,32.48-35.48s-10-35.48-32.48-35.48H125.61Z" />
                    </svg>
                  </div>
                  <div className="social-btn-content">
                    <span className="social-btn-name">ORCID</span>
                    <span className="social-btn-handle">{contactData.socials[2].handle}</span>
                  </div>
                  <span className="social-btn-arrow" aria-hidden="true">↗</span>
                </a>

                {/* X (Twitter) */}
                <a
                  href={contactData.socials[3].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn social-btn-x"
                >
                  <div className="social-btn-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </div>
                  <div className="social-btn-content">
                    <span className="social-btn-name">X (Twitter)</span>
                    <span className="social-btn-handle">{contactData.socials[3].handle}</span>
                  </div>
                  <span className="social-btn-arrow" aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

