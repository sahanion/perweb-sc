import { useState, useEffect } from 'react'
import { fetchAllGalleryPosts } from '../lib/supabase'
import { GalleryPost, defaultGalleryPosts } from '../data/gallery'
import { GalleryPostCard } from './GalleryPostCard'
import { CrystalThrobber } from './CrystalThrobber'

type GalleryPageProps = {
  onBackToHome: () => void
}

export function GalleryPage({ onBackToHome }: GalleryPageProps) {
  const [posts, setPosts] = useState<GalleryPost[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load posts on mount
  useEffect(() => {
    loadGalleryPosts()
  }, [])

  async function loadGalleryPosts() {
    setIsLoading(true)
    try {
      const data = await fetchAllGalleryPosts()
      setPosts(data)
    } catch (err) {
      console.error('Failed to load gallery posts:', err)
      setPosts(defaultGalleryPosts)
    } finally {
      setIsLoading(false)
    }
  }

  function handleScrollToStories() {
    const el = document.querySelector('.gallery-posts-stream')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="gallery-page">
      <div className="container">
        {/* Top Header & Breadcrumb Bar */}
        <div className="gallery-top-bar">
          <div className="gallery-breadcrumb">
            <button type="button" className="gallery-back-btn" onClick={onBackToHome}>
              <span aria-hidden="true">←</span> Back to Portfolio
            </button>
            <span className="gallery-breadcrumb-sep">/</span>
            <span>Visual Stories and Chronicles</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="gallery-hero">
          <h1 className="gallery-title">
            Visual Stories and<br />
            <em>Chronicles</em>
          </h1>

          <p className="gallery-intro">
            A curated visual archive dedicated to scientific photography, reticular framework illustrations, cover art designs, and research chronicles. Exploring the intersection of molecular architecture, laboratory breakthroughs, and scientific storytelling.
          </p>

          <div className="gallery-actions">
            <button
              type="button"
              className="button button-primary"
              onClick={handleScrollToStories}
            >
              Explore Stories <span aria-hidden="true">↓</span>
            </button>
            <button type="button" className="button button-quiet" onClick={onBackToHome}>
              Return to Research <span aria-hidden="true">↘</span>
            </button>
          </div>
        </div>

        {/* GALLERY CARDS STREAM (Public Read-Only) */}
        <section className="gallery-posts-stream">
          <div className="stream-header-row">
            <div>
              <p className="stream-eyebrow">POSTS ARCHIVE</p>
              <h3 className="stream-headline">Recent Photo Stories</h3>
            </div>
            <span className="stream-post-count">
              {posts.length} {posts.length === 1 ? 'Story' : 'Stories'} Published
            </span>
          </div>

          {isLoading ? (
            <div className="gallery-loading-box">
              <CrystalThrobber size="lg" label="Loading curated gallery posts..." />
              <p>Loading curated gallery posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="gallery-empty-box">
              <p>No gallery stories published yet.</p>
            </div>
          ) : (
            <div className="gallery-cards-column">
              {posts.map((post) => (
                <GalleryPostCard
                  key={post.id}
                  post={post}
                  isAdmin={false}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
