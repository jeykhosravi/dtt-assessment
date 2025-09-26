<template>
  <div class="form-group garage-group">
    <label>{{ label }}</label>
    <select
      :value="modelValue"
      :class="['garage-select', { error: errorMessage }]"
      @change="handleChange"
    >
      <option value="">Select</option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
        class="text-secondary"
      >
        {{ option.label }}
      </option>
    </select>
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  </div>
</template>

<script setup lang="ts">
interface SelectOption {
  value: string
  label: string
}

interface Props {
  label: string
  modelValue: string
  options: SelectOption[]
  errorMessage?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

withDefaults(defineProps<Props>(), {
  errorMessage: '',
})

const emit = defineEmits<Emits>()

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
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

.garage-select {
  padding: 12px 16px;
  border: 1px solid var(--color-tertiary-light);
  border-radius: 8px;
  font-size: var(--input-field-desktop);
  font-family: var(--font-secondary);
  background-color: var(--color-bg2);
  transition: border-color 0.2s ease;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 12px center;
  background-repeat: no-repeat;
  background-size: 16px;
  padding-right: 40px;
}

.garage-select:focus {
  outline: none;
}

.garage-select.error {
  border-color: var(--color-primary);
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
