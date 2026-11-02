/**
 * Utility functions for normalizing, cleaning, and resolving image URLs
 * from various external hosting services (ImgBB, Imgur, Google Drive, Dropbox, Postimages, etc.)
 */
import defaultAvatarImg from '../assets/default-avatar.jpg'

export const DEFAULT_AVATAR: string = defaultAvatarImg

/**
 * Checks whether a photo URL represents an explicit, custom-uploaded profile picture,
 * rather than an empty value, default avatar, or legacy stock Unsplash placeholder.
 */
export function hasCustomPhoto(url: string | null | undefined): boolean {
  if (!url) return false
  const trimmed = url.trim()
  if (!trimmed) return false
  if (trimmed === DEFAULT_AVATAR) return false
  if (trimmed.includes('default-avatar')) return false
  // Filter out legacy unsplash placeholder portraits
  if (trimmed.includes('images.unsplash.com/photo-')) return false
  return true
}

/**
 * Normalizes user-pasted image URLs and embed snippets.
 * Ensures <img src="..."> receives a direct image resource instead of an HTML page.
 *
 * Supported formats:
 * - ImgBB viewer links (https://ibb.co/XXXX or https://ibb.co.com/XXXX) -> converted to direct CDN image (https://i.ibb.co/XXXX/image.jpg)
 * - ImgBB HTML embed snippets (<a href="..."><img src="https://i.ibb.co/..." /></a>) -> extracts src
 * - ImgBB BBCode snippets ([url=...][img]https://i.ibb.co/...[/img][/url]) -> extracts inside [img]
 * - Imgur page links (https://imgur.com/XXXX) -> converted to direct image (https://i.imgur.com/XXXX.jpg)
 * - Google Drive share links -> converted to direct viewable URL
 * - Dropbox share links -> converted to raw=1 direct link
 * - Direct URLs (.jpg, .jpeg, .png, .webp, .svg, .gif, Unsplash, etc.) -> preserved
 */
export function normalizeImageUrl(input: string | null | undefined): string {
  if (!input) return ''
  let url = input.trim()

  if (!url) return ''

  // 1. If user pasted HTML embed snippet: <img ... src="..." ... />
  const htmlMatch = url.match(/<img[^>]+src=["']([^"']+)["']/i)
  if (htmlMatch) {
    url = htmlMatch[1].trim()
  }

  // 2. If user pasted BBCode embed snippet: [img]...[/img]
  const bbMatch = url.match(/\[img\](.*?)\[\/img\]/i)
  if (bbMatch) {
    url = bbMatch[1].trim()
  }

  // Clean any stray quotes, backticks, or trailing punctuation
  url = url.replace(/^["'`]|["'`]$/g, '').trim()

  // 3. ImgBB viewer link detection:
  // Examples:
  //   https://ibb.co/KxtyHZFF
  //   https://ibb.co.com/KxtyHZFF
  //   https://imgbb.com/KxtyHZFF
  // Note: ibb.co/<id> is an HTML webpage, but https://i.ibb.co/<id>/image.jpg is directly served as the image file.
  const ibbViewerMatch = url.match(
    /^https?:\/\/(?:[a-zA-Z0-9-]+\.)?(?:ibb\.co(?:\.com)?|imgbb\.com)\/([a-zA-Z0-9_-]+)\/?$/i
  )
  if (ibbViewerMatch) {
    const id = ibbViewerMatch[1]
    // If not already a direct image path
    if (!id.includes('.') && id.toLowerCase() !== 'upload') {
      return `https://i.ibb.co/${id}/image.jpg`
    }
  }

  // If already an i.ibb.co or i.ibb.co.com URL without an extension or path
  const ibbDirectMatch = url.match(
    /^https?:\/\/i\.ibb\.co(?:\.com)?\/([a-zA-Z0-9_-]+)\/?$/i
  )
  if (ibbDirectMatch) {
    return `https://i.ibb.co/${ibbDirectMatch[1]}/image.jpg`
  }

  // 4. Imgur link detection:
  // Examples:
  //   https://imgur.com/hPlvo4H -> https://i.imgur.com/hPlvo4H.jpg
  //   https://imgur.com/a/hPlvo4H -> https://i.imgur.com/hPlvo4H.jpg
  //   https://i.imgur.com/hPlvo4H.jpeg -> preserves .jpeg
  const imgurMatch = url.match(
    /^https?:\/\/(?:i\.)?imgur\.com\/(?:(?:a|gallery)\/)?([a-zA-Z0-9]{5,8})(?:\.([a-zA-Z0-9]+))?$/i
  )
  if (imgurMatch) {
    const id = imgurMatch[1]
    const ext = imgurMatch[2] || 'jpg'
    return `https://i.imgur.com/${id}.${ext}`
  }

  // 5. Google Drive share links:
  // Example: https://drive.google.com/file/d/1A2B3C.../view?usp=sharing
  const gdriveMatch = url.match(
    /^https?:\/\/drive\.google\.com\/(?:file\/d\/|open\?id=)([a-zA-Z0-9_-]+)/i
  )
  if (gdriveMatch) {
    return `https://lh3.googleusercontent.com/d/${gdriveMatch[1]}`
  }

  // 6. Dropbox share links:
  // Change dl=0 to raw=1
  if (url.includes('dropbox.com')) {
    let clean = url.replace(/[?&]dl=0/, '').replace(/[?&]raw=1/, '')
    return clean.includes('?') ? `${clean}&raw=1` : `${clean}?raw=1`
  }

  // 7. Postimages viewer links:
  // Example: https://postimg.cc/XXXX
  const postimgMatch = url.match(/^https?:\/\/postimg\.cc\/([a-zA-Z0-9_-]+)\/?$/i)
  if (postimgMatch) {
    return `https://i.postimg.cc/${postimgMatch[1]}/image.jpg`
  }

  return url
}
