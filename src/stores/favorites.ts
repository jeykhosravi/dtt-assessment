import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { House } from '@/services/api' // make sure you have this type

export const useFavoritesStore = defineStore('favorites', () => {
  // --- State ---
  // Use a Map so we can store full House objects keyed by ID
  const favoriteHouses = ref<Map<number, House>>(new Map())

  // --- Getters ---
  const isFavorite = computed(() => (houseId: number) => {
    return favoriteHouses.value.has(houseId)
  })

  const favoriteCount = computed(() => favoriteHouses.value.size)

  const getFavoriteIds = computed(() => Array.from(favoriteHouses.value.keys()))

  const getFavoriteHouses = computed(() => Array.from(favoriteHouses.value.values()))

  // --- Actions ---
  const toggleFavorite = (house: House) => {
    if (favoriteHouses.value.has(house.id)) {
      favoriteHouses.value.delete(house.id)
    } else {
      favoriteHouses.value.set(house.id, house)
    }
  }

  const addFavorite = (house: House) => {
    favoriteHouses.value.set(house.id, house)
  }

  const removeFavorite = (houseId: number) => {
    favoriteHouses.value.delete(houseId)
  }

  const removeDeletedHouse = (houseId: number) => {
    // Remove from favorites when a house is deleted
    favoriteHouses.value.delete(houseId)
  }

  const clearFavorites = () => {
    favoriteHouses.value.clear()
  }

  // --- Persistence with localStorage ---
  // Save to localStorage whenever favorites change
  watch(
    favoriteHouses,
    (newVal) => {
      const serialized = JSON.stringify(Array.from(newVal.entries()))
      localStorage.setItem('favorites', serialized)
    },
    { deep: true },
  )

  // Load from localStorage on init
  const loadFavorites = () => {
    const stored = localStorage.getItem('favorites')
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as [number, House][]
        favoriteHouses.value = new Map(parsed)
      } catch (e) {
        console.error('Failed to parse favorites from localStorage', e)
      }
    }
  }
  loadFavorites()

  return {
    favoriteHouses,
    isFavorite,
    favoriteCount,
    getFavoriteIds,
    getFavoriteHouses,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    removeDeletedHouse,
    clearFavorites,
  }
})
