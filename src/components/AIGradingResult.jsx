import { useState } from 'react'
import { gradeEssayWithAI } from '../utils/aiGrading'

function AIGradingResult({ question, studentAnswer, correctAnswer, maxScore = 10 }) {
  const [grading, setGrading] = useState(false)
  const [result, setResult] = useState(null)

  const handleGrade = async () => {
    setGrading(true)
    try {
      const gradingResult = await gradeEssayWithAI(
        question,
        studentAnswer,
        correctAnswer,
        maxScore
      )
      setResult(gradingResult)
    } catch (error) {
      console.error('Grading error:', error)
      setResult({
        score: 0,
        feedback: 'Có lỗi xảy ra khi chấm điểm.',
        strengths: [],
        improvements: []
      })
    } finally {
      setGrading(false)
    }
  }

  if (!result) {
    return (
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border-2 border-purple-200">
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            🤖 Chấm điểm bằng AI
          </h3>
          <p className="text-gray-600 mb-4">
            AI sẽ đánh giá câu trả lời của bạn và đưa ra nhận xét chi tiết
          </p>
          <button
            onClick={handleGrade}
            disabled={grading}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {grading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang chấm điểm...
              </span>
            ) : (
              '🚀 Chấm điểm ngay'
            )}
          </button>
        </div>
      </div>
    )
  }

  const scorePercentage = (result.score / maxScore) * 100
  const scoreColor = scorePercentage >= 80 ? 'green' : scorePercentage >= 60 ? 'yellow' : scorePercentage >= 40 ? 'orange' : 'red'

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-purple-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Kết quả chấm điểm AI</h3>
              <p className="text-purple-100 text-sm">Đánh giá tự động bởi AI</p>
            </div>
          </div>
          <button
            onClick={handleGrade}
            disabled={grading}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm font-medium transition-colors"
          >
            🔄 Chấm lại
          </button>
        </div>
      </div>

      {/* Score */}
      <div className="bg-gradient-to-br from-gray-50 to-purple-50 p-6">
        <div className="flex items-center justify-center gap-8 mb-6">
          <div className="text-center">
            <div className={`text-6xl font-bold bg-gradient-to-r from-${scoreColor}-500 to-${scoreColor}-600 bg-clip-text text-transparent`}>
              {result.score}
            </div>
            <div className="text-gray-600 text-sm mt-1">/ {maxScore} điểm</div>
          </div>
          <div className="w-32 h-32">
            <svg className="transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="10"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke={`var(--${scoreColor}-500)`}
                strokeWidth="10"
                strokeDasharray={`${scorePercentage * 3.14} 314`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
          </div>
        </div>

        {/* Feedback */}
        <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <span>💬</span>
            Nhận xét chung
          </h4>
          <p className="text-gray-700 leading-relaxed">{result.feedback}</p>
        </div>

        {/* Strengths */}
        {result.strengths && result.strengths.length > 0 && (
          <div className="bg-green-50 rounded-lg p-4 mb-4 border border-green-200">
            <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
              <span>✅</span>
              Điểm mạnh
            </h4>
            <ul className="space-y-1">
              {result.strengths.map((strength, index) => (
                <li key={index} className="text-green-800 text-sm flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Improvements */}
        {result.improvements && result.improvements.length > 0 && (
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <h4 className="font-semibold text-orange-900 mb-2 flex items-center gap-2">
              <span>💡</span>
              Cần cải thiện
            </h4>
            <ul className="space-y-1">
              {result.improvements.map((improvement, index) => (
                <li key={index} className="text-orange-800 text-sm flex items-start gap-2">
                  <span className="text-orange-600 mt-0.5">•</span>
                  <span>{improvement}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default AIGradingResult
