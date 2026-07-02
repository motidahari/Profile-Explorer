<script setup lang="ts">
defineProps<{
  label: string
  variant?: 'neutral' | 'success' | 'error' | 'info'
}>()
</script>

<template>
  <span class="app-badge" :class="`app-badge--${variant ?? 'neutral'}`">
    {{ label }}
  </span>
</template>

<style lang="scss" scoped>
.app-badge {
  display: inline-flex;
  align-items: center;
  padding-block: var(--space-1);
  padding-inline: var(--space-2);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  white-space: nowrap;

  &--neutral {
    background-color: var(--color-surface-overlay);
    color: var(--color-text-secondary);
  }

  &--success {
    background-color: #dcfce7;
    color: #15803d;
  }

  &--error {
    background-color: #fee2e2;
    color: #dc2626;
  }

  &--info {
    background-color: var(--color-primary-light);
    color: var(--color-primary);
  }
}
</style>
