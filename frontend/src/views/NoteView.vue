<template>
  <div class="note-view">
    <el-button @click="handleBack">返回笔记列表</el-button>
    
    <div v-if="!note" class="loading-state">
      <el-loading v-loading="noteStore.loading" element-loading-text="加载中..." />
    </div>
    
    <div v-else class="note-details">
      <h1>{{ note.title }}</h1>
      <p class="note-meta">
        创建时间：{{ formatDate(note.createdAt) }} | 
        更新时间：{{ formatDate(note.updatedAt) }}
      </p>
      
      <div class="note-content">
        {{ note.content }}
      </div>
      
      <div class="note-actions">
        <el-button @click="handleEdit">编辑笔记</el-button>
        <el-button type="danger" @click="handleDelete">删除笔记</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useNoteStore } from '../stores/note'

const router = useRouter()
const route = useRoute()
const noteStore = useNoteStore()

const noteId = computed(() => route.params.id as string)
const note = computed(() => noteStore.currentNote)

// 格式化日期
const formatDate = (date: Date) => {
  return new Date(date).toLocaleString()
}

// 处理返回笔记列表
const handleBack = () => {
  router.push('/')
}

// 处理编辑笔记
const handleEdit = () => {
  // 这里将来会跳转到编辑页面
  // 暂时返回列表页面
  router.push('/')
}

// 处理删除笔记
const handleDelete = async () => {
  if (note.value) {
    const success = await noteStore.deleteNote(note.value.id)
    if (success) {
      router.push('/')
    }
  }
}

// 组件挂载时获取笔记详情
onMounted(async () => {
  await noteStore.fetchNote(noteId.value)
})
</script>

<style scoped>
.note-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
}

.note-details {
  margin-top: 20px;
}

.note-details h1 {
  font-size: 28px;
  margin-bottom: 10px;
}

.note-meta {
  font-size: 14px;
  color: #999;
  margin-bottom: 20px;
}

.note-content {
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.note-actions {
  display: flex;
  gap: 10px;
}
</style>
