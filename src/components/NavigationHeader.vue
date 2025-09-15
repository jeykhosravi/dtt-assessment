<template>
  <header class="navigation-header">
    <div class="nav-container">
      <div class="logo">
        <img src="/images/dtt-logo.png" alt="DTT" class="logo-image" />
      </div>
      <nav class="nav-menu">
        <router-link to="/" class="nav-link" :class="{ active: $route.path === '/' }">
          Houses
        </router-link>
        <router-link to="/about" class="nav-link" :class="{ active: $route.path === '/about' }">
          About
        </router-link>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const $route = useRoute()
</script>

<style scoped>
.navigation-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: var(--color-bg2);
  z-index: 1000;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 50px;
  height: 70px;
}

.logo {
  display: flex;
  align-items: center;
}

.logo-image {
  height: 40px;
  width: auto;
}

.nav-menu {
  display: flex;
  gap: 40px;
}

.nav-link {
  font-family: var(--font-primary);
  font-size: var(--menu-inactive-desktop);
  font-weight: 600;
  color: var(--text-secondary);
  text-decoration: none;
  padding: 10px 0;
  position: relative;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: var(--text-primary);
}

.nav-link.active {
  color: var(--text-primary);
  font-weight: 700;
}

/* Mobile responsiveness - Hide navigation header on mobile */
@media (max-width: 640px) {
  .navigation-header {
    display: none;
  }
}
</style>
