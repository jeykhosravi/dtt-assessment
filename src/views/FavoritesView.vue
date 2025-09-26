<template>
  <div class="favorites-view">
    <div class="container">
      <div class="search-header">
        <h1>Your Favorites</h1>
        <p class="favorites-count">
          {{ favoriteCount }} {{ favoriteCount === 1 ? 'house' : 'houses' }} in your favorites
        </p>
      </div>

      <div class="favorites-content">
        <NoResults
          v-if="favoriteCount === 0"
          title="No favorites found."
          subtitle="Start adding houses to your favorites to see them here!"
          image-alt="No favorites"
        >
          <template #action>
            <router-link to="/houses" class="back-to-houses-btn"> Browse Houses </router-link>
          </template>
        </NoResults>

        <div v-else class="houses-grid">
          <HouseCard v-for="house in favoriteHouses" :key="house.id" :house="house" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useFavoritesStore } from '@/stores/favorites'
import { getHouses, type House } from '@/services/api'
import HouseCard from '@/components/HouseCard.vue'
import NoResults from '@/components/NoResults.vue'

const favoritesStore = useFavoritesStore()
const allHouses = ref<House[]>([])
const loading = ref(true)

const favoriteCount = computed(() => favoritesStore.favoriteCount)

const favoriteHouses = computed(() => {
  const favoriteIds = favoritesStore.getFavoriteIds
  return allHouses.value.filter((house) => favoriteIds.includes(house.id))
})

const fetchHouses = async () => {
  try {
    loading.value = true
    const response = await getHouses()
    allHouses.value = response
  } catch (error) {
    console.error('Failed to fetch houses:', error)
  } finally {
    loading.value = false
  }
}

// Listen for house deletions to refresh the list
const handleHouseDeleted = () => {
  fetchHouses()
}

onMounted(() => {
  fetchHouses()
  window.addEventListener('house-deleted', handleHouseDeleted)
})

onUnmounted(() => {
  window.removeEventListener('house-deleted', handleHouseDeleted)
})
</script>

<style scoped>
.favorites-view {
  min-height: calc(100vh - 70px);
  background-color: var(--color-bg);
  padding-top: 70px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.search-header {
  margin-bottom: 40px;
  text-align: center;
}

.search-header h1 {
  font-family: var(--font-primary);
  font-size: var(--header-desktop);
  font-weight: bold;
  color: var(--color-text);
  margin-bottom: 12px;
}

.favorites-count {
  font-family: var(--font-primary);
  font-size: var(--body-desktop);
  color: var(--color-text-secondary);
  margin: 0;
}

.favorites-content {
  width: 100%;
}

.back-to-houses-btn {
  background-color: var(--color-primary);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-family: var(--font-primary);
  font-size: var(--body-desktop);
  font-weight: 600;
  transition: background-color 0.2s ease;
}

.back-to-houses-btn:hover {
  background-color: var(--color-primary-dark);
}

.houses-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Mobile styles */
@media (max-width: 768px) {
  .container {
    padding: 20px 16px;
  }

  .search-header h1 {
    font-size: var(--header-mobile);
  }

  .favorites-count {
    font-size: var(--body-mobile);
  }
}
</style>
