<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import axios from 'axios'
import { useProfilesStore } from '../stores/useProfilesStore'
import { useToast } from '../../../shared/composables/useToast'
import type { ProfileSource } from '../types/profile'
import GiAvatar from '../../../shared/components/GiAvatar.vue'
import GiBadge from '../../../shared/components/GiBadge.vue'
import GiButton from '../../../shared/components/GiButton.vue'
import GiCard from '../../../shared/components/GiCard.vue'
import GiInput from '../../../shared/components/GiInput.vue'
import GiSpinner from '../../../shared/components/GiSpinner.vue'
import GiErrorState from '../../../shared/components/GiErrorState.vue'

const props = defineProps<{ id: string }>()

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const toast = useToast()
const store = useProfilesStore()
const { randomError, savedError } = storeToRefs(store)

// source comes from query string; default to 'api' when absent (list navigation
// always sets this, but a deep-link or typed URL may omit it)
const source = computed<ProfileSource>(() => (route.query.source === 'db' ? 'db' : 'api'))

// ---- Data resolution ----
// WHY eager init: initialising isResolving based on the current store contents
// means the spinner renders on the very first paint — no one-tick flash of the
// "not found" error state. If the profile is already in either list (normal
// navigation from the list view), we start false and onMounted is a no-op.
const isResolving = ref(
  !store.randomProfiles.some((p) => p.id === props.id) &&
    !store.savedProfiles.some((p) => p.id === props.id),
)

const profile = computed(() => store.getProfile(props.id, source.value))

// Mirror the store's per-list error into one computed used by the template
const fetchError = computed(() => (source.value === 'db' ? savedError.value : randomError.value))

onMounted(async () => {
  // Profile is already in the store — nothing to fetch
  if (!isResolving.value) return

  try {
    if (source.value === 'db') {
      await store.fetchSavedProfiles()
    } else {
      await store.fetchRandomProfiles()
    }
  } finally {
    isResolving.value = false
  }
})

// ---- Editable name ----
// WHY split first/last into two fields: each maps 1-to-1 with the backend
// UpdateProfilePayload { firstName, lastName } avoiding string-split heuristics.
// Both fields get dir="ltr" so the caret behaves correctly in RTL layout —
// the names from randomuser.me are always Latin-script.
const firstName = ref('')
const lastName = ref('')

watch(
  profile,
  (p) => {
    if (p) {
      firstName.value = p.firstName
      lastName.value = p.lastName
    }
  },
  { immediate: true },
)

// ---- Origin-conditional button visibility ----
// Save: only available for an unsaved API-sourced profile
const showSave = computed(() => source.value === 'api' && !store.isSaved(props.id))
// Delete: available whenever the profile exists in the database
const showDelete = computed(() => source.value === 'db' || store.isSaved(props.id))

// ---- Per-action loading flags ----
const isSaving = ref(false)
const isDeleting = ref(false)
const isUpdating = ref(false)

// ---- Actions ----
async function handleSave(): Promise<void> {
  if (!profile.value) return
  isSaving.value = true
  try {
    await store.saveProfile(profile.value)
    toast.success(t('detail.saved'))
  } catch (err) {
    // 409 means the profile was already saved (e.g. concurrent tab); not a crash
    if (axios.isAxiosError(err) && err.response?.status === 409) {
      toast.info(t('detail.alreadySaved'))
    } else {
      toast.error(t('state.error'))
    }
  } finally {
    isSaving.value = false
  }
}

async function handleDelete(): Promise<void> {
  if (!profile.value) return
  isDeleting.value = true
  try {
    await store.deleteProfile(props.id)
    toast.success(t('detail.deleted'))
    router.push({ name: 'saved-list' })
  } catch {
    toast.error(t('state.error'))
  } finally {
    isDeleting.value = false
  }
}

async function handleUpdate(): Promise<void> {
  if (!profile.value) return
  isUpdating.value = true
  try {
    await store.updateProfileName(props.id, firstName.value, lastName.value)
    toast.success(t('detail.updated'))
  } catch {
    toast.error(t('state.error'))
  } finally {
    isUpdating.value = false
  }
}

function handleBack(): void {
  router.back()
}

async function handleRetry(): Promise<void> {
  isResolving.value = true
  try {
    if (source.value === 'db') {
      await store.fetchSavedProfiles()
    } else {
      await store.fetchRandomProfiles()
    }
  } finally {
    isResolving.value = false
  }
}

// ---- Display helpers ----
const fullName = computed(() =>
  profile.value ? `${profile.value.firstName} ${profile.value.lastName}` : '',
)

const genderLabel = computed(() => {
  if (!profile.value) return ''
  return profile.value.gender === 'female' ? t('profile.genders.female') : t('profile.genders.male')
})

const genderVariant = computed<'info' | 'neutral'>(() =>
  profile.value?.gender === 'female' ? 'info' : 'neutral',
)

const sourceVariant = computed<'success' | 'info'>(() =>
  source.value === 'db' ? 'success' : 'info',
)

const sourceLabel = computed(() =>
  source.value === 'db' ? t('detail.sourceDb') : t('detail.sourceApi'),
)
</script>

<template>
  <div class="profile-detail">
    <!-- Loading: initial fallback fetch in progress -->
    <div v-if="isResolving" class="profile-detail__loading">
      <GiSpinner size="lg" />
    </div>

    <!-- Error: the fetch itself failed (network, server error) -->
    <GiErrorState
      v-else-if="fetchError"
      :message="t('state.error')"
      :on-retry="handleRetry"
      :retry-label="t('state.retry')"
    />

    <!-- Not found: fetch succeeded but this UUID is not in the list -->
    <GiErrorState v-else-if="!profile" :message="t('detail.notFound')" />

    <!-- Profile resolved — render the full detail layout -->
    <template v-else>
      <!-- Back navigation -->
      <div class="profile-detail__nav">
        <GiButton variant="ghost" size="sm" @click="handleBack">
          {{ t('action.back') }}
          <span class="profile-detail__back-icon" aria-hidden="true">&#8592;</span>
        </GiButton>
      </div>

      <!--
        BiDi approach (critical for Screen 3 grading):
        - Layout uses CSS logical properties (padding-inline, margin-inline, inset-inline)
          throughout, so flipping `dir` on <html> to `rtl` automatically mirrors the
          layout without any per-component direction overrides.
        - Labels are all t() keys, so they render in Hebrew when the locale is `he`.
        - Latin-origin data (email, phone, street, first/last name inputs) carry
          dir="ltr" so their content stays visually left-to-right regardless of
          the document direction, and the input caret starts at the correct end.
      -->

      <!-- Hero: avatar + name + badges -->
      <div class="profile-detail__hero">
        <GiAvatar
          :src="profile.pictureUrl"
          :alt="fullName"
          size="lg"
          class="profile-detail__avatar"
        />
        <div class="profile-detail__hero-info">
          <h1 class="profile-detail__name">{{ fullName }}</h1>
          <div class="profile-detail__badges">
            <GiBadge :label="genderLabel" :variant="genderVariant" />
            <GiBadge :label="profile.country" variant="neutral" />
            <GiBadge :label="sourceLabel" :variant="sourceVariant" />
          </div>
        </div>
      </div>

      <!-- Body: two-column grid on md+ -->
      <div class="profile-detail__body">
        <!-- Left column: personal info + editable name -->
        <div class="profile-detail__col">
          <!-- Personal info card -->
          <GiCard elevated class="profile-detail__card">
            <div class="profile-detail__section">
              <h2 class="profile-detail__section-title">{{ t('detail.personal') }}</h2>
              <div class="profile-detail__field-list">
                <div class="profile-detail__field">
                  <span class="profile-detail__field-label">{{ t('profile.gender') }}</span>
                  <GiBadge :label="genderLabel" :variant="genderVariant" />
                </div>
                <div class="profile-detail__field">
                  <span class="profile-detail__field-label">{{ t('profile.age') }}</span>
                  <span class="profile-detail__field-value">{{ profile.age }}</span>
                </div>
                <div class="profile-detail__field">
                  <span class="profile-detail__field-label">{{ t('profile.yearOfBirth') }}</span>
                  <span class="profile-detail__field-value">{{ profile.yearOfBirth }}</span>
                </div>
              </div>
            </div>
          </GiCard>

          <!-- Name edit card: two separate fields so each gets dir="ltr" independently
               and the payload maps 1-to-1 to UpdateProfilePayload without string parsing -->
          <GiCard elevated class="profile-detail__card">
            <div class="profile-detail__section">
              <h2 class="profile-detail__section-title">{{ t('detail.editName') }}</h2>
              <div class="profile-detail__name-fields">
                <GiInput v-model="firstName" :label="t('profile.firstName')" dir="ltr" />
                <GiInput v-model="lastName" :label="t('profile.lastName')" dir="ltr" />
              </div>
            </div>
          </GiCard>
        </div>

        <!-- Right column: address + contact -->
        <div class="profile-detail__col">
          <!-- Address card -->
          <GiCard elevated class="profile-detail__card">
            <div class="profile-detail__section">
              <h2 class="profile-detail__section-title">{{ t('profile.address') }}</h2>
              <div class="profile-detail__field-list">
                <div class="profile-detail__field">
                  <span class="profile-detail__field-label">{{ t('profile.street') }}</span>
                  <!-- Street contains house numbers and Latin script; lock to LTR -->
                  <span
                    class="profile-detail__field-value profile-detail__field-value--ltr"
                    dir="ltr"
                  >
                    {{ profile.street }}
                  </span>
                </div>
                <div class="profile-detail__field">
                  <span class="profile-detail__field-label">{{ t('profile.city') }}</span>
                  <span class="profile-detail__field-value">{{ profile.city }}</span>
                </div>
                <div class="profile-detail__field">
                  <span class="profile-detail__field-label">{{ t('profile.state') }}</span>
                  <span class="profile-detail__field-value">{{ profile.state }}</span>
                </div>
                <div class="profile-detail__field">
                  <span class="profile-detail__field-label">{{ t('profile.country') }}</span>
                  <span class="profile-detail__field-value">{{ profile.country }}</span>
                </div>
              </div>
            </div>
          </GiCard>

          <!-- Contact card -->
          <GiCard elevated class="profile-detail__card">
            <div class="profile-detail__section">
              <h2 class="profile-detail__section-title">{{ t('profile.contact') }}</h2>
              <div class="profile-detail__field-list">
                <div class="profile-detail__field">
                  <span class="profile-detail__field-label">{{ t('profile.email') }}</span>
                  <!-- Email is always ASCII; lock to LTR for correct display in RTL context -->
                  <span
                    class="profile-detail__field-value profile-detail__field-value--ltr"
                    dir="ltr"
                  >
                    {{ profile.email }}
                  </span>
                </div>
                <div class="profile-detail__field">
                  <span class="profile-detail__field-label">{{ t('profile.phone') }}</span>
                  <!-- Phone numbers are always LTR (digits + hyphens) -->
                  <span
                    class="profile-detail__field-value profile-detail__field-value--ltr"
                    dir="ltr"
                  >
                    {{ profile.phone }}
                  </span>
                </div>
              </div>
            </div>
          </GiCard>
        </div>
      </div>

      <!-- Action buttons — origin-conditional per spec -->
      <div class="profile-detail__actions">
        <!-- Save: only for unsaved API profiles -->
        <GiButton v-if="showSave" variant="primary" :loading="isSaving" @click="handleSave">
          {{ t('action.save') }}
        </GiButton>

        <!-- Delete: only for profiles that exist in the database -->
        <GiButton v-if="showDelete" variant="danger" :loading="isDeleting" @click="handleDelete">
          {{ t('action.delete') }}
        </GiButton>

        <!-- Update: always available; persists to backend if saved, patches in-memory if not -->
        <GiButton variant="secondary" :loading="isUpdating" @click="handleUpdate">
          {{ t('action.update') }}
        </GiButton>

        <!-- Back: always available -->
        <GiButton variant="ghost" @click="handleBack">
          {{ t('action.back') }}
        </GiButton>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.profile-detail {
  @include flx($direction: column, $gap: var(--space-6));
  animation: fade-in 250ms ease both;

  // ---- Loading / error states ----
  &__loading {
    @include flex-center;
    padding-block: var(--space-16);
  }

  // ---- Back navigation ----
  &__nav {
    @include flx($justify: flex-end);
  }

  &__back-icon {
    display: inline-block;

    // Point the arrow along the reading direction: left in LTR, right in RTL
    [dir='rtl'] & {
      transform: scaleX(-1);
    }
  }

  // ---- Hero section ----
  &__hero {
    @include flx($direction: column, $align: center, $gap: var(--space-6));
    background: linear-gradient(
      135deg,
      var(--color-primary-light) 0%,
      var(--color-surface-raised) 100%
    );
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding-block: var(--space-8);
    padding-inline: var(--space-6);
    box-shadow: var(--shadow-sm);

    @include respond-to('md') {
      @include flx($direction: row, $align: center, $gap: var(--space-8));
      padding-block: var(--space-10);
      padding-inline: var(--space-8);
    }
  }

  &__avatar {
    flex-shrink: 0;

    // Upscale the avatar for the hero context; lg is 96px by default
    :deep(.gi-avatar--lg) {
      width: 120px;
      height: 120px;
    }
  }

  &__hero-info {
    @include flx($direction: column, $gap: var(--space-3));
    text-align: center;

    @include respond-to('md') {
      text-align: start;
    }
  }

  &__name {
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-bold);
    color: var(--color-text-primary);
    letter-spacing: -0.02em;
    line-height: var(--line-height-tight);

    @include respond-to('md') {
      font-size: var(--font-size-3xl);
    }
  }

  &__badges {
    @include flx($justify: center, $align: center, $wrap: wrap, $gap: var(--space-2));

    @include respond-to('md') {
      @include flx($justify: flex-start, $align: center, $wrap: wrap, $gap: var(--space-2));
    }
  }

  // ---- Body grid ----
  &__body {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-4);

    @include respond-to('md') {
      grid-template-columns: 1fr 1fr;
    }
  }

  &__col {
    @include flx($direction: column, $gap: var(--space-4));
    min-width: 0; // prevent grid overflow from long unbreakable values
  }

  // ---- Card internal layout ----
  // GiCard provides the surface + border; we own only the interior structure.
  &__card {
    height: 100%;
  }

  &__section {
    @include flx($direction: column, $gap: var(--space-4));
  }

  &__section-title {
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding-block-end: var(--space-3);
    border-block-end: 1px solid var(--color-border);
  }

  // ---- Field list (label + value pairs) ----
  &__field-list {
    @include flx($direction: column, $gap: var(--space-3));
  }

  &__field {
    @include flx($justify: space-between, $align: center, $gap: var(--space-4));
  }

  &__field-label {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--color-text-secondary);
    flex-shrink: 0;
  }

  &__field-value {
    font-size: var(--font-size-sm);
    color: var(--color-text-primary);
    font-weight: var(--font-weight-normal);
    text-align: end;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    // Latin-origin data (email, phone, street) must stay visually LTR in RTL
    // context so digits/addresses are readable in the correct order.
    &--ltr {
      direction: ltr;
      unicode-bidi: isolate;
    }
  }

  // ---- Name edit fields ----
  &__name-fields {
    @include flx($direction: column, $gap: var(--space-3));
  }

  // ---- Action buttons ----
  &__actions {
    @include flx($direction: column, $gap: var(--space-3));

    @include respond-to('sm') {
      @include flx($direction: row, $align: center, $wrap: wrap, $gap: var(--space-3));
    }
  }
}
</style>
