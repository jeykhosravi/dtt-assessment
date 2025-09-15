<template>
  <div class="houses-page">
    <div class="page-container">
      <div class="houses-header">
        <h1>Houses</h1>
        <!-- Plus button for mobile only -->
        <button class="mobile-plus-btn" @click="handleCreateHouse">
          <img src="/images/plus.png" alt="Add house" />
        </button>
      </div>

      <!-- Search and Sort Controls -->
      <div class="controls-bar">
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

        <!-- Sort Buttons -->
        <div class="sort-bar">
          <button
            @click="toggleSort('price')"
            class="sort-btn"
            :class="{ active: sortBy === 'price' }"
          >
            Price
            <span v-if="sortBy === 'price'" class="sort-direction">
              {{ sortDirection === 'asc' ? '↑' : '↓' }}
            </span>
          </button>
          <button
            @click="toggleSort('size')"
            class="sort-btn"
            :class="{ active: sortBy === 'size' }"
          >
            Size
            <span v-if="sortBy === 'size'" class="sort-direction">
              {{ sortDirection === 'asc' ? '↑' : '↓' }}
            </span>
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
const searchQuery = ref('')
const sortBy = ref<'price' | 'size' | null>(null)
const sortDirection = ref<'asc' | 'desc'>('asc')

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

// toggle sort function
const toggleSort = (type: 'price' | 'size') => {
  if (sortBy.value === type) {
    if (sortDirection.value === 'asc') {
      // First click: ascending
      sortDirection.value = 'desc'
    } else {
      // Second click: descending -> clear sort
      sortBy.value = null
      sortDirection.value = 'asc'
    }
  } else {
    // If clicking a different button, set new sort type and default to ascending
    sortBy.value = type
    sortDirection.value = 'asc'
  }
}

// Handle create house action (placeholder for future implementation)
const handleCreateHouse = () => {
  // TODO: Implement create house functionality
  console.log('Create house clicked')
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
  justify-content: start;
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

.controls-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.search-bar {
  flex: 1;
  min-width: 300px;
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

.sort-bar {
  display: flex;
  align-items: center;
  gap: 0;
}

.sort-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px 16px;
  border: none;
  background-color: #c8c8c8;
  color: white;
  font-size: 14px;
  font-family: var(--font-secondary);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100px;
  border-radius: 0;
}

.sort-btn:first-child {
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
}

.sort-btn:last-child {
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
}

.sort-btn:hover {
  opacity: 0.9;
}

.sort-btn:focus {
  outline: none;
}

.sort-btn.active {
  background-color: #e65541;
  color: white;
}

.sort-direction {
  font-weight: 700;
  font-size: 12px;
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

  .mobile-plus-btn {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .controls-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .search-bar {
    min-width: auto;
  }

  .sort-bar {
    justify-content: center;
    gap: 8px;
  }

  .sort-btn {
    flex: 1;
    justify-content: center;
    min-width: 80px;
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
