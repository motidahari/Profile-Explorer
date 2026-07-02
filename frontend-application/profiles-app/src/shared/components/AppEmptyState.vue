<script setup lang="ts">
defineProps<{
  title: string
  description?: string
  icon?: string
}>()
</script>

<template>
  <div class="app-empty-state">
    <span v-if="icon" class="app-empty-state__icon" aria-hidden="true">{{ icon }}</span>
    <svg
      v-else
      class="app-empty-state__icon-default"
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="20" fill="currentColor" opacity="0.08" />
      <path
        d="M16 32c0-4.418 3.582-8 8-8s8 3.582 8 8"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        opacity="0.5"
      />
      <circle cx="24" cy="18" r="4" fill="currentColor" opacity="0.5" />
    </svg>
    <p class="app-empty-state__title">{{ title }}</p>
    <p v-if="description" class="app-empty-state__description">{{ description }}</p>
  </div>
</template>

<style lang="scss" scoped>
.app-empty-state {
  @include flx($direction: column, $align: center, $gap: var(--space-3));
  padding-block: var(--space-12);
  text-align: center;
  color: var(--color-text-muted);

  &__icon {
    font-size: 40px;
    line-height: 1;
  }

  &__icon-default {
    color: var(--color-text-muted);
  }

  &__title {
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-secondary);
  }

  &__description {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
    max-width: 280px;
  }
}
</style>
