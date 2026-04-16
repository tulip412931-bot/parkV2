import { ref } from 'vue'

const toasts = ref([])
let nextId = 0

function showToast(message, type = 'info') {
  const id = nextId++
  toasts.value.push({ id, message, type })
  setTimeout(() => {
    removeToast(id)
  }, 3000)
  return id
}

function removeToast(id) {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index !== -1) {
    toasts.value.splice(index, 1)
  }
}

export function useToast() {
  return {
    toasts,
    showToast,
    removeToast
  }
}
