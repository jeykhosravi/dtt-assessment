<template>
  <div class="sort-bar">
    <button @click="handleSort('price')" class="sort-btn" :class="{ active: sortBy === 'price' }">
      Price
      <span v-if="sortBy === 'price'" class="sort-direction">
        {{ sortDirection === 'asc' ? '↑' : '↓' }}
      </span>
    </button>
    <button @click="handleSort('size')" class="sort-btn" :class="{ active: sortBy === 'size' }">
      Size
      <span v-if="sortBy === 'size'" class="sort-direction">
        {{ sortDirection === 'asc' ? '↑' : '↓' }}
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  sortBy: 'price' | 'size' | null
  sortDirection: 'asc' | 'desc'
}

interface Emits {
  (e: 'update:sortBy', value: 'price' | 'size' | null): void
  (e: 'update:sortDirection', value: 'asc' | 'desc'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleSort = (type: 'price' | 'size') => {
  if (props.sortBy === type) {
    if (props.sortDirection === 'asc') {
      // First click: ascending -> descending
      emit('update:sortDirection', 'desc')
    } else {
      // Second click: descending -> clear sort
      emit('update:sortBy', null)
      emit('update:sortDirection', 'asc')
    }
  } else {
    // If clicking a different button, set new sort type and default to ascending
    emit('update:sortBy', type)
    emit('update:sortDirection', 'asc')
  }
}
</script>

<style scoped>
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

@media (max-width: 640px) {
  .sort-bar {
    justify-content: center;
    gap: 8px;
  }

  .sort-btn {
    flex: 1;
    justify-content: center;
    min-width: 80px;
  }
}
</style>
