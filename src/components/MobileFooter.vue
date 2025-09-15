<template>
  <footer class="mobile-footer">
    <div class="footer-nav">
      <router-link to="/houses" class="footer-item">
        <img
          src="/images/home-mobile.png"
          alt="Home"
          class="footer-icon"
          :class="{ active: isHomePage }"
        />
      </router-link>
      <router-link to="/about" class="footer-item">
        <img
          src="/images/info-mobile.png"
          alt="About"
          class="footer-icon"
          :class="{ active: isAboutPage }"
        />
      </router-link>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const isHomePage = computed(() => {
  return route.path === '/' || route.path === '/houses' || route.path.startsWith('/houses/')
})

const isAboutPage = computed(() => {
  return route.path === '/about'
})
</script>

<style scoped>
.mobile-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: var(--color-bg2);
  border-top: 1px solid var(--color-tertiary-light);
  z-index: 1000;
  display: none; /* Hidden on desktop */
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
}

.footer-nav {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
  max-width: 400px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-item {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  padding: 12px;
  transition: all 0.2s ease;
}

.footer-icon {
  width: 24px;
  height: 24px;
  transition: all 0.2s ease;
  filter: grayscale(100%) opacity(0.6);
}

.footer-icon.active {
  filter: none;
  /* Apply primary color (#EB5440) as tint using CSS filters */
  filter: brightness(0) saturate(100%) invert(47%) sepia(84%) saturate(1380%) hue-rotate(334deg)
    brightness(97%) contrast(90%);
}

.footer-item:hover .footer-icon:not(.active) {
  filter: grayscale(100%) opacity(0.8);
  transform: scale(1.05);
}

.footer-item:active {
  transform: scale(0.95);
}

/* Show footer only on mobile devices */
@media (max-width: 640px) {
  .mobile-footer {
    display: block;
  }
}
</style>
