import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { saveQuizResult } from '../utils/storage'
import RichContent from './RichContent'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../utils/supabase'
import EssayQuestion from './EssayQuestion'

/**
 * Quiz Component with Modern Split Layout
 * Supports multiple question types and mobile bottom-sheet navigation.
 */

async function saveSubmissionToSupabase(quizId, score, total, answers, questionCount) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

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

  const quiz = quizzes.find(q => {
    if (typeof q.id === 'string') return q.id === id
    return q.id === parseInt(id)
  })

  const { isAuthenticated } = useAuth()

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState([])
  const [markedQuestions, setMarkedQuestions] = useState([]) // Array of indices
  const [timeRemaining, setTimeRemaining] = useState(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submissionError, setSubmissionError] = useState('')
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  useEffect(() => {
    if (!quiz) return
    setAnswers(new Array(quiz.questions.length).fill(null))
    if (quiz.timeLimit) {
      setTimeRemaining(quiz.timeLimit * 60)
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
    if (!Array.isArray(question.choices) || question.choices.length === 0) return
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

  const toggleMarkQuestion = (index) => {
    if (isSubmitted) return
    setMarkedQuestions(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    )
  }

  const handleSubmit = () => {
    if (isSubmitted) return
    const unansweredCount = answers.filter(a => a === null || a === undefined || a === '').length

    if (unansweredCount > 0) {
      const confirmSubmit = window.confirm(
        `Bạn còn ${unansweredCount} câu chưa làm.\n\nBạn có chắc muốn nộp bài không?`
      )
      if (!confirmSubmit) return
    }

    setIsSubmitted(true)
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
      saveSubmissionToSupabase(quiz.id, score, autoGradedCount, answers, quiz.questions.length)
        .catch(err => {
          console.error('Failed to sync submission:', err)
          setSubmissionError('Không thể đồng bộ kết quả lên máy chủ. Vui lòng thử lại sau.')
        })
    }
    navigate(`/result/${quiz.id}`)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-slate-900 flex items-center justify-center">
        <p className="text-neutral-500">Không tìm thấy bài tập.</p>
      </div>
    )
  }

  const question = quiz.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100
  const hasChoices = Array.isArray(question.choices) && question.choices.length > 0
  const isMarked = markedQuestions.includes(currentQuestion)

  return (
    <div className="h-screen flex flex-col bg-neutral-50 dark:bg-slate-900 overflow-hidden font-sans">

      {/* Top Header */}
      <header className="h-16 flex-shrink-0 bg-surface dark:bg-slate-800 border-b border-neutral-200 dark:border-slate-700 flex items-center justify-between px-4 lg:px-6 z-20">
        <div className="flex items-center gap-4">
          <button onClick={() => window.history.back()} className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-slate-700 transition-colors text-neutral-600 dark:text-neutral-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-body font-bold text-neutral-900 dark:text-white line-clamp-1 max-w-[200px] sm:max-w-md">{quiz.title}</h1>
        </div>

        <div className="flex items-center gap-4">
          {timeRemaining !== null && (
            <div className="flex items-center gap-2 bg-semantic-error-subtle dark:bg-semantic-error-base/20 border border-semantic-error-border text-semantic-error-base px-3 py-1.5 rounded-base font-mono font-bold">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {formatTime(timeRemaining)}
            </div>
          )}
          <button
            onClick={handleSubmit}
            className="hidden sm:flex items-center gap-2 px-5 py-2 bg-primary-base hover:bg-primary-hover text-white rounded-base font-semibold shadow-sm transition-all text-body-sm"
          >
            Nộp bài
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </button>

          {/* Mobile Nav Toggle */}
          <button
            className="lg:hidden p-2 text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-slate-700 rounded-base border border-neutral-200 dark:border-slate-600"
            onClick={() => setIsMobileNavOpen(true)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
          </button>
        </div>
      </header>

      {/* Progress Bar Top */}
      <div className="h-1 w-full bg-neutral-200 dark:bg-slate-700 flex-shrink-0 z-20">
        <div className="h-full bg-primary-base transition-all duration-300" style={{ width: `${progress}%` }}></div>
      </div>

      {/* Main Split Layout */}
      <div className="flex-1 flex overflow-hidden lg:flex-row flex-col relative">

        {/* Left Panel: Question Display (60%) */}
        <div className="flex-1 lg:w-3/5 overflow-y-auto w-full flex flex-col">
          <div className="max-w-3xl mx-auto w-full p-6 lg:p-10 pb-32 lg:pb-10 flex-1 flex flex-col">

            <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <span className="text-display text-neutral-900 dark:text-neutral-100 font-bold leading-none">
                  {currentQuestion + 1}
                </span>
                <span className="text-body text-neutral-500 font-medium self-end mb-1">
                  / {quiz.questions.length}
                </span>
              </div>

              <button
                onClick={() => toggleMarkQuestion(currentQuestion)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-sm border text-caption font-semibold transition-colors ${isMarked
                    ? 'bg-semantic-warning-subtle text-semantic-warning-base border-semantic-warning-border'
                    : 'bg-surface dark:bg-slate-800 text-neutral-500 border-neutral-300 dark:border-slate-600 hover:bg-neutral-100 dark:hover:bg-slate-700'
                  }`}
              >
                <svg className="w-4 h-4" fill={isMarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                {isMarked ? 'Đã đánh dấu' : 'Đánh dấu xem lại'}
              </button>
            </div>

            {/* Question Content */}
            <div className="text-h3 lg:text-h2 font-medium text-neutral-800 dark:text-neutral-100 leading-relaxed mb-8">
              {hasChoices && (
                <RichContent text={question.q} eq={question.eq} image={question.image} />
              )}
            </div>

            {/* Answer Choices */}
            {hasChoices ? (
              <div className="space-y-4">
                {question.choices.map((choice, index) => {
                  const choiceObj = typeof choice === 'string' ? { text: choice } : choice
                  const isSelected = answers[currentQuestion] === index
                  return (
                    <div
                      key={index}
                      onClick={() => !isSubmitted && handleAnswerSelect(currentQuestion, index)}
                      className={`group relative p-5 rounded-lg border-2 cursor-pointer transition-all duration-200 flex items-center gap-4 ${isSelected
                          ? 'border-primary-base bg-primary-subtle dark:bg-primary-900/10 shadow-sm'
                          : 'border-neutral-200 dark:border-slate-700 bg-surface dark:bg-slate-800 hover:border-primary-300 dark:hover:border-slate-500 shadow-sm'
                        }`}
                    >
                      {/* Custom Radio */}
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${isSelected ? 'border-primary-base' : 'border-neutral-300 dark:border-slate-500 group-hover:border-primary-400'
                        }`}>
                        <div className={`w-2.5 h-2.5 rounded-full bg-primary-base transform transition-transform ${isSelected ? 'scale-100' : 'scale-0'}`} />
                      </div>

                      {/* Text */}
                      <div className="text-body lg:text-body-lg text-neutral-700 dark:text-neutral-200 flex-1">
                        <RichContent text={choiceObj.text} eq={choiceObj.eq} image={choiceObj.image} />
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex-1">
                <EssayQuestion
                  question={question}
                  questionIndex={currentQuestion}
                  answer={answers[currentQuestion]}
                  onAnswerChange={handleEssayAnswer}
                  isSubmitted={isSubmitted}
                />
              </div>
            )}

            {/* Bottom Form Actions (Left Panel) */}
            <div className="mt-auto pt-10 flex justify-between gap-4">
              <button
                onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                disabled={currentQuestion === 0 || isSubmitted}
                className="px-6 py-3 rounded-base bg-surface border border-neutral-300 text-neutral-700 dark:bg-slate-800 dark:border-slate-600 dark:text-neutral-300 font-semibold hover:bg-neutral-50 dark:hover:bg-slate-700 transition disabled:opacity-50"
              >
                &larr; Quay lại
              </button>
              {currentQuestion < quiz.questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestion(prev => prev + 1)}
                  disabled={isSubmitted}
                  className="px-6 py-3 rounded-base bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:hover:bg-white dark:text-neutral-900 font-semibold shadow-md transition disabled:opacity-50"
                >
                  Câu tiếp theo &rarr;
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitted}
                  className="lg:hidden px-6 py-3 bg-primary-base hover:bg-primary-hover text-white rounded-base font-semibold shadow-md transition"
                >
                  Nộp bài ngay
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Right Panel: Navigation Grid (40%) Desktop */}
        <div className="hidden lg:flex w-2/5 border-l border-neutral-200 dark:border-slate-700 bg-surface dark:bg-slate-900 flex-col overflow-y-auto">
          <div className="p-8">
            <h3 className="text-h3 font-bold text-neutral-900 dark:text-white mb-6">Bảng điều hướng</h3>

            <div className="flex gap-4 mb-6 flex-wrap">
              <div className="flex items-center gap-2 text-caption font-medium text-neutral-600 dark:text-neutral-400">
                <div className="w-3 h-3 rounded-sm border border-neutral-300 bg-white dark:bg-slate-800"></div> Chưa làm
              </div>
              <div className="flex items-center gap-2 text-caption font-medium text-neutral-600 dark:text-neutral-400">
                <div className="w-3 h-3 rounded-sm bg-primary-base"></div> Đã làm
              </div>
              <div className="flex items-center gap-2 text-caption font-medium text-neutral-600 dark:text-neutral-400">
                <div className="w-3 h-3 rounded-sm bg-semantic-warning-base"></div> Đánh dấu
              </div>
            </div>

            <div className="grid grid-cols-5 xl:grid-cols-6 gap-3">
              {quiz.questions.map((_, index) => {
                const isCurrent = index === currentQuestion
                const isAnswered = answers[index] !== null && answers[index] !== undefined && answers[index] !== ''
                const isMarkedItem = markedQuestions.includes(index)

                let btnClass = 'bg-surface dark:bg-slate-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-slate-700 hover:bg-neutral-100 dark:hover:bg-slate-700'

                if (isCurrent) {
                  btnClass = 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-md ring-2 ring-neutral-900/20'
                } else if (isMarkedItem) {
                  btnClass = 'bg-semantic-warning-subtle text-semantic-warning-base border-semantic-warning-border'
                } else if (isAnswered) {
                  btnClass = 'bg-primary-subtle text-primary-base border-primary-200 dark:border-primary-800 font-bold'
                }

                return (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestion(index)}
                    className={`h-12 w-full rounded-md font-semibold text-body-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary-base focus:ring-offset-1 ${btnClass}`}
                  >
                    {index + 1}
                  </button>
                )
              })}
            </div>

            {/* Submit full button on desktop bottom */}
            <div className="mt-12 bg-neutral-100 dark:bg-slate-800 rounded-lg p-5 border border-neutral-200 dark:border-slate-700 text-center">
              <p className="text-body-sm text-neutral-600 dark:text-neutral-400 mb-4">
                Đã hoàn thành: <span className="font-bold text-primary-base">{answers.filter(a => a !== null && a !== '').length}/{quiz.questions.length}</span> câu hỏi
              </p>
              <button
                onClick={handleSubmit}
                className="w-full py-3 bg-primary-base hover:bg-primary-hover text-white rounded-base font-bold shadow-md transition-all text-body"
              >
                Nộp bài & Kết thúc
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Mobile Bottom Navigation Panel */}
      {isMobileNavOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm" onClick={() => setIsMobileNavOpen(false)}></div>
          <div className="bg-surface dark:bg-slate-900 rounded-t-3xl w-full h-[70vh] flex flex-col relative animate-fade-in-up">
            <div className="p-4 flex justify-between items-center border-b border-neutral-200 dark:border-slate-700">
              <h3 className="font-bold text-body text-neutral-900 dark:text-white">Bảng điều hướng</h3>
              <button onClick={() => setIsMobileNavOpen(false)} className="p-2 text-neutral-500 bg-neutral-100 dark:bg-slate-800 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-5 gap-3 mb-8">
                {quiz.questions.map((_, index) => {
                  const isCurrent = index === currentQuestion
                  const isAnswered = answers[index] !== null && answers[index] !== undefined && answers[index] !== ''
                  const isMarkedItem = markedQuestions.includes(index)

                  let btnClass = 'bg-surface dark:bg-slate-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-slate-700'
                  if (isCurrent) btnClass = 'bg-neutral-900 text-white shadow-md'
                  else if (isMarkedItem) btnClass = 'bg-semantic-warning-subtle text-semantic-warning-base border-semantic-warning-border'
                  else if (isAnswered) btnClass = 'bg-primary-subtle text-primary-base border-primary-200 font-bold'

                  return (
                    <button
                      key={index}
                      onClick={() => { setCurrentQuestion(index); setIsMobileNavOpen(false) }}
                      className={`h-12 w-full rounded-md font-semibold text-body-sm ${btnClass}`}
                    >
                      {index + 1}
                    </button>
                  )
                })}
              </div>
              <button
                onClick={handleSubmit}
                className="w-full py-3.5 bg-primary-base text-white rounded-base font-bold shadow-md text-body"
              >
                Nộp bài & Kết thúc
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Quiz
