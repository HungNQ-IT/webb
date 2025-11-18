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
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState(null)

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

  const handleAnswerChange = (passageId, questionIndex, itemIndex, value) => {
    const key = `${passageId}-${questionIndex}-${itemIndex}`
    setAnswers(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const calculateScore = () => {
    let totalQuestions = 0
    let correctAnswers = 0

    test.passages.forEach((passage) => {
      passage.questions.forEach((question, qIndex) => {
        if (question.type === 'table-completion' || question.type === 'note-completion') {
          // Đếm số ô trống trong bảng hoặc notes
          question.answers.forEach((answer, aIndex) => {
            totalQuestions++
            const key = `${passage.id}-${qIndex}-${aIndex}`
            const userAnswer = answers[key]?.trim().toLowerCase()
            const correctAnswer = answer.toLowerCase()
            if (userAnswer === correctAnswer) {
              correctAnswers++
            }
          })
        } else if (question.type === 'true-false-not-given') {
          question.items.forEach((item, iIndex) => {
            totalQuestions++
            const key = `${passage.id}-${qIndex}-${iIndex}`
            if (answers[key] === item.answer) {
              correctAnswers++
            }
          })
        } else if (question.type === 'matching-headings') {
          question.paragraphs.forEach((para, pIndex) => {
            totalQuestions++
            const key = `${passage.id}-${qIndex}-${pIndex}`
            if (parseInt(answers[key]) === para.correctHeading) {
              correctAnswers++
            }
          })
        } else if (question.type === 'matching-information') {
          question.items.forEach((item, iIndex) => {
            totalQuestions++
            const key = `${passage.id}-${qIndex}-${iIndex}`
            if (answers[key]?.toUpperCase() === item.answer) {
              correctAnswers++
            }
          })
        } else if (question.type === 'multiple-choice-two') {
          // Đếm số đáp án đúng được chọn
          let correctSelected = 0
          let incorrectSelected = 0
          question.options.forEach((option, oIndex) => {
            const key = `${passage.id}-${qIndex}-${oIndex}`
            const isSelected = answers[key] === true
            const isCorrect = question.correctAnswers.includes(oIndex)
            
            if (isSelected && isCorrect) {
              correctSelected++
            } else if (isSelected && !isCorrect) {
              incorrectSelected++
            }
          })
          totalQuestions += 2 // Câu hỏi này đáng 2 điểm
          correctAnswers += correctSelected
        } else if (question.type === 'summary-completion') {
          question.answers.forEach((answer, aIndex) => {
            totalQuestions++
            const key = `${passage.id}-${qIndex}-${aIndex}`
            const userAnswer = answers[key]?.trim().toLowerCase()
            const correctAnswer = answer.toLowerCase()
            if (userAnswer === correctAnswer) {
              correctAnswers++
            }
          })
        } else if (question.type === 'matching-statements') {
          question.statements.forEach((statement, sIndex) => {
            totalQuestions++
            const key = `${passage.id}-${qIndex}-${sIndex}`
            if (answers[key]?.toUpperCase() === statement.answer) {
              correctAnswers++
            }
          })
        }
      })
    })

    return { correctAnswers, totalQuestions }
  }

  const handleSubmit = () => {
    if (isSubmitted) return
    setIsSubmitted(true)
    
    const { correctAnswers, totalQuestions } = calculateScore()
    
    // Lưu kết quả vào localStorage
    const result = {
      testId: test.id,
      testTitle: test.title,
      score: correctAnswers,
      total: totalQuestions,
      answers: answers,
      passages: test.passages,
      submittedAt: new Date().toISOString()
    }
    
    localStorage.setItem(`ielts_result_${test.id}`, JSON.stringify(result))
    
    // Navigate to result page
    navigate(`/ielts-result/${test.id}`)
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
        <div className="grid lg:grid-cols-[2fr,2fr,1.5fr] gap-4">
          {/* Left: Passage */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 h-fit sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{passage.title}</h2>
            <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line leading-relaxed">
              {passage.text}
            </div>
          </div>

          {/* Middle: Questions */}
          <div className="space-y-6">
            {passage.questions.map((question, qIndex) => {
              // Calculate question number for ID
              let questionNum = 1
              for (let i = 0; i < currentPassage; i++) {
                test.passages[i].questions.forEach(q => {
                  if (q.type === 'note-completion' || q.type === 'table-completion' || q.type === 'summary-completion') {
                    questionNum += q.answers?.length || 0
                  } else if (q.type === 'true-false-not-given') {
                    questionNum += q.items?.length || 0
                  } else if (q.type === 'matching-headings') {
                    questionNum += q.paragraphs?.length || 0
                  } else if (q.type === 'matching-information') {
                    questionNum += q.items?.length || 0
                  } else if (q.type === 'multiple-choice-two') {
                    questionNum += 2
                  } else if (q.type === 'matching-statements') {
                    questionNum += q.statements?.length || 0
                  }
                })
              }
              
              return (
              <div key={qIndex} id={`question-${questionNum}`} className="bg-white rounded-lg border border-gray-200 p-6 scroll-mt-24">
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
                                      value={answers[`${passage.id}-${qIndex}-${rowIndex * question.table.headers.length + cellIndex}`] || ''}
                                      onChange={(e) => handleAnswerChange(passage.id, qIndex, rowIndex * question.table.headers.length + cellIndex, e.target.value)}
                                      disabled={isSubmitted}
                                      className="w-full px-2 py-1 border border-gray-300 rounded focus:border-blue-500 focus:outline-none disabled:bg-gray-100"
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

                {/* Note Completion */}
                {question.type === 'note-completion' && (
                  <div>
                    <div className="mb-4 text-sm text-gray-700">
                      {question.instruction}
                    </div>
                    <div className="border border-gray-300 rounded-lg p-6 bg-gray-50">
                      <h3 className="text-lg font-bold text-center mb-4">{question.notes.title}</h3>
                      {question.notes.sections.map((section, sIndex) => (
                        <div key={sIndex} className="mb-6 last:mb-0">
                          <h4 className="font-semibold text-sm mb-3">{section.heading}</h4>
                          <ul className="space-y-2 ml-4">
                            {section.items.map((item, iIndex) => {
                              // Tìm vị trí số trong item (ví dụ: "1______")
                              const match = item.match(/(\d+)______/)
                              if (match) {
                                const questionNum = parseInt(match[1])
                                const parts = item.split(/\d+______/)
                                return (
                                  <li key={iIndex} className="text-sm flex items-center gap-2">
                                    <span>•</span>
                                    <span>{parts[0]}</span>
                                    <input
                                      type="text"
                                      value={answers[`${passage.id}-${qIndex}-${questionNum - 1}`] || ''}
                                      onChange={(e) => handleAnswerChange(passage.id, qIndex, questionNum - 1, e.target.value)}
                                      disabled={isSubmitted}
                                      className="px-2 py-1 border border-gray-300 rounded focus:border-blue-500 focus:outline-none disabled:bg-gray-100 w-32"
                                      placeholder={`Answer ${questionNum}`}
                                    />
                                    <span>{parts[1]}</span>
                                  </li>
                                )
                              }
                              return (
                                <li key={iIndex} className="text-sm">
                                  <span>• {item}</span>
                                </li>
                              )
                            })}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Matching Information */}
                {question.type === 'matching-information' && (
                  <div>
                    <div className="mb-4 text-sm text-gray-700">
                      {question.instruction}
                    </div>
                    <div className="space-y-3">
                      {question.items.map((item, iIndex) => (
                        <div key={iIndex} className="border border-gray-200 rounded-lg p-4">
                          <div className="mb-3 text-sm text-gray-900 font-medium">
                            Question {iIndex + 14}: {item.question}
                          </div>
                          <input
                            type="text"
                            value={answers[`${passage.id}-${qIndex}-${iIndex}`] || ''}
                            onChange={(e) => handleAnswerChange(passage.id, qIndex, iIndex, e.target.value.toUpperCase())}
                            disabled={isSubmitted}
                            maxLength={1}
                            className="w-16 px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-center uppercase disabled:bg-gray-100"
                            placeholder="A-G"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Multiple Choice - Choose TWO */}
                {question.type === 'multiple-choice-two' && (
                  <div>
                    <div className="mb-4 text-sm text-gray-700">
                      {question.instruction}
                    </div>
                    <div className="space-y-2">
                      {question.options.map((option, oIndex) => (
                        <label key={oIndex} className="flex items-start gap-3 p-3 border-2 border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={answers[`${passage.id}-${qIndex}-${oIndex}`] === true}
                            onChange={(e) => handleAnswerChange(passage.id, qIndex, oIndex, e.target.checked)}
                            disabled={isSubmitted}
                            className="w-5 h-5 text-blue-600 rounded mt-0.5"
                          />
                          <span className="text-sm flex-1">
                            <span className="font-semibold">{String.fromCharCode(65 + oIndex)}</span> {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Summary Completion */}
                {question.type === 'summary-completion' && (
                  <div>
                    <div className="mb-4 text-sm text-gray-700">
                      {question.instruction}
                    </div>
                    <div className="border border-gray-300 rounded-lg p-6 bg-gray-50">
                      <h3 className="text-lg font-bold text-center mb-4">{question.summary.title}</h3>
                      <div className="text-sm leading-relaxed">
                        {question.summary.text.split(/(\d+______)/).map((part, pIndex) => {
                          const match = part.match(/(\d+)______/)
                          if (match) {
                            const questionNum = parseInt(match[1])
                            return (
                              <input
                                key={pIndex}
                                type="text"
                                value={answers[`${passage.id}-${qIndex}-${questionNum - 23}`] || ''}
                                onChange={(e) => handleAnswerChange(passage.id, qIndex, questionNum - 23, e.target.value)}
                                disabled={isSubmitted}
                                className="px-2 py-1 border border-gray-300 rounded focus:border-blue-500 focus:outline-none disabled:bg-gray-100 w-32 mx-1"
                                placeholder={`Q${questionNum}`}
                              />
                            )
                          }
                          return <span key={pIndex}>{part}</span>
                        })}
                      </div>
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
                                  name={`${passage.id}-q${qIndex}-${itemIndex}`}
                                  value={option}
                                  checked={answers[`${passage.id}-${qIndex}-${itemIndex}`] === option}
                                  onChange={(e) => handleAnswerChange(passage.id, qIndex, itemIndex, e.target.value)}
                                  disabled={isSubmitted}
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

                {/* Matching Statements with Researchers */}
                {question.type === 'matching-statements' && (
                  <div>
                    <div className="mb-4 text-sm text-gray-700">
                      {question.instruction}
                    </div>
                    <div className="mb-4 bg-gray-50 rounded-lg p-4">
                      <div className="font-semibold text-sm mb-2">List of Researchers:</div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {question.researchers.map((researcher, i) => (
                          <div key={i}>
                            <span className="font-semibold">{String.fromCharCode(65 + i)}</span> {researcher}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      {question.statements.map((statement, sIndex) => (
                        <div key={sIndex} className="border border-gray-200 rounded-lg p-4">
                          <div className="mb-3 text-sm text-gray-900">
                            <span className="font-semibold">Question {sIndex + 27}:</span> {statement.question}
                          </div>
                          <input
                            type="text"
                            value={answers[`${passage.id}-${qIndex}-${sIndex}`] || ''}
                            onChange={(e) => handleAnswerChange(passage.id, qIndex, sIndex, e.target.value.toUpperCase())}
                            disabled={isSubmitted}
                            maxLength={1}
                            className="w-16 px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-center uppercase disabled:bg-gray-100"
                            placeholder="A-F"
                          />
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
                          <select 
                            value={answers[`${passage.id}-${qIndex}-${paraIndex}`] || ''}
                            onChange={(e) => handleAnswerChange(passage.id, qIndex, paraIndex, e.target.value)}
                            disabled={isSubmitted}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm disabled:bg-gray-100"
                          >
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
              )
            })}

            {/* Submit Button */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <button
                onClick={handleSubmit}
                disabled={isSubmitted}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                NỘP BÀI
              </button>
            </div>
          </div>

          {/* Right Sidebar: Question Navigator */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-24">


              {test.passages.map((p, pIndex) => {
                // Đếm số câu hỏi trong passage này
                let questionCount = 0
                let startQuestion = 1
                
                // Tính số câu bắt đầu của passage này
                for (let i = 0; i < pIndex; i++) {
                  test.passages[i].questions.forEach(q => {
                    if (q.type === 'note-completion' || q.type === 'table-completion' || q.type === 'summary-completion') {
                      questionCount += q.answers?.length || 0
                    } else if (q.type === 'true-false-not-given') {
                      questionCount += q.items?.length || 0
                    } else if (q.type === 'matching-headings') {
                      questionCount += q.paragraphs?.length || 0
                    } else if (q.type === 'matching-information') {
                      questionCount += q.items?.length || 0
                    } else if (q.type === 'multiple-choice-two') {
                      questionCount += 2
                    } else if (q.type === 'matching-statements') {
                      questionCount += q.statements?.length || 0
                    }
                  })
                }
                startQuestion = questionCount + 1
                
                // Đếm câu hỏi trong passage hiện tại
                let currentPassageQuestions = []
                p.questions.forEach(q => {
                  if (q.type === 'note-completion' || q.type === 'table-completion' || q.type === 'summary-completion') {
                    const count = q.answers?.length || 0
                    for (let i = 0; i < count; i++) {
                      currentPassageQuestions.push(questionCount + 1)
                      questionCount++
                    }
                  } else if (q.type === 'true-false-not-given') {
                    const count = q.items?.length || 0
                    for (let i = 0; i < count; i++) {
                      currentPassageQuestions.push(questionCount + 1)
                      questionCount++
                    }
                  } else if (q.type === 'matching-headings') {
                    const count = q.paragraphs?.length || 0
                    for (let i = 0; i < count; i++) {
                      currentPassageQuestions.push(questionCount + 1)
                      questionCount++
                    }
                  } else if (q.type === 'matching-information') {
                    const count = q.items?.length || 0
                    for (let i = 0; i < count; i++) {
                      currentPassageQuestions.push(questionCount + 1)
                      questionCount++
                    }
                  } else if (q.type === 'multiple-choice-two') {
                    currentPassageQuestions.push(questionCount + 1)
                    currentPassageQuestions.push(questionCount + 2)
                    questionCount += 2
                  } else if (q.type === 'matching-statements') {
                    const count = q.statements?.length || 0
                    for (let i = 0; i < count; i++) {
                      currentPassageQuestions.push(questionCount + 1)
                      questionCount++
                    }
                  }
                })

                return (
                  <div key={p.id} className="mb-6 last:mb-0">
                    <h3 className="font-bold text-gray-900 mb-3">{p.title}</h3>
                    <div className="grid grid-cols-5 gap-2">
                      {currentPassageQuestions.map((qNum) => (
                        <button
                          key={qNum}
                          onClick={() => {
                            setCurrentPassage(pIndex)
                            setSelectedQuestion(qNum)
                            // Scroll to question
                            const questionElement = document.getElementById(`question-${qNum}`)
                            if (questionElement) {
                              questionElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
                            }
                          }}
                          className={`w-10 h-10 border-2 rounded flex items-center justify-center text-sm font-medium transition-colors ${
                            selectedQuestion === qNum
                              ? 'border-blue-500 bg-blue-500 text-white'
                              : 'border-gray-300 text-gray-700 hover:border-gray-400'
                          }`}
                        >
                          {qNum}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IELTSQuiz
