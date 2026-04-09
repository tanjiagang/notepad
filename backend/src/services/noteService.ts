import { Note, INote } from '../models/Note'
import { fileService } from './fileService'

class NoteService {
  // Create a new note
  async createNote(userId: string, data: {
    title?: string
    content?: string
    isPinned?: boolean
    category?: string
    tags?: string[]
    isEncrypted?: boolean
  }): Promise<INote> {
    try {
      // Create note document
      const note = new Note({
        title: data.title || 'Untitled',
        content: data.content || '',
        userId,
        filePath: '', // Will be set after file creation
        isPinned: data.isPinned || false,
        category: data.category || '',
        tags: data.tags || [],
        isEncrypted: data.isEncrypted || false
      })

      // Save note to database first to get noteId
      await note.save()

      // Save content to file
      const filePath = await fileService.saveNoteContent(userId, note._id.toString(), data.content || '')

      // Update note with file path
      note.filePath = filePath
      await note.save()

      return note
    } catch (error) {
      console.error('Error creating note:', error)
      throw new Error('Failed to create note')
    }
  }

  // Get all notes for user
  async getNotes(userId: string): Promise<INote[]> {
    try {
      return await Note.find({ userId }).sort({ isPinned: -1, updatedAt: -1 }).exec()
    } catch (error) {
      console.error('Error getting notes:', error)
      throw new Error('Failed to get notes')
    }
  }

  // Get note by id
  async getNoteById(userId: string, noteId: string): Promise<INote> {
    try {
      const note = await Note.findOne({ _id: noteId, userId }).exec()
      if (!note) {
        throw new Error('Note not found')
      }

      // Read content from file
      const content = await fileService.readNoteContent(userId, noteId)
      note.content = content

      return note
    } catch (error) {
      console.error('Error getting note:', error)
      throw new Error('Failed to get note')
    }
  }

  // Update note
  async updateNote(userId: string, noteId: string, data: {
    title?: string
    content?: string
    isPinned?: boolean
    category?: string
    tags?: string[]
    isEncrypted?: boolean
  }): Promise<INote> {
    try {
      const note = await Note.findOne({ _id: noteId, userId }).exec()
      if (!note) {
        throw new Error('Note not found')
      }

      // Update note fields
      if (data.title !== undefined) note.title = data.title
      if (data.isPinned !== undefined) note.isPinned = data.isPinned
      if (data.category !== undefined) note.category = data.category
      if (data.tags !== undefined) note.tags = data.tags
      if (data.isEncrypted !== undefined) note.isEncrypted = data.isEncrypted

      // Update content in file if provided
      if (data.content !== undefined) {
        await fileService.updateNoteContent(userId, noteId, data.content)
        note.content = data.content
      }

      // Save changes
      await note.save()

      return note
    } catch (error) {
      console.error('Error updating note:', error)
      throw new Error('Failed to update note')
    }
  }

  // Delete note
  async deleteNote(userId: string, noteId: string): Promise<boolean> {
    try {
      const note = await Note.findOne({ _id: noteId, userId }).exec()
      if (!note) {
        throw new Error('Note not found')
      }

      // Delete note file
      await fileService.deleteNoteFile(userId, noteId)

      // Delete note from database
      await Note.deleteOne({ _id: noteId, userId }).exec()

      return true
    } catch (error) {
      console.error('Error deleting note:', error)
      throw new Error('Failed to delete note')
    }
  }

  // Update note content
  async updateNoteContent(userId: string, noteId: string, content: string): Promise<INote> {
    try {
      const note = await Note.findOne({ _id: noteId, userId }).exec()
      if (!note) {
        throw new Error('Note not found')
      }

      // Update content in file
      await fileService.updateNoteContent(userId, noteId, content)

      // Update note content and timestamp
      note.content = content
      note.updatedAt = new Date()
      await note.save()

      return note
    } catch (error) {
      console.error('Error updating note content:', error)
      throw new Error('Failed to update note content')
    }
  }
}

export const noteService = new NoteService()
