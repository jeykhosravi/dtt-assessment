<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import NavigationHeader from '@/components/NavigationHeader.vue'
import MobileFooter from '@/components/MobileFooter.vue'
import { useFavoritesStore } from '@/stores/favorites'

const favoritesStore = useFavoritesStore()

// Global event listener for house deletions
const handleHouseDeleted = (event: CustomEvent) => {
  const deletedHouseId = event.detail
  if (deletedHouseId) {
    // Remove the deleted house from favorites
    favoritesStore.removeDeletedHouse(deletedHouseId)
  }
}

onMounted(() => {
  // Listen for house deletion events globally
  window.addEventListener('house-deleted', handleHouseDeleted as EventListener)
})

onUnmounted(() => {
  // Clean up event listener
  window.removeEventListener('house-deleted', handleHouseDeleted as EventListener)
})
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
