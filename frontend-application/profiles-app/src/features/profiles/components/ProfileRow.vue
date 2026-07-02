<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import GiAvatar from '../../../shared/components/GiAvatar.vue'
import GiBadge from '../../../shared/components/GiBadge.vue'
import type { Profile } from '../types/profile'

const props = defineProps<{
  profile: Profile
}>()

const emit = defineEmits<{
  select: [profile: Profile]
}>()

const { t } = useI18n()

const fullName = computed(() => `${props.profile.firstName} ${props.profile.lastName}`)

const genderVariant = computed<'info' | 'neutral'>(() =>
  props.profile.gender === 'female' ? 'info' : 'neutral',
)

const genderLabel = computed(() =>
  props.profile.gender === 'female' ? t('profile.genders.female') : t('profile.genders.male'),
)

function handleSelect(): void {
  emit('select', props.profile)
}
</script>

<template>
  <button type="button" class="profile-row" @click="handleSelect">
    <GiAvatar :src="profile.pictureUrl" :alt="fullName" size="md" class="profile-row__avatar" />

    <div class="profile-row__body">
      <div class="profile-row__identity">
        <span class="profile-row__name">{{ fullName }}</span>
        <GiBadge :label="genderLabel" :variant="genderVariant" />
      </div>

      <div class="profile-row__meta">
        <span class="profile-row__meta-item">{{ profile.country }}</span>
        <span class="profile-row__meta-item profile-row__meta-item--ltr" dir="ltr">{{
          profile.phone
        }}</span>
        <span class="profile-row__meta-item profile-row__meta-item--ltr" dir="ltr">{{
          profile.email
        }}</span>
      </div>
    </div>

    <svg
      class="profile-row__chevron"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 4l4 4-4 4"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </button>
</template>

<style lang="scss" scoped>
.profile-row {
  @include flx($align: center, $gap: var(--space-4));
  width: 100%;
  padding-block: var(--space-4);
  padding-inline: var(--space-4);
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: start;
  color: inherit;
  transition: background-color var(--transition-fast);
  animation: slide-up 300ms ease both;

  &:hover {
    background-color: var(--color-surface-raised);
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: -2px;
  }

  &__avatar {
    flex-shrink: 0;
  }

  &__body {
    @include flx($direction: column, $gap: var(--space-1));
    flex: 1;
    min-width: 0;

    @include respond-to('md') {
      @include flx($direction: row, $align: center, $gap: var(--space-6));
    }
  }

  &__identity {
    @include flx($align: center, $gap: var(--space-2), $wrap: wrap);

    @include respond-to('md') {
      flex: 2;
      min-width: 0;
    }
  }

  &__name {
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-primary);
    @include truncate;
    max-width: 200px;
  }

  &__meta {
    @include flx($direction: column, $gap: var(--space-1));

    @include respond-to('md') {
      @include flx($direction: row, $align: center, $gap: var(--space-6));
      flex: 3;
    }
  }

  &__meta-item {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    @include truncate;

    @include respond-to('md') {
      flex: 1;
    }

    &--ltr {
      direction: ltr;
      unicode-bidi: isolate;
    }
  }

  &__chevron {
    flex-shrink: 0;
    color: var(--color-text-muted);
    transition: color var(--transition-fast);

    // Mirror the chevron so it points in the reading direction for RTL
    [dir='rtl'] & {
      transform: scaleX(-1);
    }
  }

  &:hover &__chevron {
    color: var(--color-primary);
  }
}
</style>
