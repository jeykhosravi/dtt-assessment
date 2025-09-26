<template>
  <div class="form-group">
    <label>{{ label }}</label>
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
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  label: string
  modelValue: File | null
  imagePreview?: string
  errorMessage?: string
}

interface Emits {
  (e: 'update:modelValue', value: File | null): void
  (e: 'update:imagePreview', value: string): void
  (e: 'clear-error'): void
}

const props = withDefaults(defineProps<Props>(), {
  imagePreview: '',
  errorMessage: '',
})

const emit = defineEmits<Emits>()

const fileInput = ref<HTMLInputElement>()

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
  // Clear error when user selects a new image
  if (props.errorMessage) {
    emit('clear-error')
  }

  emit('update:modelValue', file)
  const reader = new FileReader()
  reader.onload = (e) => {
    emit('update:imagePreview', e.target?.result as string)
  }
  reader.readAsDataURL(file)
}

const removeImage = () => {
  emit('update:modelValue', null)
  emit('update:imagePreview', '')
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
</script>

<style scoped>
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  color: var(--text-primary);
  font-size: var(--input-label-desktop);
  font-family: var(--font-secondary);
  font-weight: 600;
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

@media (max-width: 640px) {
  .form-group label {
    font-size: var(--input-label-mobile);
  }

  .error-message {
    font-size: var(--error-mobile);
  }
}
</style>
