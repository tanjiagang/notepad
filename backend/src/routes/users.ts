import express from 'express'
import authService from '../services/authService'

const router = express.Router()

router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body

    if (!username || !password) {
      return res.status(400).json({
        status: 'error',
        message: '用户名和密码不能为空',
      })
    }

    const result = await authService.register(username, password, email)

    res.status(201).json({
      status: 'success',
      message: '注册成功',
      data: result,
    })
  } catch (error: any) {
    res.status(400).json({
      status: 'error',
      message: error.message || '注册失败',
    })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({
        status: 'error',
        message: '用户名和密码不能为空',
      })
    }

    const result = await authService.login(username, password)

    res.json({
      status: 'success',
      message: '登录成功',
      data: result,
    })
  } catch (error: any) {
    res.status(401).json({
      status: 'error',
      message: error.message || '登录失败',
    })
  }
})

export default router
