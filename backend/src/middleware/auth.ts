import express from 'express'
import jwt from 'jsonwebtoken'

interface UserPayload {
  id: string
  username: string
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload
    }
  }
}

export const authMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  const token = authHeader.substring(7) // Remove 'Bearer ' prefix
  
  try {
    const secret = process.env.JWT_SECRET || 'your-secret-key'
    const payload = jwt.verify(token, secret) as UserPayload
    
    (req as any).user = payload
    next()
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' })
  }
}
