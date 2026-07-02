import { useI18n } from 'vue-i18n'

const LOCALE_KEY = 'app-locale'

export function useLocale() {
  const { locale } = useI18n()

  function setLocale(lang: 'en' | 'he') {
    locale.value = lang
    localStorage.setItem(LOCALE_KEY, lang)
    document.documentElement.setAttribute('dir', lang === 'he' ? 'rtl' : 'ltr')
    document.documentElement.setAttribute('lang', lang)
  }

  return { locale, setLocale }
}
