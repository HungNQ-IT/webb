import { useParams, useNavigate, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

function IELTSResult() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [result, setResult] = useState(null)

  useEffect(() => {
    const savedResult = localStorage.getItem(`ielts_result_${id}`)
    if (savedResult) {
      setResult(JSON.parse(savedResult))
    } else {
      // Không có kết quả, quay về trang chủ
      navigate('/')
    }
  }, [id, navigate])

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Đang tải kết quả...</p>
      </div>
    )
  }

  const percentage = Math.round((result.score / result.total) * 100)
  const band = calculateBand(percentage)

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Hoàn thành!</h1>
            <p className="text-gray-600">{result.testTitle}</p>
          </div>

          {/* Score */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {result.score}/{result.total}
                </div>
                <div className="text-sm text-gray-600">Câu đúng</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {percentage}%
                </div>
                <div className="text-sm text-gray-600">Tỷ lệ chính xác</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  {band}
                </div>
                <div className="text-sm text-gray-600">IELTS Band (ước tính)</div>
              </div>
            </div>
          </div>

          {/* Detailed Results */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Chi tiết kết quả</h2>
            
            {result.passages.map((passage, pIndex) => (
              <div key={passage.id} className="mb-8 last:mb-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{passage.title}</h3>
                
                {passage.questions.map((question, qIndex) => (
                  <div key={qIndex} className="mb-6 pb-6 border-b border-gray-200 last:border-0">
                    <div className="text-sm font-medium text-gray-700 mb-3">
                      Question {qIndex + 1}: {question.type}
                    </div>

                    {/* Table Completion & Note Completion Results */}
                    {(question.type === 'table-completion' || question.type === 'note-completion') && (
                      <div className="space-y-2">
                        {question.answers.map((correctAnswer, aIndex) => {
                          const key = `${passage.id}-${qIndex}-${aIndex}`
                          const userAnswer = result.answers[key]?.trim() || ''
                          const isCorrect = userAnswer.toLowerCase() === correctAnswer.toLowerCase()
                          
                          return (
                            <div key={aIndex} className={`p-3 rounded-lg ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="text-sm">
                                    <span className="font-medium">Câu trả lời của bạn:</span> {userAnswer || '(Không trả lời)'}
                                  </div>
                                  {!isCorrect && (
                                    <div className="text-sm text-green-700 mt-1">
                                      <span className="font-medium">Đáp án đúng:</span> {correctAnswer}
                                    </div>
                                  )}
                                </div>
                                <div>
                                  {isCorrect ? (
                                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                    </svg>
                                  ) : (
                                    <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                                    </svg>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}

                    {/* True/False/Not Given Results */}
                    {question.type === 'true-false-not-given' && (
                      <div className="space-y-2">
                        {question.items.map((item, iIndex) => {
                          const key = `${passage.id}-${qIndex}-${iIndex}`
                          const userAnswer = result.answers[key]
                          const isCorrect = userAnswer === item.answer
                          
                          return (
                            <div key={iIndex} className={`p-3 rounded-lg ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                  <div className="text-sm mb-2">{item.question}</div>
                                  <div className="text-sm">
                                    <span className="font-medium">Bạn chọn:</span> {userAnswer || '(Không trả lời)'}
                                  </div>
                                  {!isCorrect && (
                                    <div className="text-sm text-green-700 mt-1">
                                      <span className="font-medium">Đáp án đúng:</span> {item.answer}
                                    </div>
                                  )}
                                </div>
                                <div>
                                  {isCorrect ? (
                                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                    </svg>
                                  ) : (
                                    <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                                    </svg>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}

                    {/* Matching Information Results */}
                    {question.type === 'matching-information' && (
                      <div className="space-y-2">
                        {question.items.map((item, iIndex) => {
                          const key = `${passage.id}-${qIndex}-${iIndex}`
                          const userAnswer = result.answers[key]?.toUpperCase()
                          const isCorrect = userAnswer === item.answer
                          
                          return (
                            <div key={iIndex} className={`p-3 rounded-lg ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                  <div className="text-sm mb-2">{item.question}</div>
                                  <div className="text-sm">
                                    <span className="font-medium">Bạn chọn:</span> {userAnswer || '(Không trả lời)'}
                                  </div>
                                  {!isCorrect && (
                                    <div className="text-sm text-green-700 mt-1">
                                      <span className="font-medium">Đáp án đúng:</span> {item.answer}
                                    </div>
                                  )}
                                </div>
                                <div>
                                  {isCorrect ? (
                                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                    </svg>
                                  ) : (
                                    <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                                    </svg>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}

                    {/* Multiple Choice Two Results */}
                    {question.type === 'multiple-choice-two' && (
                      <div className="space-y-2">
                        {question.options.map((option, oIndex) => {
                          const key = `${passage.id}-${qIndex}-${oIndex}`
                          const isSelected = result.answers[key] === true
                          const isCorrect = question.correctAnswers.includes(oIndex)
                          const shouldShow = isSelected || isCorrect
                          
                          if (!shouldShow) return null
                          
                          return (
                            <div key={oIndex} className={`p-3 rounded-lg ${isSelected && isCorrect ? 'bg-green-50' : isSelected ? 'bg-red-50' : 'bg-yellow-50'}`}>
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                  <div className="text-sm">
                                    <span className="font-semibold">{String.fromCharCode(65 + oIndex)}</span> {option}
                                  </div>
                                  {isSelected && !isCorrect && (
                                    <div className="text-sm text-red-700 mt-1">Bạn chọn sai</div>
                                  )}
                                  {!isSelected && isCorrect && (
                                    <div className="text-sm text-green-700 mt-1">Đáp án đúng (bạn không chọn)</div>
                                  )}
                                </div>
                                <div>
                                  {isSelected && isCorrect ? (
                                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                    </svg>
                                  ) : isSelected ? (
                                    <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                                    </svg>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}

                    {/* Summary Completion Results */}
                    {question.type === 'summary-completion' && (
                      <div className="space-y-2">
                        {question.answers.map((correctAnswer, aIndex) => {
                          const key = `${passage.id}-${qIndex}-${aIndex}`
                          const userAnswer = result.answers[key]?.trim() || ''
                          const isCorrect = userAnswer.toLowerCase() === correctAnswer.toLowerCase()
                          
                          return (
                            <div key={aIndex} className={`p-3 rounded-lg ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="text-sm">
                                    <span className="font-medium">Question {aIndex + 23}:</span> {userAnswer || '(Không trả lời)'}
                                  </div>
                                  {!isCorrect && (
                                    <div className="text-sm text-green-700 mt-1">
                                      <span className="font-medium">Đáp án đúng:</span> {correctAnswer}
                                    </div>
                                  )}
                                </div>
                                <div>
                                  {isCorrect ? (
                                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                    </svg>
                                  ) : (
                                    <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                                    </svg>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}

                    {/* Matching Headings Results */}
                    {question.type === 'matching-headings' && (
                      <div className="space-y-2">
                        {question.paragraphs.map((para, pIndex) => {
                          const key = `${passage.id}-${qIndex}-${pIndex}`
                          const userAnswer = parseInt(result.answers[key])
                          const isCorrect = userAnswer === para.correctHeading
                          
                          return (
                            <div key={pIndex} className={`p-3 rounded-lg ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                  <div className="text-sm mb-2">
                                    <span className="font-medium">Paragraph {para.paragraph}:</span>
                                  </div>
                                  <div className="text-sm">
                                    <span className="font-medium">Bạn chọn:</span> {!isNaN(userAnswer) ? question.headings[userAnswer] : '(Không trả lời)'}
                                  </div>
                                  {!isCorrect && (
                                    <div className="text-sm text-green-700 mt-1">
                                      <span className="font-medium">Đáp án đúng:</span> {question.headings[para.correctHeading]}
                                    </div>
                                  )}
                                </div>
                                <div>
                                  {isCorrect ? (
                                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                    </svg>
                                  ) : (
                                    <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                                    </svg>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Link
              to="/"
              className="flex-1 bg-gray-600 text-white py-3 rounded-xl font-medium text-center hover:bg-gray-700 transition-all"
            >
              Về trang chủ
            </Link>
            <Link
              to={`/ielts/${id}`}
              className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-medium text-center hover:bg-blue-700 transition-all"
            >
              Làm lại
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// Hàm ước tính IELTS band dựa trên % đúng
function calculateBand(percentage) {
  if (percentage >= 90) return '9.0'
  if (percentage >= 80) return '8.0-8.5'
  if (percentage >= 70) return '7.0-7.5'
  if (percentage >= 60) return '6.0-6.5'
  if (percentage >= 50) return '5.0-5.5'
  if (percentage >= 40) return '4.0-4.5'
  return '3.0-3.5'
}

export default IELTSResult
