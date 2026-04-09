import mongoose, { Schema, Document } from 'mongoose'

export interface INote extends Document {
  title: string
  content: string
  userId: string
  filePath: string
  isPinned: boolean
  category: string
  tags: string[]
  isEncrypted: boolean
  createdAt: Date
  updatedAt: Date
}

const NoteSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    default: 'Untitled'
  },
  content: {
    type: String,
    default: ''
  },
  userId: {
    type: String,
    required: true,
    index: true
  },
  filePath: {
    type: String,
    required: false
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    default: ''
  },
  tags: {
    type: [String],
    default: []
  },
  isEncrypted: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

// Update updatedAt on save
NoteSchema.pre<INote>('save', function (next) {
  this.updatedAt = new Date()
  next()
})

export const Note = mongoose.model<INote>('Note', NoteSchema)
