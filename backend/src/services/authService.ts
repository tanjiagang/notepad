import jwt from 'jsonwebtoken'
import User, { IUser } from '../models/User'
import dotenv from 'dotenv'

dotenv.config()

interface AuthResponse {
  token: string
  user: {
    id: string
    username: string
    email?: string
  }
}

class AuthService {
  async register(username: string, password: string, email?: string): Promise<AuthResponse> {
    const existingUser = await User.findOne({ username })
    if (existingUser) {
      throw new Error('用户名已存在')
    }

    const user = new User({ username, password, email })
    await user.save()

    const token = this.generateToken(user)
    return {
      token,
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
      },
    }
  }

  async login(username: string, password: string): Promise<AuthResponse> {
    const user = await User.findOne({ username })
    if (!user) {
      throw new Error('用户名或密码错误')
    }

    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      throw new Error('用户名或密码错误')
    }

    const token = this.generateToken(user)
    return {
      token,
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
      },
    }
  }

  private generateToken(user: IUser): string {
    const secret = process.env.JWT_SECRET || 'your-secret-key'
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d'

    return jwt.sign(
      {
        id: user._id.toString(),
        username: user.username,
      },
      secret as any,
      { expiresIn } as any
    )
  }
}

export default new AuthService()
