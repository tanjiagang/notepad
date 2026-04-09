import { defineStore } from 'pinia'
import { getNotes, createNote, updateNote, deleteNote, type Note } from '../api/note'

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
        const notes = await getNotes()
        this.notes = notes
      } catch (error) {
        this.error = '获取笔记失败'
        console.error('Error fetching notes:', error)
        this.notes = []
      } finally {
        this.loading = false
      }
    },
    
    async fetchNote(_id: string) {
      this.loading = true
      this.error = null
      try {
        const note = await getNotes().then(notes => notes.find(n => n._id === _id))
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
    
    async createNote(note: Omit<Note, '_id' | 'createdAt' | 'updatedAt' | 'user_id' | 'filePath'>) {
      this.loading = true
      this.error = null
      try {
        const newNote = await createNote({
          title: note.title,
          content: note.content,
          isPinned: note.isPinned,
          category: note.category,
          tags: note.tags,
          isEncrypted: note.isEncrypted
        })
        
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
    
    async updateNote(_id: string, updates: Partial<Note>) {
      this.loading = true
      this.error = null
      try {
        const updatedNote = await updateNote(_id, updates)
        
        const index = this.notes.findIndex(note => note._id === _id)
        if (index !== -1) {
          this.notes[index] = updatedNote
          if (this.currentNote && this.currentNote._id === _id) {
            this.currentNote = updatedNote
          }
        }
        
        return updatedNote
      } catch (error) {
        this.error = '更新笔记失败'
        console.error('Error updating note:', error)
        return null
      } finally {
        this.loading = false
      }
    },
    
    async deleteNote(_id: string) {
      this.loading = true
      this.error = null
      try {
        await deleteNote(_id)
        
        const index = this.notes.findIndex(note => note._id === _id)
        if (index !== -1) {
          this.notes.splice(index, 1)
          if (this.currentNote && this.currentNote._id === _id) {
            this.currentNote = null
          }
        }
        
        return true
      } catch (error) {
        this.error = '删除笔记失败'
        console.error('Error deleting note:', error)
        return false
      } finally {
        this.loading = false
      }
    },
    
    // Clear notes when user logs out
    clearNotes() {
      this.notes = []
      this.currentNote = null
    }
  }
})
