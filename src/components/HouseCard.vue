<template>
  <div class="house-card" @click="navigateToDetails">
    <div class="house-image">
      <img :src="house.image" :alt="`House at ${house.streetName}`" @error="handleImageError" />
    </div>
    <div class="house-info">
      <div class="house-header">
        <h3 class="house-address">
          {{ house.streetName }} {{ house.houseNumber
          }}<span v-if="house.numberAddition"> {{ house.numberAddition }}</span>
        </h3>
        <p class="house-price">{{ formatPrice(house.price) }}</p>
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
import type { House } from '@/services/api'

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

const formatPrice = (price: number): string => {
  return price.toLocaleString('en-US')
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

.house-address {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  font-family: var(--font-primary); /* Montserrat */
  line-height: 1.3;
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
