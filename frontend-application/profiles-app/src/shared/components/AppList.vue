<script setup lang="ts" generic="T">
defineProps<{
  items: T[]
  loading?: boolean
}>()
</script>

<template>
  <div class="app-list">
    <div v-if="loading" class="app-list__loading">
      <slot name="loading" />
    </div>
    <template v-else-if="items.length === 0">
      <div class="app-list__empty">
        <slot name="empty" />
      </div>
    </template>
    <template v-else>
      <div v-for="(item, index) in items" :key="index" class="app-list__item">
        <slot name="item" :item="item" :index="index" />
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.app-list {
  width: 100%;

  &__loading {
    @include flx($direction: column, $align: center, $gap: var(--space-4));
    padding-block: var(--space-8);
  }

  &__empty {
    @include flx($direction: column, $align: center, $gap: var(--space-4));
    padding-block: var(--space-8);
  }

  &__item {
    & + & {
      border-block-start: 1px solid var(--color-border);
    }
  }
}
</style>
