<template>
  <div class="houses-page">
    <div class="page-container">
      <div class="houses-header">
        <h1>Houses</h1>
      </div>

      <!-- Search Input -->
      <div class="search-bar">
        <div class="search-input-container">
          <img src="/images/search.png" alt="Search" class="search-icon" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search for a house"
            class="search-input"
          />
          <button v-if="searchQuery" @click="searchQuery = ''" class="clear-btn">
            <img src="/images/clear.png" alt="Clear search" />
          </button>
        </div>
      </div>

      <!-- Results indicator -->
      <h2 v-if="searchQuery" class="results-indicator">
        {{ filteredHouses.length }} {{ filteredHouses.length === 1 ? 'result' : 'results' }} found
      </h2>

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
      <div v-else-if="searchQuery && filteredHouses.length === 0" class="no-results">
        <img src="/images/no result.png" alt="No results" class="no-results-image" />
        <p class="no-results-title">No results found.</p>
        <p class="no-results-subtitle">Please try another keyword.</p>
      </div>

      <div v-else class="houses-list">
        <HouseCard v-for="house in filteredHouses" :key="house.id" :house="house" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import HouseCard from '@/components/HouseCard.vue'
import { getHouses, type House } from '@/services/api'

const houses = ref<House[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const fetchHouses = async () => {
  loading.value = true
  error.value = null

  try {
    houses.value = await getHouses()
    console.log('Fetched houses:', houses.value)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load houses'
    console.error('Error fetching houses:', err)
  } finally {
    loading.value = false
  }
}

// search houses input
const searchQuery = ref('')

// fetch houses
onMounted(async () => {
  try {
    houses.value = await getHouses()
  } catch {
    error.value = 'Failed to load houses.'
  } finally {
    loading.value = false
  }
})

// computed filtered houses
const filteredHouses = computed(() => {
  if (!searchQuery.value.trim()) return houses.value

  return houses.value.filter((house) =>
    `${house.streetName} ${house.houseNumber} ${house.zip} ${house.city}`
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase()),
  )
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
}

.houses-header h1 {
  margin: 0 0 8px 0;
  color: var(--text-primary);
  font-size: var(--h1-desktop);
  font-family: var(--font-primary);
  font-weight: 700;
}

.search-bar {
  margin-bottom: 1rem;
}

.search-input-container {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 12px;
  width: 16px;
  height: 16px;
  z-index: 1;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 8px 40px;
  border: 1px solid var(--color-tertiary-light);
  background-color: var(--color-tertiary-light);
  border-radius: 6px;
  font-size: 14px;
  font-family: var(--font-secondary);
  &:focus {
    outline: none;
  }
}

.clear-btn {
  position: absolute;
  right: 8px;
  background: transparent;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.clear-btn img {
  width: 18px;
  height: 18px;
}

.no-results {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-secondary);
  font-family: var(--font-secondary);
}

.no-results-image {
  width: 300px;
  height: 100%;
  margin-bottom: 20px;
  opacity: 0.6;
}

.no-results-title {
  font-size: 18px;
  font-weight: 400;
  margin: 0;
  color: var(--text-secondary);
}

.no-results-subtitle {
  font-size: 18px;
  margin: 0;
  color: var(--text-secondary);
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

@media (max-width: 768px) {
  .houses-page {
    padding-top: 80px;
  }

  .page-container {
    padding: 16px;
    max-width: 100%;
  }

  .houses-header {
    margin-bottom: 20px;
  }

  .houses-header h1 {
    font-size: var(--h1-mobile);
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

  .no-results-image {
    width: 200px;
    height: 100%;
  }

  .no-results-title {
    font-size: 16px;
  }

  .no-results-subtitle {
    font-size: 14px;
  }

  .retry-btn {
    font-size: var(--btn-mobile);
  }
}
</style>
