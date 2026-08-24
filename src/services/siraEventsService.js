import { supabase } from './supabaseClient.js'
import { siraEvents } from '../data/siraEvents.js'

const DEFAULT_TEACHER_SLUG = import.meta.env.VITE_DEFAULT_TEACHER_SLUG || 'prof-demo'

function resolveTeacherSlugFromLocation() {
  if (typeof window === 'undefined') {
    return DEFAULT_TEACHER_SLUG
  }

  const pathMatch = window.location.pathname.match(/^\/t\/([^/?#]+)/)
  if (pathMatch) {
    return decodeURIComponent(pathMatch[1])
  }

  const params = new URLSearchParams(window.location.search)
  return params.get('teacher') || DEFAULT_TEACHER_SLUG
}

async function getTeacherTimeline(slug = resolveTeacherSlugFromLocation()) {
  const { data: teacher, error } = await supabase
    .from('teachers')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (error || !teacher) {
    throw new Error(`Aucun professeur trouv\u00e9 pour l'identifiant "${slug}".`)
  }

  // Filtrer les événements statiques en fonction des ID autorisés par ce prof
  const allowedIds = new Set(teacher.allowed_chapter_ids || [])
  const allowedEvents = siraEvents.filter(event => allowedIds.has(event.id))

  return {
    teacher: {
      slug: teacher.slug,
      name: teacher.name,
      school: teacher.school,
      grade: teacher.grade,
      accentColor: teacher.accent_color,
      description: teacher.description,
      allowedChapterIds: teacher.allowed_chapter_ids,
      totalChapters: (teacher.allowed_chapter_ids || []).length
    },
    events: allowedEvents
  }
}

export { DEFAULT_TEACHER_SLUG, getTeacherTimeline, resolveTeacherSlugFromLocation }
