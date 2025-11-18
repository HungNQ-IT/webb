import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

function IELTSQuiz({ ieltsTests }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const test = ieltsTests.find(t => t.id === parseInt(id))
  
  const [currentPassage, setCurrentPassage] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeRemaining, setTimeRemaining] = useState(null)
  const [highlightedText, setHighlightedText] = useState('')

  useEffect(() => {
    if (!test) return
    if (test.timeLimit) {
      setTimeRemaining(test.timeLimit * 60)
    }
  }, [test])

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

  const handleSubmit = () => {
    // TODO: Calculate score and navigate to result
    alert('Nộp bài thành công!')
    navigate('/')
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!test) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Không tìm thấy bài tập.</p>
      </div>
    )
  }

  const passage = test.passages[currentPassage]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{test.title}</h1>
              <div className="flex items-center gap-4 mt-1">
                <button className="text-sm text-blue-600 hover:underline">
                  Highlight nội dung ⓘ
                </button>
              </div>
            </div>
            {timeRemaining !== null && (
              <div className="text-right">
                <div className="text-sm text-gray-600">Thời gian còn lại:</div>
                <div className="text-2xl font-bold text-gray-900">{formatTime(timeRemaining)}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex gap-2">
            {test.passages.map((p, index) => (
              <button
                key={p.id}
                onClick={() => setCurrentPassage(index)}
                className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                  currentPassage === index
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {p.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: Passage */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 h-fit sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{passage.title}</h2>
            <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line leading-relaxed">
              {passage.text}
            </div>
          </div>

          {/* Right: Questions */}
          <div className="space-y-6">
            {passage.questions.map((question, qIndex) => (
              <div key={qIndex} className="bg-white rounded-lg border border-gray-200 p-6">
                {/* Table Completion */}
                {question.type === 'table-completion' && (
                  <div>
                    <div className="mb-4 text-sm text-gray-700">
                      {question.instruction}
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-50">
                            {question.table.headers.map((header, i) => (
                              <th key={i} className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {question.table.rows.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                              {row.map((cell, cellIndex) => (
                                <td key={cellIndex} className="border border-gray-300 px-3 py-2 text-sm">
                                  {cell.includes('______') ? (
                                    <input
                                      type="text"
                                      className="w-full px-2 py-1 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                                      placeholder="Your answer"
                                    />
                                  ) : (
                                    cell
                                  )}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* True/False/Not Given */}
                {question.type === 'true-false-not-given' && (
                  <div>
                    <div className="mb-4 text-sm text-gray-700">
                      {question.instruction}
                    </div>
                    <div className="space-y-4">
                      {question.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="border border-gray-200 rounded-lg p-4">
                          <div className="mb-3 text-sm text-gray-900">{item.question}</div>
                          <div className="flex gap-3">
                            {['TRUE', 'FALSE', 'NOT GIVEN'].map((option) => (
                              <label key={option} className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  name={`q${qIndex}-${itemIndex}`}
                                  value={option}
                                  className="w-4 h-4 text-blue-600"
                                />
                                <span className="text-sm">{option}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Matching Headings */}
                {question.type === 'matching-headings' && (
                  <div>
                    <div className="mb-4 text-sm text-gray-700">
                      {question.instruction}
                    </div>
                    <div className="mb-4 bg-gray-50 rounded-lg p-4">
                      <div className="font-semibold text-sm mb-2">List of Headings:</div>
                      <ol className="list-decimal list-inside space-y-1 text-sm">
                        {question.headings.map((heading, i) => (
                          <li key={i}>{heading}</li>
                        ))}
                      </ol>
                    </div>
                    <div className="space-y-3">
                      {question.paragraphs.map((para, paraIndex) => (
                        <div key={paraIndex} className="flex items-center gap-3">
                          <span className="font-semibold text-sm">Paragraph {para.paragraph}:</span>
                          <select className="flex-1 px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm">
                            <option value="">-- Select heading --</option>
                            {question.headings.map((heading, i) => (
                              <option key={i} value={i}>{i + 1}. {heading}</option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Submit Button */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <button
                onClick={handleSubmit}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
              >
                NỘP BÀI
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IELTSQuiz
