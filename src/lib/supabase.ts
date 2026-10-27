import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js'
import { MentorshipColleague, mentorshipColleagues as defaultColleagues } from '../data/mentoring'
import { GalleryPost, defaultGalleryPosts } from '../data/gallery'
export type { GalleryPost }

function sanitizeSupabaseUrl(rawUrl: string): string {
  let url = rawUrl.trim()
  // Remove /rest/v1 or any subpath if the REST endpoint was copied
  url = url.replace(/\/rest\/v1\/?.*$/, '')
  // Strip trailing slashes
  url = url.replace(/\/+$/, '')
  return url
}

const rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim()
const supabaseUrl = sanitizeSupabaseUrl(rawUrl)
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim()

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  supabaseAnonKey !== 'your-anon-key-here'
)

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? ((globalThis as any).__supabaseInstance ||
      ((globalThis as any).__supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)))
  : null

export interface CollaboratorRecord {
  id: string
  name: string
  position?: string | null
  department?: string | null
  institute?: string | null
  year_from: string
  year_till: string
  project_title_1?: string | null
  project_title_2?: string | null
  project_title_3?: string | null
  publication_link_1?: string | null
  publication_link_2?: string | null
  photo?: string | null
  google_scholar?: string | null
  order_index?: number | null
  created_at?: string
  updated_at?: string
}

export function recordToColleague(record: CollaboratorRecord): MentorshipColleague {
  const projects: string[] = []
  if (record.project_title_1?.trim()) projects.push(record.project_title_1.trim())
  if (record.project_title_2?.trim()) projects.push(record.project_title_2.trim())
  if (record.project_title_3?.trim()) projects.push(record.project_title_3.trim())

  const publications: string[] = []
  if (record.publication_link_1?.trim()) publications.push(record.publication_link_1.trim())
  if (record.publication_link_2?.trim()) publications.push(record.publication_link_2.trim())

  return {
    id: record.id,
    name: record.name,
    position: record.position || '',
    department: record.department || '',
    institute: record.institute || '',
    yearFrom: record.year_from,
    yearTill: record.year_till,
    projects,
    publications,
    photo: record.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    googleScholar: record.google_scholar || '',
    orderIndex: typeof record.order_index === 'number' ? record.order_index : 0,
  }
}

export function colleagueToRecord(colleague: MentorshipColleague): Partial<CollaboratorRecord> {
  return {
    id: colleague.id,
    name: colleague.name,
    position: colleague.position || null,
    department: colleague.department || null,
    institute: colleague.institute || null,
    year_from: colleague.yearFrom || '',
    year_till: colleague.yearTill || '',
    project_title_1: colleague.projects?.[0] || null,
    project_title_2: colleague.projects?.[1] || null,
    project_title_3: colleague.projects?.[2] || null,
    publication_link_1: colleague.publications?.[0] || null,
    publication_link_2: colleague.publications?.[1] || null,
    photo: colleague.photo || null,
    google_scholar: colleague.googleScholar || null,
    order_index: typeof colleague.orderIndex === 'number' ? colleague.orderIndex : 0,
  }
}

// Local storage key for offline/demo admin mode when Supabase credentials are pending
const LOCAL_STORAGE_KEY = 'sc_custom_collaborators'

export function getLocalCollaborators(): MentorshipColleague[] {
  if (typeof window === 'undefined') return defaultColleagues
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (err) {
    console.error('Failed to read local collaborators:', err)
  }
  return defaultColleagues
}

export function setLocalCollaborators(list: MentorshipColleague[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list))
  } catch (err) {
    console.error('Failed to save local collaborators:', err)
  }
}

/**
 * Fetch all collaborators (from Supabase if configured, otherwise from localStorage / mock file)
 */
export async function fetchAllCollaborators(): Promise<MentorshipColleague[]> {
  if (!supabase) {
    return getLocalCollaborators()
  }

  try {
    const { data, error } = await supabase
      .from('collaborators')
      .select('*')
      .order('order_index', { ascending: true, nullsFirst: false })

    if (error) {
      console.warn('Supabase fetch error, falling back to local data:', error.message)
      return getLocalCollaborators()
    }

    if (data && data.length > 0) {
      return data.map(recordToColleague)
    }

    // If table is empty, return local data
    return getLocalCollaborators()
  } catch (err) {
    console.error('Error fetching collaborators from Supabase:', err)
    return getLocalCollaborators()
  }
}

/**
 * Reorder collaborators: updates local storage and syncs order_index to Supabase
 */
export async function reorderCollaborators(
  orderedList: MentorshipColleague[]
): Promise<{ success: boolean; error?: string }> {
  // Update orderIndex on each colleague
  const indexedList = orderedList.map((item, idx) => ({
    ...item,
    orderIndex: idx,
  }))

  // Save to local storage for instant reactivity
  setLocalCollaborators(indexedList)

  if (supabase) {
    try {
      // Update each item in Supabase with its new order_index
      const updates = indexedList.map((item, idx) =>
        supabase!
          .from('collaborators')
          .update({
            order_index: idx,
            updated_at: new Date().toISOString(),
          })
          .eq('id', item.id)
      )

      const results = await Promise.all(updates)
      const failed = results.find((r) => r.error)
      if (failed && failed.error) {
        return { success: false, error: failed.error.message }
      }
      return { success: true }
    } catch (err: any) {
      console.error('Error updating order in Supabase:', err)
      return { success: false, error: err.message || 'Database error occurred while reordering' }
    }
  }

  return { success: true }
}

/**
 * Save (insert or update) a collaborator
 */
export async function saveCollaborator(
  colleague: MentorshipColleague,
  isEdit = false
): Promise<{ success: boolean; error?: string }> {
  // If Supabase is connected
  if (supabase) {
    try {
      const record = colleagueToRecord(colleague)
      if (isEdit) {
        const { error } = await supabase
          .from('collaborators')
          .update({
            ...record,
            updated_at: new Date().toISOString(),
          })
          .eq('id', colleague.id)

        if (error) return { success: false, error: error.message }
      } else {
        const { error } = await supabase
          .from('collaborators')
          .insert([record])

        if (error) return { success: false, error: error.message }
      }
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message || 'Database error occurred' }
    }
  }

  // Fallback: Local demo storage
  const current = getLocalCollaborators()
  let updated: MentorshipColleague[]
  if (isEdit) {
    updated = current.map((c) => (c.id === colleague.id ? colleague : c))
  } else {
    updated = [colleague, ...current]
  }
  setLocalCollaborators(updated)
  return { success: true }
}

/**
 * Delete a collaborator
 */
export async function removeCollaborator(id: string): Promise<{ success: boolean; error?: string }> {
  if (supabase) {
    try {
      const { error } = await supabase.from('collaborators').delete().eq('id', id)
      if (error) return { success: false, error: error.message }
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message || 'Database error occurred' }
    }
  }

  // Fallback: Local demo storage
  const current = getLocalCollaborators()
  const updated = current.filter((c) => c.id !== id)
  setLocalCollaborators(updated)
  return { success: true }
}

// ==============================================================================
// GALLERY POSTS MANAGEMENT (CMS & SUPABASE)
// ==============================================================================

export interface GalleryPostRecord {
  id: string
  title: string
  description?: string | null
  post_date?: string | null
  location?: string | null
  read_time?: string | null
  photo_1: string
  caption_1?: string | null
  photo_2?: string | null
  caption_2?: string | null
  photo_3?: string | null
  caption_3?: string | null
  photo_4?: string | null
  caption_4?: string | null
  order_index?: number | null
  created_at?: string
  updated_at?: string
}

export function recordToGalleryPost(record: GalleryPostRecord): GalleryPost {
  return {
    id: record.id,
    title: record.title,
    description: record.description || '',
    date: record.post_date || '',
    location: record.location || '',
    readTime: record.read_time || '3 min read',
    photo1: record.photo_1,
    caption1: record.caption_1 || '',
    photo2: record.photo_2 || '',
    caption2: record.caption_2 || '',
    photo3: record.photo_3 || '',
    caption3: record.caption_3 || '',
    photo4: record.photo_4 || '',
    caption4: record.caption_4 || '',
    orderIndex: typeof record.order_index === 'number' ? record.order_index : 0,
    createdAt: record.created_at,
  }
}

export function galleryPostToRecord(post: GalleryPost): Partial<GalleryPostRecord> {
  return {
    id: post.id,
    title: post.title,
    description: post.description || null,
    post_date: post.date || null,
    location: post.location || null,
    read_time: post.readTime || null,
    photo_1: post.photo1,
    caption_1: post.caption1 || null,
    photo_2: post.photo2 || null,
    caption_2: post.caption2 || null,
    photo_3: post.photo3 || null,
    caption_3: post.caption3 || null,
    photo_4: post.photo4 || null,
    caption_4: post.caption4 || null,
    order_index: typeof post.orderIndex === 'number' ? post.orderIndex : 0,
  }
}

const LOCAL_GALLERY_KEY = 'sc_custom_gallery_posts'

export function getLocalGalleryPosts(): GalleryPost[] {
  if (typeof window === 'undefined') return defaultGalleryPosts
  try {
    const raw = localStorage.getItem(LOCAL_GALLERY_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (err) {
    console.error('Failed to read local gallery posts:', err)
  }
  return defaultGalleryPosts
}

export function setLocalGalleryPosts(list: GalleryPost[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(LOCAL_GALLERY_KEY, JSON.stringify(list))
  } catch (err) {
    console.error('Failed to save local gallery posts:', err)
  }
}

/**
 * Fetch all gallery posts (from Supabase if table exists, otherwise from local storage & seeds)
 */
export async function fetchAllGalleryPosts(): Promise<GalleryPost[]> {
  if (!supabase) {
    return getLocalGalleryPosts()
  }

  try {
    const { data, error } = await supabase
      .from('gallery_posts')
      .select('*')
      .order('order_index', { ascending: true, nullsFirst: false })

    if (error) {
      console.warn('Supabase fetch gallery posts error, using local data:', error.message)
      return getLocalGalleryPosts()
    }

    if (data && data.length > 0) {
      return data.map(recordToGalleryPost)
    }

    return getLocalGalleryPosts()
  } catch (err) {
    console.error('Error fetching gallery posts:', err)
    return getLocalGalleryPosts()
  }
}

/**
 * Save (insert or update) a gallery post
 */
export async function saveGalleryPost(
  post: GalleryPost,
  isEdit = false
): Promise<{ success: boolean; error?: string }> {
  if (supabase) {
    try {
      const record = galleryPostToRecord(post)
      if (isEdit) {
        const { error } = await supabase
          .from('gallery_posts')
          .update({
            ...record,
            updated_at: new Date().toISOString(),
          })
          .eq('id', post.id)

        if (error) {
          console.warn('Supabase update gallery error, saving locally:', error.message)
          const current = getLocalGalleryPosts()
          setLocalGalleryPosts(current.map((p) => (p.id === post.id ? post : p)))
          return { success: true }
        }
      } else {
        const { error } = await supabase
          .from('gallery_posts')
          .insert([record])

        if (error) {
          console.warn('Supabase insert gallery error, saving locally:', error.message)
          const current = getLocalGalleryPosts()
          setLocalGalleryPosts([post, ...current])
          return { success: true }
        }
      }

      const current = getLocalGalleryPosts()
      const updated = isEdit ? current.map((p) => (p.id === post.id ? post : p)) : [post, ...current]
      setLocalGalleryPosts(updated)
      return { success: true }
    } catch (err: any) {
      const current = getLocalGalleryPosts()
      const updated = isEdit ? current.map((p) => (p.id === post.id ? post : p)) : [post, ...current]
      setLocalGalleryPosts(updated)
      return { success: true }
    }
  }

  const current = getLocalGalleryPosts()
  const updated = isEdit ? current.map((p) => (p.id === post.id ? post : p)) : [post, ...current]
  setLocalGalleryPosts(updated)
  return { success: true }
}

/**
 * Delete a gallery post
 */
export async function removeGalleryPost(id: string): Promise<{ success: boolean; error?: string }> {
  if (supabase) {
    try {
      const { error } = await supabase.from('gallery_posts').delete().eq('id', id)
      if (error) {
        console.warn('Supabase delete gallery error:', error.message)
      }
    } catch (err: any) {
      console.warn('Supabase delete gallery error:', err)
    }
  }

  const current = getLocalGalleryPosts()
  const updated = current.filter((p) => p.id !== id)
  setLocalGalleryPosts(updated)
  return { success: true }
}

/**
 * Reorder gallery posts
 */
export async function reorderGalleryPosts(
  orderedList: GalleryPost[]
): Promise<{ success: boolean; error?: string }> {
  const indexedList = orderedList.map((item, idx) => ({
    ...item,
    orderIndex: idx,
  }))

  setLocalGalleryPosts(indexedList)

  if (supabase) {
    try {
      const updates = indexedList.map((item, idx) =>
        supabase!
          .from('gallery_posts')
          .update({
            order_index: idx,
            updated_at: new Date().toISOString(),
          })
          .eq('id', item.id)
      )

      await Promise.all(updates)
      return { success: true }
    } catch (err: any) {
      console.error('Error reordering gallery posts in Supabase:', err)
    }
  }

  return { success: true }
}

