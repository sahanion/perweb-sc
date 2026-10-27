import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured, fetchAllGalleryPosts, saveGalleryPost, removeGalleryPost } from '../lib/supabase'
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
  const [adminUser, setAdminUser] = useState<string | null>(null)

  // Form modal/drawer state
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<GalleryPost | null>(null)

  // Supabase Auth Modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authError, setAuthError] = useState<string | null>(null)
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  // Notification message
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Check Supabase session on mount & subscribe to auth changes
  useEffect(() => {
    if (supabase) {
      supabase.auth.getSession().then(({ data }) => {
        setAdminUser(data.session?.user?.email || null)
      })

      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        setAdminUser(session?.user?.email || null)
      })

      return () => {
        authListener.subscription.unsubscribe()
      }
    }
  }, [])

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

  // Handle Admin Login via Supabase
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setAuthError(null)

    if (!supabase || !isSupabaseConfigured) {
      setAuthError('Supabase is not configured. Please check your credentials in .env')
      return
    }

    setIsAuthenticating(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password: authPassword,
      })

      if (error) {
        setAuthError(error.message)
      } else if (data.user) {
        setAdminUser(data.user.email || 'Admin')
        setIsAuthModalOpen(false)
        setAuthEmail('')
        setAuthPassword('')
        setNotification({ type: 'success', text: `Welcome back, ${data.user.email}!` })
        setTimeout(() => setNotification(null), 4000)
      }
    } catch (err: any) {
      setAuthError(err.message || 'Login failed')
    } finally {
      setIsAuthenticating(false)
    }
  }

  // Handle Logout
  async function handleLogout() {
    if (supabase) {
      await supabase.auth.signOut()
    }
    setAdminUser(null)
    setNotification({ type: 'success', text: 'You have been signed out.' })
    setTimeout(() => setNotification(null), 3000)
  }

  // Open Form for Adding New Post
  function handleOpenCreateForm() {
    if (!adminUser) {
      setIsAuthModalOpen(true)
      return
    }
    setEditingPost(null)
    setIsFormOpen(true)
  }

  // Open Form for Editing an Existing Post
  function handleOpenEditForm(post: GalleryPost) {
    if (!adminUser) {
      setIsAuthModalOpen(true)
      return
    }
    setEditingPost(post)
    setIsFormOpen(true)
    window.scrollTo({ top: 300, behavior: 'smooth' })
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
    if (!adminUser) {
      setIsAuthModalOpen(true)
      return
    }

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

          {/* Admin Status & Controls */}
          <div className="gallery-admin-meta">
            {adminUser ? (
              <div className="admin-signed-in-pill">
                <span className="admin-live-dot" />
                <span className="admin-email-text">{adminUser}</span>
                <button
                  type="button"
                  className="gallery-nav-add-btn"
                  onClick={handleOpenCreateForm}
                  title="Add new post"
                >
                  ＋ Add Post
                </button>
                <button
                  type="button"
                  className="gallery-nav-logout-btn"
                  onClick={handleLogout}
                  title="Sign out of Supabase"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="gallery-nav-login-btn"
                onClick={() => setIsAuthModalOpen(true)}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Admin Sign In
              </button>
            )}
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
              {adminUser ? '＋ Add New Story Post' : 'Sign In to Add Post →'}
            </button>
            <button type="button" className="button button-quiet" onClick={onBackToHome}>
              Return to Research <span aria-hidden="true">↘</span>
            </button>
          </div>
        </div>

        {/* INLINE / COLLAPSIBLE POST FORM (Shown when editing or adding) */}
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
                  isAdmin={Boolean(adminUser)}
                  onEdit={handleOpenEditForm}
                  onDelete={handleDeletePost}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* SUPABASE AUTH MODAL */}
      {isAuthModalOpen && (
        <div className="gallery-auth-modal" onClick={() => setIsAuthModalOpen(false)}>
          <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="auth-modal-header">
              <div className="auth-icon-wrap">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h3>Admin Authentication</h3>
              <p>Sign in with your Supabase credentials to publish, edit, or delete gallery stories.</p>
              <button
                type="button"
                className="auth-modal-close"
                onClick={() => setIsAuthModalOpen(false)}
                aria-label="Close authentication modal"
              >
                ✕
              </button>
            </div>

            {authError && <div className="admin-error-box">{authError}</div>}

            <form onSubmit={handleLogin} className="auth-modal-form">
              <div className="form-group">
                <label htmlFor="gallery-auth-email">Admin Email</label>
                <input
                  id="gallery-auth-email"
                  type="email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="forever.saha007@gmail.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="gallery-auth-password">Password</label>
                <input
                  id="gallery-auth-password"
                  type="password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                />
              </div>

              <div className="auth-modal-actions">
                <button
                  type="submit"
                  className="button button-primary auth-submit-btn"
                  disabled={isAuthenticating}
                >
                  {isAuthenticating ? 'Signing in...' : 'Sign In with Supabase →'}
                </button>
                <button
                  type="button"
                  className="auth-cancel-btn"
                  onClick={() => setIsAuthModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
