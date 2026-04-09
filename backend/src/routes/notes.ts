import express from 'express'
import { noteService } from '../services/noteService'
import { authMiddleware } from '../middleware/auth'

const router = express.Router()

// Apply auth middleware to all routes
router.use(authMiddleware)

// Get all notes
router.get('/', async (req: express.Request, res: express.Response) => {
  try {
    const userId = (req as any).user.id
    const notes = await noteService.getNotes(userId)
    res.json(notes)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Get note by id
router.get('/:id', async (req: express.Request, res: express.Response) => {
  try {
    const userId = (req as any).user.id
    const noteId = req.params.id
    const note = await noteService.getNoteById(userId, noteId)
    res.json(note)
  } catch (error: any) {
    res.status(404).json({ error: error.message })
  }
})

// Create new note
router.post('/', async (req: express.Request, res: express.Response) => {
  try {
    const userId = (req as any).user.id
    const note = await noteService.createNote(userId, req.body)
    res.status(201).json(note)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Update note
router.put('/:id', async (req: express.Request, res: express.Response) => {
  try {
    const userId = (req as any).user.id
    const noteId = req.params.id
    const note = await noteService.updateNote(userId, noteId, req.body)
    res.json(note)
  } catch (error: any) {
    res.status(404).json({ error: error.message })
  }
})

// Delete note
router.delete('/:id', async (req: express.Request, res: express.Response) => {
  try {
    const userId = (req as any).user.id
    const noteId = req.params.id
    await noteService.deleteNote(userId, noteId)
    res.json({ message: 'Note deleted successfully' })
  } catch (error: any) {
    res.status(404).json({ error: error.message })
  }
})

// Update note content
router.patch('/:id/content', async (req: express.Request, res: express.Response) => {
  try {
    const userId = (req as any).user.id
    const noteId = req.params.id
    const { content } = req.body
    
    if (content === undefined) {
      res.status(400).json({ error: 'Content is required' })
      return
    }

    const note = await noteService.updateNoteContent(userId, noteId, content)
    res.json(note)
  } catch (error: any) {
    res.status(404).json({ error: error.message })
  }
})

export default router
