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
      <router-link to="/favorites" class="footer-item">
        <div class="favorites-icon-container">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="footer-icon heart-icon"
            :class="{ active: isFavoritesPage }"
          >
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            />
          </svg>
          <span v-if="favoriteCount > 0" class="footer-badge">{{ favoriteCount }}</span>
        </div>
      </router-link>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useFavoritesStore } from '@/stores/favorites'

const route = useRoute()
const favoritesStore = useFavoritesStore()

const isHomePage = computed(() => {
  return route.path === '/' || route.path === '/houses' || route.path.startsWith('/houses/')
})

const isFavoritesPage = computed(() => {
  return route.path === '/favorites'
})

const isAboutPage = computed(() => {
  return route.path === '/about'
})

const favoriteCount = computed(() => favoritesStore.favoriteCount)
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

.favorites-icon-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.heart-icon {
  color: #ccc;
}

.heart-icon.active {
  color: #e74c3c !important;
  filter: none !important;
}

.footer-badge {
  position: absolute;
  top: -10px;
  right: -20px;
  background-color: #e74c3c;
  color: white;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 4px;
  border-radius: 10px;
  min-width: 12px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  border: 2px solid var(--color-bg2);
}

/* Show footer only on mobile devices */
@media (max-width: 640px) {
  .mobile-footer {
    display: block;
  }
}
</style>
