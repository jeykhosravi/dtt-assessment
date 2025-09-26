<template>
  <div class="form-group">
    <label :for="id">{{ label }}</label>

    <!-- Text input -->
    <input
      v-if="type === 'text' || type === 'number'"
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :class="{
        error: errorMessage,
        'error-placeholder':
          errorMessage && (modelValue === '' || modelValue === null || modelValue === undefined),
      }"
      :min="min"
      :max="max"
      @input="handleInput"
      @blur="handleBlur"
    />

    <!-- Textarea -->
    <textarea
      v-else-if="type === 'textarea'"
      :id="id"
      :value="modelValue"
      :placeholder="placeholder"
      :rows="rows"
      :class="{
        error: errorMessage,
        'error-placeholder':
          errorMessage && (modelValue === '' || modelValue === null || modelValue === undefined),
      }"
      @input="handleInput"
      @blur="handleBlur"
    />

    <!-- Error message -->
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  id: string
  label: string
  type: 'text' | 'number' | 'textarea'
  modelValue: string | number
  placeholder?: string
  errorMessage?: string
  min?: number
  max?: number
  rows?: number
  required?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string | number): void
  (e: 'blur', value: string | number): void
  (e: 'clear-error'): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
  errorMessage: '',
  rows: 4,
  required: false,
})

const emit = defineEmits<Emits>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement
  let value: string | number = target.value

  // Convert to number for number inputs
  if (props.type === 'number') {
    value = target.value === '' ? '' : Number(target.value)
  }

  // Clear error on new input to improve UX
  if (props.errorMessage) {
    emit('clear-error')
  }

  emit('update:modelValue', value)
}

const handleBlur = (event: Event) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement
  let value: string | number = target.value

  // Convert to number for number inputs
  if (props.type === 'number') {
    value = target.value === '' ? '' : Number(target.value)
  }

  // Emit blur event for validation
  emit('blur', value)
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

.form-group input,
.form-group textarea {
  padding: 12px 16px;
  border: 1px solid var(--color-tertiary-light);
  border-radius: 8px;
  font-size: var(--input-field-desktop);
  font-family: var(--font-secondary);
  background-color: var(--color-bg2);
  transition: border-color 0.2s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
}

.form-group input.error,
.form-group textarea.error {
  border-color: var(--color-primary);
}

.form-group input.error-placeholder::placeholder,
.form-group textarea.error-placeholder::placeholder {
  color: var(--color-primary);
  opacity: 1;
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
