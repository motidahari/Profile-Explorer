<script setup lang="ts">
defineProps<{
  elevated?: boolean
  hoverable?: boolean
}>()
</script>

<template>
  <div
    class="gi-card"
    :class="{
      'gi-card--elevated': elevated,
      'gi-card--hoverable': hoverable,
    }"
  >
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.gi-card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);

  &--elevated {
    box-shadow: var(--shadow-md);
    border-color: transparent;
  }

  &--hoverable {
    cursor: pointer;
    transition:
      box-shadow var(--transition-normal),
      transform var(--transition-normal);

    &:hover {
      box-shadow: var(--shadow-lg);
      transform: translateY(-2px);
    }
  }
}
</style>
