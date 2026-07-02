<script setup lang="ts">
defineProps<{
  size?: 'sm' | 'md' | 'lg'
}>()
</script>

<template>
  <span
    class="gi-spinner"
    :class="`gi-spinner--${size ?? 'md'}`"
    role="status"
    aria-label="Loading"
  >
    <span class="gi-spinner__ring" aria-hidden="true" />
  </span>
</template>

<style lang="scss" scoped>
.gi-spinner {
  @include flex-center;
  flex-shrink: 0;

  &--sm {
    width: 16px;
    height: 16px;
  }

  &--md {
    width: 24px;
    height: 24px;
  }

  &--lg {
    width: 40px;
    height: 40px;
  }

  &__ring {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: var(--radius-full);
    border: 2px solid var(--color-border);
    border-block-start-color: var(--color-primary);
    border-inline-end-color: var(--color-primary);
    animation: spin 700ms linear infinite;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
