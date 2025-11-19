import { Link, useParams, useNavigate } from 'react-router-dom'
import { useMemo, useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../utils/supabase'

function QuizList({ quizzes, ieltsTests = [] }) {
  const { subject, grade, category } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const decodedSubject = decodeURIComponent(subject)
  const decodedCategory = category ? decodeURIComponent(category) : null
  const [selectedQuiz, setSelectedQuiz] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showAudioModal, setShowAudioModal] = useState(false)
  const [audioUrls, setAudioUrls] = useState({})
  const [editingAudio, setEditingAudio] = useState({ testId: null, url: '' })
  const [loading, setLoading] = useState(false)
  const [customTimeLimit, setCustomTimeLimit] = useState('')

  const isAdmin = user?.role === 'admin'

  // Load audio URLs từ Supabase
  useEffect(() => {
    const loadAudioUrls = async () => {
      const { data, error } = await supabase
        .from('ielts_audio')
        .select('test_id, audio_url')
      
      if (!error && data) {
        const urlMap = {}
        data.forEach(item => {
          urlMap[item.test_id] = item.audio_url
        })
        setAudioUrls(urlMap)
      }
    }
    
    if (decodedCategory === 'Listening') {
      loadAudioUrls()
    }
  }, [decodedCategory])

  const handleAddAudio = (testId) => {
    setEditingAudio({ testId, url: audioUrls[testId] || '' })
    setShowAudioModal(true)
  }

  const convertGoogleDriveLink = (link) => {
    const match = link.match(/\/d\/([a-zA-Z0-9_-]+)/)
    if (match) {
      return `https://drive.google.com/uc?export=download&id=${match[1]}`
    }
    return link
  }

  const handleSaveAudio = async () => {
    if (!editingAudio.url.trim()) {
      alert('Vui lòng nhập link audio')
      return
    }

    setLoading(true)
    const directUrl = convertGoogleDriveLink(editingAudio.url)

    try {
      // Kiểm tra xem đã có audio chưa
      const { data: existing } = await supabase
        .from('ielts_audio')
        .select('id')
        .eq('test_id', editingAudio.testId)
        .single()

      if (existing) {
        // Update
        const { error } = await supabase
          .from('ielts_audio')
          .update({ 
            audio_url: directUrl,
            updated_at: new Date().toISOString()
          })
          .eq('test_id', editingAudio.testId)

        if (error) throw error
      } else {
        // Insert
        const { error } = await supabase
          .from('ielts_audio')
          .insert({
            test_id: editingAudio.testId,
            audio_url: directUrl,
            uploaded_by: user.id
          })

        if (error) throw error
      }

      // Cập nhật state local
      setAudioUrls(prev => ({
        ...prev,
        [editingAudio.testId]: directUrl
      }))

      alert('✅ Đã lưu audio thành công!')
      setShowAudioModal(false)
      setEditingAudio({ testId: null, url: '' })
    } catch (error) {
      console.error('Error saving audio:', error)
      alert('❌ Lỗi khi lưu audio: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const subjectQuizzes = useMemo(() => {
    console.log('DEBUG - decodedSubject:', decodedSubject)
    console.log('DEBUG - decodedCategory:', decodedCategory)
    console.log('DEBUG - ieltsTests:', ieltsTests)
    console.log('DEBUG - quizzes:', quizzes)
    
    // Nếu là IELTS hoặc Ngoại ngữ, lấy từ ieltsTests
    if (decodedSubject === 'IELTS' || decodedSubject === 'Ngoại ngữ') {
      let filtered = ieltsTests.filter(q => q.subject === decodedSubject)
      console.log('DEBUG - After subject filter:', filtered)
      if (decodedCategory) {
        filtered = filtered.filter(q => q.category === decodedCategory)
        console.log('DEBUG - After category filter:', filtered)
      }
      return filtered
    }
    
    // Các môn khác lấy từ quizzes
    let filtered = quizzes.filter(q => q.subject === decodedSubject)
    
    if (grade) {
      filtered = filtered.filter(q => q.grade === parseInt(grade))
    }
    
    if (decodedCategory) {
      filtered = filtered.filter(q => q.category === decodedCategory)
    }
    
    return filtered
  }, [quizzes, ieltsTests, decodedSubject, grade, decodedCategory])

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <button
              onClick={() => window.history.back()}
              className="text-gray-600 hover:text-gray-800 font-medium flex items-center gap-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Quay lại
            </button>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {decodedSubject} {grade && `- Lớp ${grade}`} {decodedCategory && `- ${decodedCategory}`}
            </h1>
            <p className="text-gray-600">
              {decodedCategory 
                ? `Luyện tập ${decodedCategory} - ${decodedSubject}`
                : `Kiểm tra kiến thức về ${decodedSubject.toLowerCase()}`
              }
            </p>
          </div>

          {/* Layout khác nhau cho IELTS/Ngoại ngữ vs các môn khác */}
          {decodedCategory ? (
            // Layout mới cho IELTS và Ngoại ngữ (có category)
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {subjectQuizzes.map((quiz) => {
                const sections = Array.isArray(quiz.sections) ? quiz.sections.length : (quiz.sections || 3)
                
                return (
                  <div
                    key={quiz.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all relative"
                  >
                    {/* Admin: Nút thêm audio */}
                    {isAdmin && decodedCategory === 'Listening' && (
                      <button
                        onClick={() => handleAddAudio(quiz.id)}
                        className="absolute top-3 right-3 w-8 h-8 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center transition-colors shadow-md"
                        title="Thêm/Sửa audio"
                      >
                        {audioUrls[quiz.id] ? '✏️' : '+'}
                      </button>
                    )}

                    <div className="mb-4">
                      <div className="flex items-start gap-2 mb-3">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                          </svg>
                        </div>
                        <h3 className="font-bold text-gray-900 text-base leading-tight pr-8">
                          {quiz.title}
                        </h3>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600 mb-3">
                        {/* Hiển thị trạng thái audio cho Listening */}
                        {decodedCategory === 'Listening' && (
                          <div className="flex items-center gap-1.5">
                            {audioUrls[quiz.id] ? (
                              <>
                                <span className="text-green-600">🎧</span>
                                <span className="text-green-600 font-medium">Có audio</span>
                              </>
                            ) : (
                              <>
                                <span className="text-red-600">🔇</span>
                                <span className="text-red-600">Chưa có audio</span>
                              </>
                            )}
                          </div>
                        )}
                        {quiz.timeLimit && (
                          <div className="flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            <span>{quiz.timeLimit} phút</span>
                          </div>
                        )}
                        <div className="text-gray-700">
                          {sections} phần thi | {quiz.questions?.length || quiz.passages?.length || 0} câu hỏi
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        setSelectedQuiz(quiz)
                        setCustomTimeLimit('') // Reset thời gian khi mở modal
                        setShowModal(true)
                      }}
                      className="block w-full text-center bg-white border-2 border-blue-600 text-blue-600 px-4 py-2.5 rounded-lg font-medium hover:bg-blue-50 transition-all"
                    >
                      Làm bài
                    </button>
                  </div>
                )
              })}
            </div>
          ) : (
            // Layout cũ cho các môn học thông thường
            <div className="grid md:grid-cols-2 gap-6">
              {subjectQuizzes.map((quiz, index) => {
                // Màu và badge dựa theo difficulty trong JSON
                const difficultyConfig = {
                easy: {
                  color: 'from-green-500 to-green-600',
                  badge: { text: 'Dễ', color: 'bg-green-500' }
                },
                medium: {
                  color: 'from-orange-500 to-orange-600',
                  badge: { text: 'Trung bình', color: 'bg-orange-500' }
                },
                hard: {
                  color: 'from-red-500 to-red-600',
                  badge: { text: 'Khó', color: 'bg-red-500' }
                  }
                }
                
                // Nếu không có difficulty, dùng màu mặc định theo thứ tự
                const defaultColors = [
                'from-orange-500 to-orange-600',
                'from-green-500 to-green-600',
                'from-blue-500 to-blue-600',
                  'from-purple-500 to-purple-600'
                ]
                
                const config = quiz.difficulty 
                  ? difficultyConfig[quiz.difficulty] 
                  : { 
                      color: defaultColors[index % defaultColors.length],
                      badge: null
                    }
                
                const colorClass = config.color
                const badge = config.badge
                
                return (
                <div
                  key={quiz.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all"
                >
                  <div className={`bg-gradient-to-r ${colorClass} p-6 text-white`}>
                    <div className="flex items-start justify-between mb-3">
                      <h2 className="text-xl font-bold flex-1">
                        {quiz.title}
                      </h2>
                      {badge && (
                        <span className={`${badge.color} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
                          {badge.text}
                        </span>
                      )}
                    </div>
                    <p className="text-white/90 text-sm">
                      {quiz.description || 'Kiểm tra kiến thức về phương trình bậc hai và công thức nghiệm'}
                    </p>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                        <span>{quiz.questions.length} câu</span>
                      </div>
                      {quiz.timeLimit && (
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                          <span>{quiz.timeLimit} phút</span>
                        </div>
                      )}
                    </div>
                    <Link
                      to={`/quiz/${quiz.id}`}
                      className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-all"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                      Bắt đầu làm bài
                    </Link>
                  </div>
                </div>
                )
              })}
            </div>
          )}

          {subjectQuizzes.length === 0 && (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <p className="text-gray-600">Chưa có bài tập nào cho môn học này.</p>
            </div>
          )}

          {/* Modal thêm/sửa audio (Admin only) */}
          {showAudioModal && editingAudio.testId && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      🎧 Thêm Audio cho bài #{editingAudio.testId}
                    </h2>
                    <button
                      onClick={() => {
                        setShowAudioModal(false)
                        setEditingAudio({ testId: null, url: '' })
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>

                  <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>📖 Hướng dẫn:</strong>
                    </p>
                    <ol className="text-sm text-blue-700 mt-2 space-y-1 ml-4 list-decimal">
                      <li>Upload file audio lên Google Drive</li>
                      <li>Click chuột phải → Chia sẻ → "Bất kỳ ai có link đều có thể xem"</li>
                      <li>Copy link và paste vào ô bên dưới</li>
                    </ol>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Google Drive Link
                    </label>
                    <input
                      type="text"
                      value={editingAudio.url}
                      onChange={(e) => setEditingAudio(prev => ({ ...prev, url: e.target.value }))}
                      placeholder="https://drive.google.com/file/d/FILE_ID/view"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  {editingAudio.url && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Direct Link (Tự động chuyển đổi)
                      </label>
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <code className="text-xs text-green-800 break-all">
                          {convertGoogleDriveLink(editingAudio.url)}
                        </code>
                      </div>
                    </div>
                  )}

                  {editingAudio.url && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Test Audio
                      </label>
                      <audio
                        controls
                        src={convertGoogleDriveLink(editingAudio.url)}
                        className="w-full"
                        onError={() => {
                          alert('Không thể tải audio. Kiểm tra:\n1. Link có đúng?\n2. File có quyền "Anyone with the link can view"?')
                        }}
                      >
                        Trình duyệt không hỗ trợ audio player.
                      </audio>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowAudioModal(false)
                        setEditingAudio({ testId: null, url: '' })
                      }}
                      className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleSaveAudio}
                      disabled={loading || !editingAudio.url.trim()}
                      className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Đang lưu...' : '💾 Lưu Audio'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal chọn phần thi */}
          {showModal && selectedQuiz && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-8">
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {selectedQuiz.title}
                      </h2>
                      <div className="flex items-center gap-4 text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                          <span>{selectedQuiz.timeLimit} phút</span>
                        </div>
                        <span>
                          {Array.isArray(selectedQuiz.sections) ? selectedQuiz.sections.length : (selectedQuiz.sections || 3)} phần thi | {selectedQuiz.questions?.length || selectedQuiz.passages?.length || 0} câu hỏi
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>

                  {/* Chọn phần thi */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                      Chọn phần thi bạn muốn làm
                    </h3>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-5 h-5 text-blue-600 rounded"
                        />
                        <span className="text-gray-900">
                          Passage 1 ({selectedQuiz.passages?.[0]?.questions?.length || Math.ceil((selectedQuiz.questions?.length || 0) / 3)} câu hỏi)
                        </span>
                      </label>
                      <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-5 h-5 text-blue-600 rounded"
                        />
                        <span className="text-gray-900">
                          Passage 2 ({selectedQuiz.passages?.[1]?.questions?.length || Math.ceil((selectedQuiz.questions?.length || 0) / 3)} câu hỏi)
                        </span>
                      </label>
                      <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-5 h-5 text-blue-600 rounded"
                        />
                        <span className="text-gray-900">
                          Passage 3 ({selectedQuiz.passages?.[2]?.questions?.length || Math.ceil((selectedQuiz.questions?.length || 0) / 3)} câu hỏi)
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Giới hạn thời gian */}
                  <div className="mb-8">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                      Giới hạn thời gian
                    </h3>
                    <select 
                      value={customTimeLimit}
                      onChange={(e) => setCustomTimeLimit(e.target.value)}
                      className="w-full p-3 border-2 border-gray-200 rounded-lg text-gray-600 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">Dùng thời gian mặc định ({selectedQuiz?.timeLimit || 30} phút)</option>
                      <option value="30">30 phút</option>
                      <option value="45">45 phút</option>
                      <option value="60">60 phút</option>
                      <option value="90">90 phút</option>
                      <option value="120">120 phút</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-2">
                      {customTimeLimit 
                        ? `Bạn đã chọn: ${customTimeLimit} phút` 
                        : `Thời gian mặc định: ${selectedQuiz?.timeLimit || 30} phút`
                      }
                    </p>
                  </div>

                  {/* Nút hành động */}
                  <button
                    onClick={() => {
                      // Lưu thời gian custom vào localStorage nếu có
                      if (customTimeLimit) {
                        localStorage.setItem(`custom_time_${selectedQuiz.id}`, customTimeLimit)
                      } else {
                        localStorage.removeItem(`custom_time_${selectedQuiz.id}`)
                      }
                      
                      setShowModal(false)
                      
                      // Phân loại route dựa theo type
                      let route = `/quiz/${selectedQuiz.id}`
                      if (selectedQuiz.type === 'ielts-reading') {
                        route = `/ielts/${selectedQuiz.id}`
                      } else if (selectedQuiz.type === 'ielts-listening') {
                        route = `/ielts-listening/${selectedQuiz.id}`
                      }
                      navigate(route)
                    }}
                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all"
                  >
                    LUYỆN TẬP
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default QuizList

