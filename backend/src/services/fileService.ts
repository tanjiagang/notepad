import fs from 'fs'
import path from 'path'

class FileService {
  private notesDir: string

  constructor() {
    this.notesDir = path.join(process.cwd(), 'notes')
    // Create notes directory if it doesn't exist
    if (!fs.existsSync(this.notesDir)) {
      fs.mkdirSync(this.notesDir, { recursive: true })
    }
  }

  // Create user directory if it doesn't exist
  private ensureUserDir(userId: string): string {
    const userDir = path.join(this.notesDir, userId)
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true })
    }
    return userDir
  }

  // Generate file name for note
  private generateFileName(noteId: string): string {
    return `${noteId}.txt`
  }

  // Save note content to file
  async saveNoteContent(userId: string, noteId: string, content: string): Promise<string> {
    const userDir = this.ensureUserDir(userId)
    const fileName = this.generateFileName(noteId)
    const filePath = path.join(userDir, fileName)

    await fs.promises.writeFile(filePath, content, 'utf8')
    return filePath
  }

  // Read note content from file
  async readNoteContent(userId: string, noteId: string): Promise<string> {
    const userDir = this.ensureUserDir(userId)
    const fileName = this.generateFileName(noteId)
    const filePath = path.join(userDir, fileName)

    if (!fs.existsSync(filePath)) {
      return ''
    }

    return await fs.promises.readFile(filePath, 'utf8')
  }

  // Update note content in file
  async updateNoteContent(userId: string, noteId: string, content: string): Promise<void> {
    const userDir = this.ensureUserDir(userId)
    const fileName = this.generateFileName(noteId)
    const filePath = path.join(userDir, fileName)

    if (!fs.existsSync(filePath)) {
      throw new Error('Note file not found')
    }

    await fs.promises.writeFile(filePath, content, 'utf8')
  }

  // Delete note file
  async deleteNoteFile(userId: string, noteId: string): Promise<void> {
    const userDir = this.ensureUserDir(userId)
    const fileName = this.generateFileName(noteId)
    const filePath = path.join(userDir, fileName)

    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath)
    }
  }

  // Get file path for note
  getFilePath(userId: string, noteId: string): string {
    const userDir = this.ensureUserDir(userId)
    const fileName = this.generateFileName(noteId)
    return path.join(userDir, fileName)
  }
}

export const fileService = new FileService()
