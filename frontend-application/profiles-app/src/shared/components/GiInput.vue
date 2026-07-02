<script setup lang="ts">
defineProps<{
  modelValue: string
  label?: string
  placeholder?: string
  error?: string
  dir?: 'ltr' | 'rtl' | 'auto'
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="gi-input" :class="{ 'gi-input--ltr': dir === 'ltr', 'gi-input--error': !!error }">
    <label v-if="label" class="gi-input__label">{{ label }}</label>
    <input
      class="gi-input__field"
      :value="modelValue"
      :placeholder="placeholder"
      :dir="dir"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <span v-if="error" class="gi-input__error" role="alert">{{ error }}</span>
  </div>
</template>

<style lang="scss" scoped>
.gi-input {
  @include flx($direction: column, $gap: var(--space-1));
  width: 100%;

  &__label {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--color-text-secondary);
  }

  &__field {
    width: 100%;
    padding-block: var(--space-2);
    padding-inline: var(--space-3);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background-color: var(--color-surface);
    color: var(--color-text-primary);
    font-size: var(--font-size-base);
    transition:
      border-color var(--transition-fast),
      box-shadow var(--transition-fast);

    &::placeholder {
      color: var(--color-text-muted);
    }

    &:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
    }
  }

  &__error {
    font-size: var(--font-size-xs);
    color: var(--color-error);
  }

  &--error &__field {
    border-color: var(--color-error);

    &:focus {
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
    }
  }

  &--ltr &__field {
    direction: ltr;
    unicode-bidi: isolate;
  }
}
</style>
