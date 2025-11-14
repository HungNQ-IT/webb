import { useState, useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './components/Home'
import RequireAuth from './components/RequireAuth'
import Layout from './components/Layout'
import { AuthProvider } from './context/AuthContext'

// Lazy load các components để tải nhanh hơn
const SubjectList = lazy(() => import('./components/SubjectList'))
const GradeList = lazy(() => import('./components/GradeList'))
const QuizList = lazy(() => import('./components/QuizList'))
const Quiz = lazy(() => import('./components/Quiz'))
const Result = lazy(() => import('./components/Result'))
const Login = lazy(() => import('./components/Login'))
const Register = lazy(() => import('./components/Register'))
const AdminDashboard = lazy(() => import('./components/AdminDashboard'))

function App() {
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load questions from JSON file với cache
    const baseUrl = import.meta.env.BASE_URL || '/'
    const cacheKey = 'quizzes_cache'
    const cacheTime = 5 * 60 * 1000 // 5 phút
    
    // Kiểm tra cache trước
    const cached = localStorage.getItem(cacheKey)
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached)
        if (Date.now() - timestamp < cacheTime) {
          setQuizzes(data)
          setLoading(false)
          return
        }
      } catch (e) {
        // Cache lỗi, tiếp tục fetch
      }
    }
    
    // Fetch mới
    fetch(`${baseUrl}questions.json`, {
      cache: 'default' // Cho phép browser cache
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then(data => {
        // Đảm bảo data là một mảng
        if (Array.isArray(data)) {
          setQuizzes(data)
          // Lưu vào cache
          localStorage.setItem(cacheKey, JSON.stringify({
            data,
            timestamp: Date.now()
          }))
        } else {
          console.error('Invalid data format:', data)
          setQuizzes([])
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading questions:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  // Get base path from Vite config (for GitHub Pages)
  const basePath = import.meta.env.BASE_URL || '/'
  const basename = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath || '/'

  // Loading component cho lazy routes
  const LoadingSpinner = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Đang tải...</p>
      </div>
    </div>
  )

  return (
    <BrowserRouter basename={basename}>
      <AuthProvider>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="/subjects" element={<SubjectList quizzes={quizzes} />} />
              <Route path="/subject/:subject/grades" element={<GradeList />} />
              <Route path="/subject/:subject/grade/:grade" element={<QuizList quizzes={quizzes} />} />
              <Route path="/subject/:subject" element={<QuizList quizzes={quizzes} />} />
              <Route path="/quiz/:id" element={<Quiz quizzes={quizzes} />} />
              <Route path="/result/:id" element={<Result quizzes={quizzes} />} />
              <Route
                path="/admin"
                element={
                  <RequireAuth roles={['admin']}>
                    <AdminDashboard />
                  </RequireAuth>
                }
              />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

