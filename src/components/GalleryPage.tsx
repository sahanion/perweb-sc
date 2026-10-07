type GalleryPageProps = {
  onBackToHome: () => void
}

export function GalleryPage({ onBackToHome }: GalleryPageProps) {
  return (
    <div className="gallery-page">
      <div className="container">
        {/* Navigation Breadcrumb */}
        <div className="gallery-breadcrumb">
          <button type="button" className="gallery-back-btn" onClick={onBackToHome}>
            <span aria-hidden="true">←</span> Back to Portfolio
          </button>
          <span className="gallery-breadcrumb-sep">/</span>
          <span>Gallery</span>
        </div>

        {/* Hero Section of Gallery */}
        <div className="gallery-hero">
          <div className="gallery-badge-wrap">
            <span className="gallery-live-pulse" />
            <span className="gallery-badge">Under Curation · Coming Soon</span>
          </div>

          <h1 className="gallery-title">
            Scientific Art &<br />
            <em>Framework Visualizations</em>
          </h1>

          <p className="gallery-intro">
            A dedicated visual archive celebrating the intersection of reticular chemistry, molecular design, and scientific illustration. This gallery is currently being curated and will launch soon.
          </p>

          <div className="gallery-actions">
            <button type="button" className="button button-primary" onClick={onBackToHome}>
              Explore Research <span aria-hidden="true">↘</span>
            </button>
            <a href="#contact" className="button button-quiet" onClick={() => {
              window.location.hash = '#contact'
            }}>
              Contact Dr. Chowdhury <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        {/* Preview of Upcoming Collections */}
        <div className="gallery-preview-section">
          <div className="gallery-preview-header">
            <p className="eyebrow">Upcoming Exhibits</p>
            <h3>What will be featured in this gallery</h3>
          </div>

          <div className="gallery-preview-grid">
            {/* Card 1: Journal Cover Art */}
            <article className="gallery-card">
              <span className="gallery-card-index">01</span>
              <div className="gallery-card-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
              <h4>Journal Cover Art</h4>
              <p>
                Self-designed scientific cover art, including the featured Inside Cover Art in the Royal Society of Chemistry journal <em>Environ. Sci.: Water Res. Technol.</em> (2024) and recent <em>Small</em> journal illustrations.
              </p>
              <div className="gallery-card-tag">RSC & Wiley Cover Art</div>
            </article>

            {/* Card 2: 3D Reticular Frameworks */}
            <article className="gallery-card">
              <span className="gallery-card-index">02</span>
              <div className="gallery-card-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
              </div>
              <h4>3D Framework Architectures</h4>
              <p>
                Interactive 3D ball-and-socket models and crystallographic lattice topologies illustrating covalent organic frameworks (COFs) and metal-organic frameworks (MOFs) with tailored pore apertures.
              </p>
              <div className="gallery-card-tag">Interactive Topology</div>
            </article>

            {/* Card 3: Advanced Microscopy */}
            <article className="gallery-card">
              <span className="gallery-card-index">03</span>
              <div className="gallery-card-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="11" y1="8" x2="11" y2="14" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </div>
              <h4>Electron Microscopy Showcase</h4>
              <p>
                High-resolution Field Emission Scanning Electron Microscopy (FESEM) and Transmission Electron Microscopy (TEM) micrographs depicting nanoscale morphology, aerogels, and electrospun nanofibers.
              </p>
              <div className="gallery-card-tag">FESEM & HRTEM Imaging</div>
            </article>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="gallery-footer-banner">
          <p>
            Interested in scientific illustration or visual collaboration in reticular chemistry?
          </p>
          <a href="mailto:sumanta.chowdhury@univ-nantes.fr" className="gallery-banner-link">
            Get in touch with Dr. Chowdhury <span>→</span>
          </a>
        </div>
      </div>
    </div>
  )
}

