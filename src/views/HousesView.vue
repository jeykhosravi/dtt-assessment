<template>
  <div class="houses-page">
    <div class="page-container">
      <div class="houses-header">
        <h1>Houses</h1>
        <!-- Create button for desktop -->
        <button class="desktop-create-btn" @click="handleCreateHouse">
          <img src="/images/plus-white.png" alt="Add house" class="plus-icon" />
          CREATE NEW
        </button>
        <!-- Plus button for mobile only -->
        <button class="mobile-plus-btn" @click="handleCreateHouse">
          <img src="/images/plus.png" alt="Add house" />
        </button>
      </div>

      <!-- Search and Sort Controls -->
      <div class="controls-container">
        <SearchInput v-model:search-query="searchQuery" :results-count="filteredHouses.length" />

        <SortButtons v-model:sort-by="sortBy" v-model:sort-direction="sortDirection" />
      </div>

      <div v-if="loading" class="loading">
        <p>Loading houses...</p>
      </div>

      <div v-else-if="error" class="error">
        <p>{{ error }}</p>
        <button @click="fetchHouses" class="retry-btn">Try Again</button>
      </div>

      <div v-else-if="houses.length === 0" class="no-houses">
        <p>No houses available at the moment.</p>
      </div>

      <!-- No search results -->
      <NoResults
        v-if="searchQuery && filteredHouses.length === 0"
        title="No results found."
        subtitle="Please try another keyword."
        image-alt="No search results"
      />

      <div v-else class="houses-list">
        <HouseCard v-for="house in filteredHouses" :key="house.id" :house="house" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import HouseCard from '@/components/HouseCard.vue'
import SearchInput from '@/components/SearchInput.vue'
import SortButtons from '@/components/SortButtons.vue'
import NoResults from '@/components/NoResults.vue'
import { getHouses, type House } from '@/services/api'

const router = useRouter()

const houses = ref<House[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const searchQuery = ref('')
const sortBy = ref<'price' | 'size' | null>(null)
const sortDirection = ref<'asc' | 'desc'>('asc')

const fetchHouses = async () => {
  loading.value = true
  error.value = null

  try {
    houses.value = await getHouses()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load houses'
    console.error('Error fetching houses:', err)
  } finally {
    loading.value = false
  }
}

// Handle create house action (placeholder for future implementation)
const handleCreateHouse = () => {
  router.push('/houses/create')
}

// Create the event handler function
const handleHouseDeleted = (event: Event) => {
  const customEvent = event as CustomEvent
  const deletedHouseId = customEvent.detail
  // Remove the deleted house from the local state
  houses.value = houses.value.filter((house) => house.id !== deletedHouseId)
}

// fetch houses
onMounted(async () => {
  try {
    houses.value = await getHouses()
  } catch {
    error.value = 'Failed to load houses.'
  } finally {
    loading.value = false
  }

  // Add event listener for house deletion
  window.addEventListener('house-deleted', handleHouseDeleted)
})

// Clean up event listener on component unmount
onUnmounted(() => {
  window.removeEventListener('house-deleted', handleHouseDeleted)
})

// computed filtered and sorted houses
const filteredHouses = computed(() => {
  let result = houses.value

  // Apply search filter
  if (searchQuery.value.trim()) {
    result = result.filter((house) =>
      `${house.streetName} ${house.houseNumber} ${house.zip} ${house.city}`
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase()),
    )
  }

  // Apply sorting
  if (sortBy.value) {
    result = [...result].sort((a, b) => {
      let comparison = 0

      if (sortBy.value === 'price') {
        comparison = a.price - b.price
      } else if (sortBy.value === 'size') {
        comparison = a.size - b.size
      }

      return sortDirection.value === 'desc' ? -comparison : comparison
    })
  }

  return result
})
</script>

<style scoped>
.houses-page {
  padding-top: 90px; /* Account for fixed header */
  min-height: 100vh;
  background-color: var(--color-bg1);
}

.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.houses-header {
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.houses-header h1 {
  margin: 0 0 8px 0;
  color: var(--text-primary);
  font-size: var(--h1-desktop);
  font-family: var(--font-primary);
  font-weight: 700;
}

.desktop-create-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background-color: var(--color-primary);
  border: none;
  border-radius: 6px;
  color: white;
  font-size: var(--btn-desktop);
  font-family: var(--font-secondary);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.desktop-create-btn .plus-icon {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

.desktop-create-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(235, 84, 64, 0.3);
}

.desktop-create-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(235, 84, 64, 0.3);
}

.mobile-plus-btn {
  display: none; /* Hidden on desktop */
  position: absolute;
  right: 0;
  width: 24px;
  height: 24px;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
}

.mobile-plus-btn img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.mobile-plus-btn:hover {
  transform: scale(1.05);
}

.mobile-plus-btn:active {
  transform: scale(0.95);
}

.controls-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.houses-count {
  margin: 0;
  color: var(--text-secondary);
  font-size: var(--body-desktop);
  font-family: var(--font-secondary);
}

.houses-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.loading,
.error,
.no-houses {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-secondary);
  font-size: var(--body-desktop);
  font-family: var(--font-secondary);
}

.error {
  color: var(--color-primary);
}

.retry-btn {
  margin-top: 16px;
  padding: 8px 16px;
  background-color: var(--color-primary);
  color: var(--color-bg2);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: var(--btn-desktop);
  font-family: var(--font-secondary);
  font-weight: 600;
}

.retry-btn:hover {
  opacity: 0.9;
}

@media (max-width: 640px) {
  .houses-page {
    padding-top: 20px;
  }

  .page-container {
    padding: 16px;
    max-width: 100%;
  }

  .houses-header {
    margin-bottom: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  .houses-header h1 {
    font-size: var(--h1-mobile);
  }

  .desktop-create-btn {
    display: none; /* Hidden on mobile */
  }

  .mobile-plus-btn {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .controls-container {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .houses-count {
    font-size: var(--body-mobile);
  }

  .houses-list {
    gap: 12px;
  }

  .loading,
  .error,
  .no-houses {
    font-size: var(--body-mobile);
  }

  .retry-btn {
    font-size: var(--btn-mobile);
  }
}
</style>
