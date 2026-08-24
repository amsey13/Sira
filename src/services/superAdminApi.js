import { supabase } from './supabaseClient'

/**
 * Super Admin Auth
 * On utilise une vérification simple via variable d'environnement ou table dédiée.
 */
export async function superAdminLogin(password) {
  const envPassword = import.meta.env.VITE_SUPER_ADMIN_PASSWORD

  // Nettoie les espaces accidentels avant ou après (ex: copier/coller erreur)
  const cleanPassword = password ? password.trim() : ""

  console.log("=== DEBUG SUPER ADMIN LOGIN ===");
  console.log("Mot de passe saisi (nettoyé) :", cleanPassword);
  console.log("Mot de passe attendu dans .env :", envPassword);

  // On accepte 'sira2024!' de façon hardcodée en secours OU le mot de passe de l'environnement
  if (cleanPassword !== 'sira2024!' && cleanPassword !== envPassword) {
    throw new Error('Mot de passe super administrateur incorrect.')
  }

  // Stockage session (disparaît à la fermeture de l'onglet pour plus de sécurité)
  sessionStorage.setItem('sira_superadmin_auth', 'true')
  return true
}

export function superAdminLogout() {
  sessionStorage.removeItem('sira_superadmin_auth')
}

/**
 * Liste tous les professeurs depuis Supabase.
 */
export async function getAllTeachers() {
  const { data, error } = await supabase
    .from('teachers')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Erreur lors de la récupération des profs:", error)
    throw new Error('Impossible de charger la liste des professeurs.')
  }

  return data
}

/**
 * Créer un nouveau professeur dans Supabase
 */
export async function createTeacher(teacherData) {
  // 1. Validation minimale
  if (!teacherData.slug || !teacherData.name || !teacherData.token) {
    throw new Error("L'identifiant, le nom et le mot de passe sont obligatoires.")
  }

  // 2. Vérifier si le slug existe déjà
  const { data: existing } = await supabase
    .from('teachers')
    .select('slug')
    .eq('slug', teacherData.slug)
    .maybeSingle()

  if (existing) {
    throw new Error('Cet identifiant de lien est déjà utilisé par un autre professeur.')
  }

  // 3. Insérer dans la base (sécurisé, ne permet pas de dupliquer la clé primaire si uuid généré)
  const { data, error } = await supabase
    .from('teachers')
    .insert([
      {
        slug: teacherData.slug.toLowerCase().trim(),
        name: teacherData.name.trim(),
        school: teacherData.school?.trim() || '',
        grade: teacherData.grade?.trim() || '',
        token: teacherData.token.trim(), // En prod
        allowed_chapter_ids: [],
      }
    ])
    .select()

  if (error) {
    console.error("Erreur de création prof:", error)
    throw new Error("Erreur de la base de données lors de la création du profil.")
  }

  return data[0]
}

/**
 * Met à jour le mot de passe d'un professeur
 */
export async function resetTeacherPassword(teacherId, newPassword) {
  if (!newPassword) throw new Error("Le mot de passe ne peut pas être vide.")

  const { error } = await supabase
    .from('teachers')
    .update({ token: newPassword.trim() })
    .eq('id', teacherId)

  if (error) {
    throw new Error("Erreur lors de la réinitialisation du mot de passe.")
  }
}

/**
 * Supprime un profil de professeur
 */
export async function deleteTeacher(teacherId) {
  const { error } = await supabase
    .from('teachers')
    .delete()
    .eq('id', teacherId)

  if (error) {
    throw new Error("Impossible de supprimer le profil.")
  }
}
