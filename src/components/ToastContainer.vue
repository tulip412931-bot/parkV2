<script setup>
import { useToast } from '@/composables/useToast'

const { toasts, removeToast } = useToast()

function iconForType(type) {
  switch (type) {
    case 'success': return '\u2713'
    case 'error': return '\u2717'
    case 'warning': return '\u26A0'
    default: return '\u2139'
  }
}

function borderColor(type) {
  switch (type) {
    case 'success': return '#16a34a'
    case 'error': return '#dc2626'
    case 'warning': return '#d97706'
    default: return '#2563eb'
  }
}

function bgColor(type) {
  switch (type) {
    case 'success': return '#f0fdf4'
    case 'error': return '#fef2f2'
    case 'warning': return '#fffbeb'
    default: return '#eff6ff'
  }
}

function iconColor(type) {
  switch (type) {
    case 'success': return '#16a34a'
    case 'error': return '#dc2626'
    case 'warning': return '#d97706'
    default: return '#2563eb'
  }
}
</script>

<template>
  <div class="toast-container">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast-item"
        :style="{
          borderLeftColor: borderColor(toast.type),
          backgroundColor: bgColor(toast.type)
        }"
        @click="removeToast(toast.id)"
      >
        <span class="toast-icon" :style="{ color: iconColor(toast.type) }">
          {{ iconForType(toast.type) }}
        </span>
        <span class="toast-message">{{ toast.message }}</span>
        <button class="toast-close" @click.stop="removeToast(toast.id)">&times;</button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 380px;
}

.toast-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 8px;
  border-left: 4px solid;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  min-width: 300px;
}

.toast-icon {
  font-size: 18px;
  flex-shrink: 0;
  width: 22px;
  text-align: center;
  font-weight: 700;
}

.toast-message {
  flex: 1;
  font-size: 14px;
  color: #1e293b;
  line-height: 1.4;
}

.toast-close {
  background: none;
  border: none;
  font-size: 18px;
  color: #94a3b8;
  cursor: pointer;
  padding: 0 2px;
  line-height: 1;
  flex-shrink: 0;
}

.toast-close:hover {
  color: #475569;
}

.toast-enter-active {
  animation: slideInRight 0.3s ease;
}

.toast-leave-active {
  animation: slideOutRight 0.3s ease;
}

@keyframes slideInRight {
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes slideOutRight {
  from { opacity: 1; transform: translateX(0); }
  to { opacity: 0; transform: translateX(30px); }
}
</style>
