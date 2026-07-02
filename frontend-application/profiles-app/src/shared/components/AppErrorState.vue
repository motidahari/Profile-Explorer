<script setup lang="ts">
import AppButton from './AppButton.vue'

defineProps<{
  message: string
  onRetry?: () => void
  retryLabel?: string
}>()
</script>

<template>
  <div class="app-error-state">
    <svg
      class="app-error-state__icon"
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="20" fill="currentColor" opacity="0.08" />
      <path d="M24 16v9M24 31v1" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
    </svg>
    <p class="app-error-state__message">{{ message }}</p>
    <AppButton v-if="onRetry" variant="secondary" size="sm" @click="onRetry">
      {{ retryLabel ?? '' }}
    </AppButton>
  </div>
</template>

<style lang="scss" scoped>
.app-error-state {
  @include flx($direction: column, $align: center, $gap: var(--space-4));
  padding-block: var(--space-12);
  text-align: center;
  color: var(--color-error);

  &__icon {
    color: var(--color-error);
  }

  &__message {
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-medium);
    color: var(--color-error);
    max-width: 320px;
  }
}
</style>
