<template>
  <div class="form-row">
    <slot />
  </div>
</template>

<script setup lang="ts">
// No props needed, this is just a layout wrapper
</script>

<style scoped>
.form-row {
  display: grid;
  grid-template-columns: 1fr 140px;
  gap: 16px;
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
