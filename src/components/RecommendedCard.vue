<template>
  <div class="recommended-card" @click="navigateToDetails">
    <div class="recommended-image">
      <img
        :src="getImageUrl(house.image)"
        :alt="`House at ${house.streetName}`"
        @error="handleImageError"
      />
    </div>
    <div class="recommended-info">
      <h4 class="recommended-address">
        {{ house.streetName }} {{ house.houseNumber
        }}<span v-if="house.numberAddition"> {{ house.numberAddition }}</span>
      </h4>
      <p class="recommended-price">{{ formatPrice(house.price) }}</p>
      <p class="recommended-location">{{ house.zip }} {{ house.city }}</p>
      <div class="recommended-details">
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
import { type House } from '@/services/api'

interface Props {
  house: House
}

const props = defineProps<Props>()
const router = useRouter()

const navigateToDetails = () => {
  router.push(`/houses/${props.house.id}`)
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = 'https://images.unsplash.com/photo-1558618047-d1c00293b19c?w=400&h=300&fit=crop'
}

// getting price formatted in euros instead of hard coding the euro sign
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(price)
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
.recommended-card {
  background: var(--color-bg2);
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  height: 100%;
  display: flex;
  flex-direction: row;
  min-height: 120px;
}

.recommended-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.recommended-image {
  width: 120px;
  height: 120px;
  overflow: hidden;
  flex-shrink: 0;
  padding: 8px;
}

.recommended-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}

.recommended-info {
  padding: 12px 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.recommended-address {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  font-family: var(--font-primary);
  line-height: 1.3;
}

.recommended-price {
  margin: 0 0 8px 0;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
  font-family: var(--font-primary);
}

.recommended-location {
  margin: 0 0 12px 0;
  font-size: 11px;
  color: var(--text-secondary);
  font-family: var(--font-secondary);
}

.recommended-details {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 12px;
  margin-top: 4px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: var(--text-secondary);
  font-family: var(--font-secondary);
}

.detail-item img {
  width: 12px;
  height: 12px;
  opacity: 0.8;
}

@media (max-width: 640px) {
  .recommended-card {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
    min-height: 100px;
    flex-direction: row;
  }

  .recommended-image {
    width: 100px;
    height: 100px;
    padding: 6px;
  }

  .recommended-image img {
    border-radius: 4px;
  }

  .recommended-info {
    padding: 8px 12px;
    justify-content: center;
  }

  .recommended-address {
    font-size: var(--listing-mobile);
    margin-bottom: 4px;
  }

  .recommended-price {
    font-size: var(--body-mobile);
    margin-bottom: 4px;
  }

  .recommended-location {
    font-size: var(--body-mobile);
    margin-bottom: 6px;
  }

  .recommended-details {
    gap: 4px 6px;
  }

  .detail-item {
    font-size: var(--body-mobile);
  }

  .detail-item img {
    width: 10px;
    height: 10px;
  }
}
</style>
