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
  const quiz = quizzes.find(q => q.id === parseInt(id))
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
  
  // Cho phép nộp bài bất cứ lúc nào (không cần làm hết)
  const canSubmit = true

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <button
                  onClick={() => window.history.back()}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-2 flex items-center gap-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{quiz.title}</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Câu {currentQuestion + 1} / {quiz.questions.length}</p>
              </div>
              
              <div className="flex items-center gap-4">
                {timeRemaining !== null && (
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-lg font-semibold">{formatTime(timeRemaining)}</span>
                  </div>
                )}
                
                {/* Nút nộp bài luôn hiển thị */}
                {!isSubmitted && (
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    Nộp bài
                  </button>
                )}
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            {!isAuthenticated && (
              <div className="mt-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-lg text-sm">
                Bạn đang làm bài với tư cách khách. Hãy <span className="font-semibold">đăng nhập</span> để lưu kết quả cho giáo viên.
              </div>
            )}
          </div>

          {/* Question */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-8 mb-6">
            {hasChoices && (
              <div className="mb-6">
                <RichContent text={question.q} eq={question.eq} image={question.image} className="text-lg font-medium text-gray-900 dark:text-gray-100" />
              </div>
            )}
            {hasChoices ? (
              <div className="space-y-3">
                {question.choices.map((choice, index) => {
                  const choiceObj = typeof choice === 'string' ? { text: choice } : choice
                  const isSelected = answers[currentQuestion] === index
                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(currentQuestion, index)}
                      disabled={isSubmitted}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${isSelected
                          ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30'
                          : 'border-gray-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-slate-700'
                        } ${isSubmitted ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                          }`}>
                          {isSelected && (
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1">
                          <RichContent text={choiceObj.text} eq={choiceObj.eq} image={choiceObj.image} />
                        </div>
                      </div>
                    </button>
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
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0 || isSubmitted}
              className="px-6 py-3 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Câu trước
            </button>
            <div className="flex gap-3">
              {currentQuestion < quiz.questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestion(prev => prev + 1)}
                  disabled={isSubmitted}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Câu tiếp theo
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitted}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                >
                  Nộp bài
                </button>
              )}
            </div>
          </div>

          {submissionError && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl">
              {submissionError}
            </div>
          )}

          {/* Question Navigation */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
            <div className="flex flex-wrap gap-2 justify-center">
              {quiz.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  disabled={isSubmitted}
                  className={`w-12 h-12 rounded-xl font-semibold transition-all ${index === currentQuestion
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                      : answers[index] !== null
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-2 border-blue-200 dark:border-blue-700'
                        : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600'
                    } ${isSubmitted ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Quiz

