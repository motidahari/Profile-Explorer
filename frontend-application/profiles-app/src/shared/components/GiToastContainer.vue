<script setup lang="ts">
import { useToast } from '../composables/useToast'
import GiToast from './GiToast.vue'

const { toasts, dismiss } = useToast()
</script>

<template>
  <Teleport to="body">
    <div class="gi-toast-container" aria-label="Notifications">
      <TransitionGroup name="toast" tag="div" class="gi-toast-container__stack">
        <GiToast
          v-for="toast in toasts"
          :key="toast.id"
          :id="toast.id"
          :message="toast.message"
          :type="toast.type"
          @dismiss="dismiss"
        />
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.gi-toast-container {
  position: fixed;
  inset-block-end: var(--space-6);
  inset-inline-end: var(--space-6);
  z-index: 9999;
  pointer-events: none;

  &__stack {
    @include flx($direction: column, $gap: var(--space-2));
    align-items: flex-end;
    pointer-events: auto;
  }
}

.toast-enter-active {
  animation: slide-up 200ms ease both;
}

.toast-leave-active {
  animation: slide-up 150ms ease reverse both;
}

.toast-move {
  transition: transform 200ms ease;
}
</style>
