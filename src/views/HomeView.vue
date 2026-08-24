<template>
  <div class="home-container">
    <div class="background-overlay"></div>

    <div class="content-wrapper">
      <div class="logo-box">
        <i class="pi pi-book main-icon"></i>
        <h1>Frise Sira <span>Interactive</span></h1>
        <p class="subtitle">La période mecquoise comme vous ne l'avez jamais vue.</p>
      </div>

      <div class="actions-grid">
        <button class="action-btn student-btn" @click="promptStudentLink">
          <i class="pi pi-user-edit"></i>
          <div>
            <h3>Espace Élève</h3>
            <p>J'ai un code fourni par mon professeur</p>
          </div>
        </button>

        <button class="action-btn teacher-btn" @click="$router.push('/teacher/login')">
          <i class="pi pi-users"></i>
          <div>
            <h3>Espace Enseignant</h3>
            <p>Se connecter au tableau de bord</p>
          </div>
        </button>
      </div>

      <div class="admin-link">
        <router-link to="/super-admin/login"><i class="pi pi-shield"></i> Panneau Administration</router-link>
      </div>
    </div>

    <Dialog v-model:visible="showStudentModal" modal header="Accéder au cours" :style="{ width: '400px' }">
      <div class="p-fluid">
        <p>Saisissez l'identifiant secret de votre professeur (exemple: <strong style="color: #d97706">prof-amine</strong>) :</p>
        <div style="display: flex; gap: 10px; align-items: center; margin-top: 15px;">
          <span style="color: #a1a1aa; font-family: monospace;">frise.com/t/</span>
          <InputText v-model="studentLinkId" placeholder="Ex: prof-amine" @keyup.enter="goToStudent" autofocus />
        </div>
        <small v-if="errorHint" style="color: #ef4444; display: block; margin-top: 5px;">
          {{ errorHint }}
        </small>
      </div>
      <template #footer>
        <Button label="Annuler" icon="pi pi-times" class="p-button-text" @click="showStudentModal = false" />
        <Button label="Rejoindre" icon="pi pi-check" class="p-button-warning" @click="goToStudent" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'

const router = useRouter()
const showStudentModal = ref(false)
const studentLinkId = ref('')
const errorHint = ref('')

const promptStudentLink = () => {
  studentLinkId.value = ''
  errorHint.value = ''
  showStudentModal.value = true
}

const goToStudent = () => {
  let val = studentLinkId.value.trim()

  if (!val) return

  // Nettoyage intelligent : si l'élève colle toute l'URL par erreur
  // (ex: http://localhost:5173/t/prof-amine), on ne garde que "prof-amine".
  if (val.includes('/t/')) {
    const parts = val.split('/t/')
    val = parts[parts.length - 1] // prend ce qu'il y a après le dernier /t/
  }

  // Enlève d'éventuels slashes finaux
  val = val.replace(/\//g, '')

  if (!val) {
    errorHint.value = "Identifiant invalide."
    return
  }

  router.push(`/t/${val}`)
  showStudentModal.value = false
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #050505;
  background-image: url('https://images.unsplash.com/photo-1542382156909-9ae37b3f56ce?q=80&w=2670&auto=format&fit=crop');
  background-size: cover;
  background-position: center;
  position: relative;
  font-family: 'Inter', sans-serif;
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(30, 20, 10, 0.8) 100%);
  z-index: 1;
}

.content-wrapper {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 600px;
  padding: 40px;
}

.logo-box {
  text-align: center;
  margin-bottom: 50px;
}
.main-icon {
  font-size: 4rem;
  color: #d97706;
  margin-bottom: 20px;
  text-shadow: 0 0 20px rgba(217, 119, 6, 0.5);
}
.logo-box h1 {
  font-family: 'Merriweather', serif;
  font-size: 2.8rem;
  color: #fff;
  margin: 0 0 10px 0;
}
.logo-box h1 span {
  color: #d97706;
}
.subtitle {
  color: #a1a1aa;
  font-size: 1.1rem;
}

.actions-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 25px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  backdrop-filter: blur(10px);
}
.action-btn i {
  font-size: 2rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}
.action-btn h3 {
  margin: 0 0 5px 0;
  font-size: 1.3rem;
  color: #fff;
}
.action-btn p {
  margin: 0;
  color: #a1a1aa;
  font-size: 0.95rem;
}

.student-btn:hover {
  background: rgba(217, 119, 6, 0.15);
  border-color: #d97706;
  transform: translateY(-5px);
}
.student-btn:hover i {
  background: #d97706;
  color: #fff;
}

.teacher-btn:hover {
  background: rgba(59, 130, 246, 0.15);
  border-color: #3b82f6;
  transform: translateY(-5px);
}
.teacher-btn:hover i {
  background: #3b82f6;
  color: #fff;
}

.admin-link {
  text-align: center;
  margin-top: 40px;
}
.admin-link a {
  color: #52525b;
  text-decoration: none;
  font-size: 0.85rem;
  transition: color 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}
.admin-link a:hover {
  color: #ef4444;
}

@media (max-width: 640px) {
  .logo-box h1 { font-size: 2rem; }
  .action-btn { padding: 15px; }
  .action-btn i { font-size: 1.5rem; width: 45px; height: 45px; }
  .action-btn h3 { font-size: 1.1rem; }
}
</style>
