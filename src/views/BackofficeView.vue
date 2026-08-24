<template>
  <div class="backoffice-container">
    <div class="backoffice-header">
      <div>
        <h1>
           Backoffice
        </h1>
        <p v-if="teacher">{{ teacher.name }} · {{ teacher.school }}</p>
      </div>
      <Button icon="pi pi-sign-out" label="Déconnexion" severity="danger" outlined @click="handleLogout" />
    </div>

    <div v-if="isLoading" class="loading">
      <ProgressSpinner />
      <p>Chargement en cours...</p>
    </div>

    <div v-else-if="error" class="error-card">
      <Message severity="error" :closable="false">
        {{ error }}
      </Message>
      <Button icon="pi pi-refresh" label="Réessayer" @click="fetchProfile" class="mt-3" />
    </div>

    <div v-else class="backoffice-content">
      <div class="info-section">
        <h2>Gestion des Chapitres</h2>
        <p>Sélectionnez les chapitres que vos étudiants peuvent consulter sur leur espace.</p>
      </div>

      <div class="chapters-grid">
        <div
          v-for="chapter in allChapters"
          :key="chapter.id"
          class="chapter-item"
          :class="{ active: isChapterSelected(chapter.id) }"
          @click="toggleChapter(chapter.id)"
        >
          <div class="chapter-checkbox">
            <i v-if="isChapterSelected(chapter.id)" class="pi pi-check"></i>
          </div>
          <div class="chapter-info">
            <div class="chapter-number">Chapitre {{ chapter.id }}</div>
            <div class="chapter-title">{{ chapter.titre }}</div>
            <div class="chapter-short">{{ chapter.titreCourt }}</div>
          </div>
        </div>
      </div>

      <div class="actions">
        <Button
          icon="pi pi-check-square"
          label="Sélectionner tous"
          severity="success"
          outlined
          @click="selectAll"
          :disabled="selectedChapters.length === allChapters.length"
        />
        <Button
          icon="pi pi-times-circle"
          label="Désélectionner tous"
          severity="danger"
          outlined
          @click="clearAll"
          :disabled="selectedChapters.length === 0"
        />
        <Button
          icon="pi pi-save"
          label="Enregistrer les modifications"
          severity="warning"
          :loading="isSaving"
          @click="handleSave"
        />
      </div>

      <Message v-if="saveMessage" :severity="saveMessage.type" :closable="false" class="mt-4">
        {{ saveMessage.text }}
      </Message>

      <div class="access-info">
        <h3>Lien d'accès étudiant</h3>
        <p class="text-sm mb-3">Partagez ce lien unique avec vos élèves. Ils ne verront que les chapitres que vous avez cochés ci-dessus.</p>
        <div class="access-link">
          <InputText v-if="teacher" :modelValue="`${frontendUrl}/t/${teacher.slug}`" readonly class="flex-1" />
          <Button icon="pi pi-copy" label="Copier" @click="copyLinkToClipboard" outlined />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getBackofficeProfile, updateTeacherChapters, clearToken, getStoredTeacher } from '../services/backofficeApi.js'

import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import ProgressSpinner from 'primevue/progressspinner'

const router = useRouter()
const teacher = ref(null)
const allChapters = ref([])
const selectedChapters = ref([])
const isLoading = ref(true)
const isSaving = ref(false)
const error = ref('')
const saveMessage = ref(null)
const frontendUrl = ref(typeof window !== 'undefined' ? window.location.origin : '')

const isChapterSelected = (chapterId) => selectedChapters.value.includes(chapterId)

const toggleChapter = (chapterId) => {
  const index = selectedChapters.value.indexOf(chapterId)
  if (index > -1) {
    selectedChapters.value.splice(index, 1)
  } else {
    selectedChapters.value.push(chapterId)
  }
  selectedChapters.value.sort((a, b) => a - b)
}

const selectAll = () => {
  selectedChapters.value = allChapters.value.map((c) => c.id)
}

const clearAll = () => {
  selectedChapters.value = []
}

const fetchProfile = async () => {
  isLoading.value = true
  error.value = ''

  try {
    const data = await getBackofficeProfile()
    teacher.value = data.teacher
    allChapters.value = data.allChapters
    selectedChapters.value = [...data.allowedChapterIds]
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erreur lors du chargement'
    if (err.message === 'Session expirée') {
      setTimeout(() => {
        router.push({ name: 'teacher-login' })
      }, 2000)
    }
  } finally {
    isLoading.value = false
  }
}

const handleSave = async () => {
  isSaving.value = true
  saveMessage.value = null

  try {
    await updateTeacherChapters(selectedChapters.value)
    saveMessage.value = {
      type: 'success',
      text: `✓ ${selectedChapters.value.length} chapitre(s) enregistré(s) avec succès`,
    }
    setTimeout(() => {
      saveMessage.value = null
    }, 4000)
  } catch (err) {
    saveMessage.value = {
      type: 'error',
      text: err instanceof Error ? err.message : 'Erreur lors de l\'enregistrement',
    }
  } finally {
    isSaving.value = false
  }
}

const handleLogout = () => {
  clearToken()
  router.push({ name: 'teacher-login' })
}

const copyLinkToClipboard = () => {
  if (teacher.value) {
    const link = `${frontendUrl.value}/t/${teacher.value.slug}`
    navigator.clipboard.writeText(link)
    saveMessage.value = {
      type: 'success',
      text: 'Lien copié dans le presse-papiers avec succès !',
    }
    setTimeout(() => {
      saveMessage.value = null
    }, 2000)
  }
}

onMounted(() => {
  fetchProfile()
})
</script>

<style scoped>
.backoffice-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  color: #fff;
  padding: 20px;
  overflow-y: auto;
}

:global(body) {
  margin: 0;
  padding: 0;
  overflow: auto !important;
}

.backoffice-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.backoffice-header h1 {
  margin: 0 0 8px 0;
  font-size: 2rem;
  display: flex;
  align-items: center;
  gap: 12px;
}

.backoffice-header p {
  margin: 0;
  color: #fcd34d;
  font-size: 0.95rem;
}

.loading,
.error-card {
  text-align: center;
  padding: 60px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.backoffice-content {
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 60px;
}

.info-section {
  margin-bottom: 30px;
}

.info-section h2 {
  margin: 0 0 8px 0;
  font-size: 1.5rem;
}

.info-section p {
  margin: 0;
  color: #d4d4d8;
}

.chapters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  margin-bottom: 30px;
}

.chapter-item {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(217, 119, 6, 0.2);
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  gap: 12px;
}

.chapter-item:hover {
  border-color: rgba(217, 119, 6, 0.5);
  background: rgba(217, 119, 6, 0.05);
}

.chapter-item.active {
  border-color: #d97706;
  background: rgba(217, 119, 6, 0.15);
}

.chapter-checkbox {
  width: 24px;
  height: 24px;
  border: 2px solid rgba(217, 119, 6, 0.3);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s;
}

.chapter-item.active .chapter-checkbox {
  background: #d97706;
  border-color: #d97706;
  color: #fff;
}

.chapter-info {
  flex: 1;
  min-width: 0;
}

.chapter-number {
  font-size: 0.8rem;
  color: #fcd34d;
  font-weight: bold;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.chapter-title {
  font-weight: bold;
  margin-bottom: 4px;
  color: #fff;
}

.chapter-short {
  font-size: 0.85rem;
  color: #d4d4d8;
}

.actions {
  display: flex;
  gap: 12px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.access-info {
  background: rgba(79, 70, 229, 0.1);
  border: 1px solid rgba(79, 70, 229, 0.3);
  border-radius: 12px;
  padding: 24px;
  margin-top: 40px;
}

.access-info h3 {
  margin: 0 0 8px 0;
  color: #a5f3fc;
}

.text-sm {
  font-size: 0.875rem;
  color: #a1a1aa;
}
.mb-3 {
  margin-bottom: 1rem;
}
.mt-3 {
  margin-top: 1rem;
}
.mt-4 {
  margin-top: 1.5rem;
}
.flex-1 {
  flex: 1;
}

.access-link {
  display: flex;
  gap: 8px;
  align-items: stretch;
}
</style>
