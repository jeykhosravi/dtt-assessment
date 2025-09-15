<template>
  <div class="about-page">
    <div class="page-container">
      <h1>About</h1>
      <p>Learn more about our platform and services.</p>
      <!-- About content will be added here later -->
    </div>
  </div>
</template>

<script setup lang="ts">
// About page logic will be implemented here
</script>

<style scoped>
.about-page {
  padding-top: 90px; /* Account for fixed header */
  min-height: 100vh;
}

.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

@media (max-width: 640px) {
  .about-page {
    padding-top: 80px;
  }

  .page-container {
    padding: 16px;
  }
}
</style>
