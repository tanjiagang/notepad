import api from './index'

export interface Note {
  _id: string
  title: string
  content: string
  userId?: string
  filePath?: string
  isPinned: boolean
  category: string
  tags: string[]
  isEncrypted: boolean
  createdAt: string | Date
  updatedAt: string | Date
}

// Get all notes
export const getNotes = async (): Promise<Note[]> => {
  const response = await api.get('/notes')
  return response.data
}

// Get note by id
export const getNote = async (id: string): Promise<Note> => {
  const response = await api.get(`/notes/${id}`)
  return response.data
}

// Create note
export const createNote = async (note: {
  title?: string
  content?: string
  isPinned?: boolean
  category?: string
  tags?: string[]
  isEncrypted?: boolean
}): Promise<Note> => {
  const response = await api.post('/notes', note)
  return response.data
}

// Update note
export const updateNote = async (id: string, note: {
  title?: string
  content?: string
  isPinned?: boolean
  category?: string
  tags?: string[]
  isEncrypted?: boolean
}): Promise<Note> => {
  const response = await api.put(`/notes/${id}`, note)
  return response.data
}

// Delete note
export const deleteNote = async (id: string): Promise<{ message: string }> => {
  const response = await api.delete(`/notes/${id}`)
  return response.data
}

// Update note content
export const updateNoteContent = async (id: string, content: string): Promise<Note> => {
  const response = await api.patch(`/notes/${id}/content`, { content })
  return response.data
}
