import { useState } from 'react'

const leftLinks = [
  { label: 'Home', href: '#top' },
  { label: 'Research', href: '#research' },
  { label: 'CV', href: '#cv' },
  { label: 'Contact', href: '#contact' },
]

const rightLinks = [
  { label: 'Collaborations', href: '#collaborations' },
  { label: 'Gallery', href: '#gallery' },
]

type NavbarProps = {
  compact: boolean
  currentPage?: 'home' | 'gallery' | 'mentoring'
  onNavigate?: (page: 'home' | 'gallery' | 'mentoring', targetHash?: string) => void
}

export function Navbar({ compact, currentPage = 'home', onNavigate }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const closeMenu = () => setIsOpen(false)

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    closeMenu()
    if (href === '#gallery') {
      e.preventDefault()
      if (onNavigate) {
        onNavigate('gallery')
      } else {
        window.location.hash = '#gallery'
      }
    } else if (href === '#collaborations' || href === '#mentoring') {
      e.preventDefault()
      if (onNavigate) {
        onNavigate('mentoring')
      } else {
        window.location.hash = '#collaborations'
      }
    } else if (currentPage !== 'home') {
      e.preventDefault()
      if (onNavigate) {
        onNavigate('home', href)
      } else {
        window.location.hash = href
      }
    }
  }

  return (
    <header className={`nav-wrap ${compact ? 'is-compact' : ''}`}>
      <nav className="navbar container" aria-label="Main navigation">
        {/* Left Side Links: Home, Research, CV, Contact */}
        <div className="nav-links nav-links-left">
          {leftLinks.map((link) => {
            const isHomeActive = link.href === '#top' && currentPage === 'home'
            return (
              <a
                href={link.href}
                key={link.label}
                className={isHomeActive ? 'is-active-nav' : ''}
                onClick={(e) => handleLinkClick(e, link.href)}
              >
                {link.label}
              </a>
            )
          })}
        </div>

        {/* Right Side Links: Collaborations, Gallery */}
        <div className="nav-links nav-links-right">
          {rightLinks.map((link) => {
            const isActive =
              (link.href === '#gallery' && currentPage === 'gallery') ||
              ((link.href === '#collaborations' || link.href === '#mentoring') && currentPage === 'mentoring')
            return (
              <a
                href={link.href}
                key={link.label}
                className={isActive ? 'is-active-nav' : ''}
                onClick={(e) => handleLinkClick(e, link.href)}
              >
                {link.label}
              </a>
            )
          })}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="sr-only">Toggle navigation menu</span>
          <span /> <span />
        </button>

        {/* Mobile Menu Drawer Overlay */}
        <div className={`nav-mobile-menu ${isOpen ? 'is-open' : ''}`} id="mobile-menu">
          <div className="mobile-menu-inner">
            <div className="mobile-links-section">
              <span className="mobile-section-label">Main Page</span>
              {leftLinks.map((link) => (
                <a
                  href={link.href}
                  key={link.label}
                  className={link.href === '#top' && currentPage === 'home' ? 'is-active-nav' : ''}
                  onClick={(e) => handleLinkClick(e, link.href)}
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="mobile-menu-divider" />

            <div className="mobile-links-section">
              <span className="mobile-section-label">Network & Art</span>
              {rightLinks.map((link) => {
                const isActive =
                  (link.href === '#gallery' && currentPage === 'gallery') ||
                  ((link.href === '#collaborations' || link.href === '#mentoring') && currentPage === 'mentoring')
                return (
                  <a
                    href={link.href}
                    key={link.label}
                    className={isActive ? 'is-active-nav' : ''}
                    onClick={(e) => handleLinkClick(e, link.href)}
                  >
                    {link.label}
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
