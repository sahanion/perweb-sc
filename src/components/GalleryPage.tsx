import { useState, useEffect } from 'react'
import { fetchAllGalleryPosts, saveGalleryPost, removeGalleryPost } from '../lib/supabase'
import { GalleryPost, defaultGalleryPosts } from '../data/gallery'
import { GalleryPostCard } from './GalleryPostCard'
import { GalleryPostForm } from './GalleryPostForm'
import { CrystalThrobber } from './CrystalThrobber'

type GalleryPageProps = {
  onBackToHome: () => void
}

export function GalleryPage({ onBackToHome }: GalleryPageProps) {
  const [posts, setPosts] = useState<GalleryPost[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Form modal/drawer state
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<GalleryPost | null>(null)

  // Notification message
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

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

  // Open Form for Adding New Post
  function handleOpenCreateForm() {
    setEditingPost(null)
    setIsFormOpen(true)
    setTimeout(() => {
      const formEl = document.querySelector('.gallery-form-drawer-section')
      if (formEl) {
        formEl.scrollIntoView({ behavior: 'smooth' })
      }
    }, 50)
  }

  // Open Form for Editing an Existing Post
  function handleOpenEditForm(post: GalleryPost) {
    setEditingPost(post)
    setIsFormOpen(true)
    setTimeout(() => {
      const formEl = document.querySelector('.gallery-form-drawer-section')
      if (formEl) {
        formEl.scrollIntoView({ behavior: 'smooth' })
      }
    }, 50)
  }

  // Handle Save Post
  async function handleSavePost(post: GalleryPost, isEdit: boolean) {
    const res = await saveGalleryPost(post, isEdit)
    if (res.success) {
      await loadGalleryPosts()
      setIsFormOpen(false)
      setEditingPost(null)
      setNotification({
        type: 'success',
        text: isEdit ? 'Post updated successfully!' : 'New post published to gallery!',
      })
      setTimeout(() => setNotification(null), 4000)
    }
    return res
  }

  // Handle Delete Post
  async function handleDeletePost(postId: string) {
    const confirmDelete = window.confirm('Are you sure you want to delete this gallery post?')
    if (!confirmDelete) return

    const res = await removeGalleryPost(postId)
    if (res.success) {
      await loadGalleryPosts()
      setNotification({ type: 'success', text: 'Post deleted successfully.' })
      setTimeout(() => setNotification(null), 4000)
    } else {
      setNotification({ type: 'error', text: res.error || 'Failed to delete post.' })
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
            <span>Gallery & Visual Stories</span>
          </div>

          <div className="gallery-top-actions">
            <button
              type="button"
              className="gallery-nav-add-btn"
              onClick={handleOpenCreateForm}
              title="Add new gallery post"
            >
              ＋ Add Story Post
            </button>
          </div>
        </div>

        {/* Global Notification Banner */}
        {notification && (
          <div className={`gallery-notification-banner is-${notification.type}`}>
            <span>{notification.text}</span>
            <button
              type="button"
              onClick={() => setNotification(null)}
              aria-label="Close notification"
            >
              ✕
            </button>
          </div>
        )}

        {/* Hero Section */}
        <div className="gallery-hero">
          <div className="gallery-badge-wrap">
            <span className="gallery-live-pulse" />
            <span className="gallery-badge">Visual Archive · Field Notes & Visual Stories</span>
          </div>

          <h1 className="gallery-title">
            Visual Stories &<br />
            <em>Fieldwork Chronicles</em>
          </h1>

          <p className="gallery-intro">
            A visual repository celebrating quiet mountain escapes, field research travels, and scientific cover designs. Each post features curated photographic records, journal narratives, and candid moments.
          </p>

          <div className="gallery-actions">
            <button
              type="button"
              className="button button-primary"
              onClick={handleOpenCreateForm}
            >
              ＋ Add New Story Post
            </button>
            <button type="button" className="button button-quiet" onClick={onBackToHome}>
              Return to Research <span aria-hidden="true">↘</span>
            </button>
          </div>
        </div>

        {/* INLINE / COLLAPSIBLE POST FORM (Shown when adding or editing) */}
        {isFormOpen && (
          <section className="gallery-form-drawer-section">
            <div className="form-drawer-card">
              <div className="form-drawer-header">
                <div>
                  <span className="form-drawer-tag">
                    {editingPost ? 'Edit Post Mode' : 'Create New Gallery Post'}
                  </span>
                  <h2>{editingPost ? `Edit: ${editingPost.title}` : 'Publish a New Photo Story'}</h2>
                  <p className="form-drawer-sub">
                    Provide post details, title, and up to 4 photos with individual captions. Photo 1 is mandatory.
                  </p>
                </div>
                <button
                  type="button"
                  className="form-drawer-close-btn"
                  onClick={() => {
                    setIsFormOpen(false)
                    setEditingPost(null)
                  }}
                  aria-label="Close form"
                >
                  ✕ Close
                </button>
              </div>

              <GalleryPostForm
                initialPost={editingPost}
                onSave={handleSavePost}
                onCancel={() => {
                  setIsFormOpen(false)
                  setEditingPost(null)
                }}
                onSuccess={() => {
                  setIsFormOpen(false)
                  setEditingPost(null)
                }}
              />
            </div>
          </section>
        )}

        {/* GALLERY CARDS STREAM */}
        <section className="gallery-posts-stream">
          <div className="stream-header-row">
            <div>
              <p className="stream-eyebrow">POSTS ARCHIVE</p>
              <h3 className="stream-headline">Recent Photo Stories</h3>
            </div>
            <div className="stream-right-meta">
              <span className="stream-post-count">
                {posts.length} {posts.length === 1 ? 'Story' : 'Stories'} Published
              </span>
              <button
                type="button"
                className="stream-inline-add-btn"
                onClick={handleOpenCreateForm}
              >
                ＋ New Post
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="gallery-loading-box">
              <CrystalThrobber size="lg" label="Loading curated gallery posts..." />
              <p>Loading curated gallery posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="gallery-empty-box">
              <p>No gallery stories published yet.</p>
              <button
                type="button"
                className="button button-primary"
                onClick={handleOpenCreateForm}
              >
                Add Your First Story ＋
              </button>
            </div>
          ) : (
            <div className="gallery-cards-column">
              {posts.map((post) => (
                <GalleryPostCard
                  key={post.id}
                  post={post}
                  isAdmin={true}
                  onEdit={handleOpenEditForm}
                  onDelete={handleDeletePost}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
