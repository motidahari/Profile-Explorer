import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import router from './core/router'
import en from './locales/en.json'
import he from './locales/he.json'
import './styles/main.scss'

const savedLocale = (localStorage.getItem('app-locale') ?? 'en') as 'en' | 'he'

document.documentElement.setAttribute('dir', savedLocale === 'he' ? 'rtl' : 'ltr')
document.documentElement.setAttribute('lang', savedLocale)

const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'en',
  messages: { en, he },
})

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(i18n)
app.mount('#app')
