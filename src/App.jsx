import { useState, useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import Home from './components/Home'
import RequireAuth from './components/RequireAuth'
import Layout from './components/Layout'
import Loading from './components/Loading'
import { AuthProvider } from './context/AuthContext'

// Component để xử lý redirect từ 404.html
function RedirectHandler() {
  const navigate = useNavigate()
  const location = useLocation()
  
  useEffect(() => {
    const redirectPath = sessionStorage.getItem('redirectPath')
    if (redirectPath) {
      sessionStorage.removeItem('redirectPath')
      // Chỉ navigate nếu không phải đang ở path đó rồi
      const cleanPath = redirectPath.replace(import.meta.env.BASE_URL || '/', '/')
      if (cleanPath !== location.pathname) {
        navigate(cleanPath, { replace: true })
      }
    }
  }, [navigate, location])
  
  return null
}

// Lazy load các components để tải nhanh hơn
const SubjectList = lazy(() => import('./components/SubjectList'))
const GradeList = lazy(() => import('./components/GradeList'))
const CategoryList = lazy(() => import('./components/CategoryList'))
const QuizList = lazy(() => import('./components/QuizList'))
const Quiz = lazy(() => import('./components/Quiz'))
const IELTSQuiz = lazy(() => import('./components/IELTSQuiz'))
const IELTSListening = lazy(() => import('./components/IELTSListening'))
const IELTSResult = lazy(() => import('./components/IELTSResult'))
const Result = lazy(() => import('./components/Result'))
const Login = lazy(() => import('./components/Login'))
const Register = lazy(() => import('./components/Register'))
const AdminDashboard = lazy(() => import('./components/AdminDashboard'))
const AdminAudioManager = lazy(() => import('./components/AdminAudioManager'))
const AdminQuizManager = lazy(() => import('./components/AdminQuizManager'))
const Profile = lazy(() => import('./components/Profile'))

function App() {
  const [quizzes, setQuizzes] = useState([])
  const [ieltsTests, setIeltsTests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const baseUrl = import.meta.env.BASE_URL || '/'
    const cacheTime = 5 * 60 * 1000 // 5 phút
    
    // Load questions.json + Supabase quizzes
    const loadQuizzes = async () => {
      const cacheKey = 'quizzes_cache'
      const cached = localStorage.getItem(cacheKey)
      
      if (cached) {
        try {
          const { data, timestamp } = JSON.parse(cached)
          if (Date.now() - timestamp < cacheTime) {
            console.log('App - Loaded quizzes from cache:', data.length)
            setQuizzes(data)
            return
          }
        } catch (e) {
          console.error('Cache error for quizzes:', e)
        }
      }
      
      try {
        // Load from JSON file
        console.log('App - Fetching questions.json from:', `${baseUrl}questions.json`)
        const res = await fetch(`${baseUrl}questions.json`, { cache: 'default' })
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
        const jsonQuizzes = await res.json()
        
        // Load from Supabase (optional - won't fail if table doesn't exist)
        let supabaseQuizzes = []
        try {
          const { supabase } = await import('./utils/supabase')
          const { data: dbQuizzes } = await supabase
            .from('quizzes')
            .select('*')
            .order('created_at', { ascending: false })
          
          if (dbQuizzes && dbQuizzes.length > 0) {
            // Convert Supabase format to app format
            supabaseQuizzes = dbQuizzes.map(q => ({
              id: `db_${q.id}`,
              subject: q.subject,
              grade: q.grade,
              title: q.title,
              description: q.description,
              type: q.type,
              timeLimit: q.time_limit,
              difficulty: q.difficulty,
              questions: q.questions || []
            }))
            console.log('App - Loaded quizzes from Supabase:', supabaseQuizzes.length)
          }
        } catch (dbErr) {
          console.log('Supabase quizzes not available:', dbErr.message)
        }
        
        // Merge: JSON quizzes + Supabase quizzes
        const allQuizzes = [...(Array.isArray(jsonQuizzes) ? jsonQuizzes : []), ...supabaseQuizzes]
        console.log('App - Total quizzes:', allQuizzes.length)
        setQuizzes(allQuizzes)
        localStorage.setItem(cacheKey, JSON.stringify({ data: allQuizzes, timestamp: Date.now() }))
      } catch (err) {
        console.error('Error loading questions:', err)
        setQuizzes([])
      }
    }
    
    // Load ielts.json
    const loadIELTS = () => {
      const cacheKey = 'ielts_cache'
      const cached = localStorage.getItem(cacheKey)
      
      if (cached) {
        try {
          const { data, timestamp } = JSON.parse(cached)
          if (Date.now() - timestamp < cacheTime) {
            console.log('App - Loaded IELTS from cache:', data.length)
            setIeltsTests(data)
            return Promise.resolve()
          }
        } catch (e) {
          console.error('Cache error for IELTS:', e)
        }
      }
      
      console.log('App - Fetching ielts.json from:', `${baseUrl}ielts.json`)
      return fetch(`${baseUrl}ielts.json`, { cache: 'default' })
        .then(res => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
          return res.json()
        })
        .then(data => {
          if (Array.isArray(data)) {
            console.log('App - Loaded IELTS tests:', data.length, data)
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
      .finally(() => {
        console.log('App - Loading complete')
        setLoading(false)
      })
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
        <RedirectHandler />
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
              <Route path="/ielts-listening/:id" element={<IELTSListening ieltsTests={ieltsTests} />} />
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
              <Route
                path="/admin/audio"
                element={
                  <RequireAuth roles={['admin']}>
                    <AdminAudioManager ieltsTests={ieltsTests} />
                  </RequireAuth>
                }
              />
              <Route
                path="/admin/quizzes"
                element={
                  <RequireAuth roles={['admin']}>
                    <AdminQuizManager />
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

