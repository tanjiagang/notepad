<template>
  <div class="language-switcher flex items-center">
    <el-dropdown trigger="click" @command="handleLanguageChange">
      <span class="language-label">
        {{ currentLanguage }}
        <el-icon class="el-icon--right"><ArrowDown /></el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="zh-CN">中文</el-dropdown-item>
          <el-dropdown-item command="en-US">English</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowDown } from '@element-plus/icons-vue'

const { locale } = useI18n()

// 当前语言显示文本
const currentLanguage = computed(() => {
  return locale.value === 'zh-CN' ? '中文' : 'English'
})

// 处理语言切换
const handleLanguageChange = (lang: string) => {
  locale.value = lang
  localStorage.setItem('locale', lang)
}

// 监听语言变化，更新文档语言属性
watch(
  () => locale.value,
  (newLang) => {
    document.documentElement.lang = newLang
  },
  { immediate: true }
)
</script>

<style scoped>
.language-switcher {
  margin-left: auto;
}

.language-label {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.language-label:hover {
  color: #409eff;
}
</style>
