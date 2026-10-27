import { useEffect, useState, useCallback, useRef } from 'react'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { Navbar } from './components/Navbar'
import { CurrentResearch } from './components/CurrentResearch'
import { AcademicCV } from './components/AcademicCV'
import { ResearchSnapshot } from './components/ResearchSnapshot'
import { Contact } from './components/Contact'
import { GalleryPage } from './components/GalleryPage'
import { MentoringPage } from './components/MentoringPage'
import { AdminPortal } from './components/AdminPortal'
import { CrystalBufferLoader } from './components/CrystalBufferLoader'

export default function App() {
  const [scrolled, setScrolled] = useState(false)
  const [currentPage, setCurrentPage] = useState<'home' | 'gallery' | 'mentoring' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase()
      if (hash === '#admin') return 'admin'
      if (hash === '#gallery') return 'gallery'
      if (hash === '#mentoring' || hash === '#collaborations') return 'mentoring'
    }
    return 'home'
  })

  // Buffer loader states: 5-sec delay on initial home load, and each time for collaborations & gallery
  const [showLoader, setShowLoader] = useState(true)
  const [isLoaderFading, setIsLoaderFading] = useState(false)
  const [loaderTarget, setLoaderTarget] = useState<'home' | 'gallery' | 'mentoring'>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase()
      if (hash === '#gallery') return 'gallery'
      if (hash === '#mentoring' || hash === '#collaborations') return 'mentoring'
    }
    return 'home'
  })

  // Tracks whether home has completed its initial 5-second buffer load
  const hasLoadedHomeOnce = useRef(false)
  const loaderTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Start the 5-second buffer loader
  const start5SecLoader = useCallback((target: 'home' | 'gallery' | 'mentoring', onComplete?: () => void) => {
    if (loaderTimerRef.current) clearTimeout(loaderTimerRef.current)
    if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current)

    setLoaderTarget(target)
    setShowLoader(true)
    setIsLoaderFading(false)

    loaderTimerRef.current = setTimeout(() => {
      setIsLoaderFading(true)
      if (target === 'home') {
        hasLoadedHomeOnce.current = true
      }
      if (onComplete) onComplete()

      fadeTimerRef.current = setTimeout(() => {
        setShowLoader(false)
        setIsLoaderFading(false)
      }, 450)
    }, 5000)
  }, [])

  // Initial load trigger on first site mount
  useEffect(() => {
    const initialHash = window.location.hash.toLowerCase()
    let initialPage: 'home' | 'gallery' | 'mentoring' | 'admin' = 'home'
    if (initialHash === '#admin') initialPage = 'admin'
    else if (initialHash === '#gallery') initialPage = 'gallery'
    else if (initialHash === '#mentoring' || initialHash === '#collaborations') initialPage = 'mentoring'

    if (initialPage !== 'admin') {
      start5SecLoader(initialPage)
    } else {
      setShowLoader(false)
    }

    return () => {
      if (loaderTimerRef.current) clearTimeout(loaderTimerRef.current)
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current)
    }
  }, [start5SecLoader])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNavigate = useCallback(
    (page: 'home' | 'gallery' | 'mentoring' | 'admin', targetHash?: string) => {
      if (page === 'admin') {
        if (loaderTimerRef.current) clearTimeout(loaderTimerRef.current)
        if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current)
        setShowLoader(false)
        window.location.hash = '#admin'
        setCurrentPage('admin')
        window.scrollTo(0, 0)
        return
      }

      // If already on the page without hash, just scroll to top
      if (page === currentPage && !targetHash) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }

      // Check loader requirement:
      // 1. Collaborations: each time
      // 2. Gallery: each time
      // 3. Home: for the first time only
      const needsLoader =
        page === 'mentoring' ||
        page === 'gallery' ||
        (page === 'home' && !hasLoadedHomeOnce.current)

      if (needsLoader) {
        // Pre-render destination in background beneath loader
        setCurrentPage(page)
        if (page === 'gallery') {
          window.location.hash = '#gallery'
        } else if (page === 'mentoring') {
          window.location.hash = '#collaborations'
        } else if (page === 'home') {
          window.location.hash = targetHash || '#top'
        }
        window.scrollTo(0, 0)

        start5SecLoader(page, () => {
          if (targetHash && page === 'home') {
            const el = document.querySelector(targetHash)
            if (el) el.scrollIntoView({ behavior: 'smooth' })
          }
        })
      } else {
        // Instant navigation for Home after first load
        setCurrentPage(page)
        if (page === 'home') {
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
      }
    },
    [currentPage, start5SecLoader]
  )

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase()
      let newPage: 'home' | 'gallery' | 'mentoring' | 'admin' = 'home'
      let targetAnchor: string | undefined = undefined

      if (hash === '#admin') {
        newPage = 'admin'
      } else if (hash === '#gallery') {
        newPage = 'gallery'
      } else if (hash === '#mentoring' || hash === '#collaborations') {
        newPage = 'mentoring'
      } else {
        newPage = 'home'
        if (hash && hash !== '#top') {
          targetAnchor = hash
        }
      }

      if (newPage !== currentPage) {
        handleNavigate(newPage, targetAnchor)
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [currentPage, handleNavigate])

  return (
    <div className="site-shell">
      {/* Rotating 3D Crystal Buffer Loader with 5-Second Delay */}
      {showLoader && (
        <CrystalBufferLoader
          target={loaderTarget}
          isFadingOut={isLoaderFading}
        />
      )}

      {currentPage !== 'admin' && (
        <Navbar
          compact={scrolled}
          currentPage={currentPage}
          onNavigate={handleNavigate}
        />
      )}
      <main>
        {currentPage === 'admin' ? (
          <AdminPortal onBackToSite={() => handleNavigate('home', '#top')} />
        ) : currentPage === 'gallery' ? (
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
      {currentPage !== 'admin' && <Footer />}
    </div>
  )
}
