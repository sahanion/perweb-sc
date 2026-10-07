import { useEffect, useState, useCallback } from 'react'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { Navbar } from './components/Navbar'
import { CurrentResearch } from './components/CurrentResearch'
import { AcademicCV } from './components/AcademicCV'
import { ResearchSnapshot } from './components/ResearchSnapshot'
import { Contact } from './components/Contact'
import { GalleryPage } from './components/GalleryPage'
import { MentoringPage } from './components/MentoringPage'

export default function App() {
  const [scrolled, setScrolled] = useState(false)
  const [currentPage, setCurrentPage] = useState<'home' | 'gallery' | 'mentoring'>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase()
      if (hash === '#gallery') return 'gallery'
      if (hash === '#mentoring') return 'mentoring'
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
      } else if (hash === '#mentoring') {
        setCurrentPage('mentoring')
        window.scrollTo(0, 0)
      } else {
        setCurrentPage('home')
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const handleNavigate = useCallback((page: 'home' | 'gallery' | 'mentoring', targetHash?: string) => {
    if (page === 'gallery') {
      window.location.hash = '#gallery'
      setCurrentPage('gallery')
      window.scrollTo(0, 0)
    } else if (page === 'mentoring') {
      window.location.hash = '#mentoring'
      setCurrentPage('mentoring')
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
        ) : currentPage === 'mentoring' ? (
          <MentoringPage onBackToHome={(target) => handleNavigate('home', target || '#top')} />
        ) : (
          <>
            <Hero />
            <ResearchSnapshot />
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
