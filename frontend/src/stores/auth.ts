import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login, register } from '../api/user'

interface User {
  id: string
  username: string
  email?: string
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<User | null>((() => {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  })())

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  const setAuth = (newToken: string, newUser: User) => {
    token.value = newToken
    user.value = newUser
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(newUser))
  }

  const clearAuth = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const loginUser = async (username: string, password: string) => {
    const result = await login({ username, password })
    setAuth(result.token, result.user)
    return result
  }

  const registerUser = async (username: string, password: string, email?: string) => {
    const result = await register({ username, password, email })
    setAuth(result.token, result.user)
    return result
  }

  const logout = () => {
    clearAuth()
  }

  return {
    token,
    user,
    isAuthenticated,
    loginUser,
    registerUser,
    logout,
  }
})
