<script setup lang="ts">
import type { ToastType } from '../composables/useToast'

defineProps<{
  id: string
  message: string
  type?: ToastType
}>()

const emit = defineEmits<{
  dismiss: [id: string]
}>()
</script>

<template>
  <div class="app-toast" :class="`app-toast--${type ?? 'info'}`" role="alert" aria-live="polite">
    <span class="app-toast__message">{{ message }}</span>
    <button class="app-toast__close" aria-label="Dismiss" @click="emit('dismiss', id)">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path
          d="M1 1l12 12M13 1L1 13"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
        />
      </svg>
    </button>
  </div>
</template>

<style lang="scss" scoped>
.app-toast {
  @include flx($justify: space-between, $align: center, $gap: var(--space-3));
  padding-block: var(--space-3);
  padding-inline: var(--space-4);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  min-width: 260px;
  max-width: 380px;
  animation: slide-up 200ms ease both;

  &--info {
    background-color: var(--color-text-primary);
    color: #fff;
  }

  &--success {
    background-color: #15803d;
    color: #fff;
  }

  &--error {
    background-color: var(--color-error);
    color: #fff;
  }

  &__message {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    flex: 1;
  }

  &__close {
    @include flex-center;
    width: 24px;
    height: 24px;
    border: none;
    border-radius: var(--radius-sm);
    background: transparent;
    color: currentColor;
    opacity: 0.7;
    cursor: pointer;
    flex-shrink: 0;
    transition: opacity var(--transition-fast);

    &:hover {
      opacity: 1;
    }

    &:focus-visible {
      outline: 2px solid currentColor;
      outline-offset: 2px;
    }
  }
}
</style>
