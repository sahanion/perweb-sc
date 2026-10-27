import { useState, useEffect } from 'react'
import { GalleryPost } from '../data/gallery'
import { CrystalThrobber } from './CrystalThrobber'

interface GalleryPostFormProps {
  initialPost?: GalleryPost | null
  onSave: (post: GalleryPost, isEdit: boolean) => Promise<{ success: boolean; error?: string }>
  onCancel?: () => void
  onSuccess?: () => void
}

const DEFAULT_SAMPLE_PHOTO = 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=1200&q=80'

export function GalleryPostForm({ initialPost, onSave, onCancel, onSuccess }: GalleryPostFormProps) {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [location, setLocation] = useState('')
  const [readTime, setReadTime] = useState('3 min read')
  const [description, setDescription] = useState('')

  // 4 Photos and Captions (Photo 1 is mandatory)
  const [photo1, setPhoto1] = useState('')
  const [caption1, setCaption1] = useState('')
  const [photo2, setPhoto2] = useState('')
  const [caption2, setCaption2] = useState('')
  const [photo3, setPhoto3] = useState('')
  const [caption3, setCaption3] = useState('')
  const [photo4, setPhoto4] = useState('')
  const [caption4, setCaption4] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Initialize form with initialPost if editing
  useEffect(() => {
    if (initialPost) {
      setTitle(initialPost.title || '')
      setDate(initialPost.date || '')
      setLocation(initialPost.location || '')
      setReadTime(initialPost.readTime || '3 min read')
      setDescription(initialPost.description || '')
      setPhoto1(initialPost.photo1 || '')
      setCaption1(initialPost.caption1 || '')
      setPhoto2(initialPost.photo2 || '')
      setCaption2(initialPost.caption2 || '')
      setPhoto3(initialPost.photo3 || '')
      setCaption3(initialPost.caption3 || '')
      setPhoto4(initialPost.photo4 || '')
      setCaption4(initialPost.caption4 || '')
    } else {
      // Set default friendly date if creating new
      const now = new Date()
      const formatted = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      setDate(formatted)
      setTitle('')
      setLocation('')
      setDescription('')
      setPhoto1('')
      setCaption1('')
      setPhoto2('')
      setCaption2('')
      setPhoto3('')
      setCaption3('')
      setPhoto4('')
      setCaption4('')
    }
  }, [initialPost])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg(null)

    if (!title.trim()) {
      setErrorMsg('Please enter a post title.')
      return
    }

    if (!photo1.trim()) {
      setErrorMsg('Photo 1 Link is mandatory. Please provide a valid image URL.')
      return
    }

    const id = initialPost?.id || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `post-${Date.now()}`

    const post: GalleryPost = {
      id,
      title: title.trim(),
      description: description.trim(),
      date: date.trim() || undefined,
      location: location.trim() || undefined,
      readTime: readTime.trim() || '3 min read',
      photo1: photo1.trim(),
      caption1: caption1.trim() || undefined,
      photo2: photo2.trim() || undefined,
      caption2: caption2.trim() || undefined,
      photo3: photo3.trim() || undefined,
      caption3: caption3.trim() || undefined,
      photo4: photo4.trim() || undefined,
      caption4: caption4.trim() || undefined,
      orderIndex: initialPost?.orderIndex !== undefined ? initialPost.orderIndex : 0,
      createdAt: initialPost?.createdAt || new Date().toISOString(),
    }

    setIsSubmitting(true)
    const result = await onSave(post, Boolean(initialPost))
    setIsSubmitting(false)

    if (result.success) {
      if (onSuccess) onSuccess()
    } else {
      setErrorMsg(result.error || 'Failed to save gallery post.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="gallery-post-form">
      {errorMsg && <div className="admin-error-box">{errorMsg}</div>}

      {/* Post Title */}
      <div className="form-group">
        <label htmlFor="post-title">
          Post Title <span className="req-star">*</span>
        </label>
        <input
          id="post-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Into the Quiet Hills, A Place Called Ichhe Gaon"
          required
        />
      </div>

      {/* Date & Location Row */}
      <div className="form-row-2">
        <div className="form-group">
          <label htmlFor="post-date">Post Date</label>
          <input
            id="post-date"
            type="text"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="e.g. Jan 29, 2019"
          />
        </div>

        <div className="form-group">
          <label htmlFor="post-location">Location / Region</label>
          <input
            id="post-location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Ichhe Gaon, Kalimpong, West Bengal"
          />
        </div>
      </div>

      {/* 4 Photos & Captions Section */}
      <div className="form-section-divider">
        <span>Photo Gallery & Captions (Up to 4 Photos)</span>
      </div>

      {/* PHOTO 1 (Mandatory) */}
      <div className="photo-entry-box is-mandatory">
        <div className="photo-entry-header">
          <span className="photo-num-badge">PHOTO 1 <span className="req-star">* Mandatory</span></span>
          {photo1 && <span className="preview-indicator">Preview Active</span>}
        </div>
        <div className="photo-input-grid">
          <div className="form-group">
            <label htmlFor="post-photo-1">Photo 1 URL <span className="req-star">*</span></label>
            <input
              id="post-photo-1"
              type="url"
              value={photo1}
              onChange={(e) => setPhoto1(e.target.value)}
              placeholder="https://images.unsplash.com/... or image link"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="post-caption-1">Photo 1 Caption</label>
            <input
              id="post-caption-1"
              type="text"
              value={caption1}
              onChange={(e) => setCaption1(e.target.value)}
              placeholder="e.g. Sunlight filtering through the pine canopies"
            />
          </div>
        </div>
        {photo1 && (
          <div className="photo-preview-strip">
            <img
              src={photo1}
              alt="Photo 1 preview"
              onError={(e) => {
                e.currentTarget.src = DEFAULT_SAMPLE_PHOTO
              }}
            />
            {caption1 && <span className="caption-preview">“{caption1}”</span>}
          </div>
        )}
      </div>

      {/* PHOTO 2 (Optional) */}
      <div className="photo-entry-box">
        <div className="photo-entry-header">
          <span className="photo-num-badge">PHOTO 2 <span className="opt-tag">(Optional)</span></span>
        </div>
        <div className="photo-input-grid">
          <div className="form-group">
            <label htmlFor="post-photo-2">Photo 2 URL</label>
            <input
              id="post-photo-2"
              type="url"
              value={photo2}
              onChange={(e) => setPhoto2(e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div className="form-group">
            <label htmlFor="post-caption-2">Photo 2 Caption</label>
            <input
              id="post-caption-2"
              type="text"
              value={caption2}
              onChange={(e) => setCaption2(e.target.value)}
              placeholder="e.g. Mountain cottages overlooking the valley"
            />
          </div>
        </div>
        {photo2 && (
          <div className="photo-preview-strip">
            <img
              src={photo2}
              alt="Photo 2 preview"
              onError={(e) => {
                e.currentTarget.src = DEFAULT_SAMPLE_PHOTO
              }}
            />
            {caption2 && <span className="caption-preview">“{caption2}”</span>}
          </div>
        )}
      </div>

      {/* PHOTO 3 (Optional) */}
      <div className="photo-entry-box">
        <div className="photo-entry-header">
          <span className="photo-num-badge">PHOTO 3 <span className="opt-tag">(Optional)</span></span>
        </div>
        <div className="photo-input-grid">
          <div className="form-group">
            <label htmlFor="post-photo-3">Photo 3 URL</label>
            <input
              id="post-photo-3"
              type="url"
              value={photo3}
              onChange={(e) => setPhoto3(e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div className="form-group">
            <label htmlFor="post-caption-3">Photo 3 Caption</label>
            <input
              id="post-caption-3"
              type="text"
              value={caption3}
              onChange={(e) => setCaption3(e.target.value)}
              placeholder="e.g. Distant snow-capped Himalayan peaks"
            />
          </div>
        </div>
        {photo3 && (
          <div className="photo-preview-strip">
            <img
              src={photo3}
              alt="Photo 3 preview"
              onError={(e) => {
                e.currentTarget.src = DEFAULT_SAMPLE_PHOTO
              }}
            />
            {caption3 && <span className="caption-preview">“{caption3}”</span>}
          </div>
        )}
      </div>

      {/* PHOTO 4 (Optional) */}
      <div className="photo-entry-box">
        <div className="photo-entry-header">
          <span className="photo-num-badge">PHOTO 4 <span className="opt-tag">(Optional)</span></span>
        </div>
        <div className="photo-input-grid">
          <div className="form-group">
            <label htmlFor="post-photo-4">Photo 4 URL</label>
            <input
              id="post-photo-4"
              type="url"
              value={photo4}
              onChange={(e) => setPhoto4(e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div className="form-group">
            <label htmlFor="post-caption-4">Photo 4 Caption</label>
            <input
              id="post-caption-4"
              type="text"
              value={caption4}
              onChange={(e) => setCaption4(e.target.value)}
              placeholder="e.g. Evening mist descending through the village trails"
            />
          </div>
        </div>
        {photo4 && (
          <div className="photo-preview-strip">
            <img
              src={photo4}
              alt="Photo 4 preview"
              onError={(e) => {
                e.currentTarget.src = DEFAULT_SAMPLE_PHOTO
              }}
            />
            {caption4 && <span className="caption-preview">“{caption4}”</span>}
          </div>
        )}
      </div>

      {/* Post Description */}
      <div className="form-group">
        <label htmlFor="post-desc">
          Post Description & Story <span className="opt-tag">(Markdown or Plain Text)</span>
        </label>
        <textarea
          id="post-desc"
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Share the story, scientific notes, or narrative for this gallery post..."
        />
      </div>

      {/* Form Action Buttons */}
      <div className="form-action-buttons">
        <button
          type="submit"
          className="button button-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <CrystalThrobber size="xs" glow={false} />
              <span>Saving Post…</span>
            </span>
          ) : initialPost ? (
            'Update Gallery Post'
          ) : (
            'Publish Gallery Post'
          )}
        </button>

        {onCancel && (
          <button
            type="button"
            className="button button-quiet"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
