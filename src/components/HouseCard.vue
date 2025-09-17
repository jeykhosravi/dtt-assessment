<template>
  <div class="house-card" :data-house-id="house.id" @click="navigateToDetails">
    <DeleteConfirmationModal
      :show="showDeleteModal"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
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
            <button
              class="action-btn like-btn"
              @click.stop="toggleLike"
              :class="{ liked: isLiked }"
              title="Add to favorites"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                width="20"
                height="20"
              >
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                />
              </svg>
            </button>
            <button
              class="action-btn edit-btn"
              @click.stop="editHouse"
              :disabled="!house.madeByMe"
              :title="house.madeByMe ? 'Edit listing' : 'You cannot edit this listing'"
            >
              <img src="/images/edit.png" alt="Edit" />
              <span class="tooltip" v-if="!house.madeByMe">You cannot edit this listing</span>
            </button>
            <button
              class="action-btn delete-btn"
              @click.stop="deleteHouse($event)"
              :disabled="!house.madeByMe"
              :title="house.madeByMe ? 'Delete listing' : 'You cannot delete this listing'"
            >
              <img src="/images/delete.png" alt="Delete" />
              <span class="tooltip" v-if="!house.madeByMe">You cannot delete this listing</span>
            </button>
          </div>
        </div>
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { apiRequest, type House } from '@/services/api'
import { useFavoritesStore } from '@/stores/favorites'
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal.vue'

interface Props {
  house: House
}

const props = defineProps<Props>()
const router = useRouter()
const showDeleteModal = ref(false)
const favoritesStore = useFavoritesStore()

// Like functionality
const isLiked = computed(() => favoritesStore.isFavorite(props.house.id))

const toggleLike = () => {
  favoritesStore.toggleFavorite(props.house) // pass full object instead of id
}

const navigateToDetails = () => {
  router.push(`/houses/${props.house.id}`)
}

const editHouse = () => {
  if (!props.house.madeByMe) return
  router.push(`/houses/${props.house.id}/edit`)
}

const deleteHouse = (event: Event) => {
  event.stopPropagation() // Prevent navigation to details
  if (!props.house.madeByMe) return

  // Show the delete confirmation modal
  showDeleteModal.value = true
}

const cancelDelete = () => {
  showDeleteModal.value = false
}

const confirmDelete = async () => {
  try {
    console.log(`Attempting to delete house with ID: ${props.house.id}`)

    // Be explicit with the URL and include a trailing slash if needed
    const endpoint = `/houses/${props.house.id}/`

    await apiRequest(endpoint, {
      method: 'DELETE',
      // Explicitly set headers to ensure proper formatting
      headers: {
        'X-Api-Key': import.meta.env.VITE_API_KEY as string,
      },
    })

    console.log(`Successfully deleted house with ID: ${props.house.id}`)
    showDeleteModal.value = false

    // Emit an event that the parent (HousesView) can listen for
    const event = new CustomEvent('house-deleted', { detail: props.house.id })
    window.dispatchEvent(event)

    // Add a fallback in case the event system doesn't trigger a UI update
    setTimeout(() => {
      if (document.contains(document.querySelector(`[data-house-id="${props.house.id}"]`))) {
        console.log('House still visible in DOM, refreshing page')
        window.location.reload()
      }
    }, 500)
  } catch (error) {
    console.error('Failed to delete the house:', error)
    alert('Failed to delete the house. Please try again.')
    // Close the modal after the alert is dismissed
    showDeleteModal.value = false
  }
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
  position: relative;
}

.action-btn img {
  width: 16px;
  height: 16px;
}

.action-btn:hover img {
  opacity: 1;
}

.action-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.action-btn .tooltip {
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
}

.action-btn:disabled:hover .tooltip {
  visibility: visible;
  opacity: 1;
}

.like-btn {
  color: #ccc;
  transition: color 0.2s ease;
}

.like-btn:hover {
  color: #ed9595;
}

.like-btn.liked {
  color: #e74c3c;
}

.like-btn.liked:hover {
  color: #c0392b;
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
@media (max-width: 600px) {
  .house-card {
    display: flex;
    background: var(--color-bg2);
    padding: 8px;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;
    cursor: pointer;
  }
}
</style>
