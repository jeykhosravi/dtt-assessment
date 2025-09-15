<script setup lang="ts">
import NavigationHeader from '@/components/NavigationHeader.vue'
</script>

<template>
  <div id="app">
    <NavigationHeader />
    <main>
      <router-view />
    </main>
  </div>
</template>

<style scoped>
#app {
  min-height: 100vh;
}

main {
  position: relative;
}
</style>
