<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useProfilesStore } from '../stores/useProfilesStore'
import { useFilter } from '../composables/useFilter'
import ProfileTable from '../components/ProfileTable.vue'
import GiButton from '../../../shared/components/GiButton.vue'
import GiInput from '../../../shared/components/GiInput.vue'
import GiEmptyState from '../../../shared/components/GiEmptyState.vue'
import GiErrorState from '../../../shared/components/GiErrorState.vue'
import type { Profile } from '../types/profile'

const router = useRouter()
const { t } = useI18n()
const store = useProfilesStore()
const { savedProfiles, savedLoading, savedError } = storeToRefs(store)

const { search, filtered } = useFilter(savedProfiles)

onMounted(() => {
  store.fetchSavedProfiles()
})

function handleSelect(profile: Profile): void {
  router.push({
    name: 'profile-detail',
    params: { id: profile.id },
    query: { source: 'db' },
  })
}

function handleRetry(): void {
  store.fetchSavedProfiles()
}

function goBack(): void {
  router.push({ name: 'home' })
}
</script>

<template>
  <div class="saved-list-view">
    <div class="saved-list-view__header">
      <div class="saved-list-view__nav">
        <GiButton variant="ghost" size="sm" @click="goBack">
          {{ t('action.back') }}
          <span class="saved-list-view__back-icon" aria-hidden="true">←</span>
        </GiButton>
      </div>
      <div class="saved-list-view__title-row">
        <h1 class="saved-list-view__title">{{ t('list.savedTitle') }}</h1>
        <span
          v-if="!savedLoading && !savedError && savedProfiles.length > 0"
          class="saved-list-view__count"
        >
          {{ filtered.length }}
          <span v-if="filtered.length !== savedProfiles.length">/ {{ savedProfiles.length }}</span>
        </span>
      </div>
    </div>

    <div class="saved-list-view__filter">
      <GiInput
        v-model="search"
        :placeholder="t('filter.placeholder')"
        :disabled="savedLoading || !!savedError"
      />
    </div>

    <div class="saved-list-view__list-card">
      <GiErrorState
        v-if="savedError"
        :message="t('state.error')"
        :on-retry="handleRetry"
        :retry-label="t('state.retry')"
      />

      <GiEmptyState
        v-else-if="!savedLoading && filtered.length === 0"
        :title="search ? t('state.empty') : t('state.emptySaved')"
        :description="search ? undefined : t('list.emptySavedDescription')"
        icon="🔖"
      />

      <ProfileTable
        v-else
        :items="filtered"
        :loading="savedLoading"
        :skeleton-rows="5"
        @select="handleSelect"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.saved-list-view {
  @include flx($direction: column, $gap: var(--space-6));
  animation: fade-in 250ms ease both;

  &__header {
    @include flx($direction: column, $gap: var(--space-3));
  }

  &__nav {
    @include flx($justify: flex-end);
  }

  &__back-icon {
    display: inline-block;
    transform: rotate(180deg);

    // Mirror the rotated arrow in RTL so both directions stay symmetric
    [dir='rtl'] & {
      transform: rotate(180deg) scaleX(-1);
    }
  }

  &__title-row {
    @include flx($align: center, $gap: var(--space-3));
  }

  &__title {
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-bold);
    color: var(--color-text-primary);
    letter-spacing: -0.02em;
    line-height: var(--line-height-tight);

    @include respond-to('md') {
      font-size: var(--font-size-3xl);
    }
  }

  &__count {
    display: inline-flex;
    align-items: center;
    padding-block: var(--space-1);
    padding-inline: var(--space-3);
    background-color: var(--color-primary-light);
    color: var(--color-primary);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-semibold);
    border-radius: var(--radius-full);
  }

  &__filter {
    max-width: 480px;
  }

  &__list-card {
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
  }
}
</style>
