<template>
  <div class="flex flex-col h-screen">
    <!-- Header -->
    <header class="flex items-center justify-between px-4 sm:px-10 py-4 sm:py-5">
      <div class="flex items-center">
        <button 
          class="sm:hidden mr-3 text-gray-700"
          @click="toggleSidebar"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <img src="/images/logo.svg" alt="Logo" class="h-9 sm:h-11" />
      </div>
      <div class="flex items-center space-x-4 sm:space-x-6">
        <LanguageSwitcher />
        <!-- User Info / Login Button -->
        <div v-if="authStore.isAuthenticated" class="flex items-center space-x-3">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-medium text-sm">
              {{ authStore.user?.username.charAt(0).toUpperCase() }}
            </div>
            <span class="text-sm font-medium text-gray-700 hidden sm:block">{{ authStore.user?.username }}</span>
          </div>
          <button 
            class="text-sm text-gray-500 hover:text-gray-700"
            @click="handleLogout"
          >
            {{ t('logout') }}
          </button>
        </div>
        <button 
          v-else 
          class="text-sm font-medium text-gray-700 hover:text-gray-900" 
          @click="navigateToLogin"
        >
          {{ t('login.loginButton') }}
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex flex-1 px-2">
      <!-- Left Sidebar -->
      <aside
        class="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 p-3 overflow-y-auto shadow transform transition-transform duration-300 ease-in-out sm:relative sm:z-0 sm:transform-none sm:static sm:block sm:w-72 sm:bg-opacity-20 sm:mr-2"
        :class="{ 'translate-x-0': sidebarOpen, '-translate-x-full': !sidebarOpen }"
      >
        <!-- Mobile close button -->
        <button 
          class="sm:hidden absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          @click="toggleSidebar"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div class="flex items-center justify-between mb-3 sm:mb-4">
          <h2 class="text-base sm:text-lg font-semibold text-gray-900">{{ t('allNotes') }}</h2>
          <span class="text-xs sm:text-sm text-gray-500">{{ noteStore.notes.length }} {{ t('notes') }}</span>
        </div>

        <button
          class="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center space-x-2 mb-4 sm:mb-6"
          @click="createNewNote"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>{{ t('createNote') }}</span>
        </button>

        <!-- Note List -->
        <div class="space-y-2 sm:space-y-3">
          <div 
            v-for="note in noteStore.sortedNotes" 
            :key="note._id"
            class="border border-gray-200 rounded-lg p-2 sm:p-3 hover:shadow-sm active:bg-gray-100 cursor-pointer transition-all"
            :class="{ 'bg-green-50 border-green-300': currentNote?._id === note._id }"
            @click="selectNote(note)"
          >
            <div class="flex items-center justify-between">
              <div class="text-sm font-medium text-gray-900 truncate flex-1">{{ note.title || t('untitled') }}</div>
              <button 
                v-if="currentNote?._id === note._id"
                class="ml-2 text-red-500 hover:text-red-700"
                @click.stop="deleteCurrentNote"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            <div class="text-xs text-gray-500 mt-1">{{ formatDate(note.updatedAt) }}</div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="noteStore.notes.length === 0" class="text-center py-8 text-gray-500">
          <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p class="text-sm">{{ t('noNotes') }}</p>
        </div>

        <!-- Additional Features -->
        <div class="mt-6 sm:mt-8">
          <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 sm:mb-3">{{ t('additionalFeatures') }}</h3>

          <div class="bg-white border border-gray-200 rounded-lg p-2 sm:p-3 mb-2 sm:mb-3">
            <div class="flex items-start space-x-2">
              <svg class="w-4 sm:w-5 h-4 sm:h-5 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
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

          <div class="bg-white border border-gray-200 rounded-lg p-2 sm:p-3">
            <div class="flex items-start space-x-2">
              <svg class="w-4 sm:w-5 h-4 sm:h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
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
        <!-- Editor Toolbar -->
        <div class="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-gray-50">
          <div class="flex items-center space-x-2 text-sm text-gray-500">
            <span v-if="saving">{{ t('saving') }}...</span>
            <span v-else-if="lastSaved">{{ t('saved') }} {{ formatTime(lastSaved) }}</span>
          </div>
          <div class="flex items-center space-x-2">
            <button 
              class="px-3 py-1 text-sm bg-green-500 hover:bg-green-600 text-white rounded"
              @click="saveNote"
            >
              {{ t('save') }}
            </button>
          </div>
        </div>
        
        <!-- Editor Content -->
        <div class="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          <div ref="editor" class="min-h-full">
            
          </div>
        </div>

      </div>
    </main>

    <!-- Footer -->
    <footer class="border-t border-gray-200 p-2 sm:p-3 bg-gray-50">
      <div class="text-xs text-gray-500 text-center" v-html="t('footerText', [
        `<a href='#' class='text-blue-600 hover:underline'>${t('termsOfService')}</a>`,
        `<a href='#' class='text-blue-600 hover:underline'>${t('privacyPolicy')}</a>`
      ])"></div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import Quill from 'quill'
import LanguageSwitcher from '../components/LanguageSwitcher.vue'
import { useNoteStore } from '../stores/note'
import { type Note } from '../api/note'
import { useAuthStore } from '../stores/auth'
import 'quill/dist/quill.snow.css'

const { t } = useI18n()
const router = useRouter()
const noteStore = useNoteStore()
const authStore = useAuthStore()
const editor = ref<HTMLElement | null>(null)
const quill = ref<Quill | null>(null)
const sidebarOpen = ref(false)
const currentNote = ref<Note | null>(null)
const saving = ref(false)
const lastSaved = ref<Date | null>(null)
let autoSaveTimer: number | null = null

const navigateToLogin = () => {
  router.push('/login')
}

const handleLogout = () => {
  // Clear notes first
  noteStore.clearNotes()
  authStore.logout()
  // Clear current note and redirect to login
  currentNote.value = null
  if (quill.value) {
    quill.value.root.innerHTML = ''
  }
  router.push('/login')
}

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatTime = (date: string | Date) => {
  return new Date(date).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const selectNote = (note: Note) => {
  currentNote.value = note
  if (quill.value) {
    quill.value.root.innerHTML = note.content || ''
  }
  // Close sidebar on mobile after selecting a note
  if (window.innerWidth < 640) {
    sidebarOpen.value = false
  }
}

const createNewNote = async () => {
  const newNote = await noteStore.createNote({
    title: t('untitled'),
    content: '',
    isPinned: false,
    category: '',
    tags: [],
    isEncrypted: false
  })
  if (newNote) {
    currentNote.value = newNote
    if (quill.value) {
      quill.value.root.innerHTML = ''
    }
    lastSaved.value = null
  }
}

const saveNote = async () => {
  console.log('Save note clicked, currentNote:', currentNote.value)
  console.log('Note store notes:', noteStore.notes)
  
  if (!currentNote.value || !quill.value) {
    console.log('Cannot save: currentNote or quill is null')
    // 如果 currentNote 为 null，尝试创建一个新笔记
    if (quill.value) {
      const content = quill.value.root.innerHTML
      const textContent = quill.value.getText().trim()
      const firstLine = textContent.split('\n')[0] || ''
      const title = firstLine.substring(0, 50) || t('untitled')
      
      const newNote = await noteStore.createNote({
        title,
        content,
        isPinned: false,
        category: '',
        tags: [],
        isEncrypted: false
      })
      
      if (newNote) {
        currentNote.value = newNote
        lastSaved.value = new Date()
      }
    }
    return
  }
  
  saving.value = true
  const content = quill.value.root.innerHTML
  const textContent = quill.value.getText().trim()
  const firstLine = textContent.split('\n')[0] || ''
  const title = firstLine.substring(0, 50) || t('untitled')
  
  try {
    const noteId = currentNote.value._id
    console.log('Saving note with id:', noteId)
    
    if (!noteId) {
      console.error('Note ID is undefined')
      // 尝试重新创建笔记
      const newNote = await noteStore.createNote({
        title,
        content,
        isPinned: false,
        category: '',
        tags: [],
        isEncrypted: false
      })
      
      if (newNote) {
        currentNote.value = newNote
        lastSaved.value = new Date()
        console.log('Note created successfully')
      }
      return
    }
    
    const result = await noteStore.updateNote(noteId, {
      title,
      content
    })
    
    if (result) {
      lastSaved.value = new Date()
      console.log('Note saved successfully')
    } else {
      console.log('Note save failed: result is null')
    }
  } catch (error) {
    console.error('Save note error:', error)
  } finally {
    saving.value = false
  }
}

const deleteCurrentNote = async () => {
  if (!currentNote.value) return
  
  if (confirm(t('confirmDelete'))) {
    await noteStore.deleteNote(currentNote.value._id)
    currentNote.value = null
    if (quill.value) {
      quill.value.root.innerHTML = ''
    }
    lastSaved.value = null
  }
}

// Auto-save functionality
const startAutoSave = () => {
  if (autoSaveTimer) {
    clearInterval(autoSaveTimer)
  }
  autoSaveTimer = setInterval(() => {
    if (currentNote.value && quill.value) {
      const content = quill.value.root.innerHTML
      if (content !== currentNote.value.content) {
        saveNote()
      }
    }
  }, 30000) // Auto-save every 30 seconds
}

onMounted(() => {
  // Check if user is logged in
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  
  // Initialize notes for current user
  noteStore.fetchNotes()
  
  // Initialize Quill editor
  if (editor.value) {
    quill.value = new Quill(editor.value, {
      theme: 'snow',
      placeholder: t('emptyState'),
      modules: {
        toolbar: [
          [{ 'header': [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'indent': '-1'}, { 'indent': '+1' }],
          [{ 'color': [] }, { 'background': [] }],
          ['link', 'image'],
          ['clean']
        ]
      }
    })
    
    // Listen for content changes
    quill.value.on('text-change', () => {
      // Could add debounced auto-save here
    })
  }
  
  startAutoSave()
})

onUnmounted(() => {
  if (autoSaveTimer) {
    clearInterval(autoSaveTimer)
  }
})

// Watch for note store changes
watch(() => noteStore.notes, (newNotes) => {
  if (newNotes.length > 0 && !currentNote.value) {
    selectNote(newNotes[0] as Note)
  }
}, { immediate: true })
</script>

<style scoped>
/* Custom styles for Quill editor */
:deep(.ql-container) {
  font-size: 16px;
  min-height: 400px;
  border: none;
}

:deep(.ql-toolbar) {
  border: none;
  border-bottom: 1px solid #e5e7eb;
  padding: 8px 0;
}

:deep(.ql-editor) {
  padding: 0;
}

:deep(.ql-editor h1) {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

:deep(.ql-editor h2) {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

:deep(.ql-editor h3) {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

:deep(.ql-editor p) {
  margin-bottom: 0.75rem;
  line-height: 1.6;
}
</style>
