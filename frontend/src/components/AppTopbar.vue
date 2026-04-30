<template>
  <div class="topbar">
    <div class="topbar__title">{{ title }}</div>
    <div v-if="back" class="topbar__sub">
      <span class="topbar__back" @click="backPath ? $router.push(backPath) : $router.go(-1)">
        ← Voltar
      </span>
    </div>
    <div v-else-if="sub" class="topbar__sub">{{ sub }}</div>
  </div>
</template>

<script setup>
defineProps({
  title:    { type: String, required: true },
  sub:      { type: String, default: "" },
  back:     { type: Boolean, default: false },
  backPath: { type: String, default: "" },
});
</script>
<style scoped>
.topbar__back {
  cursor: pointer;
  color: var(--color-red);
}

.topbar__back:hover {
  color: var(--color-red-hover);
}
</style>