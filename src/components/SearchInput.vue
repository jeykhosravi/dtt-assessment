<template>
  <div class="search-section">
    <!-- Search Input -->
    <div class="search-bar">
      <div class="search-input-container">
        <img src="/images/search.png" alt="Search" class="search-icon" />
        <input
          :value="searchQuery"
          @input="updateSearchQuery"
          type="text"
          placeholder="Search for a house"
          class="search-input"
        />
        <button v-if="searchQuery" @click="clearSearch" class="clear-btn">
          <img src="/images/clear.png" alt="Clear search" />
        </button>
      </div>
    </div>

    <!-- Results indicator -->
    <h2 v-if="searchQuery" class="results-indicator">
      {{ resultsCount }} {{ resultsCount === 1 ? 'result' : 'results' }} found
    </h2>
  </div>
</template>

<script setup lang="ts">
interface Props {
  searchQuery: string
  resultsCount: number
}

interface Emits {
  (e: 'update:searchQuery', value: string): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const updateSearchQuery = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:searchQuery', target.value)
}

const clearSearch = () => {
  emit('update:searchQuery', '')
}
</script>

<style scoped>
.search-section {
  flex: 1;
  min-width: 300px;
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

.results-indicator {
  margin: 0;
  color: var(--text-secondary);
  font-size: var(--body-desktop);
  font-family: var(--font-secondary);
  font-weight: 400;
}

@media (max-width: 640px) {
  .search-section {
    min-width: auto;
  }

  .results-indicator {
    font-size: var(--body-mobile);
  }
}
</style>
