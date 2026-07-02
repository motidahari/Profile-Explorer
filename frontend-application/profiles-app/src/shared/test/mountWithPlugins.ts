import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { createRouter, createMemoryHistory } from 'vue-router'
import type { Component } from 'vue'
import type { MountingOptions } from '@vue/test-utils'
import en from '../../locales/en.json'
import he from '../../locales/he.json'

export function createTestI18n() {
  return createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages: { en, he },
  })
}

export function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'home', component: { template: '<div />' } },
      { path: '/random', name: 'random-list', component: { template: '<div />' } },
      { path: '/saved', name: 'saved-list', component: { template: '<div />' } },
      { path: '/profile/:id', name: 'profile-detail', component: { template: '<div />' } },
    ],
  })
}

export function mountWithPlugins(
  component: Component,
  options: MountingOptions<Record<string, unknown>> = {},
) {
  const i18n = createTestI18n()
  const router = createTestRouter()

  const existingGlobal = options.global ?? {}
  const existingPlugins = Array.isArray(existingGlobal.plugins) ? existingGlobal.plugins : []

  return mount(component, {
    ...options,
    global: {
      ...existingGlobal,
      plugins: [...existingPlugins, i18n, router],
    },
  })
}
