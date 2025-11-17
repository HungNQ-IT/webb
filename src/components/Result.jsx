import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getQuizResult } from '../utils/storage'
import RichContent from './RichContent'

function Result({ quizzes }) {
  const { id } = useParams()
  const quiz = quizzes.find(q => q.id === parseInt(id))
  const [result, setResult] = useState(null)

  useEffect(() => {
    if (quiz) {
      const savedResult = getQuizResult(quiz.id)
      if (savedResult) {
        setResult(savedResult)
      }
    }
  }, [quiz])

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Không tìm thấy bài tập.</p>
        </div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Chưa có kết quả cho bài tập này.</p>
          <Link
            to={`/quiz/${quiz.id}`}
            className="mt-4 inline-block text-indigo-600 hover:text-indigo-800"
          >
            Làm bài ngay
          </Link>
        </div>
      </div>
    )
  }

  const hasAutoGraded = result.total > 0
  const percentage = hasAutoGraded ? Math.round((result.score / result.total) * 100) : null
  const getScoreColor = () => {
    if (!hasAutoGraded) return 'text-indigo-600'
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = () => {
    if (!hasAutoGraded) return 'bg-indigo-100 border-indigo-500'
    if (percentage >= 80) return 'bg-green-100 border-green-500'
    if (percentage >= 60) return 'bg-yellow-100 border-yellow-500'
    return 'bg-red-100 border-red-500'
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Score Card */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl shadow-xl p-12 mb-8 text-white text-center">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-3">
              {hasAutoGraded && percentage >= 80 && 'Hãy cố gắng thêm!'}
              {hasAutoGraded && percentage >= 60 && percentage < 80 && 'Hãy cố gắng thêm!'}
              {hasAutoGraded && percentage < 60 && 'Hãy cố gắng thêm!'}
              {!hasAutoGraded && 'Bài tự luận'}
            </h2>
            <p className="text-orange-100 mb-8">
              {hasAutoGraded ? `Bạn đã trả lời đúng ${result.score} / ${result.total} câu` : 'Giáo viên sẽ chấm điểm'}
            </p>
            <div className="bg-white rounded-2xl p-8 inline-block">
              <div className="text-6xl font-bold text-blue-600 mb-2">
                {hasAutoGraded ? `${percentage}%` : '—'}
              </div>
              <div className="text-gray-600 font-medium">Điểm số</div>
            </div>
          </div>

          {/* Review Questions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Xem lại đáp án
            </h2>
            <div className="space-y-6">
              {result.questions.map((question, index) => {
                const userAnswer = result.answers[index]
                const questionHasChoices = Array.isArray(question.choices) && question.choices.length > 0
                const isCorrect = questionHasChoices && userAnswer === question.answer
                
                return (
                  <div
                    key={index}
                    className={`border-2 rounded-xl p-6 ${
                      questionHasChoices
                        ? isCorrect
                          ? 'border-green-200 bg-green-50'
                          : 'border-red-200 bg-red-50'
                        : 'border-blue-200 bg-blue-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="font-medium text-gray-900 flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {questionHasChoices ? (
                            isCorrect ? (
                              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                </svg>
                              </div>
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                                </svg>
                              </div>
                            )
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-xs font-bold">?</span>
                            </div>
                          )}
                          <span className="font-bold text-gray-700">Câu {index + 1}:</span>
                        </div>
                        <RichContent text={question.q} eq={question.eq} image={question.image} />
                      </div>
                    </div>
                    {questionHasChoices ? (
                      <div className="space-y-2 mb-4">
                        {question.choices.map((choice, choiceIndex) => {
                          const isUserAnswer = userAnswer === choiceIndex
                          const isCorrectAnswer = choiceIndex === question.answer
                          const choiceObj = typeof choice === 'string' ? { text: choice } : choice
                          
                          return (
                            <div
                              key={choiceIndex}
                              className={`p-3 rounded-xl border-2 ${
                                isCorrectAnswer
                                  ? 'bg-green-100 border-green-300'
                                  : isUserAnswer && !isCorrect
                                  ? 'bg-red-100 border-red-300'
                                  : 'bg-white border-gray-200'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                  isCorrectAnswer
                                    ? 'border-green-500 bg-green-500'
                                    : isUserAnswer && !isCorrect
                                    ? 'border-red-500 bg-red-500'
                                    : 'border-gray-300'
                                }`}>
                                  {(isCorrectAnswer || (isUserAnswer && !isCorrect)) && (
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                      {isCorrectAnswer ? (
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                      ) : (
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                                      )}
                                    </svg>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <RichContent text={choiceObj.text} eq={choiceObj.eq} image={choiceObj.image} />
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <p className="mb-4 text-sm text-blue-700 bg-blue-100 p-3 rounded-xl">
                        Câu hỏi này không được chấm tự động. Hãy đối chiếu với lời giải hoặc nhờ giáo viên chấm.
                      </p>
                    )}
                    {(question.explain || question.explainEq || question.explainImage) && (
                      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-xl">
                        <div className="text-sm text-gray-700">
                          <div className="font-semibold text-blue-700 mb-2">💡 Giải thích:</div>
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
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/"
              className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
              </svg>
              Về trang chủ
            </Link>
            <Link
              to={`/quiz/${quiz.id}`}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              Làm lại
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Result

