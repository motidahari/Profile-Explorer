<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

function handleClick(event: MouseEvent): void {
  emit('click', event)
}
</script>

<template>
  <button
    class="app-button"
    :class="[
      `app-button--${variant ?? 'primary'}`,
      `app-button--${size ?? 'md'}`,
      { 'app-button--loading': loading },
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="app-button__spinner" aria-hidden="true" />
    <slot />
  </button>
</template>

<style lang="scss" scoped>
.app-button {
  @include flx($justify: center, $align: center, $gap: var(--space-2));
  position: relative;
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition:
    background-color var(--transition-fast),
    color var(--transition-fast),
    box-shadow var(--transition-fast),
    opacity var(--transition-fast);
  white-space: nowrap;

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &--loading {
    cursor: wait;
  }

  // Variants
  &--primary {
    background-color: var(--color-primary);
    color: #fff;

    &:not(:disabled):hover {
      background-color: var(--color-primary-hover);
      box-shadow: var(--shadow-md);
    }
  }

  &--secondary {
    background-color: var(--color-surface);
    color: var(--color-text-primary);
    box-shadow: inset 0 0 0 1px var(--color-border);

    &:not(:disabled):hover {
      background-color: var(--color-surface-overlay);
    }
  }

  &--danger {
    background-color: var(--color-error);
    color: #fff;

    &:not(:disabled):hover {
      background-color: #dc2626;
      box-shadow: var(--shadow-md);
    }
  }

  &--ghost {
    background-color: transparent;
    color: var(--color-text-secondary);

    &:not(:disabled):hover {
      background-color: var(--color-surface-overlay);
      color: var(--color-text-primary);
    }
  }

  // Sizes
  &--sm {
    font-size: var(--font-size-sm);
    padding-block: var(--space-1);
    padding-inline: var(--space-3);
    min-height: 32px;
  }

  &--md {
    font-size: var(--font-size-base);
    padding-block: var(--space-2);
    padding-inline: var(--space-4);
    min-height: 40px;
  }

  &--lg {
    font-size: var(--font-size-lg);
    padding-block: var(--space-3);
    padding-inline: var(--space-6);
    min-height: 48px;
  }

  &__spinner {
    width: 1em;
    height: 1em;
    border-radius: var(--radius-full);
    border: 2px solid transparent;
    border-block-start-color: currentColor;
    border-inline-end-color: currentColor;
    animation: spin 600ms linear infinite;
    flex-shrink: 0;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
