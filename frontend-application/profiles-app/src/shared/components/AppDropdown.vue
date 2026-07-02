<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{
  modelValue: string | number | null
  options: Array<{ label: string; value: string | number }>
  placeholder?: string
  label?: string
  searchable?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string | number | null]
}>()

const isOpen = ref(false)
const searchQuery = ref('')
const rootRef = ref<HTMLElement | null>(null)

const selectedLabel = computed(() => {
  if (props.modelValue === null || props.modelValue === undefined) return null
  return props.options.find((o) => o.value === props.modelValue)?.label ?? null
})

const filteredOptions = computed(() => {
  const q = searchQuery.value.toLowerCase()
  if (!q || props.searchable === false) return props.options
  return props.options.filter((o) => o.label.toLowerCase().includes(q))
})

function open(): void {
  isOpen.value = true
  searchQuery.value = ''
}

function close(): void {
  isOpen.value = false
}

function toggle(): void {
  if (isOpen.value) {
    close()
  } else {
    open()
  }
}

function select(value: string | number): void {
  emit('update:modelValue', value)
  close()
}

function handleOutsideClick(event: MouseEvent): void {
  if (rootRef.value && !rootRef.value.contains(event.target as Node)) {
    close()
  }
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    close()
  }
}

onMounted(() => {
  document.addEventListener('click', handleOutsideClick)
  document.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleOutsideClick)
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div ref="rootRef" class="app-dropdown" :class="{ 'app-dropdown--open': isOpen }">
    <label v-if="label" class="app-dropdown__label">{{ label }}</label>
    <button type="button" class="app-dropdown__trigger" @click="toggle">
      <span class="app-dropdown__value">
        {{ selectedLabel ?? placeholder ?? '' }}
      </span>
      <svg
        class="app-dropdown__chevron"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M4 6l4 4 4-4"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
    <div v-if="isOpen" class="app-dropdown__panel">
      <div v-if="searchable !== false" class="app-dropdown__search-wrap">
        <input v-model="searchQuery" class="app-dropdown__search" type="text" autocomplete="off" />
      </div>
      <ul class="app-dropdown__list" role="listbox">
        <li
          v-for="option in filteredOptions"
          :key="option.value"
          class="app-dropdown__option"
          :class="{ 'app-dropdown__option--selected': option.value === modelValue }"
          role="option"
          :aria-selected="option.value === modelValue"
          @click="select(option.value)"
        >
          {{ option.label }}
        </li>
        <li
          v-if="filteredOptions.length === 0"
          class="app-dropdown__option app-dropdown__option--empty"
        >
          —
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-dropdown {
  position: relative;
  width: 100%;

  &__label {
    display: block;
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--color-text-secondary);
    margin-block-end: var(--space-1);
  }

  &__trigger {
    @include flx($justify: space-between, $align: center, $gap: var(--space-2));
    width: 100%;
    padding-block: var(--space-2);
    padding-inline: var(--space-3);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background-color: var(--color-surface);
    color: var(--color-text-primary);
    font-size: var(--font-size-base);
    cursor: pointer;
    transition: border-color var(--transition-fast);
    text-align: start;

    &:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }
  }

  &--open &__trigger {
    border-color: var(--color-primary);
  }

  &__value {
    @include truncate;
    flex: 1;
    color: var(--color-text-primary);
  }

  &__chevron {
    flex-shrink: 0;
    color: var(--color-text-muted);
    transition: transform var(--transition-fast);
  }

  &--open &__chevron {
    transform: rotate(180deg);
  }

  &__panel {
    position: absolute;
    inset-block-start: calc(100% + var(--space-1));
    inset-inline-start: 0;
    width: 100%;
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    z-index: 200;
    overflow: hidden;
    animation: slide-up 150ms ease both;
  }

  &__search-wrap {
    padding: var(--space-2);
    border-block-end: 1px solid var(--color-border);
  }

  &__search {
    width: 100%;
    padding-block: var(--space-1);
    padding-inline: var(--space-2);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    font-size: var(--font-size-sm);
    background-color: var(--color-surface-raised);
    color: var(--color-text-primary);

    &:focus {
      outline: none;
      border-color: var(--color-primary);
    }
  }

  &__list {
    max-height: 200px;
    overflow-y: auto;
    padding-block: var(--space-1);
  }

  &__option {
    padding-block: var(--space-2);
    padding-inline: var(--space-3);
    font-size: var(--font-size-sm);
    color: var(--color-text-primary);
    cursor: pointer;
    transition: background-color var(--transition-fast);

    &:hover {
      background-color: var(--color-surface-overlay);
    }

    &--selected {
      background-color: var(--color-primary-light);
      color: var(--color-primary);
      font-weight: var(--font-weight-medium);
    }

    &--empty {
      color: var(--color-text-muted);
      cursor: default;
      text-align: center;

      &:hover {
        background-color: transparent;
      }
    }
  }
}
</style>
