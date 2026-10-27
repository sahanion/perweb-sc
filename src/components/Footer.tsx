export function Footer() {
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="footer">
      <div className="container footer-inner">
        {/* Left column */}
        <div className="footer-col footer-col-left">
          <p>Sumanta Chowdhury, PhD</p>
          <small>copyright 2026</small>
        </div>

        {/* Mid column: Back to top */}
        <div className="footer-col footer-col-mid">
          <button
            type="button"
            className="footer-back-to-top"
            onClick={scrollToTop}
            aria-label="Scroll back to top of page"
          >
            Back to top <span className="back-to-top-arrow" aria-hidden="true">↑</span>
          </button>
        </div>

        {/* Right column */}
        <div className="footer-col footer-col-right">
          <p>Research Portfolio</p>
          <small>
            CEISAM, University of Nantes, Nantes France
            <a href="#admin" className="admin-discrete-trigger" title="Admin CMS Portal"> · 🔒</a>
          </small>
        </div>
      </div>
    </footer>
  )
}
