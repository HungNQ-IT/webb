import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { apiRequest } from '../utils/api/client'

const AuthContext = createContext(null)
const STORAGE_KEY = 'gia_su_auth_token'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem(STORAGE_KEY)
    if (!storedToken) {
      setLoading(false)
      return
    }
    setToken(storedToken)
    apiRequest('/auth/me', { token: storedToken })
      .then((data) => {
        setUser(data.user)
      })
      .catch(() => {
        localStorage.removeItem(STORAGE_KEY)
        setToken(null)
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleAuthSuccess = (data) => {
    setUser(data.user)
    setToken(data.token)
    localStorage.setItem(STORAGE_KEY, data.token)
  }

  const login = async (email, password) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: { email, password }
    })
    handleAuthSuccess(data)
    return data.user
  }

  const register = async (payload) => {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: payload
    })
    handleAuthSuccess(data)
    return data.user
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
    setToken(null)
  }

  const value = useMemo(() => ({
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: Boolean(user && token)
  }), [user, token, loading])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

