import { useState, useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './components/Home'
import RequireAuth from './components/RequireAuth'
import Layout from './components/Layout'
import Loading from './components/Loading'
import { AuthProvider } from './context/AuthContext'

// Lazy load các components để tải nhanh hơn
const SubjectList = lazy(() => import('./components/SubjectList'))
const GradeList = lazy(() => import('./components/GradeList'))
const CategoryList = lazy(() => import('./components/CategoryList'))
const QuizList = lazy(() => import('./components/QuizList'))
const Quiz = lazy(() => import('./components/Quiz'))
const IELTSQuiz = lazy(() => import('./components/IELTSQuiz'))
const IELTSResult = lazy(() => import('./components/IELTSResult'))
const Result = lazy(() => import('./components/Result'))
const Login = lazy(() => import('./components/Login'))
const Register = lazy(() => import('./components/Register'))
const AdminDashboard = lazy(() => import('./components/AdminDashboard'))
const Profile = lazy(() => import('./components/Profile'))

function App() {
  const [quizzes, setQuizzes] = useState([])
  const [ieltsTests, setIeltsTests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const baseUrl = import.meta.env.BASE_URL || '/'
    const cacheTime = 5 * 60 * 1000 // 5 phút
    
    // Load questions.json
    const loadQuizzes = () => {
      const cacheKey = 'quizzes_cache'
      const cached = localStorage.getItem(cacheKey)
      
      if (cached) {
        try {
          const { data, timestamp } = JSON.parse(cached)
          if (Date.now() - timestamp < cacheTime) {
            setQuizzes(data)
            return Promise.resolve()
          }
        } catch (e) {
          // Cache lỗi, tiếp tục fetch
        }
      }
      
      return fetch(`${baseUrl}questions.json`, { cache: 'default' })
        .then(res => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
          return res.json()
        })
        .then(data => {
          if (Array.isArray(data)) {
            setQuizzes(data)
            localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }))
          } else {
            console.error('Invalid data format:', data)
            setQuizzes([])
          }
        })
        .catch(err => {
          console.error('Error loading questions:', err)
          setQuizzes([])
        })
    }
    
    // Load ielts.json
    const loadIELTS = () => {
      const cacheKey = 'ielts_cache'
      const cached = localStorage.getItem(cacheKey)
      
      if (cached) {
        try {
          const { data, timestamp } = JSON.parse(cached)
          if (Date.now() - timestamp < cacheTime) {
            setIeltsTests(data)
            return Promise.resolve()
          }
        } catch (e) {
          // Cache lỗi, tiếp tục fetch
        }
      }
      
      return fetch(`${baseUrl}ielts.json`, { cache: 'default' })
        .then(res => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
          return res.json()
        })
        .then(data => {
          if (Array.isArray(data)) {
            setIeltsTests(data)
            localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }))
          } else {
            console.error('Invalid IELTS data format:', data)
            setIeltsTests([])
          }
        })
        .catch(err => {
          console.error('Error loading IELTS tests:', err)
          setIeltsTests([])
        })
    }
    
    // Load cả 2 file
    Promise.all([loadQuizzes(), loadIELTS()])
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <Loading message="Đang tải dữ liệu..." />
  }

  // Get base path from Vite config (for GitHub Pages)
  const basePath = import.meta.env.BASE_URL || '/'
  const basename = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath || '/'

  return (
    <BrowserRouter basename={basename}>
      <AuthProvider>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="/subjects" element={<SubjectList quizzes={quizzes} />} />
              <Route path="/subject/:subject/grades" element={<GradeList />} />
              <Route path="/subject/:subject/grade/:grade" element={<QuizList quizzes={quizzes} ieltsTests={ieltsTests} />} />
              <Route path="/subject/:subject/category/:category" element={<QuizList quizzes={quizzes} ieltsTests={ieltsTests} />} />
              <Route path="/subject/:subject" element={<CategoryList quizzes={quizzes} ieltsTests={ieltsTests} />} />
              <Route path="/quiz/:id" element={<Quiz quizzes={quizzes} />} />
              <Route path="/ielts/:id" element={<IELTSQuiz ieltsTests={ieltsTests} />} />
              <Route path="/ielts-result/:id" element={<IELTSResult />} />
              <Route path="/result/:id" element={<Result quizzes={quizzes} />} />
              <Route
                path="/profile"
                element={
                  <RequireAuth>
                    <Profile />
                  </RequireAuth>
                }
              />
              <Route
                path="/admin"
                element={
                  <RequireAuth roles={['admin']}>
                    <AdminDashboard quizzes={quizzes} />
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

