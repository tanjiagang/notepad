import api from './index'

interface LoginRequest {
  username: string
  password: string
}

interface RegisterRequest {
  username: string
  password: string
  email?: string
}

interface AuthResponse {
  token: string
  user: {
    id: string
    username: string
    email?: string
  }
}

interface ApiResponse<T> {
  status: string
  message: string
  data: T
}

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post<ApiResponse<AuthResponse>>('/users/login', data)
  return response.data.data
}

export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await api.post<ApiResponse<AuthResponse>>('/users/register', data)
  return response.data.data
}
