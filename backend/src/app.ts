import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'

// 路由导入（将来会添加）
// import notesRouter from './routes/notes'
// import usersRouter from './routes/users'

const app = express()

// 中间件配置
app.use(cors())
app.use(helmet())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 路由配置（将来会添加）
// app.use('/api/notes', notesRouter)
// app.use('/api/users', usersRouter)

// 健康检查路由
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: '服务运行正常' })
})

// 404 处理
app.use((req, res) => {
  res.status(404).json({ status: 'error', message: '接口不存在' })
})

// 错误处理中间件
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || '服务器内部错误'
  })
})

export default app
