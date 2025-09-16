<template>
  <Teleport to="body">
    <div v-if="show" class="modal-overlay" @click.self="cancelDelete">
      <div class="modal-container">
        <h2>Delete listing</h2>
        <p>Are you sure you want to delete this listing?</p>
        <p class="warning">This action cannot be undone.</p>

        <div class="button-container">
          <button class="delete-btn" @click.stop="confirmDelete">YES, DELETE</button>
          <button class="cancel-btn" @click.stop="cancelDelete">GO BACK</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
defineProps({
  show: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['confirm', 'cancel'])

function confirmDelete() {
  emit('confirm')
}

function cancelDelete() {
  emit('cancel')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.modal-container {
  background-color: white;
  width: 90%;
  max-width: 450px;
  border-radius: 8px;
  padding: 24px;
  text-align: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

h2 {
  font-family: var(--font-primary);
  font-size: var(--h2-desktop);
  color: var(--text-primary);
  margin-top: 0;
  margin-bottom: 16px;
}

p {
  font-family: var(--font-secondary);
  font-size: 16px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.warning {
  margin-bottom: 24px;
}

.button-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.delete-btn,
.cancel-btn {
  padding: 14px;
  border-radius: 8px;
  font-family: var(--font-secondary);
  font-weight: 600;
  font-size: var(--btn-desktop);
  cursor: pointer;
  text-transform: uppercase;
  border: none;
  transition: all 0.2s ease;
}

.delete-btn {
  background-color: var(--color-primary);
  color: white;
}

.delete-btn:hover {
  opacity: 0.9;
  box-shadow: 0 4px 12px rgba(235, 84, 64, 0.3);
}

.cancel-btn {
  background-color: #4d4d4d; /* Dark gray color as shown in the image */
  color: white;
}

.cancel-btn:hover {
  opacity: 0.9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

@media (max-width: 640px) {
  .modal-container {
    width: 85%;
    max-width: 300px;
    padding: 16px;
  }

  h2 {
    font-size: var(--h2-mobile);
    margin-bottom: 12px;
  }

  p {
    font-size: 14px;
    margin-bottom: 6px;
  }

  .warning {
    margin-bottom: 18px;
  }

  .delete-btn,
  .cancel-btn {
    font-size: var(--btn-mobile);
    padding: 10px;
  }
}
</style>
