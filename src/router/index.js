import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import FriseMecquoise from '../components/FriseMecquoise.vue'
import BackofficeLoginView from '../views/BackofficeLoginView.vue'
import BackofficeView from '../views/BackofficeView.vue'
import SuperAdminLoginView from '../views/SuperAdminLoginView.vue'
import SuperAdminView from '../views/SuperAdminView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView, // Page d'accueil portail
    },
    {
      path: '/t/:teacherSlug',
      name: 'teacher-timeline',
      component: FriseMecquoise, // Vue étudiant
    },
    {
      path: '/teacher/login',
      name: 'teacher-login',
      component: BackofficeLoginView, // Espace prof login
    },
    {
      path: '/teacher/dashboard',
      name: 'teacher-dashboard',
      component: BackofficeView, // Espace prof dashboard
    },
    {
      path: '/super-admin/login',
      name: 'super-admin-login',
      component: SuperAdminLoginView, // Espace superadmin login
    },
    {
      path: '/super-admin/dashboard',
      name: 'super-admin-dashboard',
      component: SuperAdminView, // Espace superadmin dashboard
    }
  ],
})

// Navigation guard basique pour éviter que quelqu'un tape l'URL directement sans être connecté
router.beforeEach((to, from, next) => {
  // Check Teacher Auth
  if (to.name === 'teacher-dashboard') {
    // Dans backofficeApi.js, on utilise sessionStorage pour 'backoffice_token'
    const teacherToken = sessionStorage.getItem('backoffice_token')
    if (!teacherToken) {
      return next({ name: 'teacher-login' })
    }
  }

  // Check Super Admin Auth
  if (to.name === 'super-admin-dashboard') {
    const adminData = sessionStorage.getItem('sira_superadmin_auth')
    if (!adminData) {
      return next({ name: 'super-admin-login' })
    }
  }

  next()
})

export default router
