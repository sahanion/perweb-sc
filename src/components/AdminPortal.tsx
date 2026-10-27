import { useState, useEffect } from 'react'
import {
  supabase,
  isSupabaseConfigured,
  fetchAllCollaborators,
  saveCollaborator,
  removeCollaborator,
  reorderCollaborators,
  fetchAllGalleryPosts,
  saveGalleryPost,
  removeGalleryPost,
  reorderGalleryPosts,
} from '../lib/supabase'
import { MentorshipColleague, mentorshipColleagues as fallbackColleagues } from '../data/mentoring'
import { GalleryPost, defaultGalleryPosts } from '../data/gallery'
import { GalleryPostForm } from './GalleryPostForm'
import { CrystalThrobber } from './CrystalThrobber'

interface AdminPortalProps {
  onBackToSite: () => void
  onDataUpdated?: () => void
}

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'

// Generate year options from 2000 to 2035
const YEARS = Array.from({ length: 36 }, (_, i) => String(2000 + i)).reverse()

export function AdminPortal({ onBackToSite, onDataUpdated }: AdminPortalProps) {
  // Auth state
  const [sessionUser, setSessionUser] = useState<string | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState<string | null>(null)
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false)

  // Collaborators management state
  const [collaborators, setCollaborators] = useState<MentorshipColleague[]>([])
  const [loadingData, setLoadingData] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null)
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null)
  const [isReordering, setIsReordering] = useState(false)

  // Tab state & Gallery CMS state
  const [activeTab, setActiveTab] = useState<'collaborators' | 'gallery'>('collaborators')
  const [galleryPosts, setGalleryPosts] = useState<GalleryPost[]>([])
  const [loadingGallery, setLoadingGallery] = useState(false)
  const [editingGalleryPost, setEditingGalleryPost] = useState<GalleryPost | null>(null)

  // Form Fields
  const [name, setName] = useState('')
  const [position, setPosition] = useState('')
  const [department, setDepartment] = useState('')
  const [institute, setInstitute] = useState('')
  const [yearFrom, setYearFrom] = useState('2024')
  const [yearTill, setYearTill] = useState('Ongoing')
  const [isCurrent, setIsCurrent] = useState(true)
  const [isLifetime, setIsLifetime] = useState(false)
  const [project1, setProject1] = useState('')
  const [project2, setProject2] = useState('')
  const [project3, setProject3] = useState('')
  const [pub1, setPub1] = useState('')
  const [pub2, setPub2] = useState('')
  const [photo, setPhoto] = useState('')
  const [googleScholar, setGoogleScholar] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  // Check initial auth session
  useEffect(() => {
    async function checkAuth() {
      if (supabase) {
        try {
          const { data } = await supabase.auth.getSession()
          if (data?.session?.user) {
            setSessionUser(data.session.user.email || 'Admin')
          }
        } catch (err) {
          console.error('Auth session error:', err)
        }
      }
      setAuthLoading(false)
    }

    checkAuth()

    if (supabase) {
      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setSessionUser(session.user.email || 'Admin')
        } else {
          setSessionUser(null)
        }
      })
      return () => {
        authListener.subscription.unsubscribe()
      }
    }
  }, [])

  // Load data when logged in
  useEffect(() => {
    if (sessionUser) {
      loadCollaborators()
      loadGalleryPosts()
    }
  }, [sessionUser])

  async function loadGalleryPosts() {
    setLoadingGallery(true)
    try {
      const data = await fetchAllGalleryPosts()
      setGalleryPosts(data)
    } catch (err) {
      console.error(err)
      setGalleryPosts(defaultGalleryPosts)
    } finally {
      setLoadingGallery(false)
    }
  }

  async function handleSaveGalleryPost(post: GalleryPost, isEdit: boolean) {
    const res = await saveGalleryPost(post, isEdit)
    if (res.success) {
      setFeedbackMsg({
        type: 'success',
        text: isEdit ? 'Gallery post updated successfully.' : 'New gallery post published successfully!',
      })
      await loadGalleryPosts()
      setEditingGalleryPost(null)
    } else {
      setFeedbackMsg({
        type: 'error',
        text: res.error || 'Failed to save gallery post.',
      })
    }
    return res
  }

  async function handleDeleteGalleryPost(id: string, title: string) {
    if (!window.confirm(`Are you sure you want to delete post "${title}"?`)) return
    const res = await removeGalleryPost(id)
    if (res.success) {
      setFeedbackMsg({ type: 'success', text: `Deleted "${title}".` })
      await loadGalleryPosts()
      if (editingGalleryPost?.id === id) setEditingGalleryPost(null)
    } else {
      setFeedbackMsg({ type: 'error', text: res.error || 'Failed to delete post.' })
    }
  }

  async function handleMoveGallery(index: number, direction: 'up' | 'down') {
    const targetIdx = direction === 'up' ? index - 1 : index + 1
    if (targetIdx < 0 || targetIdx >= galleryPosts.length) return

    const reordered = [...galleryPosts]
    const [moved] = reordered.splice(index, 1)
    reordered.splice(targetIdx, 0, moved)
    setGalleryPosts(reordered)

    await reorderGalleryPosts(reordered)
    setFeedbackMsg({ type: 'success', text: 'Gallery display order updated.' })
  }

  async function loadCollaborators() {
    setLoadingData(true)
    try {
      const data = await fetchAllCollaborators()
      setCollaborators(data)
    } catch (err) {
      console.error(err)
      setCollaborators(fallbackColleagues)
    } finally {
      setLoadingData(false)
    }
  }

  // Handle Login
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setAuthError(null)

    if (!isSupabaseConfigured || !supabase) {
      setAuthError('Supabase is not configured yet. Please check your .env file.')
      return
    }

    setIsSubmittingAuth(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) {
        setAuthError(error.message)
      } else if (data.user) {
        setSessionUser(data.user.email || 'Admin')
      }
    } catch (err: any) {
      setAuthError(err.message || 'Login failed')
    } finally {
      setIsSubmittingAuth(false)
    }
  }

  // Handle Logout
  async function handleLogout() {
    if (supabase) {
      await supabase.auth.signOut()
    }
    setSessionUser(null)
  }

  // Populate form for editing
  function handleEdit(colleague: MentorshipColleague) {
    setEditingId(colleague.id)
    setName(colleague.name)
    setPosition(colleague.position || '')
    setDepartment(colleague.department || '')
    setInstitute(colleague.institute || '')
    setYearFrom(colleague.yearFrom || '2024')

    const till = colleague.yearTill || ''
    if (till.toLowerCase() === 'ongoing' || till.toLowerCase() === 'current') {
      setIsCurrent(true)
      setIsLifetime(false)
      setYearTill('Ongoing')
    } else if (till.toLowerCase() === 'lifetime') {
      setIsLifetime(true)
      setIsCurrent(false)
      setYearTill('Lifetime')
    } else {
      setIsCurrent(false)
      setIsLifetime(false)
      setYearTill(till || '2025')
    }

    setProject1(colleague.projects?.[0] || '')
    setProject2(colleague.projects?.[1] || '')
    setProject3(colleague.projects?.[2] || '')
    setPub1(colleague.publications?.[0] || '')
    setPub2(colleague.publications?.[1] || '')
    setPhoto(colleague.photo || '')
    setGoogleScholar(colleague.googleScholar || '')

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Reset form
  function resetForm() {
    setEditingId(null)
    setName('')
    setPosition('')
    setDepartment('')
    setInstitute('')
    setYearFrom('2024')
    setYearTill('Ongoing')
    setIsCurrent(true)
    setIsLifetime(false)
    setProject1('')
    setProject2('')
    setProject3('')
    setPub1('')
    setPub2('')
    setPhoto('')
    setGoogleScholar('')
  }

  // Handle Form Save (Insert or Update)
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFeedbackMsg(null)

    if (!name.trim()) {
      setFeedbackMsg({ type: 'error', text: 'Name is a mandatory field.' })
      return
    }

    if (!yearFrom.trim()) {
      setFeedbackMsg({ type: 'error', text: 'Timeline From Year is mandatory.' })
      return
    }

    let resolvedTill = yearTill
    if (isCurrent) resolvedTill = 'Ongoing'
    if (isLifetime) resolvedTill = 'Lifetime'

    if (!resolvedTill.trim()) {
      setFeedbackMsg({ type: 'error', text: 'Timeline Till Year is mandatory.' })
      return
    }

    setIsSaving(true)

    const projects: string[] = []
    if (project1.trim()) projects.push(project1.trim())
    if (project2.trim()) projects.push(project2.trim())
    if (project3.trim()) projects.push(project3.trim())

    const publications: string[] = []
    if (pub1.trim()) publications.push(pub1.trim())
    if (pub2.trim()) publications.push(pub2.trim())

    const id = editingId || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `colleague-${Date.now()}`

    const existingColleague = editingId ? collaborators.find((c) => c.id === editingId) : undefined
    const orderIndex = existingColleague?.orderIndex !== undefined ? existingColleague.orderIndex : 0

    const colleague: MentorshipColleague = {
      id,
      name: name.trim(),
      position: position.trim() || undefined,
      department: department.trim() || undefined,
      institute: institute.trim() || undefined,
      yearFrom: yearFrom.trim(),
      yearTill: resolvedTill.trim(),
      projects,
      publications,
      photo: photo.trim() || DEFAULT_AVATAR,
      googleScholar: googleScholar.trim(),
      orderIndex,
    }

    const res = await saveCollaborator(colleague, Boolean(editingId))

    setIsSaving(false)

    if (res.success) {
      setFeedbackMsg({
        type: 'success',
        text: editingId ? 'Collaborator updated successfully!' : 'New collaborator added successfully!',
      })
      resetForm()
      await loadCollaborators()
      if (onDataUpdated) onDataUpdated()
    } else {
      setFeedbackMsg({
        type: 'error',
        text: res.error || 'Failed to save collaborator.',
      })
    }
  }

  // Handle Delete
  async function handleDelete(id: string, colleagueName: string) {
    if (!window.confirm(`Are you sure you want to remove "${colleagueName}"?`)) {
      return
    }

    const res = await removeCollaborator(id)
    if (res.success) {
      setFeedbackMsg({ type: 'success', text: `Removed "${colleagueName}".` })
      await loadCollaborators()
      if (onDataUpdated) onDataUpdated()
    } else {
      setFeedbackMsg({ type: 'error', text: res.error || 'Failed to delete.' })
    }
  }

  // ================= DRAG & REARRANGE HANDLERS =================
  function handleDragStart(e: React.DragEvent<HTMLDivElement>, index: number) {
    setDraggedIdx(index)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(index))
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>, index: number) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (dragOverIdx !== index) {
      setDragOverIdx(index)
    }
  }

  function handleDragEnd() {
    setDraggedIdx(null)
    setDragOverIdx(null)
  }

  async function handleDrop(e: React.DragEvent<HTMLDivElement>, targetIdx: number) {
    e.preventDefault()
    if (draggedIdx === null || draggedIdx === targetIdx) {
      setDraggedIdx(null)
      setDragOverIdx(null)
      return
    }

    const updated = [...collaborators]
    const [movedItem] = updated.splice(draggedIdx, 1)
    updated.splice(targetIdx, 0, movedItem)

    setCollaborators(updated)
    setDraggedIdx(null)
    setDragOverIdx(null)

    setIsReordering(true)
    const res = await reorderCollaborators(updated)
    setIsReordering(false)

    if (res.success) {
      setFeedbackMsg({
        type: 'success',
        text: `Rearranged: "${movedItem.name}" moved to position #${targetIdx + 1}.`,
      })
      if (onDataUpdated) onDataUpdated()
    } else {
      setFeedbackMsg({
        type: 'error',
        text: res.error || 'Failed to save new card order.',
      })
    }
  }

  // Quick arrow move up
  async function handleMoveUp(index: number, e: React.MouseEvent) {
    e.stopPropagation()
    if (index <= 0 || isReordering) return
    const updated = [...collaborators]
    const temp = updated[index]
    updated[index] = updated[index - 1]
    updated[index - 1] = temp

    setCollaborators(updated)
    setIsReordering(true)
    const res = await reorderCollaborators(updated)
    setIsReordering(false)

    if (res.success) {
      setFeedbackMsg({
        type: 'success',
        text: `Moved "${temp.name}" up to position #${index}.`,
      })
      if (onDataUpdated) onDataUpdated()
    } else {
      setFeedbackMsg({
        type: 'error',
        text: res.error || 'Failed to reorder cards.',
      })
    }
  }

  // Quick arrow move down
  async function handleMoveDown(index: number, e: React.MouseEvent) {
    e.stopPropagation()
    if (index >= collaborators.length - 1 || isReordering) return
    const updated = [...collaborators]
    const temp = updated[index]
    updated[index] = updated[index + 1]
    updated[index + 1] = temp

    setCollaborators(updated)
    setIsReordering(true)
    const res = await reorderCollaborators(updated)
    setIsReordering(false)

    if (res.success) {
      setFeedbackMsg({
        type: 'success',
        text: `Moved "${temp.name}" down to position #${index + 2}.`,
      })
      if (onDataUpdated) onDataUpdated()
    } else {
      setFeedbackMsg({
        type: 'error',
        text: res.error || 'Failed to reorder cards.',
      })
    }
  }

  if (authLoading) {
    return (
      <div className="admin-loading-screen">
        <CrystalThrobber size="lg" label="Loading Admin Portal..." />
      </div>
    )
  }

  // ================= VIEW 1: LOGIN FORM =================
  if (!sessionUser) {
    return (
      <div className="admin-auth-page">
        <div className="admin-auth-card">
          <div className="admin-auth-header">
            <span className="admin-badge">PORTFOLIO CMS</span>
            <h2>Admin Authentication</h2>
            <p>Sign in with your Supabase credentials to manage collaborator profiles and website content.</p>
          </div>

          {!isSupabaseConfigured && (
            <div className="admin-notice-box">
              <strong>Supabase Setup Required:</strong>
              <p>
                Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to your <code>.env</code> file.
              </p>
            </div>
          )}

          {authError && <div className="admin-error-box">{authError}</div>}

          <form onSubmit={handleLogin} className="admin-auth-form">
            <div className="admin-field">
              <label htmlFor="admin-email">Admin Email</label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@univ-nantes.fr"
                required
              />
            </div>

            <div className="admin-field">
              <label htmlFor="admin-password">Password</label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
              />
            </div>

            <div className="admin-actions">
              <button
                type="submit"
                className="button button-primary admin-submit-btn"
                disabled={isSubmittingAuth}
              >
                {isSubmittingAuth ? 'Signing in...' : 'Sign In with Supabase →'}
              </button>

              <button
                type="button"
                className="admin-back-link"
                onClick={onBackToSite}
              >
                ← Return to Website
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // ================= VIEW 2: COLLABORATIONS CMS DASHBOARD =================
  return (
    <div className="admin-dashboard-page">
      {/* Top Navbar */}
      <header className="admin-topbar">
        <div className="container admin-topbar-inner">
          <div className="admin-branding">
            <span className="admin-indicator-dot" />
            <span className="admin-brand-title">Portfolio CMS</span>
            <span className="admin-user-pill">
              {sessionUser}
            </span>
          </div>

          <div className="admin-topbar-actions">
            <button
              type="button"
              className="admin-action-btn"
              onClick={onBackToSite}
            >
              <span>View Live Website</span>
              <span aria-hidden="true">↗</span>
            </button>
            <button
              type="button"
              className="admin-action-btn is-logout"
              onClick={handleLogout}
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="container admin-main-content">
        {/* Navigation Tabs */}
        <div className="admin-nav-tabs">
          <button
            type="button"
            className={`admin-tab ${activeTab === 'collaborators' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('collaborators')}
          >
            <span>Collaborations</span>
            <span className="admin-tab-count">{collaborators.length}</span>
          </button>
          <button
            type="button"
            className={`admin-tab ${activeTab === 'gallery' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            <span>Gallery Stories</span>
            <span className="admin-tab-count">{galleryPosts.length}</span>
          </button>
        </div>

        {/* Feedback Alert */}
        {feedbackMsg && (
          <div className={`admin-feedback-banner ${feedbackMsg.type === 'success' ? 'is-success' : 'is-error'}`}>
            <span>{feedbackMsg.text}</span>
            <button type="button" onClick={() => setFeedbackMsg(null)} aria-label="Close notification">×</button>
          </div>
        )}

        {activeTab === 'collaborators' ? (
        <div className="admin-grid-layout">
          {/* LEFT: EDITABLE COLLABORATOR FORM */}
          <div className="admin-form-panel">
            <div className="panel-header">
              <h3>{editingId ? 'Edit Collaborator Profile' : 'Add New Collaborator'}</h3>
              <p>Fields marked with <span className="req-star">*</span> are mandatory.</p>
            </div>

            <form onSubmit={handleSubmit} className="collaborator-cms-form">
              {/* Full Name */}
              <div className="form-group">
                <label htmlFor="collab-name">
                  Full Name <span className="req-star">*</span>
                </label>
                <input
                  id="collab-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Prof. Prem Felix Siril"
                  required
                />
              </div>

              {/* Position & Department (2-col) */}
              <div className="form-row-2">
                <div className="form-group">
                  <label htmlFor="collab-pos">Position / Academic Rank</label>
                  <input
                    id="collab-pos"
                    type="text"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="e.g. Professor, CNRS Research Director"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="collab-dept">Affiliated Department</label>
                  <input
                    id="collab-dept"
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Département Chimie, School of Chemical Science"
                  />
                </div>
              </div>

              {/* Institute */}
              <div className="form-group">
                <label htmlFor="collab-inst">Institute / University</label>
                <input
                  id="collab-inst"
                  type="text"
                  value={institute}
                  onChange={(e) => setInstitute(e.target.value)}
                  placeholder="e.g. CEISAM, Nantes University"
                />
              </div>

              {/* Timeline with Year Picker & Current Toggle (MANDATORY) */}
              <div className="form-group timeline-field-group">
                <label>
                  Connection Timeline <span className="req-star">*</span>
                </label>
                <div className="timeline-inputs-row">
                  {/* From Year */}
                  <div className="timeline-col">
                    <span className="sub-label">Connected From (Year):</span>
                    <select
                      value={yearFrom}
                      onChange={(e) => setYearFrom(e.target.value)}
                      className="year-dropdown"
                      required
                    >
                      {YEARS.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>

                  {/* Till Year */}
                  <div className="timeline-col">
                    <span className="sub-label">Connected Till:</span>
                    {isCurrent ? (
                      <div className="timeline-status-badge is-current">
                        <span>Current / Ongoing</span>
                      </div>
                    ) : isLifetime ? (
                      <div className="timeline-status-badge is-lifetime">
                        <span>Lifetime Collaboration</span>
                      </div>
                    ) : (
                      <select
                        value={yearTill}
                        onChange={(e) => setYearTill(e.target.value)}
                        className="year-dropdown"
                      >
                        {YEARS.map((y) => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

                {/* Checkbox Options for Ongoing and Lifetime */}
                <div className="timeline-checkboxes">
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={isCurrent}
                      onChange={(e) => {
                        const checked = e.target.checked
                        setIsCurrent(checked)
                        if (checked) {
                          setIsLifetime(false)
                          setYearTill('Ongoing')
                        } else {
                          setYearTill(yearFrom)
                        }
                      }}
                    />
                    <span>Active / Current (Ongoing)</span>
                  </label>

                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={isLifetime}
                      onChange={(e) => {
                        const checked = e.target.checked
                        setIsLifetime(checked)
                        if (checked) {
                          setIsCurrent(false)
                          setYearTill('Lifetime')
                        } else {
                          setYearTill(yearFrom)
                        }
                      }}
                    />
                    <span>Lifetime Partnership</span>
                  </label>
                </div>
              </div>

              {/* Collaborative Projects (1, 2, 3) */}
              <div className="form-section-divider">
                <span>Collaborative Project Titles</span>
              </div>

              <div className="form-group">
                <label htmlFor="collab-p1">Project Title 1</label>
                <input
                  id="collab-p1"
                  type="text"
                  value={project1}
                  onChange={(e) => setProject1(e.target.value)}
                  placeholder="e.g. POWER-CO2 [COF and MOF molecular materials]"
                />
              </div>

              <div className="form-group">
                <label htmlFor="collab-p2">Project Title 2</label>
                <input
                  id="collab-p2"
                  type="text"
                  value={project2}
                  onChange={(e) => setProject2(e.target.value)}
                  placeholder="e.g. Sustainable Green Hydrogen Production from Glycerol"
                />
              </div>

              <div className="form-group">
                <label htmlFor="collab-p3">Project Title 3</label>
                <input
                  id="collab-p3"
                  type="text"
                  value={project3}
                  onChange={(e) => setProject3(e.target.value)}
                  placeholder="e.g. Investigating Structure-Activity Relationships in Reticular Materials"
                />
              </div>

              {/* Joint Publications (1, 2) */}
              <div className="form-section-divider">
                <span>Joint Publications (Links Only)</span>
              </div>

              <div className="form-group">
                <label htmlFor="collab-pub1">Publication Link 1</label>
                <input
                  id="collab-pub1"
                  type="url"
                  value={pub1}
                  onChange={(e) => setPub1(e.target.value)}
                  placeholder="https://pubs.acs.org/doi/10.1021/..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="collab-pub2">Publication Link 2</label>
                <input
                  id="collab-pub2"
                  type="url"
                  value={pub2}
                  onChange={(e) => setPub2(e.target.value)}
                  placeholder="https://www.sciencedirect.com/science/article/..."
                />
              </div>

              {/* Profile Photo & Google Scholar */}
              <div className="form-section-divider">
                <span>Profile Photo & Scholar Link</span>
              </div>

              <div className="form-group">
                <label htmlFor="collab-photo">Profile Picture Link (URL)</label>
                <div className="photo-input-preview-wrap">
                  <input
                    id="collab-photo"
                    type="url"
                    value={photo}
                    onChange={(e) => setPhoto(e.target.value)}
                    placeholder="https://... (direct image link)"
                  />
                  <div className="photo-mini-thumb">
                    <img
                      src={photo || DEFAULT_AVATAR}
                      alt="Thumbnail preview"
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_AVATAR
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="collab-scholar">Google Scholar Profile Link</label>
                <input
                  id="collab-scholar"
                  type="url"
                  value={googleScholar}
                  onChange={(e) => setGoogleScholar(e.target.value)}
                  placeholder="https://scholar.google.com/citations?user=..."
                />
              </div>

              {/* Form Action Buttons */}
              <div className="form-action-buttons">
                <button
                  type="submit"
                  className="button button-primary"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <CrystalThrobber size="xs" glow={false} />
                      <span>Saving Profile…</span>
                    </span>
                  ) : editingId ? (
                    'Update Collaborator Profile'
                  ) : (
                    'Add Collaborator to Network'
                  )}
                </button>

                {editingId && (
                  <button
                    type="button"
                    className="button button-quiet"
                    onClick={resetForm}
                  >
                    Cancel Editing
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* RIGHT: LIVE PREVIEW & EXISTING COLLABORATORS */}
          <div className="admin-roster-panel">
            <div className="panel-header">
              <div className="panel-header-with-badge">
                <h3>Collaborations Roster ({collaborators.length})</h3>
                <span className="reorder-badge" title="Drag cards to rearrange order">
                  ⠿ Drag to Rearrange
                </span>
              </div>
              <p>Drag using the <strong>⠿ grip handle</strong> or click <strong>▲ / ▼</strong> to reorder cards on the live website.</p>
            </div>

            {loadingData ? (
              <div className="roster-loading">
                <CrystalThrobber size="md" label="Loading collaborator roster…" />
              </div>
            ) : (
              <div className="collaborators-roster-list">
                {collaborators.map((c, index) => {
                  const isDragging = draggedIdx === index
                  const isOver = dragOverIdx === index && draggedIdx !== index

                  return (
                    <div
                      key={c.id}
                      className={`roster-item ${editingId === c.id ? 'is-selected' : ''} ${isDragging ? 'is-dragging' : ''} ${isOver ? 'drag-over' : ''}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDrop={(e) => handleDrop(e, index)}
                      onDragEnd={handleDragEnd}
                    >
                      {/* Drag Grip & Quick Arrow Controls */}
                      <div className="roster-drag-column">
                        <div
                          className="roster-drag-handle"
                          title="Click and drag to rearrange card"
                          aria-label={`Drag handle for ${c.name}`}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <circle cx="8" cy="6" r="2.2" />
                            <circle cx="16" cy="6" r="2.2" />
                            <circle cx="8" cy="12" r="2.2" />
                            <circle cx="16" cy="12" r="2.2" />
                            <circle cx="8" cy="18" r="2.2" />
                            <circle cx="16" cy="18" r="2.2" />
                          </svg>
                          <span className="roster-card-index">#{index + 1}</span>
                        </div>

                        <div className="roster-arrow-pair">
                          <button
                            type="button"
                            className="roster-arrow-btn"
                            onClick={(e) => handleMoveUp(index, e)}
                            disabled={index === 0 || isReordering}
                            title="Move card up"
                            aria-label={`Move ${c.name} up`}
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            className="roster-arrow-btn"
                            onClick={(e) => handleMoveDown(index, e)}
                            disabled={index === collaborators.length - 1 || isReordering}
                            title="Move card down"
                            aria-label={`Move ${c.name} down`}
                          >
                            ▼
                          </button>
                        </div>
                      </div>

                      <div className="roster-item-photo">
                        <img
                          src={c.photo || DEFAULT_AVATAR}
                          alt={c.name}
                          onError={(e) => {
                            e.currentTarget.src = DEFAULT_AVATAR
                          }}
                        />
                      </div>

                      <div className="roster-item-info">
                        <div className="roster-item-top">
                          <h4 className="roster-name">{c.name}</h4>
                          <span className="roster-timeline">
                            {c.yearFrom ? `${c.yearFrom} – ${c.yearTill || 'Ongoing'}` : 'Network'}
                          </span>
                        </div>
                        <p className="roster-pos-inst">
                          {c.position || 'Collaborator'} {c.institute ? `· ${c.institute}` : ''}
                        </p>
                        <div className="roster-tags">
                          {c.projects && c.projects.length > 0 && (
                            <span className="roster-tag">{c.projects.length} Project{c.projects.length > 1 ? 's' : ''}</span>
                          )}
                          {c.publications && c.publications.length > 0 && (
                            <span className="roster-tag">{c.publications.length} Pub{c.publications.length > 1 ? 's' : ''}</span>
                          )}
                          {c.googleScholar && (
                            <span className="roster-tag is-scholar">Scholar</span>
                          )}
                        </div>
                      </div>

                      <div className="roster-item-actions">
                        <button
                          type="button"
                          className="roster-btn is-edit"
                          onClick={() => handleEdit(c)}
                          title={`Edit ${c.name}`}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="roster-btn is-delete"
                          onClick={() => handleDelete(c.id, c.name)}
                          title={`Delete ${c.name}`}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
        ) : (
        /* ================= TAB 2: GALLERY CMS ================= */
        <div className="admin-grid-layout">
          {/* LEFT: GALLERY POST FORM */}
          <div className="admin-form-panel">
            <div className="panel-header">
              <h3>{editingGalleryPost ? 'Edit Gallery Post' : 'Add New Gallery Post'}</h3>
              <p>Fields marked with <span className="req-star">*</span> are mandatory (Title & Photo 1 Link).</p>
            </div>

            <GalleryPostForm
              initialPost={editingGalleryPost}
              onSave={handleSaveGalleryPost}
              onCancel={() => setEditingGalleryPost(null)}
              onSuccess={() => setEditingGalleryPost(null)}
            />
          </div>

          {/* RIGHT: GALLERY STORIES ROSTER */}
          <div className="admin-roster-panel">
            <div className="panel-header">
              <div className="panel-header-with-badge">
                <h3>Published Stories ({galleryPosts.length})</h3>
                <span className="reorder-badge">▲ / ▼ Reorder</span>
              </div>
              <p>Use the arrow controls to rearrange stories or edit/delete existing cards.</p>
            </div>

            {loadingGallery ? (
              <div className="roster-loading">
                <CrystalThrobber size="md" label="Loading gallery posts..." />
              </div>
            ) : (
              <div className="collaborators-roster-list">
                {galleryPosts.map((post, index) => {
                  const photoCount = [post.photo1, post.photo2, post.photo3, post.photo4].filter(Boolean).length

                  return (
                    <div
                      key={post.id}
                      className={`roster-item ${editingGalleryPost?.id === post.id ? 'is-selected' : ''}`}
                    >
                      {/* Quick Move Up/Down */}
                      <div className="roster-item-reorder-ctrls">
                        <button
                          type="button"
                          className="reorder-arrow-btn"
                          disabled={index === 0}
                          onClick={() => handleMoveGallery(index, 'up')}
                          title="Move up"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          className="reorder-arrow-btn"
                          disabled={index === galleryPosts.length - 1}
                          onClick={() => handleMoveGallery(index, 'down')}
                          title="Move down"
                        >
                          ▼
                        </button>
                      </div>

                      <div className="roster-item-avatar">
                        <img
                          src={post.photo1 || 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=400&q=80'}
                          alt={post.title}
                        />
                      </div>

                      <div className="roster-item-info">
                        <div className="roster-item-primary">
                          <h4>{post.title}</h4>
                          {post.date && (
                            <span className="roster-years-badge">
                              {post.date}
                            </span>
                          )}
                        </div>
                        <p className="roster-item-meta">
                          {post.location || 'Curated Story'}
                        </p>
                        <div className="roster-tags">
                          <span className="roster-tag">📷 {photoCount} Photo{photoCount > 1 ? 's' : ''}</span>
                          {post.readTime && <span className="roster-tag">{post.readTime}</span>}
                        </div>
                      </div>

                      <div className="roster-item-actions">
                        <button
                          type="button"
                          className="roster-btn is-edit"
                          onClick={() => setEditingGalleryPost(post)}
                          title={`Edit ${post.title}`}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="roster-btn is-delete"
                          onClick={() => handleDeleteGalleryPost(post.id, post.title)}
                          title={`Delete ${post.title}`}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
        )}
      </main>
    </div>
  )
}

