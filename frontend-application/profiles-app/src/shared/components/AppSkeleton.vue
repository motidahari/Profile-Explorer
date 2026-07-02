<script setup lang="ts">
defineProps<{
  width?: string
  height?: string
  variant?: 'text' | 'circle' | 'rect'
}>()
</script>

<template>
  <span
    class="app-skeleton"
    :class="`app-skeleton--${variant ?? 'rect'}`"
    :style="{ width, height }"
    aria-hidden="true"
  />
</template>

<style lang="scss" scoped>
.app-skeleton {
  display: block;
  background-color: var(--color-surface-overlay);
  animation: skeleton-pulse 1.5s ease-in-out infinite;

  &--text {
    border-radius: var(--radius-sm);
    height: 1em;
    width: 100%;
  }

  &--rect {
    border-radius: var(--radius-md);
    width: 100%;
    height: 16px;
  }

  &--circle {
    border-radius: var(--radius-full);
  }
}

@keyframes skeleton-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}
</style>
