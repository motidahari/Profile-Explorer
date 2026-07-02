<script setup lang="ts">
import { useLocale } from '../composables/useLocale'

const { locale, setLocale } = useLocale()
</script>

<template>
  <div class="app-language-switcher" role="group">
    <button
      class="app-language-switcher__btn"
      :class="{ 'app-language-switcher__btn--active': locale === 'en' }"
      @click="setLocale('en')"
    >
      EN
    </button>
    <span class="app-language-switcher__divider" aria-hidden="true">|</span>
    <button
      class="app-language-switcher__btn"
      :class="{ 'app-language-switcher__btn--active': locale === 'he' }"
      @click="setLocale('he')"
    >
      HE
    </button>
  </div>
</template>

<style lang="scss" scoped>
.app-language-switcher {
  @include flx($align: center, $gap: var(--space-1));

  &__btn {
    padding-block: var(--space-1);
    padding-inline: var(--space-2);
    border: none;
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--color-text-muted);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-semibold);
    letter-spacing: 0.05em;
    cursor: pointer;
    transition:
      color var(--transition-fast),
      background-color var(--transition-fast);

    &:hover {
      color: var(--color-text-primary);
      background-color: var(--color-surface-overlay);
    }

    &--active {
      color: var(--color-primary);
      background-color: var(--color-primary-light);
    }

    &:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }
  }

  &__divider {
    color: var(--color-border);
    user-select: none;
  }
}
</style>
