import { supabase } from './supabaseClient.js'
import { siraEvents } from '../data/siraEvents.js'

const BACKOFFICE_TOKEN_KEY = 'backoffice_token'
const BACKOFFICE_TEACHER_KEY = 'backoffice_teacher'

function storeToken(token) {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(BACKOFFICE_TOKEN_KEY, token)
  }
}

function getStoredToken() {
  if (typeof window === 'undefined') return null
  return sessionStorage.getItem(BACKOFFICE_TOKEN_KEY)
}

function clearToken() {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(BACKOFFICE_TOKEN_KEY)
    sessionStorage.removeItem(BACKOFFICE_TEACHER_KEY)
  }
}

function storeTeacher(teacher) {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(BACKOFFICE_TEACHER_KEY, JSON.stringify(teacher))
  }
}

function getStoredTeacher() {
  if (typeof window === 'undefined') return null
  const stored = sessionStorage.getItem(BACKOFFICE_TEACHER_KEY)
  return stored ? JSON.parse(stored) : null
}

async function loginTeacher(slug, token) {
  const cleanSlug = (slug || '').trim()
  const cleanToken = (token || '').trim()

  const { data: teacher, error } = await supabase
    .from('teachers')
    .select('*')
    .eq('slug', cleanSlug)
    .maybeSingle()

  if (error) {
    throw new Error('Erreur base de donn\u00e9es : ' + error.message)
  }

  if (!teacher) {
    throw new Error(`L'identifiant "${cleanSlug}" n'existe pas dans la base de donn\u00e9es. Vérifiez l'orthographe.`)
  }

  if (teacher.token !== cleanToken) {
    throw new Error('Jeton (Token) invalide pour ce profil.')
  }

  const teacherData = {
    id: teacher.id,
    slug: teacher.slug,
    name: teacher.name,
    school: teacher.school,
    grade: teacher.grade,
    accentColor: teacher.accent_color,
    description: teacher.description,
  }

  storeToken(teacher.token)
  storeTeacher(teacherData)

  return {
    teacher: teacherData,
    session: {
      token: teacher.token,
      allowedChapterIds: teacher.allowed_chapter_ids || []
    }
  }
}

async function getBackofficeProfile() {
  const token = getStoredToken()
  if (!token) throw new Error('Pas de token stock\u00e9')

  const { data: teacher, error } = await supabase
    .from('teachers')
    .select('*')
    .eq('token', token)
    .maybeSingle()

  if (error) {
    clearToken()
    throw new Error('Erreur BD lors de la r\u00e9cup\u00e9ration du profil')
  }

  if (!teacher) {
    clearToken()
    throw new Error('Session expir\u00e9e : Profil introuvable')
  }

  const teacherData = {
    id: teacher.id,
    slug: teacher.slug,
    name: teacher.name,
    school: teacher.school,
    grade: teacher.grade,
    accentColor: teacher.accent_color,
    description: teacher.description,
  }

  storeTeacher(teacherData)

  return {
    teacher: teacherData,
    allowedChapterIds: teacher.allowed_chapter_ids || [],
    allChapters: siraEvents.map((e) => ({
      id: e.id,
      titre: e.titre,
      titreCourt: e.titreCourt,
    }))
  }
}

async function updateTeacherChapters(chapterIds) {
  const token = getStoredToken()
  if (!token) throw new Error('Pas de token stock\u00e9')

  const { data: teacher, error: authError } = await supabase
    .from('teachers')
    .select('id, slug, name')
    .eq('token', token)
    .maybeSingle()

  if (authError || !teacher) {
    throw new Error('Token invalide ou introuvable')
  }

  const { error: updateError } = await supabase
    .from('teachers')
    .update({ allowed_chapter_ids: chapterIds })
    .eq('id', teacher.id)

  if (updateError) {
    throw new Error('Erreur de mise \u00e0 jour: ' + updateError.message)
  }

  return {
    teacher: {
      id: teacher.id,
      slug: teacher.slug,
      name: teacher.name,
    },
    allowedChapterIds: chapterIds,
    message: 'Chapitres mis \u00e0 jour avec succ\u00e8s',
  }
}

export {
  clearToken,
  getBackofficeProfile,
  getStoredTeacher,
  getStoredToken,
  loginTeacher,
  storeTeacher,
  storeToken,
  updateTeacherChapters,
}
