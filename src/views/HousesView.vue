<template>
  <div class="houses-page">
    <div class="page-container">
      <div class="houses-header">
        <h1>Houses</h1>
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

      <div v-else class="houses-list">
        <HouseCard v-for="house in houses" :key="house.id" :house="house" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
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

onMounted(() => {
  fetchHouses()
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

  .retry-btn {
    font-size: var(--btn-mobile);
  }
}
</style>
