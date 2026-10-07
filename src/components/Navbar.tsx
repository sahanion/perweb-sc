import { useState } from 'react'
import { researcher } from '../data/researcher'

const links = [
  { label: 'Research', href: '#research' },
  { label: 'CV', href: '#cv' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Contact', href: '#contact' },
]

type NavbarProps = {
  compact: boolean
  currentPage?: 'home' | 'gallery'
  onNavigate?: (page: 'home' | 'gallery', targetHash?: string) => void
}

export function Navbar({ compact, currentPage = 'home', onNavigate }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const closeMenu = () => setIsOpen(false)

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, link: typeof links[0]) => {
    closeMenu()
    if (link.href === '#gallery') {
      e.preventDefault()
      if (onNavigate) {
        onNavigate('gallery')
      } else {
        window.location.hash = '#gallery'
      }
    } else if (currentPage === 'gallery') {
      e.preventDefault()
      if (onNavigate) {
        onNavigate('home', link.href)
      } else {
        window.location.hash = link.href
      }
    }
  }

  const handleBrandClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    closeMenu()
    if (currentPage === 'gallery') {
      e.preventDefault()
      if (onNavigate) {
        onNavigate('home', '#top')
      } else {
        window.location.hash = '#top'
      }
    }
  }

  return (
    <header className={`nav-wrap ${compact ? 'is-compact' : ''}`}>
      <nav className="navbar container" aria-label="Main navigation">
        <a className="brand" href="#top" onClick={handleBrandClick} aria-label={`${researcher.shortName} home`}>
          <span className="brand-mark">SC</span>
          <span className="brand-name">{researcher.shortName}</span>
        </a>
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={isOpen}
          aria-controls="site-menu"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="sr-only">Toggle menu</span>
          <span /> <span />
        </button>
        <div className={`nav-links ${isOpen ? 'is-open' : ''}`} id="site-menu">
          {links.map((link) => {
            const isActive = link.href === '#gallery' && currentPage === 'gallery'
            return (
              <a
                href={link.href}
                key={link.label}
                className={isActive ? 'is-active-nav' : ''}
                onClick={(e) => handleLinkClick(e, link)}
              >
                {link.label}
              </a>
            )
          })}
        </div>
      </nav>
    </header>
  )
}
