import { defineStore } from 'pinia'

export interface Note {
  id: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
  isPinned: boolean
  category: string
  tags: string[]
  isEncrypted: boolean
}

export const useNoteStore = defineStore('note', {
  state: () => ({
    notes: [] as Note[],
    currentNote: null as Note | null,
    loading: false,
    error: null as string | null
  }),
  getters: {
    pinnedNotes: (state) => state.notes.filter(note => note.isPinned),
    unpinnedNotes: (state) => state.notes.filter(note => !note.isPinned),
    sortedNotes: (state) => {
      return [...state.notes].sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1
        if (!a.isPinned && b.isPinned) return 1
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      })
    }
  },
  actions: {
    async fetchNotes() {
      this.loading = true
      this.error = null
      try {
        // 这里将来会替换为API调用
        // 暂时使用模拟数据
        const mockNotes: Note[] = [
          {
            id: '1',
            title: '测试笔记 1',
            content: '这是测试笔记 1 的内容',
            createdAt: new Date(),
            updatedAt: new Date(),
            isPinned: true,
            category: '工作',
            tags: ['测试', '工作'],
            isEncrypted: false
          },
          {
            id: '2',
            title: '测试笔记 2',
            content: '这是测试笔记 2 的内容',
            createdAt: new Date(),
            updatedAt: new Date(),
            isPinned: false,
            category: '生活',
            tags: ['测试', '生活'],
            isEncrypted: false
          }
        ]
        this.notes = mockNotes
      } catch (error) {
        this.error = '获取笔记失败'
        console.error('Error fetching notes:', error)
      } finally {
        this.loading = false
      }
    },
    async fetchNote(id: string) {
      this.loading = true
      this.error = null
      try {
        // 这里将来会替换为API调用
        // 暂时从本地状态中查找
        const note = this.notes.find(note => note.id === id)
        if (note) {
          this.currentNote = note
        } else {
          this.error = '笔记不存在'
        }
      } catch (error) {
        this.error = '获取笔记失败'
        console.error('Error fetching note:', error)
      } finally {
        this.loading = false
      }
    },
    async createNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) {
      this.loading = true
      this.error = null
      try {
        // 这里将来会替换为API调用
        // 暂时创建本地笔记
        const newNote: Note = {
          ...note,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
        this.notes.push(newNote)
        this.currentNote = newNote
        return newNote
      } catch (error) {
        this.error = '创建笔记失败'
        console.error('Error creating note:', error)
        return null
      } finally {
        this.loading = false
      }
    },
    async updateNote(id: string, updates: Partial<Note>) {
      this.loading = true
      this.error = null
      try {
        // 这里将来会替换为API调用
        // 暂时更新本地笔记
        const index = this.notes.findIndex(note => note.id === id)
        if (index !== -1) {
          const updatedNote = {
            ...this.notes[index],
            ...updates,
            updatedAt: new Date()
          } as Note
          this.notes[index] = updatedNote
          if (this.currentNote && this.currentNote.id === id) {
            this.currentNote = updatedNote
          }
          return updatedNote
        } else {
          this.error = '笔记不存在'
          return null
        }
      } catch (error) {
        this.error = '更新笔记失败'
        console.error('Error updating note:', error)
        return null
      } finally {
        this.loading = false
      }
    },
    async deleteNote(id: string) {
      this.loading = true
      this.error = null
      try {
        // 这里将来会替换为API调用
        // 暂时从本地状态中删除
        const index = this.notes.findIndex(note => note.id === id)
        if (index !== -1) {
          this.notes.splice(index, 1)
          if (this.currentNote && this.currentNote.id === id) {
            this.currentNote = null
          }
          return true
        } else {
          this.error = '笔记不存在'
          return false
        }
      } catch (error) {
        this.error = '删除笔记失败'
        console.error('Error deleting note:', error)
        return false
      } finally {
        this.loading = false
      }
    }
  }
})
