import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { saveQuizResult } from '../utils/storage'
import RichContent from './RichContent'

function Quiz({ quizzes }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const quiz = quizzes.find(q => q.id === parseInt(id))
  
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState([])
  const [timeRemaining, setTimeRemaining] = useState(null)
  const [isSubmitted, setIsSubmitted] = useState(false)

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
    const newAnswers = [...answers]
    newAnswers[questionIndex] = answerIndex
    setAnswers(newAnswers)
  }

  const handleSubmit = () => {
    if (isSubmitted) return
    
    setIsSubmitted(true)
    
    // Calculate score
    let score = 0
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.answer) {
        score++
      }
    })

    // Save result to localStorage
    const result = {
      score,
      total: quiz.questions.length,
      answers: [...answers],
      questions: quiz.questions
    }
    saveQuizResult(quiz.id, result)

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Không tìm thấy bài tập.</p>
        </div>
      </div>
    )
  }

  const question = quiz.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-800">{quiz.title}</h1>
              {timeRemaining !== null && (
                <div className="text-lg font-semibold text-indigo-600">
                  ⏱️ {formatTime(timeRemaining)}
                </div>
              )}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Câu {currentQuestion + 1} / {quiz.questions.length}
            </p>
          </div>

          {/* Question */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <RichContent text={question.q} eq={question.eq} image={question.image} className="text-xl font-semibold" />
            <div className="space-y-3 mt-6">
              {question.choices.map((choice, index) => {
                const choiceObj = typeof choice === 'string' ? { text: choice } : choice
                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(currentQuestion, index)}
                    disabled={isSubmitted}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      answers[currentQuestion] === index
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                        : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                    } ${isSubmitted ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <span className="font-medium mr-2">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    <RichContent text={choiceObj.text} eq={choiceObj.eq} image={choiceObj.image} />
                  </button>
                )
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0 || isSubmitted}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Câu trước
            </button>
            <div className="flex gap-2">
              {currentQuestion < quiz.questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestion(prev => prev + 1)}
                  disabled={isSubmitted}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Câu sau →
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitted || answers.some(a => a === null)}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Nộp bài
                </button>
              )}
            </div>
          </div>

          {/* Question Navigation Dots */}
          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            {quiz.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                disabled={isSubmitted}
                className={`w-10 h-10 rounded-full font-medium ${
                  index === currentQuestion
                    ? 'bg-indigo-600 text-white'
                    : answers[index] !== null
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                } ${isSubmitted ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Quiz

