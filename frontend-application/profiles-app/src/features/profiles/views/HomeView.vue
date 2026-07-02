<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import GiButton from '../../../shared/components/GiButton.vue'

const router = useRouter()
const { t } = useI18n()

function goToRandomList(): void {
  router.push({ name: 'random-list' })
}

function goToSavedList(): void {
  router.push({ name: 'saved-list' })
}
</script>

<template>
  <div class="home-view">
    <div class="home-view__backdrop" aria-hidden="true">
      <span class="home-view__orb home-view__orb--1" />
      <span class="home-view__orb home-view__orb--2" />
    </div>

    <div class="home-view__content">
      <div class="home-view__hero">
        <div class="home-view__icon-wrap" aria-hidden="true">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="14" r="7" fill="currentColor" />
            <path
              d="M6 36c0-7.732 6.268-14 14-14s14 6.268 14 14"
              stroke="currentColor"
              stroke-width="3"
              stroke-linecap="round"
            />
          </svg>
        </div>
        <h1 class="home-view__title">{{ t('home.title') }}</h1>
        <p class="home-view__subtitle">{{ t('home.subtitle') }}</p>
      </div>

      <div class="home-view__actions">
        <GiButton variant="primary" size="lg" @click="goToRandomList">
          {{ t('nav.fetch') }}
        </GiButton>
        <GiButton variant="secondary" size="lg" @click="goToSavedList">
          {{ t('nav.history') }}
        </GiButton>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home-view {
  position: relative;
  @include flex-center;
  min-height: calc(100vh - var(--header-height) - var(--space-16));
  overflow: hidden;

  &__backdrop {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
  }

  &__orb {
    position: absolute;
    border-radius: var(--radius-full);
    background: var(--color-primary-light);
    opacity: 0.6;

    &--1 {
      width: 320px;
      height: 320px;
      inset-block-start: -80px;
      inset-inline-end: -60px;
    }

    &--2 {
      width: 200px;
      height: 200px;
      inset-block-end: -40px;
      inset-inline-start: -40px;
      opacity: 0.4;
    }
  }

  &__content {
    position: relative;
    z-index: 1;
    @include flx($direction: column, $align: center, $gap: var(--space-10));
    width: 100%;
    max-width: 560px;
    padding-inline: var(--space-4);
    text-align: center;
    animation: slide-up 400ms ease both;
  }

  &__hero {
    @include flx($direction: column, $align: center, $gap: var(--space-4));
  }

  &__icon-wrap {
    @include flex-center;
    width: 80px;
    height: 80px;
    border-radius: var(--radius-xl);
    background: var(--color-primary-light);
    color: var(--color-primary);
    margin-block-end: var(--space-2);
  }

  &__title {
    font-size: var(--font-size-3xl);
    font-weight: var(--font-weight-bold);
    color: var(--color-text-primary);
    letter-spacing: -0.03em;
    line-height: var(--line-height-tight);

    @include respond-to('md') {
      font-size: 40px;
    }
  }

  &__subtitle {
    font-size: var(--font-size-lg);
    color: var(--color-text-secondary);
    line-height: var(--line-height-normal);
    max-width: 400px;
  }

  &__actions {
    @include flx($direction: column, $gap: var(--space-3), $align: stretch);
    width: 100%;

    @include respond-to('sm') {
      @include flx($direction: row, $justify: center, $gap: var(--space-4));
      width: auto;
    }
  }
}
</style>
