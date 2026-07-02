import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../../features/profiles/views/HomeView.vue'),
    },
    {
      path: '/random',
      name: 'random-list',
      component: () => import('../../features/profiles/views/RandomListView.vue'),
    },
    {
      path: '/saved',
      name: 'saved-list',
      component: () => import('../../features/profiles/views/SavedListView.vue'),
    },
    {
      path: '/profile/:id',
      name: 'profile-detail',
      component: () => import('../../features/profiles/views/ProfileDetailView.vue'),
    },
  ],
})

export default router
