<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import GiAvatar from '../../../shared/components/GiAvatar.vue'
import GiBadge from '../../../shared/components/GiBadge.vue'
import GiSkeleton from '../../../shared/components/GiSkeleton.vue'
import type { Profile } from '../types/profile'

defineProps<{
  items: Profile[]
  loading?: boolean
  skeletonRows?: number
}>()

const emit = defineEmits<{
  select: [profile: Profile]
}>()

const { t } = useI18n()

function fullName(profile: Profile): string {
  return `${profile.firstName} ${profile.lastName}`
}

function genderVariant(profile: Profile): 'info' | 'neutral' {
  return profile.gender === 'female' ? 'info' : 'neutral'
}

function genderLabel(profile: Profile): string {
  return profile.gender === 'female' ? t('profile.genders.female') : t('profile.genders.male')
}

function handleSelect(profile: Profile): void {
  emit('select', profile)
}
</script>

<template>
  <div class="profile-table">
    <table class="profile-table__table">
      <thead class="profile-table__head">
        <tr>
          <th class="profile-table__th profile-table__th--avatar">
            <span class="profile-table__sr-only">{{ t('profile.name') }}</span>
          </th>
          <th class="profile-table__th">{{ t('profile.name') }}</th>
          <th class="profile-table__th">{{ t('profile.gender') }}</th>
          <th class="profile-table__th">{{ t('profile.country') }}</th>
          <th class="profile-table__th">{{ t('profile.phone') }}</th>
          <th class="profile-table__th">{{ t('profile.email') }}</th>
        </tr>
      </thead>

      <tbody v-if="loading" class="profile-table__body">
        <tr v-for="n in skeletonRows ?? 8" :key="n" class="profile-table__row">
          <td class="profile-table__td profile-table__td--avatar">
            <GiSkeleton variant="circle" width="40px" height="40px" />
          </td>
          <td class="profile-table__td"><GiSkeleton variant="text" width="70%" height="16px" /></td>
          <td class="profile-table__td"><GiSkeleton variant="text" width="60%" height="16px" /></td>
          <td class="profile-table__td"><GiSkeleton variant="text" width="65%" height="16px" /></td>
          <td class="profile-table__td"><GiSkeleton variant="text" width="80%" height="16px" /></td>
          <td class="profile-table__td"><GiSkeleton variant="text" width="90%" height="16px" /></td>
        </tr>
      </tbody>

      <tbody v-else class="profile-table__body">
        <tr
          v-for="profile in items"
          :key="profile.id"
          class="profile-table__row profile-table__row--clickable"
          tabindex="0"
          @click="handleSelect(profile)"
          @keydown.enter.prevent="handleSelect(profile)"
          @keydown.space.prevent="handleSelect(profile)"
        >
          <td class="profile-table__td profile-table__td--avatar">
            <GiAvatar :src="profile.pictureUrl" :alt="fullName(profile)" size="sm" />
          </td>
          <td class="profile-table__td profile-table__td--name">{{ fullName(profile) }}</td>
          <td class="profile-table__td">
            <GiBadge :label="genderLabel(profile)" :variant="genderVariant(profile)" />
          </td>
          <td class="profile-table__td">{{ profile.country }}</td>
          <td class="profile-table__td profile-table__td--ltr" dir="ltr">{{ profile.phone }}</td>
          <td class="profile-table__td profile-table__td--ltr" dir="ltr">{{ profile.email }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped>
.profile-table {
  width: 100%;
  overflow-x: auto;

  &__table {
    width: 100%;
    min-width: 720px;
    border-collapse: collapse;
    text-align: start;
  }

  &__th {
    padding-block: var(--space-3);
    padding-inline: var(--space-4);
    text-align: start;
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-semibold);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--color-text-muted);
    background-color: var(--color-surface-raised);
    border-block-end: 1px solid var(--color-border);
    white-space: nowrap;

    &--avatar {
      width: 64px;
    }
  }

  &__row {
    transition: background-color var(--transition-fast);

    & + & .profile-table__td {
      border-block-start: 1px solid var(--color-border);
    }

    &--clickable {
      cursor: pointer;

      &:hover {
        background-color: var(--color-surface-raised);
      }

      &:focus-visible {
        outline: 2px solid var(--color-primary);
        outline-offset: -2px;
      }
    }
  }

  &__td {
    padding-block: var(--space-3);
    padding-inline: var(--space-4);
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    vertical-align: middle;
    white-space: nowrap;

    &--avatar {
      width: 64px;
    }

    &--name {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
    }

    &--ltr {
      direction: ltr;
      unicode-bidi: isolate;
      text-align: start;
    }
  }

  &__sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
}
</style>
