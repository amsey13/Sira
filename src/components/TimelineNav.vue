<template>
  <div class="chapter-selector-area">
    <div class="nav-controls">
      <button class="nav-btn prev-btn" @click="$emit('prev')" :disabled="activeIndex === 0">
        <i class="pi pi-angle-left"></i> Précédent
      </button>
      <div class="nav-hint">Flèches ◄ / ► pour naviguer</div>
      <button
        class="nav-btn next-btn"
        @click="$emit('next')"
        :disabled="activeIndex === evenements.length - 1"
      >
        Suivant <i class="pi pi-angle-right"></i>
      </button>
    </div>

    <div class="timeline-scroller" ref="scroller">
      <!-- On ajoute un padding dynamique ou un espace fixe pour éviter de cacher le texte -->
      <div class="track-spacer">
        <div class="track-container" :style="trackWidthStyle">
          <div class="track-line-bg"></div>
          <div class="track-line-fill" :style="{ width: progressPercentage }"></div>
          <div class="nodes-container">
            <div
              v-for="(evt, index) in evenements"
              :key="evt.id"
              class="node-wrapper"
              @click="$emit('set-chapter', index)"
              :ref="el => { if (el) nodesRefs[index] = el }"
            >
              <div
                class="node-point"
                :class="{ active: activeIndex === index, completed: index < activeIndex }"
              >
                <div class="node-core"></div>
              </div>
              <div class="node-label" :class="{ 'active-label': activeIndex === index }">
                {{ evt.titreCourt }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, computed } from 'vue'

const props = defineProps({
  evenements: {
    type: Array,
    required: true,
  },
  activeIndex: {
    type: Number,
    required: true,
  },
  progressPercentage: {
    type: String,
    required: true,
  },
})

defineEmits(['prev', 'next', 'set-chapter'])

const scroller = ref(null)
const nodesRefs = ref([])

const trackWidthStyle = computed(() => {
  const minWidthPerNode = 40;
  const calculatedWidth = props.evenements.length * minWidthPerNode;
  return { minWidth: `max(100%, ${calculatedWidth}px)` }
})

watch(() => props.activeIndex, async (newIndex) => {
  await nextTick()
  if (scroller.value && nodesRefs.value[newIndex]) {
    const node = nodesRefs.value[newIndex]
    const scrollerRect = scroller.value.getBoundingClientRect()
    const nodeRect = node.getBoundingClientRect()

    if (nodeRect.left < scrollerRect.left || nodeRect.right > scrollerRect.right) {
      node.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    }
  }
})
</script>

<style scoped>
.chapter-selector-area {
  padding: 20px 60px 40px 60px;
  background: linear-gradient(0deg, rgba(0, 0, 0, 1) 0%, transparent 100%);
  width: 100%;
}

.nav-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}
.nav-hint {
  color: #71717a;
  font-size: 0.9rem;
  letter-spacing: 1px;
  text-transform: uppercase;
}
.nav-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  padding: 10px 25px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  transition: 0.2s;
  border-radius: 4px;
}
.nav-btn:hover:not(:disabled) {
  background: #d97706;
  border-color: #fcd34d;
}
.nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.timeline-scroller {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  padding-top: 40px;
  padding-bottom: 20px;
  scroll-behavior: smooth;
  scrollbar-width: none;
}
.timeline-scroller::-webkit-scrollbar {
  display: none;
}

/* Nouveau spacer pour laisser de l'espace à gauche et à droite pour le texte des étiquettes ! */
.track-spacer {
  padding: 0 40px; /* Ajoute un vide aux deux extrémités */
  width: 100%;
}

.track-container {
  position: relative;
  height: 20px;
  display: flex;
  align-items: center;
}
.track-line-bg {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 4px;
  background-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-50%);
  z-index: 0;
}
.track-line-fill {
  position: absolute;
  top: 50%;
  left: 0;
  height: 4px;
  background-color: #d97706;
  transform: translateY(-50%);
  z-index: 1;
  transition: width 0.6s;
  box-shadow: 0 0 10px #d97706;
}
.nodes-container {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  width: 100%;
}
.node-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  width: 20px;
}
.node-point {
  width: 16px;
  height: 16px;
  background-color: #18181b;
  border: 2px solid #52525b;
  transform: rotate(45deg);
  transition: 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.node-core {
  width: 6px;
  height: 6px;
  background-color: #a1a1aa;
  opacity: 0;
  transition: 0.3s;
}
.node-point.completed {
  border-color: #d97706;
  background-color: #78350f;
}
.node-point.active {
  background-color: #fef3c7;
  border-color: #fff;
  transform: rotate(45deg) scale(1.6);
  box-shadow: 0 0 20px rgba(217, 119, 6, 0.8);
}
.node-point.active .node-core {
  opacity: 1;
  background-color: #d97706;
}
.node-label {
  position: absolute;
  top: -35px;
  font-size: 0.75rem;
  font-weight: bold;
  color: #a1a1aa;
  text-transform: uppercase;
  opacity: 0;
  transform: translateY(10px);
  transition: 0.3s;
  pointer-events: none;
  white-space: nowrap;
}
.node-label.active-label {
  opacity: 1;
  color: #fff;
  transform: translateY(0);
}
.node-wrapper:hover .node-point {
  transform: rotate(45deg) scale(1.4);
  border-color: #fff;
}
.node-wrapper:hover .node-label {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 768px) {
  .chapter-selector-area {
    padding: 10px 15px 15px 15px;
  }

  .nav-controls {
    flex-direction: row;
    gap: 10px;
    margin-bottom: 5px;
  }

  .nav-btn {
    width: 50%;
    padding: 10px 15px;
    font-size: 0.75rem;
  }

  .nav-hint {
    display: none;
  }

  /* Sur mobile on peut réduire un peu le vide si besoin pour optimiser */
  .track-spacer {
    padding: 0 30px;
  }
}
</style>
