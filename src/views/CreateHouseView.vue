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
        <FormField
          id="streetName"
          label="Street name*"
          type="text"
          v-model="form.streetName"
          placeholder="Enter the street name"
          :error-message="errors.streetName"
          @blur="validateField('streetName')"
          @clear-error="clearFieldError('streetName')"
        />

        <!-- House number and Addition row -->
        <FormRow>
          <FormField
            id="houseNumber"
            label="House number*"
            type="number"
            v-model="form.houseNumber"
            placeholder="Enter house number"
            :error-message="errors.houseNumber"
            @blur="validateField('houseNumber')"
            @clear-error="clearFieldError('houseNumber')"
          />

          <FormField
            id="numberAddition"
            label="Addition (optional)"
            type="text"
            v-model="form.numberAddition"
            placeholder="e.g. A"
          />
        </FormRow>

        <!-- Postal code -->
        <FormField
          id="zip"
          label="Postal code*"
          type="text"
          v-model="form.zip"
          placeholder="e.g. 1000 AB"
          :error-message="errors.zip"
          @blur="validateField('zip')"
          @clear-error="clearFieldError('zip')"
        />

        <!-- City -->
        <FormField
          id="city"
          label="City*"
          type="text"
          v-model="form.city"
          placeholder="e.g. Utrecht"
          :error-message="errors.city"
          @blur="validateField('city')"
          @clear-error="clearFieldError('city')"
        />

        <!-- Image Upload Section -->
        <ImageUpload
          label="Upload picture (PNG or JPG)*"
          v-model="form.image"
          v-model:image-preview="imagePreview"
          :error-message="errors.image"
          @clear-error="clearFieldError('image')"
        />

        <!-- Price -->
        <FormField
          id="price"
          label="Price*"
          type="number"
          v-model="form.price"
          placeholder="e.g. €150,000"
          :error-message="errors.price"
          @blur="validateField('price')"
          @clear-error="clearFieldError('price')"
        />

        <!-- Size and Garage row -->
        <FormRow>
          <FormField
            id="size"
            label="Size*"
            type="number"
            v-model="form.size"
            placeholder="e.g. 120m²"
            :error-message="errors.size"
            @blur="validateField('size')"
            @clear-error="clearFieldError('size')"
          />

          <SelectField
            label="Garage*"
            v-model="form.hasGarage"
            :options="garageOptions"
            :error-message="errors.hasGarage"
            @blur="validateField('hasGarage')"
            @clear-error="clearFieldError('hasGarage')"
          />
        </FormRow>

        <!-- Bedrooms and Bathrooms row -->
        <FormRow>
          <FormField
            id="bedrooms"
            label="Bedrooms*"
            type="number"
            v-model="form.bedrooms"
            placeholder="Enter amount"
            :min="1"
            :error-message="errors.bedrooms"
            @blur="validateField('bedrooms')"
            @clear-error="clearFieldError('bedrooms')"
          />

          <FormField
            id="bathrooms"
            label="Bathrooms*"
            type="number"
            v-model="form.bathrooms"
            placeholder="Enter amount"
            :min="1"
            :error-message="errors.bathrooms"
            @blur="validateField('bathrooms')"
            @clear-error="clearFieldError('bathrooms')"
          />
        </FormRow>

        <!-- Construction date -->
        <FormField
          id="constructionYear"
          label="Construction date*"
          type="number"
          v-model="form.constructionYear"
          placeholder="e.g. 1990"
          :min="1900"
          :max="new Date().getFullYear()"
          :error-message="errors.constructionYear"
          @blur="validateField('constructionYear')"
          @clear-error="clearFieldError('constructionYear')"
        />

        <!-- Description -->
        <FormField
          id="description"
          label="Description*"
          type="textarea"
          v-model="form.description"
          placeholder="Enter description"
          :rows="4"
          :error-message="errors.description"
          @blur="validateField('description')"
          @clear-error="clearFieldError('description')"
        />

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
import FormField from '@/components/Form/FormField.vue'
import FormRow from '@/components/Form/FormRow.vue'
import ImageUpload from '@/components/Form/ImageUpload.vue'
import SelectField from '@/components/Form/SelectField.vue'

const router = useRouter()
const route = useRoute()
const isEditMode = computed(() => route.path.includes('/edit'))
const houseId = computed(() => (route.params.id ? parseInt(route.params.id as string) : undefined))

// Garage options for select field
const garageOptions = [
  { value: 'true', label: 'Yes' },
  { value: 'false', label: 'No' },
]

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
const imagePreview = ref<string>('')

// Individual field validation functions
const validateField = (fieldName: string) => {
  // Clear the existing error for this field
  delete errors[fieldName]

  switch (fieldName) {
    case 'streetName':
      if (!form.streetName.trim()) {
        errors.streetName = 'Street name is required'
      }
      break

    case 'houseNumber':
      const houseNumber = Number(form.houseNumber)
      if (!form.houseNumber || isNaN(houseNumber) || houseNumber <= 0) {
        errors.houseNumber = 'House number is required'
      }
      break

    case 'zip':
      if (!form.zip.trim()) {
        errors.zip = 'Postal code is required'
      }
      break

    case 'city':
      if (!form.city.trim()) {
        errors.city = 'City is required'
      }
      break

    case 'price':
      const price = Number(form.price)
      if (!form.price || isNaN(price) || price <= 0) {
        errors.price = 'Price is required'
      }
      break

    case 'size':
      const size = Number(form.size)
      if (!form.size || isNaN(size) || size <= 0) {
        errors.size = 'Size is required'
      }
      break

    case 'bedrooms':
      const bedrooms = Number(form.bedrooms)
      if (form.bedrooms === '' || isNaN(bedrooms) || bedrooms < 0) {
        errors.bedrooms = 'Number of bedrooms is required'
      }
      break

    case 'bathrooms':
      const bathrooms = Number(form.bathrooms)
      if (form.bathrooms === '' || isNaN(bathrooms) || bathrooms < 0) {
        errors.bathrooms = 'Number of bathrooms is required'
      }
      break

    case 'constructionYear':
      const constructionYear = Number(form.constructionYear)
      if (
        !form.constructionYear ||
        isNaN(constructionYear) ||
        constructionYear < 1900 ||
        constructionYear > new Date().getFullYear()
      ) {
        errors.constructionYear = 'Valid construction year is required'
      }
      break

    case 'hasGarage':
      if (form.hasGarage === '') {
        errors.hasGarage = 'Garage selection is required'
      }
      break

    case 'description':
      if (!form.description.trim()) {
        errors.description = 'Description is required'
      }
      break

    case 'image':
      if (!isEditMode.value && !form.image) {
        errors.image = 'Image is required'
      }
      break
  }
}

const clearFieldError = (fieldName: string) => {
  if (errors[fieldName]) {
    delete errors[fieldName]
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

  .submit-btn {
    font-size: var(--btn-mobile);
    width: 100%;
    padding: 12px 24px;
  }
}
</style>
