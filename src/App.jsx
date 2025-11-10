import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './components/Home'
import SubjectList from './components/SubjectList'
import QuizList from './components/QuizList'
import Quiz from './components/Quiz'
import Result from './components/Result'

function App() {
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load questions from JSON file
    const baseUrl = import.meta.env.BASE_URL || '/'
    fetch(`${baseUrl}questions.json`)
      .then(res => res.json())
      .then(data => {
        setQuizzes(data)
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

  return (
    <BrowserRouter basename="/Gia-su-10-diem">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/subjects" element={<SubjectList quizzes={quizzes} />} />
        <Route path="/subject/:subject" element={<QuizList quizzes={quizzes} />} />
        <Route path="/quiz/:id" element={<Quiz quizzes={quizzes} />} />
        <Route path="/result/:id" element={<Result quizzes={quizzes} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

