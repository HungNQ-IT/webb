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
    // Nếu là IELTS hoặc Ngoại ngữ, lấy từ ieltsTests
    if (decodedSubject === 'IELTS' || decodedSubject === 'Ngoại ngữ') {
      let filtered = ieltsTests.filter(q => q.subject === decodedSubject)
      if (decodedCategory) {
        filtered = filtered.filter(q => q.category === decodedCategory)
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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12 animate-fade-in">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-12">
            <button
              onClick={() => window.history.back()}
              className="group flex items-center gap-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors mb-6 font-medium"
            >
              <div className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm group-hover:shadow-md transition-all border border-gray-100 dark:border-slate-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
              <span>Quay lại</span>
            </button>

            <div className="relative">
              <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-4">
                {decodedSubject}
              </h1>
              <div className="h-1.5 w-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4"></div>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
                {grade && <span className="font-semibold text-gray-800 dark:text-white mr-2">Lớp {grade}</span>}
                {decodedCategory
                  ? `Chuyên đề ${decodedCategory}`
                  : `Tổng hợp các bài kiểm tra và luyện tập`
                }
              </p>
            </div>
          </div>

          {/* Grid Layout - Unified for all types */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {subjectQuizzes.map((quiz, index) => {
              const sections = Array.isArray(quiz.sections) ? quiz.sections.length : (quiz.sections || 3)
              const questionCount = quiz.questions?.length || quiz.passages?.length || 0

              // Difficulty Styling
              const difficultyColors = {
                easy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800',
                medium: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800',
                hard: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800'
              }
              const diffColor = difficultyColors[quiz.difficulty] || difficultyColors.medium
              const diffLabel = quiz.difficulty === 'easy' ? 'Dễ' : quiz.difficulty === 'hard' ? 'Khó' : 'Trung bình'

              // Card Gradient Accent (Randomized slightly based on index for variety)
              const gradients = [
                'from-blue-500 to-cyan-500',
                'from-purple-500 to-pink-500',
                'from-indigo-500 to-purple-500',
                'from-emerald-500 to-teal-500'
              ]
              const accentGradient = gradients[index % gradients.length]

              return (
                <div
                  key={quiz.id}
                  className="group bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden transition-all duration-300 hover:-translate-y-1 relative flex flex-col"
                >
                  {/* Accent Line */}
                  <div className={`h-1.5 w-full bg-gradient-to-r ${accentGradient}`}></div>

                  <div className="p-6 flex-1 flex flex-col">
                    {/* Header: Badge & Title */}
                    <div className="flex items-start justify-between mb-4 gap-4">
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${diffColor}`}>
                        {diffLabel}
                      </div>

                      {/* Audio Indicator */}
                      {decodedCategory === 'Listening' && (
                        <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md ${audioUrls[quiz.id] ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>
                          {audioUrls[quiz.id] ? (
                            <>
                              <span>🎧</span> Audio
                            </>
                          ) : (
                            <>
                              <span>🔇</span> No Audio
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {quiz.title}
                    </h3>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 line-clamp-2 flex-1">
                      {quiz.description || 'Bài kiểm tra kiến thức tổng hợp.'}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-slate-700">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5" title="Số lượng câu hỏi">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span>{questionCount} câu</span>
                        </div>
                        {quiz.timeLimit && (
                          <div className="flex items-center gap-1.5" title="Thời gian làm bài">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{quiz.timeLimit}p</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Button (Visible on Hover/Always on Mobile) */}
                    <button
                      onClick={() => {
                        // Logic chọn bài giống cũ
                        if (decodedCategory) {
                          setSelectedQuiz(quiz)
                          setCustomTimeLimit('')
                          setShowModal(true)
                        } else {
                          // Logic cho môn thường (không cần modal chọn passage)
                          setSelectedQuiz(quiz)
                          // Với bài thường có thể vào thẳng hoặc mở modal confirm. 
                          // Giữ nguyên logic cũ là: IELTS/Category -> Modal, Thường -> Link trực tiếp
                          // Nhưng để thống nhất UI, ta có thể dùng Modal cho tất cả hoặc chỉ Category.
                          // Code cũ: Category -> Modal, Thường -> Link trực tiếp.
                          // Hãy thống nhất dùng Link trực tiếp cho bài thường để nhanh, hoặc Modal nếu muốn chọn time.
                          // Để đẹp và nhất quán, ta dùng navigate luôn cho bài thường, hoặc mở modal nếu muốn tính năng custom time.
                          // Ở đây tôi sẽ dùng navigate luôn cho bài thường như cũ để đỡ phức tạp, 
                          // nhưng nếu cần custom time thì nên dùng modal.
                          // Code cũ bài thường dùng <Link>. Code mới dùng button này.
                          navigate(`/quiz/${quiz.id}`)
                        }
                      }}
                      className="mt-4 w-full bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white font-semibold py-3 rounded-xl border border-gray-200 dark:border-slate-600 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 hover:border-transparent transition-all duration-200 flex items-center justify-center gap-2 group-hover:shadow-lg"
                    >
                      <span>Làm bài ngay</span>
                      <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>

                    {/* Admin: Edit Audio Button */}
                    {isAdmin && decodedCategory === 'Listening' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAddAudio(quiz.id)
                        }}
                        className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-full text-purple-600 hover:text-purple-700 shadow-sm border border-purple-100 dark:border-purple-900/30 transition-all opacity-0 group-hover:opacity-100"
                        title="Quản lý Audio"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Empty State */}
          {subjectQuizzes.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-24 h-24 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Chưa có bài tập nào</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md">
                Hiện tại chưa có bài tập nào cho mục này. Vui lòng quay lại sau hoặc chọn môn học khác.
              </p>
              <button
                onClick={() => window.history.back()}
                className="mt-8 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Quay lại
              </button>
            </div>
          )}

          {/* Modal thêm/sửa audio (Admin only) - KEEP EXISTING LOGIC */}
          {showAudioModal && editingAudio.testId && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full border border-gray-100 dark:border-slate-700">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      🎧 Quản lý Audio #{editingAudio.testId}
                    </h2>
                    <button
                      onClick={() => {
                        setShowAudioModal(false)
                        setEditingAudio({ testId: null, url: '' })
                      }}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl">
                    <p className="text-sm text-blue-800 dark:text-blue-300 font-medium mb-2">
                      Hướng dẫn nhanh:
                    </p>
                    <ol className="text-sm text-blue-700 dark:text-blue-400 space-y-1 ml-4 list-decimal">
                      <li>Upload file lên Google Drive, bật chia sẻ "Bất kỳ ai có link".</li>
                      <li>Copy link và dán vào ô dưới đây.</li>
                      <li>Hệ thống tự động chuyển đổi sang link trực tiếp.</li>
                    </ol>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Google Drive Link
                      </label>
                      <input
                        type="text"
                        value={editingAudio.url}
                        onChange={(e) => setEditingAudio(prev => ({ ...prev, url: e.target.value }))}
                        placeholder="https://drive.google.com/file/d/..."
                        className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 outline-none transition-all"
                      />
                    </div>

                    {editingAudio.url && (
                      <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl border border-gray-100 dark:border-slate-700">
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                          Preview Audio
                        </label>
                        <audio
                          controls
                          src={convertGoogleDriveLink(editingAudio.url)}
                          className="w-full"
                          onError={() => alert('Lỗi tải audio! Kiểm tra lại link.')}
                        />
                        <p className="text-xs text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          Link hợp lệ
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 mt-8">
                    <button
                      onClick={() => {
                        setShowAudioModal(false)
                        setEditingAudio({ testId: null, url: '' })
                      }}
                      className="flex-1 px-4 py-3 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors font-medium"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      onClick={handleSaveAudio}
                      disabled={loading || !editingAudio.url.trim()}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Đang xử lý...' : 'Lưu thay đổi'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal chọn phần thi (Generic Modal) */}
          {showModal && selectedQuiz && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
              <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-gray-100 dark:border-slate-700">
                <div className="p-6 md:p-8">
                  {/* Header */}
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Sẵn sàng làm bài?
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 font-medium">
                      {selectedQuiz.title}
                    </p>
                  </div>

                  {/* Options */}
                  <div className="space-y-6">
                    {/* Time Selector */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Thời gian làm bài
                      </label>
                      <select
                        value={customTimeLimit}
                        onChange={(e) => setCustomTimeLimit(e.target.value)}
                        className="w-full p-3 border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      >
                        <option value="">⏱️ Mặc định ({selectedQuiz?.timeLimit || 30} phút)</option>
                        <option value="30">30 phút</option>
                        <option value="45">45 phút</option>
                        <option value="60">60 phút</option>
                        <option value="infinity">∞ Không giới hạn</option>
                      </select>
                    </div>

                    {/* Phần thi Selector (Chỉ hiển thị nếu có logic chọn phần) - Simplification: Mặc định chọn hết hoặc logic cũ */}
                    {decodedCategory && (
                      <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl border border-gray-100 dark:border-slate-700">
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                          Bài thi bao gồm:
                        </p>
                        <ul className="space-y-2">
                          <li className="flex items-center gap-2 text-sm font-medium text-gray-800 dark:text-white">
                            <span className="text-green-500">✓</span> Passage 1
                          </li>
                          <li className="flex items-center gap-2 text-sm font-medium text-gray-800 dark:text-white">
                            <span className="text-green-500">✓</span> Passage 2
                          </li>
                          <li className="flex items-center gap-2 text-sm font-medium text-gray-800 dark:text-white">
                            <span className="text-green-500">✓</span> Passage 3
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="grid grid-cols-2 gap-4 mt-8">
                    <button
                      onClick={() => setShowModal(false)}
                      className="px-6 py-3 border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 font-semibold transition-colors"
                    >
                      Để sau
                    </button>
                    <button
                      onClick={() => {
                        if (customTimeLimit) {
                          localStorage.setItem(`custom_time_${selectedQuiz.id}`, customTimeLimit)
                        } else {
                          localStorage.removeItem(`custom_time_${selectedQuiz.id}`)
                        }
                        setShowModal(false)

                        let route = `/quiz/${selectedQuiz.id}`
                        if (selectedQuiz.type === 'ielts-reading') {
                          route = `/ielts/${selectedQuiz.id}`
                        } else if (selectedQuiz.type === 'ielts-listening') {
                          route = `/ielts-listening/${selectedQuiz.id}`
                        }
                        navigate(route)
                      }}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/30 font-semibold transition-all hover:-translate-y-0.5"
                    >
                      Bắt đầu ngay
                    </button>
                  </div>
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

