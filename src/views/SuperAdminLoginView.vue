<template>
  <div class="login-page">
    <div class="login-card">
      <div class="header">
        <i class="pi pi-shield lock-icon"></i>
        <h1>Accès Master</h1>
        <p>Espace réservé à l'administration centrale.</p>
      </div>

      <form @submit.prevent="handleLogin" class="p-fluid">
        <div class="form-group">
          <label for="password">Mot de passe Super Admin</label>
          <InputText
            id="password"
            v-model="password"
            type="password"
            placeholder="Clé de sécurité"
            required
            class="input-custom"
          />
        </div>

        <Message v-if="errorMsg" severity="error" :closable="false" class="error-msg">
          {{ errorMsg }}
        </Message>

        <Button
          type="submit"
          label="CONNEXION"
          icon="pi pi-arrow-right"
          class="submit-btn"
          :loading="isLoading"
        />
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Message from 'primevue/message'
import { superAdminLogin } from '../services/superAdminApi.js'

const router = useRouter()
const password = ref('')
const isLoading = ref(false)
const errorMsg = ref('')

const handleLogin = async () => {
  console.log("=== VUE : Déclenchement de la fonction de login ===")
  console.log("Valeur du mot de passe tapé dans le form :", password.value)

  errorMsg.value = ''
  isLoading.value = true

  try {
    const success = await superAdminLogin(password.value)
    console.log("Résultat de superAdminLogin :", success)
    router.push({ name: 'super-admin-dashboard' })
  } catch (error) {
    console.error("Erreur attrapée dans la vue :", error)
    errorMsg.value = error.message || 'Mot de passe invalide.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000;
  background-image:
    radial-gradient(circle at 15% 50%, rgba(220, 38, 38, 0.08), transparent 25%),
    radial-gradient(circle at 85% 30%, rgba(220, 38, 38, 0.08), transparent 25%);
  padding: 20px;
  font-family: 'Inter', sans-serif;
}

.login-card {
  width: 100%;
  max-width: 420px;
  background: rgba(15, 15, 15, 0.95);
  border: 1px solid rgba(220, 38, 38, 0.3); /* Rouge admin */
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8), 0 0 20px rgba(220, 38, 38, 0.1);
  backdrop-filter: blur(10px);
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.lock-icon {
  font-size: 2.5rem;
  color: #ef4444; /* Rouge Prime */
  background: rgba(239, 68, 68, 0.15);
  padding: 15px;
  border-radius: 50%;
  margin-bottom: 15px;
}

.header h1 {
  margin: 0 0 10px 0;
  color: #fff;
  font-size: 1.8rem;
  font-weight: 700;
  letter-spacing: 1px;
}

.header p {
  margin: 0;
  color: #a1a1aa;
  font-size: 0.95rem;
}

.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #e4e4e7;
  font-weight: 500;
  font-size: 0.9rem;
}

/* Customisation PrimeVue surchargée */
:deep(.input-custom) {
  width: 100%;
  background: rgba(0, 0, 0, 0.4) !important;
  border: 1px solid #3f3f46 !important;
  color: #fff !important;
  padding: 12px 15px !important;
  border-radius: 6px !important;
  transition: all 0.3s ease;
}

:deep(.input-custom:focus) {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2) !important;
}

:deep(.submit-btn) {
  width: 100%;
  background: #ef4444 !important;
  border: none !important;
  padding: 14px !important;
  font-weight: bold !important;
  letter-spacing: 1px !important;
  border-radius: 6px !important;
  margin-top: 10px;
}

:deep(.submit-btn:hover) {
  background: #dc2626 !important;
}

.error-msg {
  margin-bottom: 20px;
}
</style>
