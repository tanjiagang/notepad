import axios from 'axios'

const api = axios.create({
  baseURL: 'http://39.104.28.195/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 只有在已经登录的情况下才重定向到登录页面
    // 登录请求的 401 错误应该让调用者处理，以便显示错误信息
    if (error.response?.status === 401 && error.config?.url !== '/users/login') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
