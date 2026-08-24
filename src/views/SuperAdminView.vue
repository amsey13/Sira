<template>
  <div class="admin-dashboard">
    <div class="top-nav">
      <div class="nav-brand">
        <i class="pi pi-shield"></i>
        <span>PANNEAU D'ADMINISTRATION CENTRAL</span>
      </div>
      <Button
        label="Déconnexion"
        icon="pi pi-sign-out"
        class="p-button-danger p-button-outlined"
        @click="handleLogout"
      />
    </div>

    <div class="dashboard-content">
      <div class="card-container">
        <!-- HEADER DE LA LISTE -->
        <div class="list-header">
          <h2>
            <i class="pi pi-users" style="margin-right: 10px; color: #ef4444"></i>
            Liste des Professeurs ({{ teachers.length }})
          </h2>
          <Button
            label="Ajouter un professeur"
            icon="pi pi-plus"
            class="p-button-danger"
            @click="showCreateDialog = true"
          />
        </div>

        <Message v-if="successMsg" severity="success" class="mb-4">{{ successMsg }}</Message>
        <Message v-if="errorMsg" severity="error" class="mb-4">{{ errorMsg }}</Message>

        <div v-if="isLoading" class="loading-state">
           <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" animationDuration=".5s" />
        </div>

        <!-- LISTE DES PROFS -->
        <div v-else-if="teachers.length > 0" class="teacher-grid">
          <div v-for="teacher in teachers" :key="teacher.id" class="teacher-card">
            <div class="card-body">
              <div class="teacher-name">{{ teacher.name }}</div>
              <div class="teacher-detail">
                <i class="pi pi-building"></i> {{ teacher.school || 'Non spécifiée' }}
              </div>
              <div class="teacher-detail">
                <i class="pi pi-book"></i> {{ teacher.grade || 'Non spécifié' }}
              </div>

              <div class="link-box">
                <div class="link-label">Lien vers la classe :</div>
                <div class="link-url">
                  <span>/t/{{ teacher.slug }}</span>
                  <i class="pi pi-copy copy-icon" @click="copyLink(teacher.slug)" title="Copier le lien"></i>
                </div>
              </div>
            </div>

            <div class="card-actions">
               <div class="stats">
                 <span>{{ (teacher.allowed_chapter_ids || []).length }}</span> chap(s)
               </div>
               <Button
                 icon="pi pi-key"
                 class="p-button-rounded p-button-warning p-button-text"
                 title="Changer mot de passe"
                 @click="initPasswordReset(teacher)"
               />
               <Button
                 icon="pi pi-trash"
                 class="p-button-rounded p-button-danger p-button-text"
                 title="Supprimer"
                 @click="initDelete(teacher)"
               />
            </div>
          </div>
        </div>

        <div v-else class="empty-state">
          <i class="pi pi-folder-open empty-icon"></i>
          <h3>Aucun professeur inscrit</h3>
          <p>Créez le premier accès enseignant pour commencer.</p>
        </div>
      </div>
    </div>

    <!-- DIALOG : CRÉATION D'UN PROFESSEUR -->
    <Dialog v-model:visible="showCreateDialog" modal header="Déclarer un nouveau professeur" :style="{ width: '500px' }">
      <div class="p-fluid dialogue-form">
        <div class="field">
          <label for="name">Nom / Nom de plume</label>
          <InputText id="name" v-model="form.name" placeholder="Ex: Mr. Othmane" autofocus />
        </div>
        <div class="field">
          <label for="slug">Identifiant public (URL)</label>
          <InputText id="slug" v-model="form.slug" placeholder="Ex: othmane-2026" />
          <small>Ce texte sera la fin de son lien (ex: frise.com/t/<strong>othmane-2026</strong>). Pas d'espaces ni d'accents.</small>
        </div>
        <div class="field">
          <label for="token">Mot de passe pour se connecter</label>
          <InputText id="token" v-model="form.token" placeholder="Fournir ce mot de passe au professeur" />
        </div>
        <div class="field">
          <label for="school">Mosquée/École/Institut (Optionnel)</label>
          <InputText id="school" v-model="form.school" placeholder="Ex: Institut Al-Ghazali" />
        </div>
        <div class="field">
          <label for="grade">Niveau/Classe (Optionnel)</label>
          <InputText id="grade" v-model="form.grade" placeholder="Ex: Groupe Ados Mercredi" />
        </div>
      </div>
      <template #footer>
        <Button label="Annuler" icon="pi pi-times" class="p-button-text" @click="showCreateDialog = false" />
        <Button label="Créer le profil" icon="pi pi-check" class="p-button-danger" @click="submitCreateTeacher" :loading="isSaving" />
      </template>
    </Dialog>

    <!-- DIALOG : RESET MOT DE PASSE -->
    <Dialog v-model:visible="showResetDialog" modal header="Réinitialiser le mot de passe" :style="{ width: '400px' }">
      <div class="p-fluid dialogue-form">
        <p>Modification de l'accès pour : <strong>{{ selectedTeacher?.name }}</strong></p>
        <div class="field mt-3">
          <label for="newPassword">Nouveau mot de passe</label>
          <InputText id="newPassword" v-model="newPasswordInput" />
        </div>
      </div>
      <template #footer>
        <Button label="Annuler" icon="pi pi-times" class="p-button-text" @click="showResetDialog = false" />
        <Button label="Mettre à jour" icon="pi pi-check" class="p-button-warning" @click="submitResetPassword" :loading="isSaving" />
      </template>
    </Dialog>

    <!-- DIALOG : SUPPRESSION -->
    <Dialog v-model:visible="showDeleteDialog" modal header="Confirmation de suppression" :style="{ width: '400px' }">
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle" style="font-size: 2rem; color: #ef4444; margin-right: 15px"></i>
        <span>Êtes-vous sûr de vouloir supprimer définitivement l'accès du professeur <strong>{{ selectedTeacher?.name }}</strong> ? Les élèves sur ce lien n'auront plus accès !</span>
      </div>
      <template #footer>
        <Button label="Non, conserver" icon="pi pi-times" class="p-button-text" @click="showDeleteDialog = false" />
        <Button label="Oui, supprimer" icon="pi pi-trash" class="p-button-danger" @click="submitDeleteTeacher" :loading="isSaving" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Dialog from 'primevue/dialog'
import Message from 'primevue/message'
import ProgressSpinner from 'primevue/progressspinner'
import { superAdminLogout, getAllTeachers, createTeacher, resetTeacherPassword, deleteTeacher } from '../services/superAdminApi'

const router = useRouter()

const teachers = ref([])
const isLoading = ref(true)
const isSaving = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

// Etats des Modals
const showCreateDialog = ref(false)
const showResetDialog = ref(false)
const showDeleteDialog = ref(false)

const selectedTeacher = ref(null)

// Formulaire nouveau prof
const form = ref({
  name: '',
  slug: '',
  token: '',
  school: '',
  grade: ''
})

const newPasswordInput = ref('')

onMounted(async () => {
  await loadTeachers()
})

const loadTeachers = async () => {
  isLoading.value = true
  errorMsg.value = ''
  try {
    teachers.value = await getAllTeachers()
  } catch (error) {
    errorMsg.value = error.message
  } finally {
    isLoading.value = false
  }
}

// Format slug automatique sur la frappe (pas d'espaces)
const formatSlug = (val) => {
  return val.toLowerCase().replace(/[^a-z0-9-]/g, '-')
}

const submitCreateTeacher = async () => {
  if (!form.value.name || !form.value.slug || !form.value.token) {
    alert("Veuillez remplir le nom, l'identifiant et le mot de passe.")
    return
  }

  isSaving.value = true
  // Force clean slug
  form.value.slug = formatSlug(form.value.slug)

  try {
    await createTeacher(form.value)
    showCreateDialog.value = false
    successMsg.value = "Le profil du professeur a été créé avec succès."
    // reset du form
    form.value = { name: '', slug: '', token: '', school: '', grade: ''}
    await loadTeachers()
  } catch (error) {
    alert(error.message)
  } finally {
    isSaving.value = false
    setTimeout(() => { successMsg.value = '' }, 4000)
  }
}

const initPasswordReset = (teacher) => {
  selectedTeacher.value = teacher
  newPasswordInput.value = ''
  showResetDialog.value = true
}

const submitResetPassword = async () => {
  if (!newPasswordInput.value) return
  isSaving.value = true
  try {
    await resetTeacherPassword(selectedTeacher.value.id, newPasswordInput.value)
    showResetDialog.value = false
    successMsg.value = `Le mot de passe de ${selectedTeacher.value.name} a été mis à jour.`
  } catch (error) {
    alert(error.message)
  } finally {
    isSaving.value = false
    setTimeout(() => { successMsg.value = '' }, 4000)
  }
}

const initDelete = (teacher) => {
  selectedTeacher.value = teacher
  showDeleteDialog.value = true
}

const submitDeleteTeacher = async () => {
  isSaving.value = true
  try {
    await deleteTeacher(selectedTeacher.value.id)
    showDeleteDialog.value = false
    successMsg.value = `Le professeur a été supprimé définitivement.`
    await loadTeachers()
  } catch (error) {
    alert(error.message)
  } finally {
    isSaving.value = false
    setTimeout(() => { successMsg.value = '' }, 4000)
  }
}

const copyLink = (slug) => {
  const url = `${window.location.origin}/t/${slug}`
  navigator.clipboard.writeText(url).then(() => {
    alert('Lien '+url+' copié dans le presse-papier !')
  })
}

const handleLogout = () => {
  superAdminLogout()
  router.push({ name: 'super-admin-login' })
}
</script>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  background-color: #f4f4f5; /* Fond clair pour l'admin != sombre pour le jeu */
  font-family: 'Inter', sans-serif;
  color: #18181b;
}

.top-nav {
  background: #18181b;
  color: #fff;
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.nav-brand {
  font-size: 1.2rem;
  font-weight: bold;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.nav-brand i {
  color: #ef4444;
  font-size: 1.5rem;
}

.dashboard-content {
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.card-container {
  background: #fff;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  border-bottom: 2px solid #f4f4f5;
  padding-bottom: 20px;
}
.list-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #27272a;
}

.loading-state {
  display: flex;
  justify-content: center;
  padding: 50px 0;
}

/* Grille des profs */
.teacher-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}
.teacher-card {
  border: 1px solid #e4e4e7;
  border-radius: 8px;
  background: #fff;
  display: flex;
  flex-direction: column;
  transition: 0.2s;
}
.teacher-card:hover {
  border-color: #ef4444;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.1);
}

.card-body {
  padding: 20px;
  flex: 1;
}
.teacher-name {
  font-size: 1.2rem;
  font-weight: bold;
  color: #18181b;
  margin-bottom: 10px;
}
.teacher-detail {
  color: #52525b;
  font-size: 0.9rem;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.link-box {
  background: #f4f4f5;
  border-radius: 6px;
  padding: 10px;
  margin-top: 15px;
}
.link-label {
  font-size: 0.75rem;
  color: #71717a;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 4px;
}
.link-url {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: monospace;
  font-size: 0.95rem;
  color: #ef4444;
  background: #fff;
  padding: 5px 8px;
  border: 1px solid #e4e4e7;
  border-radius: 4px;
}
.copy-icon {
  cursor: pointer;
  color: #a1a1aa;
}
.copy-icon:hover {
  color: #18181b;
}

.card-actions {
  background: #fafafa;
  border-top: 1px solid #e4e4e7;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 0 0 8px 8px;
}
.stats {
  flex: 1;
  font-size: 0.85rem;
  color: #71717a;
}
.stats span {
  font-weight: bold;
  color: #ef4444;
  font-size: 1rem;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}
.empty-icon {
  font-size: 3rem;
  color: #d4d4d8;
  margin-bottom: 15px;
}
.empty-state h3 {
  color: #3f3f46;
  margin: 0 0 10px 0;
}
.empty-state p {
  color: #71717a;
  margin: 0;
}

.dialogue-form .field {
  margin-bottom: 1.5rem;
}
.dialogue-form label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  color: #3f3f46;
}
.dialogue-form small {
  color: #71717a;
  display: block;
  margin-top: 5px;
}
.mt-3 {
  margin-top: 1rem;
}
.mb-4 {
  margin-bottom: 1.5rem;
}

.confirmation-content {
  display: flex;
  align-items: center;
}
</style>
