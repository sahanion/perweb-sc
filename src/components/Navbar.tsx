import { useState, useEffect } from 'react'

type ActiveSection = 'top' | 'research' | 'cv' | 'contact'

const leftLinks: { label: string; href: string; section: ActiveSection }[] = [
  { label: 'Home', href: '#top', section: 'top' },
  { label: 'Research', href: '#research', section: 'research' },
  { label: 'CV', href: '#cv', section: 'cv' },
  { label: 'Contact', href: '#contact', section: 'contact' },
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
  const [activeSection, setActiveSection] = useState<ActiveSection>('top')

  const closeMenu = () => setIsOpen(false)

  // Scrollspy: detect active section when scrolling the main single page
  useEffect(() => {
    if (currentPage !== 'home') return

    const sections = [
      { id: 'top', section: 'top' as const },
      { id: 'research', section: 'research' as const },
      { id: 'current-research', section: 'research' as const },
      { id: 'cv', section: 'cv' as const },
      { id: 'contact', section: 'contact' as const },
    ]

    const handleScroll = () => {
      const scrollPos = window.scrollY
      const windowHeight = window.innerHeight
      const docHeight = document.documentElement.scrollHeight

      // If scrolled near the bottom of the page, highlight Contact
      if (scrollPos + windowHeight >= docHeight - 80) {
        setActiveSection('contact')
        return
      }

      // If near the top, highlight Home
      if (scrollPos < 150) {
        setActiveSection('top')
        return
      }

      // Check section bounding rects against top offset
      const navOffset = 180
      let current: ActiveSection = 'top'

      for (const s of sections) {
        const el = document.getElementById(s.id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= navOffset) {
            current = s.section
          }
        }
      }

      setActiveSection(current)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [currentPage])

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, section?: ActiveSection) => {
    closeMenu()
    if (section && currentPage === 'home') {
      setActiveSection(section)
    }
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
        {/* Left Side Links: Home, Research, CV, Contact with scrollspy active highlight */}
        <div className="nav-links nav-links-left">
          {leftLinks.map((link) => {
            const isActive = currentPage === 'home' && activeSection === link.section
            return (
              <a
                href={link.href}
                key={link.label}
                className={isActive ? 'is-active-nav' : ''}
                onClick={(e) => handleLinkClick(e, link.href, link.section)}
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
              {leftLinks.map((link) => {
                const isActive = currentPage === 'home' && activeSection === link.section
                return (
                  <a
                    href={link.href}
                    key={link.label}
                    className={isActive ? 'is-active-nav' : ''}
                    onClick={(e) => handleLinkClick(e, link.href, link.section)}
                  >
                    {link.label}
                  </a>
                )
              })}
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
