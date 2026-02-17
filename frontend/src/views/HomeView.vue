<template>
  <div class="home-container">
    <!-- 侧边栏：笔记列表 -->
    <div class="sidebar">
      <div class="sidebar-header">
        <h1>记事本</h1>
        <el-button type="primary" @click="handleCreateNote">新建笔记</el-button>
      </div>
      
      <div class="search-box">
        <el-input
          v-model="searchQuery"
          placeholder="搜索笔记"
          prefix-icon="el-icon-search"
        />
      </div>
      
      <div class="notes-list">
        <h2>置顶笔记</h2>
        <div class="note-item" v-for="note in filteredPinnedNotes" :key="note.id" @click="handleOpenNote(note.id)">
          <h3>{{ note.title }}</h3>
          <p class="note-preview">{{ note.content.substring(0, 50) }}...</p>
          <p class="note-meta">{{ formatDate(note.updatedAt) }}</p>
        </div>
        
        <h2>所有笔记</h2>
        <div class="note-item" v-for="note in filteredUnpinnedNotes" :key="note.id" @click="handleOpenNote(note.id)">
          <h3>{{ note.title }}</h3>
          <p class="note-preview">{{ note.content.substring(0, 50) }}...</p>
          <p class="note-meta">{{ formatDate(note.updatedAt) }}</p>
        </div>
      </div>
    </div>
    
    <!-- 主内容区：笔记编辑 -->
    <div class="main-content">
      <div v-if="!currentNote" class="empty-state">
        <el-empty description="选择一个笔记或创建新笔记" />
      </div>
      <div v-else class="note-editor">
        <el-input
          v-model="currentNote.title"
          class="note-title"
          placeholder="笔记标题"
          @blur="handleUpdateNote"
        />
        <el-input
          v-model="currentNote.content"
          type="textarea"
          class="note-content"
          placeholder="笔记内容"
          @blur="handleUpdateNote"
        />
        <div class="note-actions">
          <el-button @click="handlePinNote">
            {{ currentNote.isPinned ? '取消置顶' : '置顶' }}
          </el-button>
          <el-button type="danger" @click="handleDeleteNote">删除笔记</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useNoteStore } from '../stores/note'
import type { Note } from '../stores/note'
const noteStore = useNoteStore()

const searchQuery = ref('')
const currentNote = ref<Note | null>(null)

// 计算属性：过滤后的置顶笔记
const filteredPinnedNotes = computed(() => {
  if (!searchQuery.value) {
    return noteStore.pinnedNotes
  }
  return noteStore.pinnedNotes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// 计算属性：过滤后的非置顶笔记
const filteredUnpinnedNotes = computed(() => {
  if (!searchQuery.value) {
    return noteStore.unpinnedNotes
  }
  return noteStore.unpinnedNotes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// 格式化日期
const formatDate = (date: Date) => {
  return new Date(date).toLocaleString()
}

// 处理创建新笔记
const handleCreateNote = async () => {
  const newNote = await noteStore.createNote({
    title: '新笔记',
    content: '',
    isPinned: false,
    category: '默认',
    tags: [],
    isEncrypted: false
  })
  if (newNote) {
    currentNote.value = newNote
  }
}

// 处理打开笔记
const handleOpenNote = async (id: string) => {
  await noteStore.fetchNote(id)
  currentNote.value = noteStore.currentNote
}

// 处理更新笔记
const handleUpdateNote = async () => {
  if (currentNote.value) {
    await noteStore.updateNote(currentNote.value.id, {
      title: currentNote.value.title,
      content: currentNote.value.content
    })
  }
}

// 处理置顶/取消置顶笔记
const handlePinNote = async () => {
  if (currentNote.value) {
    await noteStore.updateNote(currentNote.value.id, {
      isPinned: !currentNote.value.isPinned
    })
  }
}

// 处理删除笔记
const handleDeleteNote = async () => {
  if (currentNote.value) {
    const success = await noteStore.deleteNote(currentNote.value.id)
    if (success) {
      currentNote.value = null
    }
  }
}

// 组件挂载时获取笔记列表
onMounted(async () => {
  await noteStore.fetchNotes()
})
</script>

<style scoped>
.home-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.sidebar {
  width: 300px;
  background-color: #f5f5f5;
  border-right: 1px solid #e0e0e0;
  padding: 20px;
  overflow-y: auto;
}

.sidebar-header {
  margin-bottom: 20px;
}

.sidebar-header h1 {
  font-size: 24px;
  margin-bottom: 10px;
}

.search-box {
  margin-bottom: 20px;
}

.notes-list {
  margin-top: 20px;
}

.notes-list h2 {
  font-size: 16px;
  margin-bottom: 10px;
  color: #666;
}

.note-item {
  padding: 15px;
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.note-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.note-item h3 {
  font-size: 16px;
  margin-bottom: 5px;
  color: #333;
}

.note-preview {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.note-meta {
  font-size: 12px;
  color: #999;
}

.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.note-editor {
  max-width: 800px;
  margin: 0 auto;
}

.note-title {
  font-size: 24px;
  margin-bottom: 20px;
}

.note-content {
  min-height: 400px;
  font-size: 16px;
  line-height: 1.6;
}

.note-actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}
</style>
