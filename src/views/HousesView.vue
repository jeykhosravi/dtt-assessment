<template>
  <div class="houses-page">
    <div class="page-container">
      <h1>Houses</h1>
      <p>Welcome to the Houses page. Here you can browse and manage houses.</p>
      <!-- Houses content will be added here later -->
    </div>
  </div>
</template>

<script setup lang="ts">
// Houses page logic will be implemented here
</script>

<style scoped>
.houses-page {
  padding-top: 90px; /* Account for fixed header */
  min-height: 100vh;
}

.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

@media (max-width: 768px) {
  .houses-page {
    padding-top: 80px;
  }

  .page-container {
    padding: 16px;
  }
}
</style>
