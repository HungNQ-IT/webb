import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../utils/supabase'

const AuthContext = createContext(null)

// Hàm chuyển đổi Supabase user thành format app cần
function mapSupabaseUser(supabaseUser) {
  if (!supabaseUser) return null
  
  const metadata = supabaseUser.user_metadata || {}
  const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || '').split(',').map(s => s.trim()).filter(Boolean)
  
  return {
    id: supabaseUser.id,
    email: supabaseUser.email,
    name: metadata.name || null,
    grade: metadata.grade || null,
    role: adminEmails.includes(supabaseUser.email?.toLowerCase()) ? 'admin' : (metadata.role || 'student'),
    createdAt: supabaseUser.created_at
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Kiểm tra session hiện tại
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(mapSupabaseUser(session.user))
        setSession(session)
      }
      setLoading(false)
    })

    // Lắng nghe thay đổi auth state
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(mapSupabaseUser(session.user))
        setSession(session)
      } else {
        setUser(null)
        setSession(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase(),
      password,
    })

    if (error) {
      throw new Error(error.message || 'Đăng nhập thất bại')
    }

    if (data.user && data.session) {
      const mappedUser = mapSupabaseUser(data.user)
      setUser(mappedUser)
      setSession(data.session)
      return mappedUser
    }

    throw new Error('Đăng nhập thất bại')
  }

  const register = async (payload) => {
    const { email, password, name, grade } = payload
    
    // Đăng ký user với Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.toLowerCase(),
      password,
      options: {
        data: {
          name: name || null,
          grade: grade || null,
          role: 'student'
        }
      }
    })

    if (authError) {
      throw new Error(authError.message || 'Đăng ký thất bại')
    }

    if (authData.user) {
      // Nếu có session (email confirmation tắt), tự động đăng nhập
      if (authData.session) {
        const mappedUser = mapSupabaseUser(authData.user)
        setUser(mappedUser)
        setSession(authData.session)
        return mappedUser
      } else {
        // Nếu không có session (cần xác nhận email), chỉ thông báo
        throw new Error('Vui lòng kiểm tra email để xác nhận tài khoản trước khi đăng nhập')
      }
    }

    throw new Error('Đăng ký thất bại')
  }

  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Logout error:', error)
    }
    setUser(null)
    setSession(null)
  }

  const value = useMemo(() => ({
    user,
    token: session?.access_token || null, // Supabase access token để tương thích với code hiện tại
    loading,
    login,
    register,
    logout,
    isAuthenticated: Boolean(user && session)
  }), [user, session, loading])

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

