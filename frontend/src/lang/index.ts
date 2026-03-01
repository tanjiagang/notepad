import { createI18n } from 'vue-i18n'
import zhCN from './zh-CN'
import enUS from './en-US'

// 检测浏览器语言
const getBrowserLanguage = () => {
  const lang = navigator.language
  if (lang.startsWith('zh')) {
    return 'zh-CN'
  }
  return 'en-US'
}

// 从本地存储获取语言设置，默认使用浏览器语言
const getLocale = () => {
  return localStorage.getItem('locale') || getBrowserLanguage()
}

const i18n = createI18n({
  legacy: false, // 使用组合式 API
  locale: getLocale(),
  fallbackLocale: 'en-US',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS
  }
})

export default i18n
