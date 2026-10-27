import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js'
import { MentorshipColleague, mentorshipColleagues as defaultColleagues } from '../data/mentoring'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  supabaseAnonKey !== 'your-anon-key-here'
)

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
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

