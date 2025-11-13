import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './components/Home'
import SubjectList from './components/SubjectList'
import GradeList from './components/GradeList'
import QuizList from './components/QuizList'
import Quiz from './components/Quiz'
import Result from './components/Result'
import Login from './components/Login'
import Register from './components/Register'
import AdminDashboard from './components/AdminDashboard'
import RequireAuth from './components/RequireAuth'
import Layout from './components/Layout'
import { AuthProvider } from './context/AuthContext'

function App() {
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load questions from JSON file
    const baseUrl = import.meta.env.BASE_URL || '/'
    fetch(`${baseUrl}questions.json`)
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
          // Debug: log số lượng bài tập theo môn
          const subjectsCount = {}
          data.forEach(q => {
            subjectsCount[q.subject] = (subjectsCount[q.subject] || 0) + 1
          })
          console.log('Loaded quizzes by subject:', subjectsCount)
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

  return (
    <BrowserRouter basename={basename}>
      <AuthProvider>
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
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

