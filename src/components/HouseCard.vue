<template>
  <div class="house-card" @click="navigateToDetails">
    <div class="house-image">
      <img
        :src="getImageUrl(house.image)"
        :alt="`House at ${house.streetName}`"
        @error="handleImageError"
      />
    </div>
    <div class="house-info">
      <div class="house-header">
        <div class="address-with-buttons">
          <h3 class="house-address">
            {{ house.streetName }} {{ house.houseNumber
            }}<span v-if="house.numberAddition"> {{ house.numberAddition }}</span>
          </h3>
          <div class="action-buttons">
            <button class="action-btn edit-btn" @click.stop="editHouse">
              <img src="/images/edit.png" alt="Edit" />
            </button>
            <button class="action-btn delete-btn" @click.stop="deleteHouse">
              <img src="/images/delete.png" alt="Delete" />
            </button>
          </div>
        </div>
        <p class="house-price">€ {{ formatPrice(house.price) }}</p>
      </div>

      <p class="postal-city">{{ house.zip }} {{ house.city }}</p>

      <div class="house-details">
        <div class="detail-item">
          <img src="/images/bed.png" alt="Bedrooms" />
          <span>{{ house.bedrooms }}</span>
        </div>
        <div class="detail-item">
          <img src="/images/bath.png" alt="Bathrooms" />
          <span>{{ house.bathrooms }}</span>
        </div>
        <div class="detail-item">
          <img src="/images/size.png" alt="Size in square meters" />
          <span>{{ house.size }} m²</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { apiRequest, type House } from '@/services/api'

interface Props {
  house: House
}

const props = defineProps<Props>()
const router = useRouter()

const navigateToDetails = () => {
  router.push(`/houses/${props.house.id}`)
}

const editHouse = () => {
  router.push(`/houses/${props.house.id}/edit`)
}

const deleteHouse = async () => {
  const confirmed = confirm('Are you sure you want to delete this house?')
  if (!confirmed) return

  try {
    await apiRequest(`/houses/${props.house.id}`, { method: 'DELETE' })
    // Refresh the page or emit an event to parent component to update the list
    window.location.reload()
  } catch {
    alert('Failed to delete the house.')
  }
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = 'https://images.unsplash.com/photo-1558618047-d1c00293b19c?w=400&h=300&fit=crop'
}

const formatPrice = (price: number): string => {
  return price.toLocaleString('en-US')
}

const getImageUrl = (imageUrl: string): string => {
  // If no image URL is provided, return the fallback
  if (!imageUrl || imageUrl === 'null' || imageUrl === 'undefined') {
    console.log('No valid image URL found, using fallback')
    return 'https://images.unsplash.com/photo-1558618047-d1c00293b19c?w=400&h=300&fit=crop'
  }

  // If it's already a full URL, use it as is
  if (imageUrl.startsWith('http')) {
    return imageUrl
  }

  // Otherwise, prefix with the API URL
  const apiBaseUrl = import.meta.env.VITE_API_URL as string
  const fullUrl = imageUrl.startsWith('/')
    ? `${apiBaseUrl}${imageUrl}`
    : `${apiBaseUrl}/${imageUrl}`

  console.log('Image URL resolved to:', fullUrl)
  return fullUrl
}
</script>

<style scoped>
.house-card {
  display: flex;
  background: var(--color-bg2);
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  cursor: pointer;
}

.house-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.house-image {
  width: 120px;
  height: 120px;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 8px;
}

.house-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.house-info {
  flex: 1;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.address-with-buttons {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
}

.house-address {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  font-family: var(--font-primary); /* Montserrat */
  line-height: 1.3;
  flex: 1;
}

.action-buttons {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.action-btn {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn img {
  width: 16px;
  height: 16px;
}

.action-btn:hover img {
  opacity: 1;
}

.house-price {
  margin: 4px 0;
  font-size: 14px;
  font-weight: 400;
  color: var(--text-primary);
  font-family: var(--font-primary); /* Montserrat */
}

.postal-city {
  margin: 0 0 8px 0;
  font-size: 12px;
  color: var(--text-secondary);
  font-family: var(--font-secondary); /* Open Sans */
}

.house-details {
  display: flex;
  gap: 16px;
  margin-top: auto;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--text-secondary);
  font-family: var(--font-secondary);
}

.detail-item img {
  width: 14px;
  height: 14px;
  opacity: 0.8;
}
</style>
