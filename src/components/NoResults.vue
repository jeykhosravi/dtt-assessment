<template>
  <div class="no-results">
    <img src="/images/no result.png" :alt="imageAlt" class="no-results-image" />
    <p class="no-results-title">{{ title }}</p>
    <p class="no-results-subtitle">{{ subtitle }}</p>
    <slot name="action"></slot>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  subtitle: string
  imageAlt?: string
}

withDefaults(defineProps<Props>(), {
  imageAlt: 'No results',
})
</script>

<style scoped>
.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 60px 20px;
  color: var(--text-secondary);
  font-family: var(--font-secondary);
}

.no-results-image {
  width: 200px;
  height: auto;
  margin-bottom: 24px;
  opacity: 0.6;
}

.no-results-title {
  font-size: 18px;
  font-weight: 400;
  margin: 0 0 12px 0;
  color: var(--text-secondary);
}

.no-results-subtitle {
  font-size: 18px;
  font-weight: 400;
  margin: 0 0 32px 0;
  color: var(--text-secondary);
}

/* Mobile styles */
@media (max-width: 768px) {
  .no-results {
    padding: 40px 16px;
  }

  .no-results-image {
    width: 150px;
  }

  .no-results-title {
    font-size: 16px;
  }

  .no-results-subtitle {
    font-size: 14px;
  }
}
</style>
