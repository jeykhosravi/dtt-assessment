<template>
  <div class="house-details-page">
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
    <div v-else class="house-details">
      <div class="house-image-container">
        <img :src="house.image" :alt="`House at ${house.streetName}`" class="house-image" />

        <!-- Mobile absolute buttons on image -->
        <button class="mobile-back-overlay" @click="$router.push('/houses')">
          <img src="/images/back-white.png" alt="Back" class="mobile-overlay-icon" />
        </button>

        <div class="mobile-actions-overlay">
          <button class="mobile-edit-btn" @click="editHouse">
            <img src="/images/edit-white.png" alt="Edit" class="mobile-overlay-icon" />
          </button>
          <button class="mobile-delete-btn" @click="deleteHouse">
            <img src="/images/delete-white.png" alt="Delete" class="mobile-overlay-icon" />
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
              <button class="edit-btn" @click="editHouse">
                <img src="/images/edit.png" alt="Edit" class="action-icon" />
              </button>
              <button class="delete-btn" @click="deleteHouse">
                <img src="/images/delete.png" alt="Delete" class="action-icon" />
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getHouseById, apiRequest, type House } from '@/services/api'

const route = useRoute()
const router = useRouter()

const house = ref<House | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const formatPrice = (price: number): string => {
  return price.toLocaleString('en-US')
}

onMounted(async () => {
  try {
    const id = Number(route.params.id)
    house.value = await getHouseById(id)
  } catch {
    error.value = 'Failed to load house details.'
  } finally {
    loading.value = false
  }
})

function editHouse() {
  if (!house.value) return
  router.push(`/houses/${house.value.id}/edit`)
}

async function deleteHouse() {
  if (!house.value) return
  const confirmed = confirm('Are you sure you want to delete this house?')
  if (!confirmed) return

  try {
    await apiRequest(`/houses/${house.value.id}`, { method: 'DELETE' })
    router.push('/houses')
  } catch {
    alert('Failed to delete the house.')
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

.house-details {
  display: flex;
  flex-direction: column;
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

/* Mobile responsive */
@media (max-width: 640px) {
  .house-details-page {
    padding: 0;
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
  }

  .mobile-overlay-icon {
    width: 20px;
    height: 20px;
  }

  .house-details {
    max-width: 100%;
    position: relative;
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
