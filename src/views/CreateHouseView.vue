<template>
  <div class="create-house-page">
    <div class="page-container">
      <!-- Header with back button -->
      <div class="page-header">
        <button @click="$router.go(-1)" class="back-btn">
          <img src="/images/back.png" alt="Back" class="back-icon" />
          Back to overview
        </button>
        <h1>{{ isEditMode ? 'Edit listing' : 'Create new listing' }}</h1>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="create-form">
        <!-- Street name -->
        <div class="form-group">
          <label for="streetName">Street name*</label>
          <input
            id="streetName"
            v-model="form.streetName"
            type="text"
            placeholder="Enter the street name"
            :class="{ error: errors.streetName }"
          />
          <div v-if="errors.streetName" class="error-message">{{ errors.streetName }}</div>
        </div>

        <!-- House number and Addition row -->
        <div class="form-row">
          <div class="form-group">
            <label for="houseNumber">House number*</label>
            <input
              id="houseNumber"
              v-model.number="form.houseNumber"
              type="number"
              placeholder="Enter house number"
              :class="{ error: errors.houseNumber }"
            />
            <div v-if="errors.houseNumber" class="error-message">{{ errors.houseNumber }}</div>
          </div>

          <div class="form-group">
            <label for="numberAddition">Addition (optional)</label>
            <input
              id="numberAddition"
              v-model="form.numberAddition"
              type="text"
              placeholder="e.g. A"
            />
          </div>
        </div>

        <!-- Postal code -->
        <div class="form-group">
          <label for="zip">Postal code*</label>
          <input
            id="zip"
            v-model="form.zip"
            type="text"
            placeholder="e.g. 1000 AB"
            :class="{ error: errors.zip }"
          />
          <div v-if="errors.zip" class="error-message">{{ errors.zip }}</div>
        </div>

        <!-- City -->
        <div class="form-group">
          <label for="city">City*</label>
          <input
            id="city"
            v-model="form.city"
            type="text"
            placeholder="e.g. Utrecht"
            :class="{ error: errors.city }"
          />
          <div v-if="errors.city" class="error-message">{{ errors.city }}</div>
        </div>

        <!-- Image Upload Section -->
        <div class="form-group">
          <label>Upload picture (PNG or JPG)*</label>
          <div
            :class="['image-upload', { 'has-image': imagePreview }]"
            @click="triggerFileInput"
            @dragover.prevent
            @drop.prevent="handleDrop"
          >
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              @change="handleFileSelect"
              style="display: none"
            />
            <div v-if="!imagePreview" class="upload-placeholder">
              <div class="upload-icon-container">
                <img src="/images/upload.png" alt="Upload" class="upload-icon" />
              </div>
            </div>
            <div v-else class="image-preview">
              <img :src="imagePreview" alt="Preview" class="preview-image" />
              <button type="button" @click.stop="removeImage" class="remove-image-btn">
                <img src="/images/clear-white.png" alt="Remove" />
              </button>
            </div>
          </div>
          <div v-if="errors.image" class="error-message">{{ errors.image }}</div>
        </div>

        <!-- Price -->
        <div class="form-group">
          <label for="price">Price*</label>
          <input
            id="price"
            v-model.number="form.price"
            type="number"
            placeholder="e.g. €150,000"
            :class="{ error: errors.price }"
          />
          <div v-if="errors.price" class="error-message">{{ errors.price }}</div>
        </div>

        <!-- Size and Garage row -->
        <div class="form-row">
          <div class="form-group">
            <label for="size">Size*</label>
            <input
              id="size"
              v-model.number="form.size"
              type="number"
              placeholder="e.g. 120m²"
              :class="{ error: errors.size }"
            />
            <div v-if="errors.size" class="error-message">{{ errors.size }}</div>
          </div>

          <div class="form-group garage-group">
            <label>Garage*</label>
            <select v-model="form.hasGarage" class="garage-select">
              <option value="">Select</option>
              <option value="true" class="text-secondary">Yes</option>
              <option value="false" class="text-secondary">No</option>
            </select>
          </div>
        </div>

        <!-- Bedrooms and Bathrooms row -->
        <div class="form-row">
          <div class="form-group">
            <label for="bedrooms">Bedrooms*</label>
            <input
              id="bedrooms"
              v-model.number="form.bedrooms"
              type="number"
              min="1"
              placeholder="Enter amount"
              :class="{ error: errors.bedrooms }"
            />
            <div v-if="errors.bedrooms" class="error-message">{{ errors.bedrooms }}</div>
          </div>

          <div class="form-group">
            <label for="bathrooms">Bathrooms*</label>
            <input
              id="bathrooms"
              v-model.number="form.bathrooms"
              type="number"
              min="1"
              placeholder="Enter amount"
              :class="{ error: errors.bathrooms }"
            />
            <div v-if="errors.bathrooms" class="error-message">{{ errors.bathrooms }}</div>
          </div>
        </div>

        <!-- Construction date -->
        <div class="form-group">
          <label for="constructionYear">Construction date*</label>
          <input
            id="constructionYear"
            v-model.number="form.constructionYear"
            type="number"
            min="1900"
            :max="new Date().getFullYear()"
            placeholder="e.g. 1990"
            :class="{ error: errors.constructionYear }"
          />
          <div v-if="errors.constructionYear" class="error-message">
            {{ errors.constructionYear }}
          </div>
        </div>

        <!-- Description -->
        <div class="form-group">
          <label for="description">Description*</label>
          <textarea
            id="description"
            v-model="form.description"
            placeholder="Enter description"
            rows="4"
            :class="{ error: errors.description }"
          ></textarea>
          <div v-if="errors.description" class="error-message">{{ errors.description }}</div>
        </div>

        <!-- Submit Button -->
        <div class="form-actions">
          <button type="submit" class="submit-btn" :disabled="isSubmitting || !isFormValid">
            {{
              isSubmitting
                ? isEditMode
                  ? 'SAVING...'
                  : 'POSTING...'
                : isEditMode
                  ? 'SAVE'
                  : 'POST'
            }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { createOrUpdateHouse, getHouseById, type CreateHouseRequest } from '@/services/api'

const router = useRouter()
const route = useRoute()
const isEditMode = computed(() => route.path.includes('/edit'))
const houseId = computed(() => (route.params.id ? parseInt(route.params.id as string) : undefined))

// Form data
const form = reactive({
  streetName: '',
  houseNumber: '' as string | number,
  numberAddition: '',
  zip: '',
  city: '',
  price: '' as string | number,
  size: '' as string | number,
  bedrooms: '' as string | number,
  bathrooms: '' as string | number,
  constructionYear: '' as string | number,
  hasGarage: '' as string,
  description: '',
  image: null as File | null,
})

const isFormValid = computed(() => {
  // Basic validation for all required fields
  const basicValidation =
    form.streetName.trim() &&
    form.houseNumber &&
    form.zip.trim() &&
    form.city.trim() &&
    form.price &&
    form.size &&
    form.bedrooms !== '' &&
    form.bedrooms !== null &&
    !isNaN(Number(form.bedrooms)) &&
    form.bathrooms !== '' &&
    form.bathrooms !== null &&
    !isNaN(Number(form.bathrooms)) &&
    form.constructionYear &&
    form.hasGarage !== '' &&
    form.description.trim()

  // Image is required in create mode, but optional in edit mode if there's already an image
  const imageValidation = form.image || (isEditMode.value && imagePreview.value)

  return basicValidation && imageValidation
})

// Form validation
const errors = reactive<Record<string, string>>({})
const isSubmitting = ref(false)

// Image handling
const fileInput = ref<HTMLInputElement>()
const imagePreview = ref<string>('')

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    setImageFile(file)
  }
}

const handleDrop = (event: DragEvent) => {
  const file = event.dataTransfer?.files[0]
  if (file && file.type.startsWith('image/')) {
    setImageFile(file)
  }
}

const setImageFile = (file: File) => {
  form.image = file
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
  delete errors.image
}

const removeImage = () => {
  form.image = null
  imagePreview.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// Validation
const validateForm = (): boolean => {
  // Clear previous errors
  Object.keys(errors).forEach((key) => delete errors[key])

  let isValid = true

  // Required fields validation
  if (!form.streetName.trim()) {
    errors.streetName = 'Street name is required'
    isValid = false
  }

  // Special handling for image in edit mode - don't require image if we already have one
  if (!isEditMode.value && !form.image) {
    errors.image = 'Image is required'
    isValid = false
  }

  const houseNumber = Number(form.houseNumber)
  if (!form.houseNumber || isNaN(houseNumber) || houseNumber <= 0) {
    errors.houseNumber = 'House number is required'
    isValid = false
  }

  if (!form.zip.trim()) {
    errors.zip = 'Postal code is required'
    isValid = false
  }

  if (!form.city.trim()) {
    errors.city = 'City is required'
    isValid = false
  }

  const price = Number(form.price)
  if (!form.price || isNaN(price) || price <= 0) {
    errors.price = 'Price is required'
    isValid = false
  }

  const size = Number(form.size)
  if (!form.size || isNaN(size) || size <= 0) {
    errors.size = 'Size is required'
    isValid = false
  }

  const bedrooms = Number(form.bedrooms)
  if (form.bedrooms === '' || isNaN(bedrooms) || bedrooms < 0) {
    errors.bedrooms = 'Number of bedrooms is required'
    isValid = false
  }

  const bathrooms = Number(form.bathrooms)
  if (form.bathrooms === '' || isNaN(bathrooms) || bathrooms < 0) {
    errors.bathrooms = 'Number of bathrooms is required'
    isValid = false
  }

  const constructionYear = Number(form.constructionYear)
  if (
    !form.constructionYear ||
    isNaN(constructionYear) ||
    constructionYear < 1900 ||
    constructionYear > new Date().getFullYear()
  ) {
    errors.constructionYear = 'Valid construction year is required'
    isValid = false
  }

  if (!form.description.trim()) {
    errors.description = 'Description is required'
    isValid = false
  }

  // Image validation is handled above

  return isValid
}

// Load existing house data if in edit mode
onMounted(async () => {
  if (isEditMode.value && houseId.value) {
    try {
      const house = await getHouseById(houseId.value)

      // Fill form with house data
      form.streetName = house.streetName
      form.houseNumber = house.houseNumber
      form.numberAddition = house.numberAddition || ''
      form.zip = house.zip
      form.city = house.city
      form.price = house.price
      form.size = house.size
      form.bedrooms = house.bedrooms
      form.bathrooms = house.bathrooms
      form.constructionYear = house.constructionYear
      form.hasGarage = house.hasGarage ? 'true' : 'false'
      form.description = house.description

      // Set image preview if there's an existing image
      if (house.image) {
        imagePreview.value = house.image
        // In edit mode, image is optional (to keep existing one)
      }
    } catch (error) {
      console.error('Error loading house data:', error)
      router.push('/houses')
    }
  }
})

// Submit handler
const handleSubmit = async () => {
  // In edit mode, image is optional if there's already an image
  if (isEditMode.value && imagePreview.value && !form.image) {
    delete errors.image
  }

  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    // If we're in edit mode and there's no new image but there is an existing image preview,
    // we should send a null for the image to indicate we want to keep the existing image
    const imageToSubmit = isEditMode.value && !form.image && imagePreview.value ? null : form.image

    const houseData: CreateHouseRequest = {
      streetName: form.streetName,
      houseNumber: Number(form.houseNumber),
      numberAddition: form.numberAddition,
      zip: form.zip,
      city: form.city,
      price: Number(form.price),
      size: Number(form.size),
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      constructionYear: Number(form.constructionYear),
      hasGarage: form.hasGarage === 'true',
      description: form.description,
      image: imageToSubmit as File, // TypeScript needs the cast, but API will handle null
    }

    const house = await createOrUpdateHouse(houseData, isEditMode.value ? houseId.value : undefined)

    // Redirect to the house details page
    router.push(`/houses/${house.id}`)
  } catch (error) {
    console.error(`Error ${isEditMode.value ? 'updating' : 'creating'} house:`, error)
    errors.submit = `Failed to ${isEditMode.value ? 'update' : 'create'} house. Please try again.`
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.create-house-page {
  min-height: 100vh;
  background-color: var(--color-bg1);
  background-image: url('/images/background.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  margin-bottom: 24px;
  position: relative; /* Added for consistency with mobile */
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-size: var(--back-button-desktop);
  font-family: var(--font-secondary);
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 12px;
}

.back-icon {
  width: 16px;
  height: 16px;
}

.page-header h1 {
  margin: 0;
  color: var(--text-primary);
  font-size: var(--h1-desktop);
  font-family: var(--font-primary);
  font-weight: 700;
}

.create-form {
  display: flex;
  flex-direction: column;
  max-width: 400px;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 140px;
  gap: 16px;
}

.form-group label {
  color: var(--text-primary);
  font-size: var(--input-label-desktop);
  font-family: var(--font-secondary);
  font-weight: 600;
}

.form-group input,
.form-group textarea,
.garage-select {
  padding: 12px 16px;
  border: 1px solid var(--color-tertiary-light);
  border-radius: 8px;
  font-size: var(--input-field-desktop);
  font-family: var(--font-secondary);
  background-color: var(--color-bg2);
  transition: border-color 0.2s ease;
}

.form-group input:focus,
.form-group textarea:focus,
.garage-select:focus {
  outline: none;
}

.form-group input.error,
.form-group textarea.error {
  border-color: var(--color-primary);
}

.form-group input[type='number']::-webkit-inner-spin-button,
.form-group input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.form-group input[type='number'] {
  -moz-appearance: textfield;
  appearance: textfield;
}

.garage-select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 12px center;
  background-repeat: no-repeat;
  background-size: 16px;
  padding-right: 40px;
}

.garage-select[value=''] {
  color: var(--text-secondary);
}

.garage-select option {
  color: var(--text-secondary);
}

.garage-select {
  color: var(--text-secondary);
}

.text-secondary {
  color: var(--text-secondary) !important;
}

.image-upload {
  border: 2px dashed var(--color-tertiary-dark);
  max-width: 100px;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s ease;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Remove border when image is uploaded */
.image-upload.has-image {
  border: none;
}

.upload-icon-container {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-icon {
  width: 20px;
  height: 20px;
  opacity: 0.7;
}

.image-preview {
  position: relative;
  display: inline-block;
}

.preview-image {
  max-width: 100%;
  height: 100%;
}

.remove-image-btn {
  position: absolute;
  top: 0px;
  right: 0px;
  width: 10px;
  height: 10px;
  border: none;
  border-radius: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.remove-image-btn img {
  width: 20px;
  height: 20px;
}

.error-message {
  color: var(--color-primary);
  font-size: var(--error-desktop);
  font-family: var(--font-secondary);
  font-style: italic;
  margin-top: 4px;
}

.form-actions {
  margin-top: 24px;
  display: flex;
  justify-content: end;
}

.submit-btn {
  padding: 14px 48px;
  background-color: var(--color-primary);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: var(--btn-desktop);
  font-family: var(--font-secondary);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.submit-btn:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(235, 84, 64, 0.3);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .create-house-page {
    background-position: bottom center;
    background-size: 100% auto;
  }

  .page-container {
    padding: 16px;
    max-width: 100%;
  }

  .page-header {
    display: flex;
    align-items: center;
    position: relative;
    justify-content: center;
    margin-bottom: 16px;
  }

  .page-header h1 {
    font-size: var(--h1-mobile);
    text-align: center;
  }

  .back-btn {
    position: absolute;
    left: 0;
    margin-bottom: 0;
    font-size: 0; /* Hide text on mobile */
  }

  .back-icon {
    width: 18px;
    height: 18px;
  }

  .form-group label {
    font-size: var(--input-label-mobile);
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .submit-btn {
    font-size: var(--btn-mobile);
    width: 100%;
    padding: 12px 24px;
  }

  .error-message {
    font-size: var(--error-mobile);
  }
}
</style>
