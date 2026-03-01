<template>
  <div class="flex flex-col h-screen">
    <!-- Header -->
    <header class="flex items-center justify-between px-10 py-5">
      <div class="flex items-center">
        <img src="/images/logo.svg" alt="Logo" class="h-11" />
      </div>
      <div class="flex items-center space-x-6">
        <LanguageSwitcher />
        <button class="text-sm font-medium text-gray-700 hover:text-gray-900">Login</button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex flex-1 px-2">
      <!-- Left Sidebar -->
      <aside
        class="w-72 bg-white bg-opacity-20 border-r rounded-[12px] border-gray-200 p-4 mr-2 overflow-y-auto shadow">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">{{ t('allNotes') }}</h2>
          <span class="text-sm text-gray-500">1 note</span>
        </div>

        <button
          class="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center space-x-2 mb-6">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>{{ t('createNote') }}</span>
        </button>

        <!-- Note List -->
        <div class="space-y-3">
          <div class="border border-gray-200 rounded-lg p-3 hover:shadow-sm active:bg-gray-100">
            <div class="text-sm font-medium text-gray-900">{{ t('noteTitle') }}</div>
            <div class="text-xs text-gray-500 mt-1">Last synced: 2028/02/22</div>
          </div>
        </div>

        <!-- Additional Features -->
        <div class="mt-8">
          <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{{ t('additionalFeatures') }}</h3>

          <div class="bg-white border border-gray-200 rounded-lg p-3 mb-3">
            <div class="flex items-start space-x-2">
              <svg class="w-5 h-5 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <div>
                <div class="text-sm font-medium text-gray-900">AI Edit</div>
                <div class="text-xs text-gray-500 mt-0.5">An AI assistant that helps you write and polish your notes.
                </div>
                <button class="text-xs text-blue-600 hover:text-blue-800 mt-1">apply</button>
              </div>
            </div>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg p-3">
            <div class="flex items-start space-x-2">
              <svg class="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
              </svg>
              <div>
                <div class="text-sm font-medium text-gray-900">Attach images and files</div>
                <div class="text-xs text-gray-500 mt-0.5">Attach images, PDFs, and other types of files to your notes.
                </div>
                <button class="text-xs text-blue-600 hover:text-blue-800 mt-1">apply</button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- Right Editor -->
      <div class="flex-1 flex flex-col bg-white border-r border-gray-200 shadow">
        <!-- Editor Content -->
        <div class="flex-1 overflow-y-auto p-8">
          <div ref="editor" class="min-h-full">
            
          </div>
        </div>

      </div>
    </main>

    <!-- Footer -->
    <footer class="border-t border-gray-200 p-3 bg-gray-50">
      <div class="text-xs text-gray-500 text-center" v-html="t('footerText', [
        `<a href='#' class='text-blue-600 hover:underline'>${t('termsOfService')}</a>`,
        `<a href='#' class='text-blue-600 hover:underline'>${t('privacyPolicy')}</a>`
      ])"></div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import Quill from 'quill'
import LanguageSwitcher from '../components/LanguageSwitcher.vue'
import 'quill/dist/quill.snow.css'

const { t } = useI18n()
const editor = ref<HTMLElement | null>(null)
const quill = ref<Quill | null>(null)

onMounted(() => {
  if (editor.value) {
    quill.value = new Quill(editor.value, {
      theme: 'snow',
      placeholder: t('emptyState')
    })
  }
})
</script>

<style scoped>
/* Custom styles for Quill editor */
:deep(.ql-container) {
  font-size: 16px;
  min-height: 400px;
}

:deep(.ql-editor h1) {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1rem;
}
</style>