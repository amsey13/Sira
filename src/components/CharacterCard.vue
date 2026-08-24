<template>
  <div class="perso-card">
    <div class="perso-avatar" :style="{ backgroundColor: perso.couleur || '#d97706' }">
      <span>{{ perso.initiales || perso.nom.charAt(0) }}</span>
    </div>
    <div class="perso-info">
      <h3>{{ perso.nom }}</h3>
      <p>{{ perso.role }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  perso: {
    type: Object,
    required: true,
  },
})
</script>

<style scoped>
/* Ne ramène ici QUE le CSS lié aux perso-card depuis FriseMecquoise.vue */
.perso-card {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  background: linear-gradient(135deg, rgba(217, 119, 6, 0.15) 0%, rgba(50, 50, 50, 0.3) 100%);
  padding: 20px;
  border-radius: 12px;
  border: 2px solid rgba(217, 119, 6, 0.3);
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}
.perso-card:hover {
  background: linear-gradient(135deg, rgba(217, 119, 6, 0.25) 0%, rgba(100, 100, 100, 0.4) 100%);
  border-color: #d97706;
  box-shadow: 0 8px 32px rgba(217, 119, 6, 0.2);
  transform: translateY(-5px);
}
.perso-avatar {
  min-width: 70px;
  width: 70px;
  height: 70px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  font-weight: bold;
  color: #fff;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}
.perso-info h3 {
  margin: 0 0 5px 0;
  font-size: 1.1rem;
  color: #fcd34d;
}
.perso-info p {
  margin: 0;
  color: #d4d4d8;
  font-size: 0.9rem;
  line-height: 1.5;
}
</style>
