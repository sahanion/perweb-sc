import { useState } from 'react'
import { GalleryPost } from '../data/gallery'

interface GalleryPostCardProps {
  post: GalleryPost
  isAdmin?: boolean
  onEdit?: (post: GalleryPost) => void
  onDelete?: (postId: string) => void
}

export function GalleryPostCard({ post, isAdmin, onEdit, onDelete }: GalleryPostCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  // Collect all valid photo entries with captions
  const photos = [
    { url: post.photo1, caption: post.caption1 },
    post.photo2 ? { url: post.photo2, caption: post.caption2 } : null,
    post.photo3 ? { url: post.photo3, caption: post.caption3 } : null,
    post.photo4 ? { url: post.photo4, caption: post.caption4 } : null,
  ].filter(Boolean) as { url: string; caption?: string }[]

  const photoCount = photos.length

  function openLightbox(index: number) {
    setLightboxIndex(index)
  }

  function closeLightbox() {
    setLightboxIndex(null)
  }

  function prevPhoto() {
    if (lightboxIndex === null) return
    setLightboxIndex((lightboxIndex - 1 + photoCount) % photoCount)
  }

  function nextPhoto() {
    if (lightboxIndex === null) return
    setLightboxIndex((lightboxIndex + 1) % photoCount)
  }

  // Determine collage layout class
  const collageClass =
    photoCount === 1
      ? 'is-single'
      : photoCount === 2
      ? 'is-split-2'
      : photoCount === 3
      ? 'is-split-3'
      : 'is-grid-4'

  return (
    <article className="gallery-post-card">
      {/* Admin Action Bar (if authenticated) */}
      {isAdmin && (
        <div className="gallery-card-admin-bar">
          <span className="admin-status-badge">Story Options</span>
          <div className="admin-btn-group">
            {onEdit && (
              <button
                type="button"
                className="admin-mini-btn is-edit"
                onClick={() => onEdit(post)}
                title="Edit this post"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                </svg>
                Edit
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                className="admin-mini-btn is-delete"
                onClick={() => onDelete(post.id)}
                title="Delete this post"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                Delete
              </button>
            )}
          </div>
        </div>
      )}

      {/* TOP PHOTO COLLAGE BANNER */}
      <div className={`gallery-photo-collage ${collageClass}`}>
        {photoCount === 1 && (
          <div className="collage-slot slot-single" onClick={() => openLightbox(0)}>
            <img src={photos[0].url} alt={photos[0].caption || post.title} loading="lazy" />
            {photos[0].caption && (
              <div className="collage-caption-overlay">
                <span>{photos[0].caption}</span>
              </div>
            )}
          </div>
        )}

        {photoCount === 2 && (
          <>
            <div className="collage-slot slot-half" onClick={() => openLightbox(0)}>
              <img src={photos[0].url} alt={photos[0].caption || post.title} loading="lazy" />
              {photos[0].caption && (
                <div className="collage-caption-overlay">
                  <span>{photos[0].caption}</span>
                </div>
              )}
            </div>
            <div className="collage-slot slot-half" onClick={() => openLightbox(1)}>
              <img src={photos[1].url} alt={photos[1].caption || post.title} loading="lazy" />
              {photos[1].caption && (
                <div className="collage-caption-overlay">
                  <span>{photos[1].caption}</span>
                </div>
              )}
            </div>
          </>
        )}

        {photoCount === 3 && (
          <>
            <div className="collage-slot slot-primary" onClick={() => openLightbox(0)}>
              <img src={photos[0].url} alt={photos[0].caption || post.title} loading="lazy" />
              {photos[0].caption && (
                <div className="collage-caption-overlay">
                  <span>{photos[0].caption}</span>
                </div>
              )}
            </div>
            <div className="collage-slot-stack">
              <div className="collage-slot slot-stacked" onClick={() => openLightbox(1)}>
                <img src={photos[1].url} alt={photos[1].caption || post.title} loading="lazy" />
                {photos[1].caption && (
                  <div className="collage-caption-overlay">
                    <span>{photos[1].caption}</span>
                  </div>
                )}
              </div>
              <div className="collage-slot slot-stacked" onClick={() => openLightbox(2)}>
                <img src={photos[2].url} alt={photos[2].caption || post.title} loading="lazy" />
                {photos[2].caption && (
                  <div className="collage-caption-overlay">
                    <span>{photos[2].caption}</span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {photoCount === 4 && (
          <div className="collage-grid-4">
            {photos.map((p, idx) => (
              <div key={idx} className="collage-slot slot-quad" onClick={() => openLightbox(idx)}>
                <img src={p.url} alt={p.caption || `${post.title} photo ${idx + 1}`} loading="lazy" />
                {p.caption && (
                  <div className="collage-caption-overlay">
                    <span>{p.caption}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CARD BODY CONTENT */}
      <div className="gallery-card-body">
        {/* Meta Row: Date Pill, Location Pin, Photo Count */}
        <div className="gallery-meta-row">
          {post.date && (
            <span className="gallery-date-pill">
              <span className="pill-icon" aria-hidden="true">🗓</span>
              {post.date.toUpperCase()}
            </span>
          )}

          {post.location && (
            <span className="gallery-location-tag">
              <span className="location-icon" aria-hidden="true">📍</span>
              {post.location}
            </span>
          )}

          <span className="gallery-photo-count">
            <span className="camera-icon" aria-hidden="true">📷</span>
            {photoCount} {photoCount === 1 ? 'photo' : 'photos'}
          </span>
        </div>

        {/* Serif Post Title */}
        <h2 className="gallery-post-title">{post.title}</h2>

        {/* Post Description Paragraph */}
        {post.description && (
          <div
            className={`gallery-post-desc ${isExpanded ? 'is-expanded' : ''}`}
            dangerouslySetInnerHTML={{
              __html: post.description.includes('<')
                ? post.description
                : post.description.replace(/\n\n/g, '<br/><br/>')
            }}
          />
        )}

        {/* EXPANDABLE FULL STORY SECTION */}
        {isExpanded && (
          <div className="gallery-full-story-content">
            <div className="story-divider-label">
              <span>Full Photo Story & Captions</span>
            </div>

            <div className="story-photo-roster">
              {photos.map((item, idx) => (
                <figure key={idx} className="story-photo-card" onClick={() => openLightbox(idx)}>
                  <div className="story-img-wrap">
                    <img src={item.url} alt={item.caption || `Photo ${idx + 1}`} loading="lazy" />
                    <span className="story-zoom-hint">Click to enlarge</span>
                  </div>
                  {item.caption && (
                    <figcaption className="story-photo-caption">
                      <span className="caption-number">Photo {idx + 1}:</span> {item.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </div>
        )}

        {/* CARD FOOTER: READ FULL STORY BUTTON & READ TIME */}
        <div className="gallery-card-footer">
          <button
            type="button"
            className="gallery-read-story-btn"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
          >
            {isExpanded ? (
              <>
                COLLAPSE STORY <span aria-hidden="true">↑</span>
              </>
            ) : (
              <>
                READ FULL STORY <span aria-hidden="true">↓</span>
              </>
            )}
          </button>

          <span className="gallery-read-time">{post.readTime || '3 min read'}</span>
        </div>
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {lightboxIndex !== null && (
        <div className="gallery-lightbox-modal" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="lightbox-close-btn"
              onClick={closeLightbox}
              aria-label="Close photo preview"
            >
              ✕
            </button>

            {photoCount > 1 && (
              <button
                type="button"
                className="lightbox-nav-btn is-prev"
                onClick={prevPhoto}
                aria-label="Previous photo"
              >
                ‹
              </button>
            )}

            <div className="lightbox-image-wrap">
              <img
                src={photos[lightboxIndex].url}
                alt={photos[lightboxIndex].caption || post.title}
              />
              <div className="lightbox-footer-info">
                <span className="lightbox-counter">
                  {lightboxIndex + 1} of {photoCount}
                </span>
                {photos[lightboxIndex].caption && (
                  <p className="lightbox-caption">{photos[lightboxIndex].caption}</p>
                )}
              </div>
            </div>

            {photoCount > 1 && (
              <button
                type="button"
                className="lightbox-nav-btn is-next"
                onClick={nextPhoto}
                aria-label="Next photo"
              >
                ›
              </button>
            )}
          </div>
        </div>
      )}
    </article>
  )
}

