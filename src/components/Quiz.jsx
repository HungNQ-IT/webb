import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { saveQuizResult } from '../utils/storage'
import RichContent from './RichContent'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../utils/supabase'
import EssayQuestion from './EssayQuestion'

// Hàm lưu submission vào Supabase
async function saveSubmissionToSupabase(quizId, score, total, answers, questionCount) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  // Lưu thông tin user vào details để admin có thể xem
  const { data, error } = await supabase
    .from('submissions')
    .insert({
      user_id: user.id,
      quiz_id: quizId,
      score: score,
      total: total,
      details: {
        questionCount: questionCount,
        answers: answers,
        userInfo: {
          email: user.email,
          name: user.user_metadata?.name || null,
          grade: user.user_metadata?.grade || null
        }
      }
    })
    .select()
    .single()

  if (error) throw error
  return data
}

function Quiz({ quizzes }) {
  const { id } = useParams()
  const navigate = useNavigate()
  // Support both numeric IDs and string IDs (from Supabase: db_xxx)
  const quiz = quizzes.find(q => {
    if (typeof q.id === 'string') {
      return q.id === id
    }
    return q.id === parseInt(id)
  })
  const { isAuthenticated } = useAuth()

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState([])
  const [timeRemaining, setTimeRemaining] = useState(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submissionError, setSubmissionError] = useState('')

  useEffect(() => {
    if (!quiz) return

    // Initialize answers array
    setAnswers(new Array(quiz.questions.length).fill(null))

    // Initialize timer if timeLimit exists
    if (quiz.timeLimit) {
      setTimeRemaining(quiz.timeLimit * 60) // Convert minutes to seconds
    }
  }, [quiz])

  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeRemaining])

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    if (isSubmitted) return
    const question = quiz.questions[questionIndex]
    const hasChoices = Array.isArray(question.choices) && question.choices.length > 0
    if (!hasChoices) return
    const newAnswers = [...answers]
    newAnswers[questionIndex] = answerIndex
    setAnswers(newAnswers)
  }

  const handleEssayAnswer = (questionIndex, text) => {
    if (isSubmitted) return
    const newAnswers = [...answers]
    newAnswers[questionIndex] = text
    setAnswers(newAnswers)
  }

  const handleSubmit = () => {
    if (isSubmitted) return

    // Kiểm tra số câu chưa làm
    const unansweredCount = answers.filter(a => a === null || a === undefined || a === '').length

    if (unansweredCount > 0) {
      const confirmSubmit = window.confirm(
        `Bạn còn ${unansweredCount} câu chưa làm.\n\nBạn có chắc muốn nộp bài không?`
      )
      if (!confirmSubmit) return
    }

    setIsSubmitted(true)

    // Calculate score for trắc nghiệm questions only
    let score = 0
    let autoGradedCount = 0
    quiz.questions.forEach((question, index) => {
      const hasChoices = Array.isArray(question.choices) && question.choices.length > 0
      if (hasChoices) {
        autoGradedCount++
        if (answers[index] === question.answer) {
          score++
        }
      }
    })

    // Save result to localStorage
    const result = {
      score,
      total: autoGradedCount,
      questionCount: quiz.questions.length,
      submittedAt: new Date().toISOString(),
      answers: [...answers],
      questions: quiz.questions
    }
    saveQuizResult(quiz.id, result)

    setSubmissionError('')

    if (isAuthenticated) {
      // Lưu vào Supabase
      saveSubmissionToSupabase(quiz.id, score, autoGradedCount, answers, quiz.questions.length)
        .catch(err => {
          console.error('Failed to sync submission:', err)
          setSubmissionError('Không thể đồng bộ kết quả lên máy chủ. Vui lòng thử lại sau.')
        })
    }

    // Navigate to result page
    navigate(`/result/${quiz.id}`)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Không tìm thấy bài tập.</p>
        </div>
      </div>
    )
  }

  const question = quiz.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100
  const hasChoices = Array.isArray(question.choices) && question.choices.length > 0

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-6 md:py-8 font-sans">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Header Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 relative overflow-hidden">
            {/* Progress Bar Top */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gray-100 dark:bg-slate-700">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <button
                  onClick={() => window.history.back()}
                  className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-2 flex items-center gap-1 text-sm font-medium transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Quay lại
                </button>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">{quiz.title}</h1>
                <div className="flex items-center gap-3 mt-2 text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Câu {currentQuestion + 1} / {quiz.questions.length}</span>
                  {/* Progress Percentage Badge */}
                  <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold">
                    {Math.round(progress)}% hoàn thành
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {timeRemaining !== null && (
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-xl">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-lg font-bold font-mono">{formatTime(timeRemaining)}</span>
                  </div>
                )}

                {!isSubmitted && (
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                  >
                    <span>Nộp bài</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {!isAuthenticated && (
              <div className="mt-6 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-900/50 rounded-lg p-3 flex items-start gap-3">
                <svg className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-sm text-orange-800 dark:text-orange-300">
                  Bạn đang làm bài với tư cách khách. Hãy <span className="font-bold underline cursor-pointer hover:text-orange-900 dark:hover:text-orange-200">đăng nhập</span> để lưu kết quả cho giáo viên.
                </p>
              </div>
            )}
          </div>

          {/* Question Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 md:p-8 min-h-[400px] flex flex-col">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6 leading-relaxed">
              {hasChoices && (
                <RichContent text={question.q} eq={question.eq} image={question.image} />
              )}
            </h2>

            {hasChoices ? (
              <div className="space-y-4 flex-1">
                {question.choices.map((choice, index) => {
                  const choiceObj = typeof choice === 'string' ? { text: choice } : choice
                  const isSelected = answers[currentQuestion] === index
                  return (
                    <div
                      key={index}
                      onClick={() => !isSubmitted && handleAnswerSelect(currentQuestion, index)}
                      className={`group relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${isSelected
                          ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 shadow-sm'
                          : 'border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-slate-500 hover:bg-gray-50 dark:hover:bg-slate-700/50'
                        } ${isSubmitted ? 'cursor-not-allowed opacity-80' : ''}`}
                    >
                      <div className="flex items-center gap-4">
                        {/* Radio Circle */}
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected
                            ? 'border-blue-500'
                            : 'border-gray-300 dark:border-gray-500 group-hover:border-blue-400'
                          }`}>
                          <div className={`w-3 h-3 rounded-full bg-blue-500 transition-all transform ${isSelected ? 'scale-100' : 'scale-0'
                            }`} />
                        </div>

                        {/* Option Text */}
                        <div className="flex-1 text-gray-700 dark:text-gray-200 text-lg">
                          <RichContent text={choiceObj.text} eq={choiceObj.eq} image={choiceObj.image} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <EssayQuestion
                question={question}
                questionIndex={currentQuestion}
                answer={answers[currentQuestion]}
                onAnswerChange={handleEssayAnswer}
                isSubmitted={isSubmitted}
              />
            )}

            {/* Nav Buttons (Next/Prev) */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100 dark:border-slate-700">
              <button
                onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                disabled={currentQuestion === 0 || isSubmitted}
                className="px-5 py-2.5 rounded-lg border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Câu trước
              </button>

              {currentQuestion < quiz.questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestion(prev => prev + 1)}
                  disabled={isSubmitted}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Câu tiếp theo
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitted}
                  className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 shadow-md transition-all disabled:opacity-50"
                >
                  Hoàn thành
                </button>
              )}
            </div>
          </div>

          {submissionError && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl">
              {submissionError}
            </div>
          )}

          {/* Pagination */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Danh sách câu hỏi</h3>
            <div className="flex flex-wrap gap-2">
              {quiz.questions.map((_, index) => {
                let statusClass = 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600' // Default
                if (index === currentQuestion) {
                  statusClass = 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md ring-2 ring-blue-200 dark:ring-blue-900' // Active
                } else if (answers[index] !== null && answers[index] !== undefined && answers[index] !== '') {
                  statusClass = 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800' // Answered
                }

                return (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestion(index)}
                    disabled={isSubmitted}
                    className={`w-10 h-10 rounded-lg font-medium text-sm transition-all ${statusClass} ${isSubmitted ? 'cursor-not-allowed opacity-70' : ''}`}
                  >
                    {index + 1}
                  </button>
                )
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Quiz
