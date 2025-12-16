import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../utils/supabase'
import { useAuth } from '../context/AuthContext'
import RichContent from './RichContent'

function AdminDashboard({ quizzes = [] }) {
  const { user } = useAuth()
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [newSubmissionNotification, setNewSubmissionNotification] = useState(null)

  useEffect(() => {
    let isMounted = true
    setLoading(true)

    // Hàm format submissions
    const formatSubmissions = (data) => {
      return data.map((sub) => {
        const userInfo = sub.details?.userInfo || {}
        return {
          id: sub.id,
          quizId: sub.quiz_id,
          score: sub.score,
          total: sub.total,
          details: sub.details,
          createdAt: sub.created_at,
          user: {
            id: sub.user_id,
            email: userInfo.email || 'N/A',
            name: userInfo.name || '—',
            grade: userInfo.grade || '—'
          }
        }
      })
    }

    // Lấy tất cả submissions từ Supabase lần đầu
    supabase
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error: fetchError }) => {
        if (!isMounted) return

        if (fetchError) {
          console.error('Error fetching submissions:', fetchError)
          setError(fetchError.message || 'Không thể tải dữ liệu')
          setLoading(false)
          return
        }

        const formattedSubmissions = formatSubmissions(data || [])
        setSubmissions(formattedSubmissions)
        setLoading(false)
      })
      .catch((err) => {
        if (!isMounted) return
        console.error('Error:', err)
        setError(err.message || 'Không thể tải dữ liệu')
        setLoading(false)
      })

    // Subscribe để nhận updates real-time
    const channel = supabase
      .channel('submissions-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'submissions'
        },
        (payload) => {
          console.log('Real-time update:', payload)

          if (!isMounted) return

          // Nếu là INSERT, thêm submission mới vào đầu danh sách
          if (payload.eventType === 'INSERT') {
            const newSub = payload.new
            const userInfo = newSub.details?.userInfo || {}
            const formattedSub = {
              id: newSub.id,
              quizId: newSub.quiz_id,
              score: newSub.score,
              total: newSub.total,
              details: newSub.details,
              createdAt: newSub.created_at,
              user: {
                id: newSub.user_id,
                email: userInfo.email || 'N/A',
                name: userInfo.name || '—',
                grade: userInfo.grade || '—'
              }
            }
            setSubmissions(prev => [formattedSub, ...prev])

            // Hiển thị thông báo
            setNewSubmissionNotification({
              name: userInfo.name || userInfo.email || 'Học sinh',
              quizId: newSub.quiz_id
            })

            // Tự động ẩn thông báo sau 5 giây
            setTimeout(() => {
              setNewSubmissionNotification(null)
            }, 5000)
          }
          // Nếu là UPDATE hoặc DELETE, reload toàn bộ
          else {
            supabase
              .from('submissions')
              .select('*')
              .order('created_at', { ascending: false })
              .then(({ data, error }) => {
                if (!isMounted) return
                if (error) {
                  console.error('Error reloading submissions:', error)
                  return
                }
                const formattedSubmissions = formatSubmissions(data || [])
                setSubmissions(formattedSubmissions)
              })
          }
        }
      )
      .subscribe()

    return () => {
      isMounted = false
      supabase.removeChannel(channel)
    }
  }, [])

  // Calculate Stats
  const stats = useMemo(() => {
    const totalSubmissions = submissions.length
    const uniqueStudents = new Set(submissions.map(s => s.user.email)).size
    const totalScore = submissions.reduce((sum, s) => sum + (s.score || 0), 0)
    const totalPossible = submissions.reduce((sum, s) => sum + (s.total || 0), 0)
    const averageScore = totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0

    // Submissions today
    const today = new Date().toDateString()
    const submissionsToday = submissions.filter(s => new Date(s.createdAt).toDateString() === today).length

    return {
      totalSubmissions,
      uniqueStudents,
      averageScore,
      submissionsToday
    }
  }, [submissions])

  return (
    <div className="min-h-screen py-12 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none"></div>
      <div className="absolute top-20 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 animate-fade-in-up">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Dashboard <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Quản trị</span>
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Quản lý kết quả học tập và tài nguyên hệ thống</p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/admin/quizzes"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-sm flex items-center gap-2 font-medium"
              >
                <span className="text-xl">📝</span> Thêm bài tập
              </Link>
              <Link
                to="/admin/audio"
                className="px-6 py-3 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all shadow-sm border border-gray-200 dark:border-slate-700 flex items-center gap-2 font-medium"
              >
                <span className="text-xl">🎧</span> Quản lý Audio
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            {[
              { label: 'Tổng bài nộp', value: stats.totalSubmissions, icon: '📝', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
              { label: 'Học sinh', value: stats.uniqueStudents, icon: '👥', color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
              { label: 'Điểm trung bình', value: `${stats.averageScore}%`, icon: '⭐', color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
              { label: 'Hôm nay', value: `+${stats.submissionsToday}`, icon: '📈', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
            ].map((stat, index) => (
              <div key={index} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-white/20 dark:border-slate-700/50">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center text-2xl`}>
                    {stat.icon}
                  </div>
                  <span className={`text-sm font-bold ${stat.color} px-2 py-1 rounded-full bg-white dark:bg-slate-900/50`}>
                    {stat.label}
                  </span>
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Main Content Card */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-slate-700/50 overflow-hidden animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="w-2 h-6 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></span>
                Danh sách bài nộp
              </h2>

              {/* Notification */}
              {newSubmissionNotification && (
                <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-4 py-2 rounded-lg flex items-center gap-2 animate-pulse text-sm font-medium">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  {newSubmissionNotification.name} vừa nộp bài #{newSubmissionNotification.quizId}
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-12 text-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-500 dark:text-gray-400">Đang tải dữ liệu...</p>
                </div>
              ) : error ? (
                <div className="p-8 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 m-6 rounded-xl border border-red-100 dark:border-red-800">
                  <p className="font-bold flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                  </p>
                  {error.includes('relation "submissions" does not exist') && (
                    <p className="mt-2 text-sm ml-7">
                      Vui lòng chạy SQL script trong file <code className="bg-white dark:bg-slate-900 px-1 py-0.5 rounded border border-red-200 dark:border-red-800">supabase_setup.sql</code>
                    </p>
                  )}
                </div>
              ) : submissions.length === 0 ? (
                <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                  Chưa có dữ liệu nào.
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-slate-700 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-slate-800/50">
                      <th className="px-6 py-4 font-semibold">Học sinh</th>
                      <th className="px-6 py-4 font-semibold">Lớp</th>
                      <th className="px-6 py-4 font-semibold">Bài tập</th>
                      <th className="px-6 py-4 font-semibold">Điểm số</th>
                      <th className="px-6 py-4 font-semibold">Thời gian</th>
                      <th className="px-6 py-4 font-semibold text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                    {submissions.map((submission) => {
                      const percentage = submission.total > 0 ? (submission.score / submission.total) * 100 : 0
                      return (
                        <tr key={submission.id} className="group hover:bg-blue-50/50 dark:hover:bg-slate-700/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center text-xs font-bold text-blue-700 dark:text-blue-300">
                                {submission.user.name ? submission.user.name.charAt(0).toUpperCase() : submission.user.email.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900 dark:text-white">{submission.user.name || '—'}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{submission.user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300">
                              {submission.user.grade || '—'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                            #{submission.quizId}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-bold ${percentage >= 80 ? 'text-green-600 dark:text-green-400' :
                                  percentage >= 50 ? 'text-yellow-600 dark:text-yellow-400' :
                                    'text-red-600 dark:text-red-400'
                                }`}>
                                {submission.score}/{submission.total}
                              </span>
                              <div className="w-16 h-1.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${percentage >= 80 ? 'bg-green-500' :
                                      percentage >= 50 ? 'bg-yellow-500' :
                                        'bg-red-500'
                                    }`}
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                            {new Date(submission.createdAt).toLocaleString('vi-VN')}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => setSelectedSubmission(submission)}
                              className="text-blue-600 dark:text-blue-400 hover:text-purple-600 dark:hover:text-purple-400 font-medium text-sm transition-colors"
                            >
                              Chi tiết →
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal hiển thị chi tiết */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
            <div className="sticky top-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur border-b border-gray-100 dark:border-slate-700 px-6 py-4 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="text-2xl">📝</span>
                Chi tiết bài làm
              </h2>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              {/* User Info Card */}
              <div className="bg-gray-50 dark:bg-slate-700/30 rounded-xl p-6 mb-8 border border-gray-100 dark:border-slate-700">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mb-1">Học sinh</p>
                    <p className="font-bold text-gray-900 dark:text-white">{selectedSubmission.user?.name || '—'}</p>
                    <p className="text-xs text-gray-500">{selectedSubmission.user?.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mb-1">Bài tập</p>
                    <p className="font-bold text-gray-900 dark:text-white">#{selectedSubmission.quizId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mb-1">Điểm số</p>
                    <p className="font-bold text-2xl text-blue-600 dark:text-blue-400">
                      {selectedSubmission.score}/{selectedSubmission.total}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mb-1">Thời gian</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date(selectedSubmission.createdAt).toLocaleString('vi-VN')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Questions Review */}
              {(() => {
                const quiz = quizzes.find(q => q.id === selectedSubmission.quizId)
                const details = selectedSubmission.details || {}
                const answers = details.answers || []

                if (!quiz) {
                  return <p className="text-center text-gray-500 py-8">Không tìm thấy thông tin bài tập gốc.</p>
                }

                return (
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white border-l-4 border-blue-500 pl-3">
                      Nội dung bài làm
                    </h3>
                    {quiz.questions.map((question, index) => {
                      const userAnswer = answers[index]
                      const hasChoices = Array.isArray(question.choices) && question.choices.length > 0
                      const isCorrect = hasChoices && userAnswer === question.answer

                      return (
                        <div key={index} className={`rounded-xl border p-5 ${isCorrect
                            ? 'border-green-200 dark:border-green-900/50 bg-green-50/30 dark:bg-green-900/10'
                            : 'border-red-200 dark:border-red-900/50 bg-red-50/30 dark:bg-red-900/10'
                          }`}>
                          <div className="flex items-start justify-between mb-3">
                            <span className="font-bold text-gray-700 dark:text-gray-300">Câu {index + 1}</span>
                            {hasChoices && (
                              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${isCorrect
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                  : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                                }`}>
                                {isCorrect ? 'Chính xác' : 'Sai'}
                              </span>
                            )}
                          </div>

                          <div className="mb-4 text-gray-800 dark:text-gray-200">
                            <RichContent
                              text={question.q}
                              eq={question.eq}
                              image={question.image}
                            />
                          </div>

                          {hasChoices ? (
                            <div className="grid gap-3">
                              {question.choices.map((choice, choiceIndex) => {
                                const choiceObj = typeof choice === 'string' ? { text: choice } : choice
                                const isUserAnswer = userAnswer === choiceIndex
                                const isCorrectAnswer = choiceIndex === question.answer

                                let choiceClass = "p-3 rounded-lg border-2 transition-all "
                                if (isCorrectAnswer) {
                                  choiceClass += "border-green-500 bg-green-50 dark:bg-green-900/20"
                                } else if (isUserAnswer) {
                                  choiceClass += "border-red-500 bg-red-50 dark:bg-red-900/20"
                                } else {
                                  choiceClass += "border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800"
                                }

                                return (
                                  <div key={choiceIndex} className={choiceClass}>
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isCorrectAnswer ? 'bg-green-500 text-white' :
                                            isUserAnswer ? 'bg-red-500 text-white' :
                                              'bg-gray-200 dark:bg-slate-600 text-gray-600 dark:text-gray-300'
                                          }`}>
                                          {String.fromCharCode(65 + choiceIndex)}
                                        </span>
                                        <div className="text-gray-700 dark:text-gray-300">
                                          <RichContent
                                            text={choiceObj.text}
                                            eq={choiceObj.eq}
                                            image={choiceObj.image}
                                          />
                                        </div>
                                      </div>
                                      {isCorrectAnswer && <span className="text-green-600 text-xs font-bold">ĐÁP ÁN ĐÚNG</span>}
                                      {isUserAnswer && !isCorrectAnswer && <span className="text-red-600 text-xs font-bold">BẠN CHỌN</span>}
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          ) : (
                            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                              <p className="text-sm text-amber-800 dark:text-amber-200 font-medium mb-2">
                                Câu hỏi tự luận
                              </p>
                              <div className="text-gray-900 dark:text-white">
                                {userAnswer !== null ? (
                                  <span>Học sinh chọn: <strong>{String.fromCharCode(65 + userAnswer)}</strong></span>
                                ) : (
                                  <span className="italic text-gray-500">Chưa có câu trả lời</span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
