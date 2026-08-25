<template>
  <transition name="fade">
    <div v-if="isVisible" class="tutorial-overlay">
      <div class="tutorial-backdrop" @click="nextStep"></div>

      <div
        class="tutorial-card shadow-8"
        :class="currentPositionClass"
      >
        <div class="tutorial-header">
          <i :class="['pi', currentStepData.icon || 'pi-info-circle', 'tut-icon']"></i>
          <h3>{{ currentStepData.title }}</h3>
        </div>

        <p class="tutorial-body" v-html="currentStepData.text"></p>

        <div class="tutorial-footer">
          <div class="step-indicators">
            <span
              v-for="(step, index) in steps"
              :key="index"
              class="dot"
              :class="{ active: index === currentStepIndex }"
            ></span>
          </div>

          <button class="tut-btn skip-btn" @click="closeTutorial" v-if="currentStepIndex < steps.length - 1">
            Passer
          </button>

          <button class="tut-btn next-btn" @click="nextStep">
            {{ currentStepIndex === steps.length - 1 ? 'C\'est parti !' : 'Suivant' }}
            <i :class="currentStepIndex === steps.length - 1 ? 'pi pi-check' : 'pi pi-arrow-right'"></i>
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close'])

const currentStepIndex = ref(0)
const steps = [
  {
    title: "Bienvenue dans l'aventure",
    text: "Prenez 30 secondes pour découvrir comment naviguer dans votre espace d'apprentissage interactif.",
    position: "center",
    icon: "pi-sparkles"
  },
  {
    title: "Explorez votre chapitre",
    text: "En haut, vous trouverez <strong>les onglets</strong>.<br><br>Lisez le récit, puis cliquez pour découvrir les <strong>Personnages clés</strong>, les <strong>Leçons</strong> à tirer, et les <strong>Versets</strong> liés au chapitre.",
    position: "top",
    icon: "pi-clone"
  },
  {
    title: "Le Codex Pré-Islamique",
    text: "En haut à droite, le bouton <strong>CODEX</strong> est votre boussole.<br><br>Ouvrez-le à tout instant pour comprendre le contexte géopolitique et les tribus de l'époque !",
    position: "top-right",
    icon: "pi-compass"
  },
  {
    title: "Votre progression temporelle",
    text: "En bas de l'écran, vous trouverez <strong>la frise chronologique</strong>.<br><br>Utilisez les flèches ou cliquez sur les points pour avancer dans le temps. C'est à vous de jouer !",
    position: "bottom",
    icon: "pi-map"
  }
]

const currentStepData = computed(() => steps[currentStepIndex.value])
const currentPositionClass = computed(() => `pos-${currentStepData.value.position}`)

const nextStep = () => {
  if (currentStepIndex.value < steps.length - 1) {
    currentStepIndex.value++
  } else {
    closeTutorial()
  }
}

const closeTutorial = () => {
  emit('close')
}
</script>

<style scoped>
.tutorial-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  pointer-events: auto;
}

.tutorial-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(3px);
}

.tutorial-card {
  position: absolute;
  width: 90%;
  max-width: 450px;
  background: rgba(15, 15, 15, 0.95);
  border: 2px solid #d97706;
  border-radius: 16px;
  padding: 30px;
  color: #fff;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(217, 119, 6, 0.2);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
}

/* Positions animées */
.pos-center {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.pos-top {
  top: 15%;
  left: 50%;
  transform: translateX(-50%);
}

.pos-top-right {
  top: 80px;
  right: 60px;
  transform: none;
}

.pos-bottom {
  bottom: 120px;
  left: 50%;
  transform: translateX(-50%);
}

/* Typographie & UI */
.tutorial-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 15px;
}

.tut-icon {
  font-size: 2rem;
  color: #fcd34d;
  background: rgba(217, 119, 6, 0.2);
  padding: 10px;
  border-radius: 12px;
}

.tutorial-header h3 {
  margin: 0;
  font-size: 1.3rem;
  font-family: 'Merriweather', serif;
  color: #fff;
}

.tutorial-body {
  font-size: 1.05rem;
  line-height: 1.6;
  color: #e4e4e7;
  margin-bottom: 30px;
}

:deep(.tutorial-body strong) {
  color: #fcd34d;
}

.tutorial-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
}

.step-indicators {
  display: flex;
  gap: 8px;
}

.step-indicators .dot {
  width: 10px;
  height: 10px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transition: 0.3s;
}

.step-indicators .dot.active {
  background: #d97706;
  transform: scale(1.3);
}

.tut-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-weight: bold;
  letter-spacing: 1px;
  transition: 0.2s;
  padding: 10px 20px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.skip-btn {
  color: #71717a;
  font-size: 0.85rem;
}
.skip-btn:hover {
  color: #a1a1aa;
  background: rgba(255, 255, 255, 0.05);
}

.next-btn {
  background: #d97706;
  color: #fff;
}
.next-btn:hover {
  background: #f59e0b;
  transform: translateX(3px);
}

/* Animations Vue */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsivité Mobile */
@media (max-width: 768px) {
  .pos-top-right {
    top: auto;
    bottom: 20px; /* Sur mobile on centre en bas plutot qu'en haut à droite qui sort de la page */
    left: 50%;
    right: auto;
    transform: translateX(-50%);
  }
  .pos-bottom {
    bottom: 100px;
  }
}
</style>
