import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getQuizResult } from '../utils/storage'
import RichContent from './RichContent'
import AIGradingResult from './AIGradingResult'

/**
 * Result Component
 * Displays post-submission analysis, score reveal animations, and detailed explanations.
 */

function Result({ quizzes }) {
  const { id } = useParams()
  const navigate = useNavigate()

  const quiz = quizzes.find(q => {
    if (typeof q.id === 'string') return q.id === id
    return q.id === parseInt(id)
  })

  const [result, setResult] = useState(null)
  const [showExplanations, setShowExplanations] = useState(false)
  const [isRevealing, setIsRevealing] = useState(true)

  useEffect(() => {
    if (quiz) {
      const savedResult = getQuizResult(quiz.id)
      if (savedResult) {
        setResult(savedResult)
        // Score reveal animation effect
        const timer = setTimeout(() => setIsRevealing(false), 800)
        return () => clearTimeout(timer)
      }
    }
  }, [quiz])

  if (!quiz) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-slate-900 flex items-center justify-center font-sans">
        <p className="text-neutral-500">Không tìm thấy bài tập.</p>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-slate-900 flex items-center justify-center font-sans">
        <div className="text-center">
          <p className="text-neutral-600 dark:text-neutral-400 mb-4 text-body-lg">Chưa có kết quả cho bài tập này.</p>
          <Link
            to={`/quiz/${quiz.id}`}
            className="px-6 py-3 bg-primary-base text-white rounded-base font-semibold hover:bg-primary-hover transition-colors"
          >
            Làm bài ngay
          </Link>
        </div>
      </div>
    )
  }

  const hasAutoGraded = result.total > 0
  const percentage = hasAutoGraded ? Math.round((result.score / result.total) * 100) : 0

  // Calculate stats
  const correctCount = result.score
  const incorrectCount = result.total - result.score
  const unansweredCount = result.questions.filter((q, i) => {
    const hasChoices = Array.isArray(q.choices) && q.choices.length > 0
    return hasChoices && (result.answers[i] === null || result.answers[i] === undefined || result.answers[i] === '')
  }).length

  // Mocked topic breakdown (If topic data was actually in questions, we would group by it)
  const topicStats = [
    { title: 'Kiến thức cốt lõi', correct: Math.floor(correctCount * 0.6), total: Math.floor(result.total * 0.6) },
    { title: 'Vận dụng', correct: correctCount - Math.floor(correctCount * 0.6), total: result.total - Math.floor(result.total * 0.6) }
  ]

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-slate-900 pt-16 pb-24 font-sans selection:bg-primary-subtle selection:text-primary-base">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">

          <button
            onClick={() => navigate('/subjects')}
            className="group flex items-center gap-2 text-neutral-600 hover:text-primary-base dark:text-neutral-400 dark:hover:text-primary-400 transition-colors mb-8 font-medium"
          >
            <div className="p-2 bg-surface dark:bg-slate-800 rounded-full shadow-sm group-hover:shadow-md transition-all border border-neutral-200 dark:border-slate-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            <span className="text-body-sm font-medium">Trở về danh sách</span>
          </button>

          {/* Score Reveal Hero Card */}
          <div className="bg-surface dark:bg-slate-800 rounded-3xl p-8 lg:p-12 shadow-md border border-neutral-200 dark:border-slate-700 mb-8 relative overflow-hidden">

            {/* Background Decorative */}
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
              <svg className="w-64 h-64 text-primary-base" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
            </div>

            <div className="text-center relative z-10">
              <h1 className="text-h3 lg:text-h2 font-bold text-neutral-900 dark:text-white mb-2">Phân tích kết quả</h1>
              <p className="text-body-lg text-neutral-600 dark:text-neutral-400 mb-10">{quiz.title}</p>

              {hasAutoGraded ? (
                <div className="flex flex-col items-center justify-center">
                  <div className="relative w-48 h-48 mb-6 flexItemsCenter justify-center mx-auto">
                    {/* Circle chart outline */}
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" className="text-neutral-100 dark:text-slate-700" strokeWidth="8" />
                      <circle
                        cx="50" cy="50" r="45" fill="none"
                        stroke="currentColor"
                        className={`${percentage >= 80 ? 'text-semantic-success-base' : percentage >= 50 ? 'text-semantic-warning-base' : 'text-semantic-error-base'} transition-all duration-1000 ease-out`}
                        strokeWidth="8"
                        strokeDasharray="283"
                        strokeDashoffset={isRevealing ? 283 : 283 - (283 * percentage) / 100}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-display font-black tracking-tighter ${percentage >= 80 ? 'text-semantic-success-base' : percentage >= 50 ? 'text-semantic-warning-base' : 'text-semantic-error-base'}`}>
                        {isRevealing ? '0' : percentage}<span className="text-h2">%</span>
                      </span>
                    </div>
                  </div>

                  <div className="text-h3 font-bold text-neutral-900 dark:text-white mb-2">
                    {percentage >= 80 ? 'Xuất sắc! 🔥' : percentage >= 50 ? 'Khá tốt, cố gắng lên! 🌟' : 'Cần ôn tập thêm 📚'}
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 text-body">
                    Hoàn thành <strong className="text-neutral-900 dark:text-white">{result.score}</strong> trên tổng số <strong className="text-neutral-900 dark:text-white">{result.total}</strong> câu hỏi trắc nghiệm.
                  </p>
                </div>
              ) : (
                <div className="py-12">
                  <div className="text-display font-black text-primary-base tracking-tighter mb-4">Tự luận</div>
                  <p className="text-body-lg text-neutral-600 dark:text-neutral-400">Giáo viên sẽ xem xét và chấm điểm bài làm của bạn.</p>
                </div>
              )}
            </div>

            {hasAutoGraded && (
              <div className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-neutral-200 dark:border-slate-700 max-w-2xl mx-auto">
                <div className="text-center p-4 bg-semantic-success-subtle dark:bg-semantic-success-base/10 rounded-lg">
                  <div className="text-h2 font-bold text-semantic-success-base mb-1">{correctCount}</div>
                  <div className="text-caption font-semibold text-semantic-success-base uppercase tracking-wider">Làm đúng</div>
                </div>
                <div className="text-center p-4 bg-semantic-error-subtle dark:bg-semantic-error-base/10 rounded-lg">
                  <div className="text-h2 font-bold text-semantic-error-base mb-1">{incorrectCount - unansweredCount}</div>
                  <div className="text-caption font-semibold text-semantic-error-base uppercase tracking-wider">Làm sai</div>
                </div>
                <div className="text-center p-4 bg-neutral-100 dark:bg-slate-700/50 rounded-lg">
                  <div className="text-h2 font-bold text-neutral-600 dark:text-neutral-300 mb-1">{unansweredCount}</div>
                  <div className="text-caption font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">Bỏ qua</div>
                </div>
              </div>
            )}
          </div>

          {/* Breakdown By Topic Mock */}
          {hasAutoGraded && (
            <div className="p-8 bg-surface dark:bg-slate-800 rounded-2xl shadow-sm border border-neutral-200 dark:border-slate-700 mb-8">
              <h3 className="text-h3 font-bold text-neutral-900 dark:text-white mb-6">Phân tích theo chủ đề</h3>
              <div className="space-y-6">
                {topicStats.map((topic, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-body font-semibold text-neutral-800 dark:text-neutral-200">{topic.title}</span>
                      <span className="text-body-sm text-neutral-500 font-medium">{topic.correct}/{topic.total} câu ({Math.round((topic.correct / topic.total) * 100)}%)</span>
                    </div>
                    <div className="w-full bg-neutral-200 dark:bg-slate-700 rounded-full h-2">
                      <div className="bg-primary-base h-2 rounded-full" style={{ width: `${(topic.correct / topic.total) * 100}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button
              onClick={() => setShowExplanations(!showExplanations)}
              className="w-full sm:w-auto px-8 py-3.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-base font-bold text-body hover:bg-neutral-800 transition-colors shadow-md"
            >
              {showExplanations ? 'Ẩn giải thích chi tiết' : 'Xem giải thích từng câu'}
            </button>
            <Link
              to={`/quiz/${quiz.id}`}
              className="w-full sm:w-auto px-8 py-3.5 bg-surface dark:bg-slate-800 text-neutral-900 dark:text-white border border-neutral-300 dark:border-slate-600 rounded-base font-bold text-body hover:bg-neutral-50 transition-colors text-center shadow-sm"
            >
              Làm lại đề này
            </Link>
          </div>

          {/* Detailed Explanations */}
          {showExplanations && (
            <div className="space-y-8 animate-fade-in-up">
              <h2 className="text-h2 font-bold text-neutral-900 dark:text-white mb-6">Chi tiết bài làm</h2>

              {result.questions.map((question, index) => {
                const userAnswer = result.answers[index]
                const questionHasChoices = Array.isArray(question.choices) && question.choices.length > 0
                const isCorrect = questionHasChoices && userAnswer === question.answer

                return (
                  <div
                    key={index}
                    className={`border-2 rounded-xl p-6 lg:p-8 bg-surface dark:bg-slate-800 ${questionHasChoices
                        ? isCorrect
                          ? 'border-semantic-success-border'
                          : 'border-semantic-error-border'
                        : 'border-neutral-200 dark:border-slate-700'
                      }`}
                  >
                    {/* Question Header */}
                    <div className="flex items-start justify-between mb-6 pb-6 border-b border-neutral-100 dark:border-slate-700">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <span className={`px-3 py-1 text-caption font-bold rounded-sm ${questionHasChoices
                              ? isCorrect ? 'bg-semantic-success-subtle text-semantic-success-base' : 'bg-semantic-error-subtle text-semantic-error-base'
                              : 'bg-primary-subtle text-primary-base'
                            }`}>
                            Câu {index + 1}
                          </span>
                          {questionHasChoices && (
                            <span className={`font-semibold text-body-sm ${isCorrect ? 'text-semantic-success-base' : 'text-semantic-error-base'}`}>
                              {isCorrect ? 'Tuyệt vời!' : 'Sai rồi'}
                            </span>
                          )}
                        </div>
                        <div className="text-body-lg text-neutral-800 dark:text-neutral-100 font-medium leading-relaxed">
                          <RichContent text={question.q} eq={question.eq} image={question.image} />
                        </div>
                      </div>
                    </div>

                    {/* Choices Display */}
                    {questionHasChoices ? (
                      <div className="space-y-3 mb-6">
                        {question.choices.map((choice, choiceIndex) => {
                          const isUserAnswer = userAnswer === choiceIndex
                          const isCorrectAnswer = choiceIndex === question.answer
                          const choiceObj = typeof choice === 'string' ? { text: choice } : choice

                          let borderClass = 'border-neutral-200 dark:border-slate-600 bg-surface dark:bg-slate-700/50'
                          if (isCorrectAnswer) borderClass = 'border-semantic-success-base bg-semantic-success-subtle/30 dark:bg-semantic-success-base/10'
                          else if (isUserAnswer && !isCorrect) borderClass = 'border-semantic-error-base bg-semantic-error-subtle/30 dark:bg-semantic-error-base/10'

                          return (
                            <div key={choiceIndex} className={`p-4 rounded-lg border-2 flex items-center gap-4 ${borderClass}`}>
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isCorrectAnswer ? 'border-semantic-success-base bg-semantic-success-base text-white' :
                                  (isUserAnswer && !isCorrect) ? 'border-semantic-error-base bg-semantic-error-base text-white' : 'border-neutral-300 dark:border-slate-500'
                                }`}>
                                {(isCorrectAnswer || (isUserAnswer && !isCorrect)) && (
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {isCorrectAnswer ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />}
                                  </svg>
                                )}
                              </div>
                              <div className={`text-body flex-1 ${isCorrectAnswer ? 'text-semantic-success-base font-semibold' : (isUserAnswer && !isCorrect) ? 'text-semantic-error-base line-through opacity-80' : 'text-neutral-700 dark:text-neutral-300'}`}>
                                <RichContent text={choiceObj.text} eq={choiceObj.eq} image={choiceObj.image} />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="mb-6">
                        <div className="bg-neutral-50 dark:bg-slate-700/50 border border-neutral-200 dark:border-slate-600 rounded-lg p-5 mb-4">
                          <h4 className="font-semibold text-neutral-900 dark:text-white mb-3 text-body-sm uppercase tracking-wider">Bài làm tự luận:</h4>
                          <p className="text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap leading-relaxed">{userAnswer || '(Bỏ trống)'}</p>
                        </div>

                        {userAnswer && userAnswer.length >= 10 && (
                          <AIGradingResult question={question.q} studentAnswer={userAnswer} correctAnswer={question.answer} maxScore={question.points || 10} />
                        )}

                        {(!userAnswer || userAnswer.length < 10) && (
                          <p className="text-body-sm text-semantic-warning-base bg-semantic-warning-subtle/30 p-4 rounded-lg font-medium border border-semantic-warning-border border-dashed">
                            ⚠️ Câu trả lời không đủ độ dài để tự động chấm điểm.
                          </p>
                        )}
                      </div>
                    )}

                    {/* Explanation Box */}
                    {(question.explain || question.explainEq || question.explainImage) && (
                      <div className="bg-semantic-info-subtle/50 dark:bg-semantic-info-subtle border border-semantic-info-border p-6 rounded-xl mt-4">
                        <div className="flex items-center gap-2 font-bold text-semantic-info-base mb-3">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          Giải thích chi tiết:
                        </div>
                        <div className="text-neutral-800 dark:text-neutral-700 font-medium leading-relaxed">
                          <RichContent
                            text={question.explain}
                            eq={question.explainEq}
                            image={question.explainImage}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default Result
