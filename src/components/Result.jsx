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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Score Card */}
          <div className={`bg-white rounded-xl shadow-lg p-8 mb-6 border-4 ${getScoreBgColor()}`}>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {quiz.title}
              </h1>
              <div className={`text-6xl font-bold mb-2 ${getScoreColor()}`}>
                {hasAutoGraded ? `${result.score}/${result.total}` : 'Tự luận'}
              </div>
              <div className={`text-2xl font-semibold ${getScoreColor()}`}>
                {hasAutoGraded ? `${percentage}%` : 'Giáo viên sẽ chấm điểm'}
              </div>
              {hasAutoGraded && percentage >= 80 && (
                <p className="text-green-600 font-medium mt-2">🎉 Xuất sắc!</p>
              )}
              {hasAutoGraded && percentage >= 60 && percentage < 80 && (
                <p className="text-yellow-600 font-medium mt-2">👍 Tốt!</p>
              )}
              {hasAutoGraded && percentage < 60 && (
                <p className="text-red-600 font-medium mt-2">💪 Cố gắng thêm nhé!</p>
              )}
              {!hasAutoGraded && (
                <p className="text-indigo-600 font-medium mt-2">
                  Bài này chỉ gồm câu tự luận. Hãy nộp cho giáo viên để chấm.
                </p>
              )}
            </div>
          </div>

          {/* Review Questions */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Xem lại bài làm
            </h2>
            <div className="space-y-6">
              {result.questions.map((question, index) => {
                const userAnswer = result.answers[index]
                const questionHasChoices = Array.isArray(question.choices) && question.choices.length > 0
                const isCorrect = questionHasChoices && userAnswer === question.answer
                
                return (
                  <div
                    key={index}
                    className={`border-2 rounded-lg p-4 ${
                      questionHasChoices
                        ? isCorrect
                          ? 'border-green-500 bg-green-50'
                          : 'border-red-500 bg-red-50'
                        : 'border-indigo-400 bg-indigo-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="font-semibold text-gray-800">
                        <span className="mr-2">Câu {index + 1}:</span>
                        <RichContent text={question.q} eq={question.eq} image={question.image} />
                      </div>
                      {questionHasChoices ? (
                        isCorrect ? (
                          <span className="text-green-600 font-bold">✓ Đúng</span>
                        ) : (
                          <span className="text-red-600 font-bold">✗ Sai</span>
                        )
                      ) : (
                        <span className="text-indigo-600 font-bold">Câu tự luận</span>
                      )}
                    </div>
                    {questionHasChoices ? (
                      <div className="space-y-2 mb-3">
                        {question.choices.map((choice, choiceIndex) => {
                          const isUserAnswer = userAnswer === choiceIndex
                          const isCorrectAnswer = choiceIndex === question.answer
                          const choiceObj = typeof choice === 'string' ? { text: choice } : choice
                          
                          return (
                            <div
                              key={choiceIndex}
                              className={`p-2 rounded ${
                                isCorrectAnswer
                                  ? 'bg-green-200 font-semibold'
                                  : isUserAnswer && !isCorrect
                                  ? 'bg-red-200'
                                  : 'bg-gray-100'
                              }`}
                            >
                              <span className="font-medium mr-2">
                                {String.fromCharCode(65 + choiceIndex)}.
                              </span>
                              <RichContent text={choiceObj.text} eq={choiceObj.eq} image={choiceObj.image} />
                              {isCorrectAnswer && (
                                <span className="ml-2 text-green-700">(Đáp án đúng)</span>
                              )}
                              {isUserAnswer && !isCorrect && (
                                <span className="ml-2 text-red-700">(Bạn chọn)</span>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <p className="mb-3 text-sm text-indigo-700">
                        Câu hỏi này không được chấm tự động. Hãy đối chiếu với lời giải hoặc nhờ giáo viên chấm.
                      </p>
                    )}
                    {(question.explain || question.explainEq || question.explainImage) && (
                      <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                        <div className="text-sm text-gray-700">
                          <strong>Giải thích:</strong>
                          <RichContent 
                            text={question.explain}
                            eq={question.explainEq}
                            image={question.explainImage}
                            className="mt-1"
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
          <div className="flex gap-4 justify-center">
            <Link
              to={`/quiz/${quiz.id}`}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Làm lại bài
            </Link>
            <Link
              to={`/subject/${encodeURIComponent(quiz.subject)}`}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Về danh sách bài tập
            </Link>
            <Link
              to="/subjects"
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Chọn môn khác
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Result

