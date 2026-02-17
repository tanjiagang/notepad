import app from './app'

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`)
  console.log(`健康检查: http://localhost:${PORT}/health`)
})
