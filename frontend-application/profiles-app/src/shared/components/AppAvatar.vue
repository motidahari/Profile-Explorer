<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  src?: string
  alt?: string
  size?: 'sm' | 'md' | 'lg'
}>()

const imageError = ref(false)

function handleError(): void {
  imageError.value = true
}
</script>

<template>
  <div class="app-avatar" :class="`app-avatar--${size ?? 'md'}`">
    <img
      v-if="src && !imageError"
      class="app-avatar__image"
      :src="src"
      :alt="alt ?? ''"
      @error="handleError"
    />
    <span v-else class="app-avatar__fallback" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="currentColor" width="60%" height="60%">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8" />
      </svg>
    </span>
  </div>
</template>

<style lang="scss" scoped>
.app-avatar {
  @include flex-center;
  border-radius: var(--radius-full);
  overflow: hidden;
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  flex-shrink: 0;

  &--sm {
    width: 32px;
    height: 32px;
  }

  &--md {
    width: 48px;
    height: 48px;
  }

  &--lg {
    width: 96px;
    height: 96px;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  &__fallback {
    @include flex-center;
    width: 100%;
    height: 100%;
  }
}
</style>
