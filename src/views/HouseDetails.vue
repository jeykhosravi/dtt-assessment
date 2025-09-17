<template>
  <div class="house-details-page">
    <DeleteConfirmationModal
      :show="showDeleteModal"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />

    <!-- Desktop back button -->
    <button class="back-btn desktop-back" @click="$router.push('/houses')">
      <img src="/images/back.png" alt="Back" class="back-icon" />
      Back to overview
    </button>

    <!-- Mobile back button (icon only) -->
    <button class="back-btn mobile-back" @click="$router.push('/houses')">
      <img src="/images/back.png" alt="Back" class="back-icon" />
    </button>

    <div v-if="loading" class="loading">Loading house details...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="!house" class="not-found">House not found.</div>
    <div v-else class="house-details-container">
      <div class="house-details">
        <div class="house-image-container">
          <img :src="house.image" :alt="`House at ${house.streetName}`" class="house-image" />

          <!-- Mobile absolute buttons on image -->
          <button class="mobile-back-overlay" @click="$router.push('/houses')">
            <img src="/images/back-white.png" alt="Back" class="mobile-overlay-icon" />
          </button>

          <div class="mobile-actions-overlay">
            <button
              class="mobile-edit-btn"
              @click="editHouse"
              :disabled="!house.madeByMe"
              :title="house.madeByMe ? 'Edit listing' : 'You cannot edit this listing'"
            >
              <img src="/images/edit-white.png" alt="Edit" class="mobile-overlay-icon" />
              <span v-if="!house.madeByMe" class="tooltip">You cannot edit this listing</span>
            </button>
            <button
              class="mobile-delete-btn"
              @click="deleteHouse($event)"
              :disabled="!house.madeByMe"
              :title="house.madeByMe ? 'Delete listing' : 'You cannot delete this listing'"
            >
              <img src="/images/delete-white.png" alt="Delete" class="mobile-overlay-icon" />
              <span v-if="!house.madeByMe" class="tooltip">You cannot delete this listing</span>
            </button>
          </div>
        </div>

        <div class="house-info">
          <div class="address-section">
            <div class="address-header">
              <h2 class="house-address">
                {{ house.streetName }} {{ house.houseNumber
                }}{{ house.numberAddition ? house.numberAddition : '' }}
              </h2>
              <div class="actions-buttons">
                <button
                  class="edit-btn"
                  @click="editHouse"
                  :disabled="!house.madeByMe"
                  :title="house.madeByMe ? 'Edit listing' : 'You cannot edit this listing'"
                >
                  <img src="/images/edit.png" alt="Edit" class="action-icon" />
                  <span v-if="!house.madeByMe" class="tooltip">You cannot edit this listing</span>
                </button>
                <button
                  class="delete-btn"
                  @click="deleteHouse($event)"
                  :disabled="!house.madeByMe"
                  :title="house.madeByMe ? 'Delete listing' : 'You cannot delete this listing'"
                >
                  <img src="/images/delete.png" alt="Delete" class="action-icon" />
                  <span v-if="!house.madeByMe" class="tooltip">You cannot delete this listing</span>
                </button>
              </div>
            </div>
            <div class="location-info">
              <img src="/images/location.png" alt="Location" class="detail-icon" />
              <span class="postal-code">{{ house.zip }}</span>
              <span class="city">{{ house.city }}</span>
            </div>
          </div>

          <!-- Details section with two rows -->
          <div class="details-section">
            <!-- First row: Price, Size, Construction -->
            <div class="details-row">
              <div class="detail-item price-item">
                <img src="/images/price.png" alt="Price" class="detail-icon" />
                <span> {{ formatPrice(house.price) }}</span>
              </div>
              <div class="detail-item">
                <img src="/images/size.png" alt="Size" class="detail-icon" />
                <span>{{ house.size }} m²</span>
              </div>
              <div class="detail-item">
                <img src="/images/construction.png" alt="Built" class="detail-icon" />
                <span>Built in {{ house.constructionYear }}</span>
              </div>
            </div>

            <!-- Second row: Bedrooms, Bathrooms, Garage -->
            <div class="details-row">
              <div class="detail-item">
                <img src="/images/bed.png" alt="Bedrooms" class="detail-icon" />
                <span>{{ house.bedrooms }}</span>
              </div>
              <div class="detail-item">
                <img src="/images/bath.png" alt="Bathrooms" class="detail-icon" />
                <span>{{ house.bathrooms }}</span>
              </div>
              <div class="detail-item">
                <img src="/images/garage.png" alt="Garage" class="detail-icon" />
                <span>{{ house.hasGarage ? 'Yes' : 'No' }}</span>
              </div>
            </div>
          </div>

          <div class="description-section">
            <p class="description">{{ house.description }}</p>
          </div>
        </div>
      </div>

      <!-- Recommended for you section -->
      <div v-if="recommendedHouses.length > 0" class="recommended-section">
        <h3 class="recommended-title">Recommended for you</h3>
        <div class="recommended-cards">
          <RecommendedCard
            v-for="recommendedHouse in recommendedHouses"
            :key="recommendedHouse.id"
            :house="recommendedHouse"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getHouseById, getHouses, apiRequest, type House } from '@/services/api'
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal.vue'
import RecommendedCard from '@/components/RecommendedCard.vue'

const route = useRoute()
const router = useRouter()

const house = ref<House | null>(null)
const recommendedHouses = ref<House[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const showDeleteModal = ref(false)

const formatPrice = (price: number): string => {
  return price.toLocaleString('en-US')
}

const getRecommendedHouses = async (currentHouse: House) => {
  try {
    const allHouses = await getHouses()

    // Filter out the current house and get up to 3 recommendations
    const otherHouses = allHouses.filter((h) => h.id !== currentHouse.id)

    // Simple recommendation logic: prioritize houses in the same city, then similar price range
    const sameCity = otherHouses.filter((h) => h.city === currentHouse.city)
    const similarPrice = otherHouses.filter(
      (h) => Math.abs(h.price - currentHouse.price) <= currentHouse.price * 0.3, // Within 30% price range
    )

    // Combine and deduplicate recommendations
    const recommendations = new Set<House>()

    // First priority: same city
    sameCity.slice(0, 2).forEach((h) => recommendations.add(h))

    // Second priority: similar price
    similarPrice.slice(0, 3 - recommendations.size).forEach((h) => recommendations.add(h))

    // Fill remaining slots with any other houses
    const remaining = 3 - recommendations.size
    if (remaining > 0) {
      otherHouses
        .filter((h) => !recommendations.has(h))
        .slice(0, remaining)
        .forEach((h) => recommendations.add(h))
    }

    recommendedHouses.value = Array.from(recommendations).slice(0, 3)
  } catch (error) {
    console.error('Failed to fetch recommended houses:', error)
    recommendedHouses.value = []
  }
}

import { watch } from 'vue'

// existing onMounted fetch
onMounted(fetchHouse)

// refactored fetch logic into a function
async function fetchHouse() {
  loading.value = true
  error.value = null
  try {
    const id = Number(route.params.id)
    house.value = await getHouseById(id)

    if (house.value) {
      await getRecommendedHouses(house.value)
    }
  } catch {
    error.value = 'Failed to load house details.'
  } finally {
    loading.value = false
  }
}

// watch route changes
watch(
  () => route.params.id,
  () => {
    fetchHouse()
  },
)

function editHouse() {
  if (!house.value) return
  if (!house.value.madeByMe) return
  router.push(`/houses/${house.value.id}/edit`)
}

function deleteHouse(event?: Event) {
  if (event) event.stopPropagation()
  if (!house.value) return
  if (!house.value.madeByMe) return
  // Show the delete confirmation modal instead of using the browser's confirm dialog
  showDeleteModal.value = true
}

function cancelDelete() {
  showDeleteModal.value = false
}

async function confirmDelete() {
  if (!house.value) return

  try {
    console.log(`Attempting to delete house with ID: ${house.value.id}`)

    // Be explicit with the URL and include a trailing slash if needed
    const endpoint = `/houses/${house.value.id}/`

    await apiRequest(endpoint, {
      method: 'DELETE',
      // Explicitly set headers to ensure proper formatting
      headers: {
        'X-Api-Key': import.meta.env.VITE_API_KEY as string,
      },
    })

    console.log(`Successfully deleted house with ID: ${house.value.id}`)
    showDeleteModal.value = false

    // Navigate to houses route using replace to avoid affecting the history
    router.replace('/houses')
  } catch (error) {
    console.error('Failed to delete the house:', error)
    alert('Failed to delete the house. Please try again.')
    // Close the modal after showing the alert
    showDeleteModal.value = false
  }
}
</script>

<style scoped>
.house-details-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
  font-family: var(--font-secondary);
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  background: none;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
  margin-bottom: 30px;
  font-family: var(--font-secondary);
  font-size: 18px;
  font-weight: 700;
  padding: 0;
}

/* Hide mobile back button on desktop */
.mobile-back {
  display: none;
}

/* Hide mobile overlay buttons on desktop */
.mobile-back-overlay,
.mobile-actions-overlay {
  display: none;
}

.back-icon {
  width: 18px;
  height: 18px;
}

.loading,
.error,
.not-found {
  text-align: center;
  padding: 40px;
  color: var(--text-secondary);
}

.house-details-container {
  display: flex;
  gap: 40px;
  align-items: flex-start;
}

.house-details {
  display: flex;
  flex-direction: column;
  flex: 1;
  max-width: 700px;
  overflow: hidden;
}

.house-image-container {
  position: relative;
  z-index: 1;
}

.house-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.edit-btn,
.delete-btn {
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  position: relative;
}

.edit-btn:disabled,
.delete-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.tooltip {
  position: absolute;
  top: -30px;
  right: 0;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  white-space: nowrap;
  visibility: hidden;
  opacity: 0;
  transition:
    opacity 0.2s ease,
    visibility 0.2s ease;
  z-index: 10;
}

.edit-btn:disabled:hover .tooltip,
.delete-btn:disabled:hover .tooltip {
  visibility: visible;
  opacity: 1;
}

.action-icon {
  width: 20px;
  height: 20px;
}

.house-info {
  background: var(--color-bg2);
  padding: 40px;
  height: 100%;
  position: relative;
  z-index: 0;
}

.address-section {
  margin-bottom: 16px;
}

.address-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.house-address {
  font-family: var(--font-primary);
  font-size: var(--h2-desktop);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  flex: 1;
}

.actions-buttons {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.location-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  font-size: 14px;
}

.postal-code,
.city {
  color: var(--text-secondary);
}

.details-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
}

.details-row {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  font-size: 14px;
  min-width: 120px;
}

.detail-item.price-item span {
  font-weight: 600;
  font-size: 14px;
  color: var(--text-secondary);
}

.detail-icon {
  width: 18px;
  height: 18px;
}

.description {
  color: var(--text-secondary);
  line-height: 1.7;
  margin: 0;
  font-size: 14px;
}

.recommended-section {
  flex-shrink: 0;
  width: 400px;
  margin-top: 0;
  padding-top: 0;
  border-top: none;
}

.recommended-title {
  font-family: var(--font-primary);
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 24px 0;
}

.recommended-cards {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Mobile responsive */
@media (max-width: 640px) {
  .house-details-page {
    padding: 0;
  }

  .house-details-container {
    flex-direction: column;
    gap: 0;
  }

  /* Hide desktop back button on mobile */
  .desktop-back {
    display: none !important;
  }

  /* Show mobile back button as overlay on image */
  .mobile-back {
    display: flex !important;
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 4;
    background: none;
    border: none;
    width: 40px;
    height: 40px;
    align-items: center;
    justify-content: center;
    margin-bottom: 0;
    padding: 0;
  }

  .mobile-back .back-icon {
    filter: brightness(0) invert(1);
  }

  /* Show mobile overlay buttons */
  .mobile-back-overlay {
    display: flex !important;
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 10;
    background: none;
    border: none;
    width: 40px;
    height: 40px;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 0;
  }

  .mobile-actions-overlay {
    display: flex !important;
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 10;
    gap: 8px;
  }

  .mobile-edit-btn,
  .mobile-delete-btn {
    background: none;
    border: none;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 0;
    position: relative;
  }

  .mobile-edit-btn:disabled,
  .mobile-delete-btn:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }

  .mobile-edit-btn .tooltip,
  .mobile-delete-btn .tooltip {
    top: 40px;
    right: -40px;
    width: 120px;
  }

  .mobile-overlay-icon {
    width: 20px;
    height: 20px;
  }

  .house-details {
    max-width: 100%;
    position: relative;
  }

  .recommended-section {
    width: 100%;
    margin-top: 24px;
  }

  .recommended-title {
    font-size: 16px;
    padding: 8px;
    margin-bottom: 16px;
  }

  .recommended-cards {
    display: flex;
    flex-direction: column;
    padding: 8px;
    gap: 12px;
  }

  .house-image-container {
    margin-bottom: 0;
    position: relative;
  }

  /* Hide desktop actions buttons on mobile */
  .address-header .actions-buttons {
    display: none !important;
  }

  .house-image {
    height: 40vh;
    border-radius: 0;
  }

  .house-info {
    padding: 20px 16px;
    margin-top: -80px;
    position: relative;
    z-index: 3;
    border-radius: 32px 32px 0 0;
    border-top: 1px solid var(--color-tertiary-light);
  }

  .house-address {
    font-size: var(--h1-mobile);
    margin-bottom: 4px;
  }

  .address-section {
    margin-bottom: 12px;
  }

  .details-section {
    gap: 8px 16px;
    margin-bottom: 16px;
  }

  .detail-item {
    min-width: 100px;
    font-size: 12px;
  }

  .description {
    font-size: 13px;
  }
}
</style>
