import { useEffect, useState, useCallback } from 'react'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { Navbar } from './components/Navbar'
import { CurrentResearch } from './components/CurrentResearch'
import { AcademicCV } from './components/AcademicCV'
import { ResearchJourney } from './components/ResearchJourney'
import { ResearchSnapshot } from './components/ResearchSnapshot'
import { Contact } from './components/Contact'
import { GalleryPage } from './components/GalleryPage'

export default function App() {
  const [scrolled, setScrolled] = useState(false)
  const [currentPage, setCurrentPage] = useState<'home' | 'gallery'>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase()
      if (hash === '#gallery') return 'gallery'
    }
    return 'home'
  })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase()
      if (hash === '#gallery') {
        setCurrentPage('gallery')
        window.scrollTo(0, 0)
      } else {
        setCurrentPage('home')
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const handleNavigate = useCallback((page: 'home' | 'gallery', targetHash?: string) => {
    if (page === 'gallery') {
      window.location.hash = '#gallery'
      setCurrentPage('gallery')
      window.scrollTo(0, 0)
    } else {
      setCurrentPage('home')
      if (targetHash) {
        window.location.hash = targetHash
        setTimeout(() => {
          const el = document.querySelector(targetHash)
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' })
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }
        }, 60)
      } else {
        window.location.hash = '#top'
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }, [])

  return (
    <div className="site-shell">
      <Navbar compact={scrolled} currentPage={currentPage} onNavigate={handleNavigate} />
      <main>
        {currentPage === 'gallery' ? (
          <GalleryPage onBackToHome={() => handleNavigate('home', '#top')} />
        ) : (
          <>
            <Hero />
            <ResearchSnapshot />
            <ResearchJourney />
            <CurrentResearch />
            <AcademicCV />
            <Contact />
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}
