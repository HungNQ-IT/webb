import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../utils/supabase'
import AudioPlayer from './AudioPlayer'

function IELTSListening({ ieltsTests = [] }) {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [currentSection, setCurrentSection] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeRemaining, setTimeRemaining] = useState(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [audioUrl, setAudioUrl] = useState(null)
  const [loadingAudio, setLoadingAudio] = useState(true)
  
  // Tìm test
  const test = ieltsTests.find(t => t.id === parseInt(id))
  
  // Debug
  useEffect(() => {
    console.log('🎧 Listening Component Loaded')
    console.log('ID:', id)
    console.log('Tests available:', ieltsTests.length)
    console.log('Test found:', test ? 'YES' : 'NO')
    if (test) {
      console.log('Test:', test.title)
      console.log('Sections:', test.sections?.length || 0)
    }
  }, [id, ieltsTests, test])

  // Load audio
  useEffect(() => {
    if (!test) return
    
    const loadAudio = async () => {
      try {
        setLoadingAudio(true)
        const { data } = await supabase
          .from('ielts_audio')
          .select('audio_url')
          .eq('test_id', test.id)
          .single()
        
        setAudioUrl(data?.audio_url || test.audioUrl || null)
      } catch (err) {
        console.error('Audio error:', err)
        setAudioUrl(test.audioUrl || null)
      } finally {
        setLoadingAudio(false)
      }
    }
    
    loadAudio()
  }, [test])

  // Set timer
  useEffect(() => {
    if (!test || !test.timeLimit) return
    setTimeRemaining(test.timeLimit * 60)
  }, [test])

  // Countdown
  useEffect(() => {
    if (!timeRemaining || timeRemaining <= 0 || isSubmitted) return

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
  }, [timeRemaining, isSubmitted])

  const handleAnswerChange = (sectionId, questionIndex, itemIndex, value) => {
    const key = `${sectionId}-${questionIndex}-${itemIndex}`
    setAnswers(prev => ({ ...prev, [key]: value }))
  }

  const calculateScore = () => {
    if (!test?.sections) return { correctAnswers: 0, totalQuestions: 0 }

    let totalQuestions = 0
    let correctAnswers = 0

    test.sections.forEach((section) => {
      if (!section.questions) return
      
      section.questions.forEach((question, qIndex) => {
        if (question.type === 'form-completion' && question.form?.fields) {
          question.form.fields.forEach((field, fIndex) => {
            totalQuestions++
            const key = `${section.id}-${qIndex}-${fIndex}`
            const userAnswer = answers[key]?.trim().toLowerCase()
            const correctAnswer = field.answer?.toLowerCase()
            if (userAnswer === correctAnswer) correctAnswers++
          })
        } else if (question.type === 'multiple-choice' && question.items) {
          question.items.forEach((item, iIndex) => {
            totalQuestions++
            const key = `${section.id}-${qIndex}-${iIndex}`
            if (parseInt(answers[key]) === item.answer) correctAnswers++
          })
        } else if (question.type === 'note-completion' && question.answers) {
          question.answers.forEach((answer, aIndex) => {
            totalQuestions++
            const key = `${section.id}-${qIndex}-${aIndex}`
            const userAnswer = answers[key]?.trim().toLowerCase()
            const correctAnswer = answer?.toLowerCase()
            if (userAnswer === correctAnswer) correctAnswers++
          })
        } else if (question.type === 'matching' && question.items) {
          question.items.forEach((item, iIndex) => {
            totalQuestions++
            const key = `${section.id}-${qIndex}-${iIndex}`
            if (parseInt(answers[key]) === item.answer) correctAnswers++
          })
        }
      })
    })

    return { correctAnswers, totalQuestions }
  }

  const handleSubmit = () => {
    if (isSubmitted || !test) return
    
    setIsSubmitted(true)
    const { correctAnswers, totalQuestions } = calculateScore()
    
    const result = {
      testId: test.id,
      testTitle: test.title,
      score: correctAnswers,
      total: totalQuestions,
      answers: answers,
      sections: test.sections,
      submittedAt: new Date().toISOString()
    }
    
    localStorage.setItem(`ielts_listening_result_${test.id}`, JSON.stringify(result))
    navigate(`/ielts-result/${test.id}`)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Không tìm thấy test
  if (!test) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy bài test</h1>
          <p className="text-gray-600 mb-4">ID: {id}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            ← Quay lại
          </button>
        </div>
      </div>
    )
  }

  // Không có sections
  if (!test.sections || !Array.isArray(test.sections) || test.sections.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Bài test chưa có nội dung</h1>
          <p className="text-gray-600 mb-4">Vui lòng thêm sections cho bài test này</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            ← Quay lại
          </button>
        </div>
      </div>
    )
  }

  const section = test.sections[currentSection]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{test.title}</h1>
              <p className="text-sm text-gray-600">{test.description}</p>
            </div>
            {timeRemaining !== null && (
              <div className="text-right">
                <div className="text-sm text-gray-600">Thời gian còn lại</div>
                <div className="text-2xl font-bold text-blue-600">{formatTime(timeRemaining)}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto">
            {test.sections.map((s, index) => (
              <button
                key={s.id}
                onClick={() => setCurrentSection(index)}
                className={`px-6 py-3 font-medium border-b-2 whitespace-nowrap ${
                  currentSection === index
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {s.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Audio */}
          {loadingAudio ? (
            <div className="bg-white rounded-xl p-6 text-center">
              <p className="text-gray-600">⏳ Đang tải audio...</p>
            </div>
          ) : audioUrl ? (
            <AudioPlayer audioUrl={audioUrl} title={test.title} />
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <p className="text-yellow-800">⚠️ Bài này chưa có audio</p>
            </div>
          )}

          {/* Section Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h2 className="text-lg font-bold text-gray-900 mb-2">{section.title}</h2>
            <p className="text-sm text-gray-700">{section.instruction}</p>
          </div>

          {/* Questions */}
          <div className="space-y-6">
            {section.questions?.map((question, qIndex) => (
              <div key={qIndex} className="bg-white rounded-lg border p-6">
                {/* Form Completion */}
                {question.type === 'form-completion' && (
                  <div>
                    <div className="mb-4 text-sm text-gray-700 font-medium">
                      {question.instruction}
                    </div>
                    <div className="border rounded-lg p-6 bg-gray-50">
                      <h3 className="text-lg font-bold text-center mb-6">{question.form.title}</h3>
                      <div className="space-y-4">
                        {question.form.fields.map((field, fIndex) => (
                          <div key={fIndex} className="flex items-center gap-4">
                            <label className="w-1/3 text-sm font-medium">{field.label}:</label>
                            <input
                              type="text"
                              value={answers[`${section.id}-${qIndex}-${fIndex}`] || ''}
                              onChange={(e) => handleAnswerChange(section.id, qIndex, fIndex, e.target.value)}
                              disabled={isSubmitted}
                              className="flex-1 px-4 py-2 border rounded-lg focus:border-blue-500 focus:outline-none disabled:bg-gray-100"
                              placeholder="Your answer"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Multiple Choice */}
                {question.type === 'multiple-choice' && (
                  <div>
                    <div className="mb-4 text-sm text-gray-700 font-medium">
                      {question.instruction}
                    </div>
                    <div className="space-y-4">
                      {question.items.map((item, iIndex) => (
                        <div key={iIndex} className="border rounded-lg p-4">
                          <div className="mb-3 text-sm font-medium">
                            Question {iIndex + 1}: {item.question}
                          </div>
                          <div className="space-y-2">
                            {item.options.map((option, oIndex) => (
                              <label key={oIndex} className="flex items-center gap-3 p-3 border-2 rounded-lg hover:border-blue-300 cursor-pointer">
                                <input
                                  type="radio"
                                  name={`${section.id}-q${qIndex}-${iIndex}`}
                                  value={oIndex}
                                  checked={parseInt(answers[`${section.id}-${qIndex}-${iIndex}`]) === oIndex}
                                  onChange={(e) => handleAnswerChange(section.id, qIndex, iIndex, e.target.value)}
                                  disabled={isSubmitted}
                                  className="w-5 h-5"
                                />
                                <span className="text-sm flex-1">
                                  <span className="font-semibold">{String.fromCharCode(65 + oIndex)}.</span> {option}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Note Completion */}
                {question.type === 'note-completion' && (
                  <div>
                    <div className="mb-4 text-sm text-gray-700 font-medium">
                      {question.instruction}
                    </div>
                    <div className="border rounded-lg p-6 bg-gray-50">
                      <h3 className="text-lg font-bold mb-4">{question.notes.title}</h3>
                      <ul className="space-y-3">
                        {question.notes.items.map((item, iIndex) => {
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
                                  value={answers[`${section.id}-${qIndex}-${questionNum - 1}`] || ''}
                                  onChange={(e) => handleAnswerChange(section.id, qIndex, questionNum - 1, e.target.value)}
                                  disabled={isSubmitted}
                                  className="px-3 py-1.5 border rounded focus:border-blue-500 focus:outline-none disabled:bg-gray-100 w-40"
                                  placeholder={`Answer ${questionNum}`}
                                />
                                <span>{parts[1]}</span>
                              </li>
                            )
                          }
                          return <li key={iIndex} className="text-sm">• {item}</li>
                        })}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Matching */}
                {question.type === 'matching' && (
                  <div>
                    <div className="mb-4 text-sm text-gray-700 font-medium">
                      {question.instruction}
                    </div>
                    <div className="space-y-3">
                      {question.items.map((item, iIndex) => (
                        <div key={iIndex} className="border rounded-lg p-4">
                          <div className="mb-3 text-sm font-medium">{item.question}</div>
                          <div className="space-y-2">
                            {item.options.map((option, oIndex) => (
                              <label key={oIndex} className="flex items-center gap-3 p-3 border-2 rounded-lg hover:border-blue-300 cursor-pointer">
                                <input
                                  type="radio"
                                  name={`${section.id}-q${qIndex}-${iIndex}`}
                                  value={oIndex}
                                  checked={parseInt(answers[`${section.id}-${qIndex}-${iIndex}`]) === oIndex}
                                  onChange={(e) => handleAnswerChange(section.id, qIndex, iIndex, e.target.value)}
                                  disabled={isSubmitted}
                                  className="w-5 h-5"
                                />
                                <span className="text-sm flex-1">{option}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Submit */}
            <div className="bg-white rounded-lg border p-6">
              <button
                onClick={handleSubmit}
                disabled={isSubmitted}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitted ? '✓ ĐÃ NỘP BÀI' : 'NỘP BÀI'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IELTSListening
