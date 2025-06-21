import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../api'
import type { IUser } from '../interfaces/IUser'
import type { ITokenPayload } from '../interfaces/ITokenPayload'

export const useAuth = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const refreshToken = ref<string | null>(localStorage.getItem('refreshToken'))
  const user = ref<IUser | null>(null)
  const isInitialized = ref(false)

  function decodeToken(token: string): ITokenPayload | null {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        window.atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
      return JSON.parse(jsonPayload)
    } catch (error) {
      return null
    }
  }

  function isTokenExpiringSoon(token: string): boolean {
    const decoded = decodeToken(token)
    if (!decoded) return true
    
    const now = Math.floor(Date.now() / 1000)
    const timeUntilExpiry = decoded.exp - now
    return timeUntilExpiry < 300 
  }

  function isTokenExpired(token: string): boolean {
    const decoded = decodeToken(token)
    if (!decoded) return true
    
    const now = Math.floor(Date.now() / 1000)
    return decoded.exp < now
  }

  function setToken(newToken: string | null) {
    token.value = newToken
    if (newToken) {
      localStorage.setItem('token', newToken)
      const decoded = decodeToken(newToken)
      if (decoded) {
        user.value = {
          id: decoded.id,
          name: decoded.name,
          email: decoded.email,
          role_id: decoded.role_id
        }
      }
    } else {
      localStorage.removeItem('token')
      user.value = null
    }
  }

  function setRefreshToken(newToken: string | null) {
    refreshToken.value = newToken
    if (newToken) {
      localStorage.setItem('refreshToken', newToken)
    } else {
      localStorage.removeItem('refreshToken')
    }
  }

  async function refreshAccessToken(): Promise<boolean> {
    if (!refreshToken.value) {
      return false
    }

    try {
      const response = await fetch('http://localhost:3030/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: refreshToken.value })
      })

      if (!response.ok) {
        throw new Error('Erro ao renovar token')
      }

      const data = await response.json()
      setToken(data.accessToken)
      
      if (data.refreshToken) {
        setRefreshToken(data.refreshToken)
      }
      
      return true
    } catch (error) {
      await logout()
      return false
    }
  }

  async function logout() {
    try {
      if (refreshToken.value) {
        await api.post('/auth/logout', { refreshToken: refreshToken.value })
      }
    } catch (e) {
    } finally {
      setToken(null)
      setRefreshToken(null)
      user.value = null
      isInitialized.value = false
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
    }
  }

  async function checkTokenAndRefresh(): Promise<boolean> {
    if (!token.value) {
      return false
    }

    if (isTokenExpired(token.value)) {
      return await refreshAccessToken()
    }

    if (isTokenExpiringSoon(token.value)) {
      return await refreshAccessToken()
    }

    return true
  }

  async function fetchUser() {
    if (!token.value) {
      user.value = null
      isInitialized.value = true
      return
    }

    const tokenValid = await checkTokenAndRefresh()
    if (!tokenValid) {
      isInitialized.value = true
      return
    }

    try {
      const { data } = await api.get('/user/me')
      user.value = data
    } catch (error) {
      user.value = null
      await logout()
    } finally {
      isInitialized.value = true
    }
  }

  async function initialize() {
    if (isInitialized.value) return
    
    if (token.value) {
      if (isTokenExpired(token.value)) {
        const renewed = await refreshAccessToken()
        if (!renewed) {
          isInitialized.value = true
          return
        }
      } else {
        const decoded = decodeToken(token.value)
        if (decoded) {
          user.value = {
            id: decoded.id,
            name: decoded.name,
            email: decoded.email,
            role_id: decoded.role_id
          }
        }
      }
      await fetchUser()
    } else {
      isInitialized.value = true
    }
  }

  function setupTokenRefreshInterval() {
    setInterval(async () => {
      if (token.value && user.value) {
        await checkTokenAndRefresh()
      }
    }, 5 * 60 * 1000)
  }

  return {
    token,
    refreshToken,
    user,
    isInitialized,
    setToken,
    setRefreshToken,
    logout,
    fetchUser,
    initialize,
    refreshAccessToken,
    checkTokenAndRefresh,
    setupTokenRefreshInterval,
    isTokenExpired,
    isTokenExpiringSoon
  }
})