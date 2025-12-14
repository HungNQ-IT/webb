import { useState } from 'react'
import RichContent from './RichContent'

function EssayQuestion({ question, questionIndex, answer, onAnswerChange, isSubmitted }) {
  const [charCount, setCharCount] = useState(answer?.length || 0)
  const minChars = 10 // Giảm xuống 10 để linh hoạt hơn
  const recommendedChars = 100 // Giảm xuống 100

  const handleChange = (e) => {
    const value = e.target.value
    setCharCount(value.length)
    onAnswerChange(questionIndex, value)
  }

  const getCharCountColor = () => {
    if (charCount < minChars) return 'text-red-600'
    if (charCount < recommendedChars) return 'text-yellow-600'
    return 'text-green-600'
  }

  const getProgressWidth = () => {
    return Math.min((charCount / recommendedChars) * 100, 100)
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
      {/* Question */}
      <div className="mb-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
            <span className="text-purple-600 dark:text-purple-400 font-bold text-sm">{questionIndex + 1}</span>
          </div>
          <div className="flex-1">
            <RichContent 
              text={question.q}
              eq={question.eq}
              image={question.image}
              className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2"
            />
            {question.maxScore && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
                📝 {question.maxScore} điểm
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Answer Textarea */}
      <div className="mb-4">
        <textarea
          value={answer || ''}
          onChange={handleChange}
          disabled={isSubmitted}
          placeholder="Nhập câu trả lời của bạn... (Trả lời ngắn gọn, đúng trọng tâm)"
          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-lg focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none disabled:bg-gray-100 dark:disabled:bg-slate-600 disabled:cursor-not-allowed resize-none"
          rows="8"
        />
        
        {/* Character Count & Progress */}
        <div className="mt-2">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className={`font-medium ${getCharCountColor()}`}>
              {charCount} / {recommendedChars} ký tự
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              {charCount < minChars && `Cần thêm ${minChars - charCount} ký tự`}
              {charCount >= minChars && charCount < recommendedChars && '✓ Đủ tối thiểu'}
              {charCount >= recommendedChars && '✓ Tốt'}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                charCount < minChars ? 'bg-red-500' :
                charCount < recommendedChars ? 'bg-yellow-500' :
                'bg-green-500'
              }`}
              style={{ width: `${getProgressWidth()}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tips */}
      {!isSubmitted && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
            </svg>
            <div className="flex-1">
              <p className="text-sm text-blue-800 dark:text-blue-300 font-medium mb-1">💡 Gợi ý:</p>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Trả lời đúng trọng tâm câu hỏi</li>
                <li>• Nếu đề hỏi "Tìm x" → Chỉ cần ghi kết quả</li>
                <li>• Nếu đề hỏi "Giải thích" → Cần trình bày chi tiết</li>
                <li>• Viết ngắn gọn nhưng đầy đủ ý</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Rubric (after submit) */}
      {isSubmitted && question.rubric && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mt-4">
          <h4 className="font-semibold text-green-900 dark:text-green-300 mb-2 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            Gợi ý chấm điểm
          </h4>
          <p className="text-green-800 dark:text-green-300 text-sm whitespace-pre-wrap">{question.rubric}</p>
        </div>
      )}
    </div>
  )
}

export default EssayQuestion
