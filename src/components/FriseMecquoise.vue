<template>
  <div v-if="loadState === 'ready' && activeEvent" class="ui-layer">
    <div class="game-ui-container" tabindex="0" @keyup="handleKeydown" ref="gameContainer">
      <transition name="bg-fade" mode="out-in">
        <div :key="activeEvent.id" class="background-layer">
          <div class="bg-image" :style="getBackgroundStyle(activeEvent.bgImage)"></div>
        </div>
      </transition>

      <div class="vignette-overlay"></div>

      <!-- ON UTILISE UN FLEX COLUMN SUR TOUTE LA HAUTEUR -->
      <div class="ui-layer main-layout">

        <!-- HEADER EN HAUT -->
        <div class="top-hud shrink-0">
          <div class="mode-title">
            <span class="mode-icon"><i class="pi pi-book"></i></span>
            <div>
              <h2>COURS SIRA : PÉRIODE MÉCQUOISE</h2>
              <p class="teacher-label">{{ teacherLabel }}</p>
            </div>
          </div>

          <div class="hud-right">
            <div class="progress-counter">
              CHAPITRE {{ activeIndex + 1 }} / {{ evenements.length }}
            </div>
            <button class="codex-btn" @click="showCodex = true">
              <i class="pi pi-compass"></i> CODEX
            </button>
          </div>
        </div>

        <!-- ZONE CENTRALE FLUIDE QUI PREND TOUT L'ESPACE RESTANT -->
        <div class="info-panel flex-1">
          <transition name="slide-up" mode="out-in">
            <div :key="activeEvent.id" class="chapter-content h-full">
              <!-- En-tête du chapitre toujours visible -->
              <div class="chapter-header-fixed shrink-0">
                <div class="chapter-meta">
                  <span class="age-tag"><i class="pi pi-user"></i> Âge : {{ activeEvent.age }}</span>
                  <span class="date-tag"><i class="pi pi-calendar"></i> {{ activeEvent.date }}</span>
                  <span class="hijri-tag"><i class="pi pi-moon"></i> {{ activeEvent.dateH }}</span>
                </div>

                <h1 class="chapter-title">{{ activeEvent.titre }}</h1>

                <div class="chapter-tabs">
                  <button :class="{ active: activeTab === 'recit' }" @click="activeTab = 'recit'">
                    RÉCIT HISTORIQUE
                  </button>
                  <button :class="{ active: activeTab === 'persos' }" @click="activeTab = 'persos'">
                    PERSONNAGES
                  </button>
                  <button :class="{ active: activeTab === 'lecons' }" @click="activeTab = 'lecons'">
                    LEÇONS
                  </button>
                                    <button
                    v-if="activeEvent.sources"
                    :class="{ active: activeTab === 'sources' }"
                    @click="activeTab = 'sources'"
                  >
                    SOURCES
                  </button>
<button
                    v-if="activeEvent.versets"
                    :class="{ active: activeTab === 'versets' }"
                    @click="activeTab = 'versets'"
                  >
                    VERSETS
                  </button>
                </div>
              </div>

              <!-- Zone de texte scrollable qui remplit le reste de l'Info-panel -->
              <div class="tab-content-area flex-1">
                <transition name="fade" mode="out-in">
                  <div v-if="activeTab === 'recit'" class="tab-pane recit-pane" key="recit">
                    <div class="text-content" v-html="activeEvent.recit"></div>
                  </div>

                  <div v-else-if="activeTab === 'persos'" class="tab-pane persos-pane" key="persos">
                    <div class="persos-grid">
                      <CharacterCard
                        v-for="(perso, i) in activeEvent.personnages"
                        :key="i"
                        :perso="perso"
                      />
                    </div>
                  </div>

                  <div v-else-if="activeTab === 'lecons'" class="tab-pane lecons-pane" key="lecons">
                    <ul class="lecons-list">
                      <li v-for="(lecon, i) in activeEvent.lecons" :key="i">
                        <i class="pi pi-star-fill lecon-icon"></i>
                        <span v-html="lecon"></span>
                      </li>
                    </ul>
                  </div>

                  
                  <div v-else-if="activeTab === 'sources'" class="tab-pane sources-pane" key="sources">
                    <ul class="sources-list">
                      <li v-for="(source, i) in activeEvent.sources" :key="i">
                        <i class="pi pi-verified source-icon"></i>
                        <span v-html="source"></span>
                      </li>
                    </ul>
                  </div>

<div
                    v-else-if="activeTab === 'versets'"
                    class="tab-pane versets-pane"
                    key="versets"
                  >
                    <div class="verset-box">
                      <i class="pi pi-book verset-icon"></i>
                      <p>{{ activeEvent.versets }}</p>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </transition>
        </div>

        <!-- TIMELINE EN BAS -->
        <TimelineNav
          class="shrink-0"
          :evenements="evenements"
          :activeIndex="activeIndex"
          :progressPercentage="progressPercentage"
          @prev="prevChapter"
          @next="nextChapter"
          @set-chapter="setChapter"
        />
      </div>

      <transition name="slide-left">
        <div v-if="showCodex" class="codex-overlay">
          <button class="close-codex" @click="showCodex = false">
            <i class="pi pi-times"></i> FERMER
          </button>
          <h2><i class="pi pi-compass"></i> CODEX : CONTEXTE PRÉ-ISLAMIQUE</h2>
          <div class="codex-content">
            <div class="codex-section">
              <h3>Les Empires Rivaux</h3>
              <p>
                La péninsule est coincée entre l'<strong>Empire Byzantin</strong> (Chrétien, au
                Nord-Ouest) et l'<strong>Empire Sassanide</strong> (Perse Zoroastrien, au Nord-Est).
                Au sud, le Yémen subit l'influence de l'Empire d'Abyssinie.
              </p>
            </div>
            <div class="codex-section">
              <h3>La Dégénérescence Religieuse</h3>
              <p>
                Le monothéisme pur d'Ibrahim et Ismaël a été corrompu par
                <strong>'Âmir b. Luhayy</strong> qui ramena l'idole <strong>Hubal</strong> de Syrie.
                Parmi les grandes déesses vénérées : Al-Lât (à Ta'if), Al-'Uzza et Manât.
              </p>
            </div>
            <div class="codex-section">
              <h3>Le Système Tribal Mecquois (Quraysh)</h3>
              <p>
                La Mecque n'a pas de roi. Elle est gérée par la tribu de Quraysh à travers
                <strong>19 fonctions honorifiques</strong> réparties entre les clans. Exemples : la
                <em>Siqâya</em> (gestion de l'eau) et la <em>Hijaba</em> (garde des clés de la
                Ka'ba).
              </p>
            </div>
            <div class="codex-section">
              <h3>Hiérarchie et Protection (Wala / Jiwar)</h3>
              <p>
                La société arabe préislamique repose sur la protection. Au sommet, les nobles de <strong>Quraysh</strong>. 
                Puis viennent les <strong>étrangers bénéficiant d'une protection contractuelle</strong> (les confédérés, ou <em>Hulafâ'</em>), 
                qui permettait par exemple à des étrangers comme Yâsir (le père de 'Ammar) de s'installer.
                <br><br>
                Tout en bas se trouvent les <strong>esclaves</strong>. Même après avoir été affranchis, ces derniers 
                devaient rester sous la tutelle religieuse et politique (<em>Wala'</em>) de leurs anciens maîtres pour survivre. 
                C'est pourquoi Sumayya, la mère de 'Ammar, resta à la merci d'Abu Jahl. C'est sur ces classes sans grande tribu pour les venger 
                que se sont abattues les pires tortures.
              </p>
            </div>
          </div>
        </div>
      </transition>


      <!-- ALERT BAHIRA (ID 6) - CUSTOM UI -->
      <transition name="fade">
        <div v-if="showBahiraWarning" class="ui-layer" style="display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.8); z-index: 50; padding: 20px;" @click="showBahiraWarning = false">
          <div class="state-card" style="position: relative; max-width: 600px; padding: 40px; border-color: rgba(239, 68, 68, 0.4);" @click.stop>
            <span class="state-icon" style="background: rgba(239, 68, 68, 0.15); color: #ef4444; margin-bottom: 24px; width: 72px; height: 72px; font-size: 2rem;">
              <i class="pi pi-exclamation-triangle"></i>
            </span>
            <h2 style="color: #ef4444; font-size: 1.4rem; letter-spacing: 2px; margin-bottom: 20px;">AVERTISSEMENT</h2>
            <p style="font-size: 1.15rem; text-align: justify; color: #f1f1f3; line-height: 1.8;">
              Bien que l'histoire du moine <strong>Baḥîrâ</strong> soit très célèbre dans la Sîra, son authenticité absolue
              ainsi que certains de ses détails sont jugés <strong>faibles ou rejetés</strong>
              par de nombreux grands savants du Hadith.
            </p>
            <button class="codex-btn" style="margin-top: 20px; background: rgba(239, 68, 68, 0.2); color: #ef4444; border-color: #ef4444; width: 100%; font-size: 1rem; padding: 12px; letter-spacing: 2px;" @click="showBahiraWarning = false">
              <i class="pi pi-check"></i> J'AI COMPRIS
            </button>
          </div>
        </div>
      </transition>

      <!-- TUTORIEL JEU -->

      <GameTutorial
        v-if="showTutorial"
        :isVisible="showTutorial"
        @close="finishTutorial"
      />

    </div>
  </div>
  <div v-else-if="loadState === 'loading'" class="ui-layer">
    <!-- Skeleton loader omis par simplicité ... -->
    <div class="state-screen">
       <i class="pi pi-spin pi-spinner" style="font-size: 3rem; color: #d97706"></i>
    </div>
  </div>
  <div v-else class="ui-layer state-screen">
    <div class="state-card">
      <span class="state-icon">
        <i :class="loadState === 'error' ? 'pi pi-exclamation-triangle' : 'pi pi-lock'"></i>
      </span>
      <h2>{{ loadState === 'error' ? 'Backend indisponible' : 'Aucun chapitre autorisé' }}</h2>
      <p>{{ errorMessage || 'Ce professeur ne dispose d’aucun chapitre publié pour le moment.' }}</p>
      <button class="codex-btn" @click="fetchEvents">
        <i class="pi pi-refresh"></i> RÉESSAYER
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import TimelineNav from './TimelineNav.vue'
import CharacterCard from './CharacterCard.vue'
import GameTutorial from './GameTutorial.vue'
import { getTeacherTimeline, resolveTeacherSlugFromLocation } from '../services/siraEventsService.js'

const showCodex = ref(false)
const showTutorial = ref(false)
const activeTab = ref('recit') // 'recit', 'persos', 'lecons', 'versets'

const evenements = ref([])
const loadState = ref('loading') // loading | ready | empty | error
const errorMessage = ref('')
const teacherLabel = ref('Chargement du profil enseignant…')
const teacherSlug = ref(resolveTeacherSlugFromLocation())

const fetchEvents = async () => {
  try {
    loadState.value = 'loading'
    errorMessage.value = ''

    const payload = await getTeacherTimeline(teacherSlug.value)
    evenements.value = payload.events ?? []
    teacherLabel.value = payload.teacher?.name
      ? `${payload.teacher.name} · ${payload.teacher.school}`
      : 'Accès enseignant'

    activeIndex.value = 0
    loadState.value = evenements.value.length > 0 ? 'ready' : 'empty'

    if (loadState.value === 'ready') {
      checkTutorialStatus()
    }
  } catch (error) {
    console.error('Error fetching events:', error)
    errorMessage.value = error instanceof Error ? error.message : 'Impossible de charger la timeline.'
    loadState.value = 'error'
  }
}
const activeIndex = ref(0)
const activeEvent = computed(() => evenements.value[activeIndex.value] ?? null)
const isTimelineReady = computed(() => loadState.value === 'ready' && !!activeEvent.value)
const progressPercentage = computed(() =>
  evenements.value.length <= 1
    ? '0%'
    : (activeIndex.value / (evenements.value.length - 1)) * 100 + '%',
)

/* ---- TUTORIEL LOGIC ---- */
const checkTutorialStatus = () => {
  const hasSeenAdmin = sessionStorage.getItem('sira_superadmin_auth')
  const hasSeenTeacher = sessionStorage.getItem('backoffice_token')
  const hasSeenTutorial = localStorage.getItem('sira_tutorial_seen')

  // On affiche le tuto seulement s'il n'a pas été vu et qu'on n'est pas un prof/admin (optionnel)
  if (!hasSeenTutorial) {
    showTutorial.value = true
  }
}
const finishTutorial = () => {
  showTutorial.value = false
  localStorage.setItem('sira_tutorial_seen', 'true')
  if (gameContainer.value) gameContainer.value.focus()
}

const setChapter = (index) => {
  activeIndex.value = index
  activeTab.value = 'recit'
}
const nextChapter = () => {
  if (activeIndex.value < evenements.value.length - 1) {
    activeIndex.value++
    activeTab.value = 'recit'
  }
}
const prevChapter = () => {
  if (activeIndex.value > 0) {
    activeIndex.value--
    activeTab.value = 'recit'
  }
}

const handleKeydown = (e) => {
  if (!isTimelineReady.value || showTutorial.value) return

  // Navigation
  if (e.key === 'ArrowRight') nextChapter()
  if (e.key === 'ArrowLeft') prevChapter()
  // Menu Codex
  if (e.key === 'Escape') showCodex.value = false
}


const showBahiraWarning = ref(false)
let bahiraTimeout = null

watch(activeEvent, (newVal) => {
  if (newVal && newVal.titreCourt === 'Bahira') {
    showBahiraWarning.value = true
    if (bahiraTimeout) clearTimeout(bahiraTimeout)
    bahiraTimeout = setTimeout(() => {
      showBahiraWarning.value = false
    }, 4500) // 5 secondes
  } else {
    showBahiraWarning.value = false
    if (bahiraTimeout) clearTimeout(bahiraTimeout)
  }
})

const gameContainer = ref(null)
onMounted(() => {
  fetchEvents()
  if (gameContainer.value) gameContainer.value.focus()
})

// Fonction pour gérer les gradients et images
const getBackgroundStyle = (bgValue) => {
  if (bgValue.includes('gradient')) {
    return { background: bgValue }
  }
  return { backgroundImage: `url(${bgValue})` }
}
</script>

<style scoped>
/* Reset global */
.game-ui-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #050505;
  font-family: 'Inter', sans-serif;
  color: #fff;
  outline: none;
}

/* Utilitaires Flex pour structurer la page */
.main-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.shrink-0 {
  flex-shrink: 0;
}
.flex-1 {
  flex: 1 1 auto;
  min-height: 0;
}
.h-full {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* Animations ! */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.4s ease;
}
.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(100%);
}

/* Couches d'images */
.background-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}
.bg-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  animation: slowPan 30s linear infinite alternate;
}
@keyframes slowPan {
  0% { transform: scale(1) translate(0, 0); }
  100% { transform: scale(1.1) translate(-1%, -1%); }
}

.vignette-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background:
    linear-gradient(90deg, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.8) 45%, rgba(0, 0, 0, 0) 100%),
    linear-gradient(0deg, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.5) 20%, rgba(0, 0, 0, 0.1) 100%);
}
.ui-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
}

/* Top HUD */
.top-hud {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 60px;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.8) 0%, transparent 100%);
}
.mode-title {
  display: flex;
  align-items: center;
  gap: 15px;
}
.mode-icon {
  background: #d97706;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 1.2rem;
}
.mode-title h2 {
  margin: 0;
  font-size: 1.2rem;
  letter-spacing: 4px;
  color: #e4e4e7;
}
.teacher-label {
  margin: 0;
  color: #fcd34d;
  font-size: 0.8rem;
  letter-spacing: 1px;
  text-transform: uppercase;
}
.hud-right {
  display: flex;
  align-items: center;
  gap: 30px;
}
.progress-counter {
  font-family: 'Courier New', Courier, monospace;
  font-size: 1.2rem;
  font-weight: bold;
  color: #d97706;
  letter-spacing: 2px;
}
.codex-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  padding: 10px 20px;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  transition: 0.2s;
  letter-spacing: 2px;
}
.codex-btn:hover {
  background: #d97706;
  border-color: #fcd34d;
}

/* State screens */
.state-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}
.state-card {
  width: min(560px, 100%);
  background: rgba(15, 15, 15, 0.9);
  border: 1px solid rgba(217, 119, 6, 0.35);
  border-radius: 18px;
  padding: 32px;
  text-align: center;
}
.state-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: rgba(217, 119, 6, 0.15);
  color: #fcd34d;
  font-size: 1.5rem;
  margin-bottom: 16px;
}
.state-card h2 {
  margin: 0 0 12px 0;
  color: #f8fafc;
}
.state-card p {
  margin: 0 0 24px 0;
  color: #d4d4d8;
  line-height: 1.7;
}

/* Info Panel (Mid section) */
.info-panel {
  padding: 10px 60px 0 60px;
  max-width: 900px;
}

.chapter-meta {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  font-size: 0.85rem;
  font-weight: bold;
  letter-spacing: 1px;
}
.age-tag {
  color: #fcd34d;
  background: rgba(217, 119, 6, 0.2);
  padding: 6px 14px;
  border-radius: 4px;
  border: 1px solid #d97706;
}
.date-tag,
.hijri-tag {
  color: #a1a1aa;
  background: rgba(255, 255, 255, 0.1);
  padding: 6px 14px;
  border-radius: 4px;
}

.chapter-title {
  font-size: 3.5rem;
  font-weight: 900;
  margin: 0 0 20px 0;
  font-family: 'Merriweather', serif;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.8);
  line-height: 1.2;
}

/* Onglets */
.chapter-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 10px;
}
.chapter-tabs button {
  background: none;
  border: none;
  color: #a1a1aa;
  font-weight: bold;
  letter-spacing: 2px;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 10px 15px;
  transition: 0.2s;
  border-radius: 4px;
}
.chapter-tabs button:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.05);
}
.chapter-tabs button.active {
  color: #d97706;
  background: rgba(217, 119, 6, 0.15);
  border-bottom: 2px solid #d97706;
}

/* Zone Scrollable du contenu */
.tab-content-area {
  overflow-y: auto;
  padding-right: 20px;
  padding-bottom: 30px;
  -webkit-mask-image: linear-gradient(to bottom, black 95%, transparent 100%);
  mask-image: linear-gradient(to bottom, black 95%, transparent 100%);
}

.tab-content-area::-webkit-scrollbar {
  width: 8px;
}
.tab-content-area::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.15);
  border-radius: 10px;
}
.tab-content-area::-webkit-scrollbar-thumb {
  background: rgba(217, 119, 6, 0.4);
  border-radius: 10px;
}
.tab-content-area::-webkit-scrollbar-thumb:hover {
  background: rgba(217, 119, 6, 0.7);
}

/* -------- AMÉLIORATION DU TEXTE (LE LECTEUR HISTORIQUE) -------- */
.text-content {
  font-size: 1.2rem;
  line-height: 1.8;
  letter-spacing: 0.3px;
  color: #f1f1f3;
  text-shadow: 1px 1px 8px rgba(0, 0, 0, 0.9);
}
:deep(.text-content br) {
  display: block;
  content: "";
  margin-top: 1em;
}

/* -------- AMÉLIORATION DES LEÇONS -------- */
.lecons-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.lecons-list li {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  color: #e4e4e7;
  font-size: 1.15rem;
  line-height: 1.6;
  background: rgba(0, 0, 0, 0.5);
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #d97706;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}
.lecon-icon {
  color: #d97706;
  font-size: 1.2rem;
  margin-top: 5px;
  flex-shrink: 0;
}

/* -------- AMÉLIORATION DES PERSONNAGES -------- */
.persos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.verset-box {
  background: rgba(217, 119, 6, 0.1);
  border: 1px solid #d97706;
  padding: 30px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
}
.verset-icon {
  font-size: 2.5rem;
  color: #d97706;
  margin-bottom: 20px;
}
.verset-box p {
  font-family: 'Merriweather', serif;
  font-size: 1.4rem;
  font-style: italic;
  color: #fcd34d;
  line-height: 1.6;
}

/* =================== RESTAURATION CSS CODEX =================== */
.codex-overlay {
  position: absolute;
  top: 0;
  right: 0;
  width: 500px;
  height: 100%;
  background: rgba(15, 15, 15, 0.95);
  border-left: 2px solid #d97706;
  z-index: 10;
  padding: 40px;
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
}
.close-codex {
  align-self: flex-end;
  background: none;
  border: none;
  color: #a1a1aa;
  cursor: pointer;
  font-size: 1rem;
  letter-spacing: 2px;
  margin-bottom: 30px;
}
.close-codex:hover {
  color: #ef4444;
}
.codex-overlay h2 {
  color: #fcd34d;
  font-size: 1.5rem;
  border-bottom: 1px solid #3f3f46;
  padding-bottom: 15px;
  margin-bottom: 30px;
}
.codex-content {
  overflow-y: auto;
  padding-right: 15px;
}
.codex-section {
  margin-bottom: 30px;
}
.codex-section h3 {
  color: #d97706;
  font-size: 1.1rem;
  margin-bottom: 10px;
}
.codex-section p {
  color: #d4d4d8;
  line-height: 1.6;
  font-size: 0.95rem;
  margin-top: 0;
}

/* =================== RESPONSIVE DESIGN =================== */

@media (max-width: 1024px) {
  .top-hud { padding: 15px 30px; }
  .info-panel { padding: 10px 40px 0 40px; }
  .chapter-title { font-size: 2.8rem; margin-bottom: 10px; }

  .codex-btn { padding: 8px 15px; font-size: 0.9rem; }
  .codex-overlay { width: 100%; max-width: 400px; }
}

@media (max-width: 640px) {
  .top-hud {
    padding: 15px;
    flex-wrap: wrap;
    gap: 10px;
  }
  .mode-title { width: 100%; gap: 10px; }
  .mode-title h2 { font-size: 0.9rem; }
  .mode-icon { width: 30px; height: 30px; }

  .hud-right {
    width: 100%;
    justify-content: space-between;
  }
  .progress-counter { font-size: 0.9rem; }
  .codex-btn { padding: 6px 12px; font-size: 0.75rem; }

  .info-panel { padding: 10px 20px 0 20px; }

  .chapter-meta { flex-wrap: wrap; gap: 6px; font-size: 0.75rem; margin-bottom: 10px; }

  .chapter-title {
    font-size: 1.8rem;
    margin-bottom: 10px;
  }

  .chapter-tabs { flex-wrap: wrap; gap: 4px; margin-bottom: 10px; }
  .chapter-tabs button { font-size: 0.7rem; padding: 6px 10px; }

  .text-content {
    font-size: 1.05rem;
    line-height: 1.6;
  }

  .lecons-list li {
    font-size: 0.95rem;
    padding: 15px;
  }

  .persos-grid { grid-template-columns: 1fr; }

  .codex-overlay {
    width: 100%;
    height: auto;
    bottom: 0;
    right: 0;
    top: auto;
    border-left: none;
    border-top: 2px solid #d97706;
    border-radius: 15px 15px 0 0;
    padding: 20px;
    max-height: 70vh;
    overflow-y: auto;
  }
  .codex-overlay h2 {
    font-size: 1.2rem;
  }
}

/* -------- ONGLET SOURCES -------- */

.source-link {
  color: #38bdf8;
  text-decoration: underline;
  text-underline-offset: 3px;
  font-weight: 600;
  transition: all 0.2s ease;
}
.source-link:hover {
  color: #7dd3fc;
  text-shadow: 0 0 8px rgba(56, 189, 248, 0.6);
}

.sources-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.sources-list li {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  color: #e4e4e7;
  font-size: 1.05rem;
  line-height: 1.6;
  background: rgba(0, 0, 0, 0.4);
  padding: 15px 20px;
  border-radius: 8px;
  border-left: 4px solid #10b981;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}
.source-icon {
  color: #10b981;
  font-size: 1.2rem;
  margin-top: 5px;
  flex-shrink: 0;
}

:deep(.doua-quote) {
  margin: 1rem 0;
  padding: 0.85rem 1.15rem;
  border-left: 3px solid #d4a574;
  background: rgba(212, 165, 116, 0.08);
  border-radius: 0 8px 8px 0;
  font-size: 0.92rem;
  line-height: 1.6;
  color: #f3f4f6;
}

</style>

