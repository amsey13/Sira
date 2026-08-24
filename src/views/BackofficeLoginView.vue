<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <span class="login-icon"><i class="pi pi-lock"></i></span>
        <h1>Backoffice Enseignant</h1>
      </div>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="slug">Identifiant</label>
          <input
            id="slug"
            v-model="slug"
            type="text"
            placeholder="ex: prof-amine"
            @keyup.enter="handleLogin"
          />
        </div>

        <div class="form-group">
          <label for="token">Clé d'accès</label>
          <input
            id="token"
            v-model="token"
            type="password"
            placeholder="Votre jeton secret"
            @keyup.enter="handleLogin"
          />
        </div>

        <div v-if="error" class="error-message">
          <i class="pi pi-exclamation-triangle"></i>
          {{ error }}
        </div>

        <button type="submit" class="login-btn" :disabled="isLoading">
          <span v-if="!isLoading"><i class="pi pi-sign-in"></i> Connexion</span>
          <span v-else><i class="pi pi-spin pi-spinner"></i> Connexion...</span>
        </button>
      </form>

      <div class="demo-credentials">
        <p>Demandez vos accès à l'administration centrale.</p>
        <code>Identifiant / Mot de passe</code>
      </div>

      <router-link to="/" class="back-link">
        <i class="pi pi-arrow-left"></i> Retour à l'accueil
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { loginTeacher } from '../services/backofficeApi.js'

const router = useRouter()
// Utilisation de ref séparées pour s'assurer que v-model se bind correctement
const slug = ref('')
const token = ref('')

const error = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  error.value = ''
  isLoading.value = true

  console.log("Tentative de login avec :", slug.value, token.value)

  try {
    await loginTeacher(slug.value, token.value)
    // Redirige vers le tableau de bord rebaptisé
    router.push({ name: 'teacher-dashboard' })
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erreur de connexion'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  display: grid;
  place-items: center;
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: rgba(15, 15, 15, 0.9);
  border: 1px solid rgba(217, 119, 6, 0.3);
  border-radius: 16px;
  padding: 40px;
  backdrop-filter: blur(10px);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  background: rgba(217, 119, 6, 0.2);
  border-radius: 16px;
  color: #fcd34d;
  font-size: 1.5rem;
  margin-bottom: 15px;
}

.login-header h1 {
  margin: 0;
  color: #fff;
  font-size: 1.5rem;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #fcd34d;
  font-size: 0.9rem;
  font-weight: bold;
  letter-spacing: 0.5px;
}

input {
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(217, 119, 6, 0.3);
  border-radius: 8px;
  color: #fff;
  font-size: 1rem;
  outline: none;
  transition: all 0.2s;
}

input:focus {
  border-color: #d97706;
  background: rgba(217, 119, 6, 0.1);
}

input::placeholder {
  color: #71717a;
}

.error-message {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid #ef4444;
  color: #fca5a5;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.login-btn {
  width: 100%;
  padding: 12px 20px;
  background: #d97706;
  border: none;
  border-radius: 8px;
  color: #fff;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.login-btn:hover:not(:disabled) {
  background: #ea580c;
  transform: scale(1.02);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.demo-credentials {
  background: rgba(252, 211, 77, 0.05);
  border: 1px dashed rgba(252, 211, 77, 0.3);
  padding: 16px;
  border-radius: 8px;
  margin-top: 24px;
  text-align: center;
}

.demo-credentials p {
  margin: 0 0 8px 0;
  color: #d4d4d8;
  font-size: 0.85rem;
}

.demo-credentials code {
  display: block;
  background: rgba(0, 0, 0, 0.3);
  padding: 8px 12px;
  border-radius: 4px;
  color: #fcd34d;
  font-family: monospace;
  font-size: 0.85rem;
  user-select: all;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 20px;
  color: #a1a1aa;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.back-link:hover {
  color: #fcd34d;
}
</style>
