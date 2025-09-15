<script setup lang="ts">
import NavigationHeader from '@/components/NavigationHeader.vue'
import MobileFooter from '@/components/MobileFooter.vue'
</script>

<template>
  <div id="app">
    <NavigationHeader />
    <main>
      <router-view />
    </main>
    <MobileFooter />
  </div>
</template>

<style scoped>
#app {
  min-height: 100vh;
}

main {
  position: relative;
  padding-top: 70px; /* Account for fixed header height */
  min-height: calc(100vh - 70px);
}

@media (max-width: 640px) {
  main {
    padding-top: 0; /* No header on mobile */
    min-height: 100vh;
    padding-bottom: 70px; /* Account for mobile footer height */
  }
}
</style>
