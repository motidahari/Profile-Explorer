<script setup lang="ts" generic="T">
defineProps<{
  items: T[]
  loading?: boolean
}>()
</script>

<template>
  <div class="gi-list">
    <div v-if="loading" class="gi-list__loading">
      <slot name="loading" />
    </div>
    <template v-else-if="items.length === 0">
      <div class="gi-list__empty">
        <slot name="empty" />
      </div>
    </template>
    <template v-else>
      <div v-for="(item, index) in items" :key="index" class="gi-list__item">
        <slot name="item" :item="item" :index="index" />
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.gi-list {
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
