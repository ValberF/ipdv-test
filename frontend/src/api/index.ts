import axios, { AxiosError } from 'axios'
import type { AxiosRequestConfig } from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3030',
})

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: any) => void
  config: AxiosRequestConfig
}> = []

let authStore: any = null

export function setAuthStore(store: any) {
  authStore = store
}

function processQueue(error: any, token: string | null = null) {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      if (token && prom.config.headers) {
        prom.config.headers['Authorization'] = `Bearer ${token}`
      }
      prom.resolve(api(prom.config))
    }
  })
  failedQueue = []
}

function getTokenFromStorage() {
  return localStorage.getItem('token')
}

function getRefreshTokenFromStorage() {
  return localStorage.getItem('refreshToken')
}

async function refreshTokenDirectly(refreshToken: string): Promise<{ accessToken: string; refreshToken?: string } | null> {
  try {
    const response = await fetch('http://localhost:3030/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken })
    })

    if (!response.ok) {
      throw new Error('Erro ao renovar token')
    }

    return await response.json()
  } catch (error) {
    return null
  }
}

function logoutDirect() {
  localStorage.removeItem('token')
  localStorage.removeItem('refreshToken')
  window.location.href = '/login'
}

api.interceptors.request.use(
  async (config) => {
    const token = getTokenFromStorage()

    if (token) {
      config.headers = config.headers || {}
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
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = getRefreshTokenFromStorage()

      if (!refreshToken) {
        logoutDirect()
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const tokenData = await refreshTokenDirectly(refreshToken)

        if (tokenData && tokenData.accessToken) {

          localStorage.setItem('token', tokenData.accessToken)
          if (tokenData.refreshToken) {
            localStorage.setItem('refreshToken', tokenData.refreshToken)
          }

          if (authStore) {
            authStore.setToken(tokenData.accessToken)
            if (tokenData.refreshToken) {
              authStore.setRefreshToken(tokenData.refreshToken)
            }
          }

          processQueue(null, tokenData.accessToken)

          originalRequest.headers = originalRequest.headers || {}
          originalRequest.headers['Authorization'] = `Bearer ${tokenData.accessToken}`
          return api(originalRequest)
        } else {
          throw new Error('Falha ao renovar token')
        }
      } catch (refreshError) {
        processQueue(refreshError, null)

        if (authStore) {
          await authStore.logout()
        } else {
          logoutDirect()
        }

        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api