<script setup lang="ts">
// Language switcher will be added here when AppLanguageSwitcher shared component is built
</script>

<template>
  <div class="app-layout">
    <header class="app-layout__header">
      <div class="app-layout__container app-layout__container--header">
        <div class="app-layout__brand">
          <span class="app-layout__brand-icon" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="8" r="4" fill="currentColor" opacity="0.9" />
              <path d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.7" />
            </svg>
          </span>
          <span class="app-layout__brand-name">Profile Explorer</span>
        </div>
        <div class="app-layout__header-actions">
          <!-- AppLanguageSwitcher will be placed here -->
        </div>
      </div>
    </header>
    <main class="app-layout__main">
      <div class="app-layout__container">
        <slot />
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  &__header {
    height: var(--header-height);
    background-color: var(--color-surface);
    border-block-end: 1px solid var(--color-border);
    box-shadow: var(--shadow-sm);
    display: flex;
    align-items: center;
    position: sticky;
    inset-block-start: 0;
    z-index: 100;
  }

  &__container {
    width: 100%;
    max-width: var(--container-max);
    margin-inline: auto;
    padding-inline: var(--space-4);

    @include respond-to('md') {
      padding-inline: var(--space-6);
    }

    &--header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  &__brand {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    color: var(--color-primary);
    text-decoration: none;
    user-select: none;
  }

  &__brand-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    background: var(--color-primary-light);
    border-radius: var(--radius-md);
    color: var(--color-primary);
    flex-shrink: 0;
  }

  &__brand-name {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-bold);
    color: var(--color-primary);
    letter-spacing: -0.02em;
  }

  &__header-actions {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }

  &__main {
    flex: 1;
    padding-block: var(--space-8);
  }
}
</style>
