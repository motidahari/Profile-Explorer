<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useProfilesStore } from '../stores/useProfilesStore'
import { useFilter } from '../composables/useFilter'
import ProfileRow from '../components/ProfileRow.vue'
import GiButton from '../../../shared/components/GiButton.vue'
import GiInput from '../../../shared/components/GiInput.vue'
import GiList from '../../../shared/components/GiList.vue'
import GiSkeleton from '../../../shared/components/GiSkeleton.vue'
import GiEmptyState from '../../../shared/components/GiEmptyState.vue'
import GiErrorState from '../../../shared/components/GiErrorState.vue'
import type { Profile } from '../types/profile'

const router = useRouter()
const { t } = useI18n()
const store = useProfilesStore()
const { randomProfiles, randomLoading, randomError } = storeToRefs(store)

const { search, filtered } = useFilter(randomProfiles)

onMounted(() => {
  store.fetchRandomProfiles()
})

function handleSelect(profile: Profile): void {
  router.push({
    name: 'profile-detail',
    params: { id: profile.id },
    query: { source: 'api' },
  })
}

function handleRetry(): void {
  store.fetchRandomProfiles()
}

function goBack(): void {
  router.push({ name: 'home' })
}
</script>

<template>
  <div class="random-list-view">
    <div class="random-list-view__header">
      <div class="random-list-view__nav">
        <GiButton variant="ghost" size="sm" @click="goBack"> ← {{ t('action.back') }} </GiButton>
      </div>
      <div class="random-list-view__title-row">
        <h1 class="random-list-view__title">{{ t('list.randomTitle') }}</h1>
        <span v-if="!randomLoading && !randomError" class="random-list-view__count">
          {{ filtered.length }}
          <span v-if="filtered.length !== randomProfiles.length"
            >/ {{ randomProfiles.length }}</span
          >
        </span>
      </div>
    </div>

    <div class="random-list-view__filter">
      <GiInput
        v-model="search"
        :placeholder="t('filter.placeholder')"
        :disabled="randomLoading || !!randomError"
      />
    </div>

    <div class="random-list-view__list-card">
      <GiErrorState
        v-if="randomError"
        :message="t('state.error')"
        :on-retry="handleRetry"
        :retry-label="t('state.retry')"
      />

      <GiList v-else :items="filtered" :loading="randomLoading">
        <template #loading>
          <div v-for="n in 8" :key="n" class="random-list-view__skeleton-row">
            <GiSkeleton variant="circle" width="48px" height="48px" />
            <div class="random-list-view__skeleton-content">
              <GiSkeleton variant="text" width="55%" height="16px" />
              <GiSkeleton variant="text" width="75%" height="12px" />
            </div>
          </div>
        </template>

        <template #empty>
          <GiEmptyState
            :title="t('state.empty')"
            :description="search ? undefined : t('list.emptyRandomDescription')"
          />
        </template>

        <template #item="{ item }">
          <ProfileRow :profile="item as Profile" @select="handleSelect" />
        </template>
      </GiList>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.random-list-view {
  @include flx($direction: column, $gap: var(--space-6));
  animation: fade-in 250ms ease both;

  &__header {
    @include flx($direction: column, $gap: var(--space-3));
  }

  &__nav {
    @include flx;
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

  &__skeleton-row {
    @include flx($align: center, $gap: var(--space-4));
    padding-block: var(--space-4);
    padding-inline: var(--space-4);

    & + & {
      border-block-start: 1px solid var(--color-border);
    }
  }

  &__skeleton-content {
    @include flx($direction: column, $gap: var(--space-2));
    flex: 1;
  }

  // Stagger the appearance of each profile row for a polished load-in effect
  @for $i from 1 through 10 {
    :deep(.gi-list__item:nth-child(#{$i}) .profile-row) {
      animation-delay: #{($i - 1) * 35}ms;
    }
  }
}
</style>
