import { useEffect, useState } from 'react'
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Kết quả làm bài của học sinh</h1>
            <Link
              to="/admin/audio"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              🎧 Quản lý Audio
            </Link>
          </div>
          
          {/* Thông báo submission mới */}
          {newSubmissionNotification && (
            <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center justify-between animate-pulse">
              <span>
                ✨ <strong>{newSubmissionNotification.name}</strong> vừa nộp bài #{newSubmissionNotification.quizId}
              </span>
              <button
                onClick={() => setNewSubmissionNotification(null)}
                className="text-green-700 hover:text-green-900"
              >
                ×
              </button>
            </div>
          )}
          
          {loading && <p className="text-gray-600">Đang tải dữ liệu...</p>}
          {error && (
            <div className="mb-4 bg-red-100 text-red-700 px-4 py-2 rounded-lg">
              {error}
              {error.includes('relation "submissions" does not exist') && (
                <div className="mt-2 text-sm">
                  ⚠️ Bảng submissions chưa được tạo. Vui lòng chạy SQL script trong file <code className="bg-red-200 px-1 rounded">supabase_setup.sql</code>
                </div>
              )}
            </div>
          )}
          {!loading && !error && submissions.length === 0 && (
            <p className="text-gray-600">Chưa có bài nộp nào.</p>
          )}
          {!loading && !error && submissions.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Học sinh</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lớp</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bài</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Điểm</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chi tiết</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {submissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-indigo-50">
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {submission.user?.name || '—'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {submission.user?.email}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {submission.user?.grade || '—'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        #{submission.quizId}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-800">
                        {submission.score}/{submission.total}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(submission.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() => setSelectedSubmission(submission)}
                          className="text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                          Xem chi tiết
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal hiển thị chi tiết */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                Chi tiết bài làm - {selectedSubmission.user?.name || selectedSubmission.user?.email}
              </h2>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <div className="mb-6 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold">{selectedSubmission.user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Lớp</p>
                  <p className="font-semibold">{selectedSubmission.user?.grade || '—'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Bài tập</p>
                  <p className="font-semibold">#{selectedSubmission.quizId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Điểm số</p>
                  <p className="font-semibold text-indigo-600">
                    {selectedSubmission.score}/{selectedSubmission.total}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Thời gian nộp</p>
                  <p className="font-semibold">
                    {new Date(selectedSubmission.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Hiển thị câu hỏi và câu trả lời */}
              {(() => {
                const quiz = quizzes.find(q => q.id === selectedSubmission.quizId)
                const details = selectedSubmission.details || {}
                const answers = details.answers || []
                
                if (!quiz) {
                  return <p className="text-gray-500">Không tìm thấy thông tin bài tập.</p>
                }

                return (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Câu trả lời chi tiết</h3>
                    {quiz.questions.map((question, index) => {
                      const userAnswer = answers[index]
                      const hasChoices = Array.isArray(question.choices) && question.choices.length > 0
                      const isCorrect = hasChoices && userAnswer === question.answer
                      
                      return (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <span className="font-semibold text-gray-700">Câu {index + 1}</span>
                            {hasChoices && (
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                isCorrect 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {isCorrect ? '✓ Đúng' : '✗ Sai'}
                              </span>
                            )}
                          </div>
                          <div className="mb-3">
                            <RichContent 
                              text={question.q} 
                              eq={question.eq} 
                              image={question.image} 
                            />
                          </div>
                          {hasChoices ? (
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-gray-600">Các lựa chọn:</p>
                              {question.choices.map((choice, choiceIndex) => {
                                const choiceObj = typeof choice === 'string' ? { text: choice } : choice
                                const isUserAnswer = userAnswer === choiceIndex
                                const isCorrectAnswer = choiceIndex === question.answer
                                
                                return (
                                  <div
                                    key={choiceIndex}
                                    className={`p-2 rounded border-2 ${
                                      isCorrectAnswer
                                        ? 'border-green-500 bg-green-50'
                                        : isUserAnswer
                                        ? 'border-red-500 bg-red-50'
                                        : 'border-gray-200'
                                    }`}
                                  >
                                    <span className="font-medium mr-2">
                                      {String.fromCharCode(65 + choiceIndex)}.
                                    </span>
                                    <RichContent 
                                      text={choiceObj.text} 
                                      eq={choiceObj.eq} 
                                      image={choiceObj.image} 
                                    />
                                    {isCorrectAnswer && (
                                      <span className="ml-2 text-green-600 font-semibold">(Đáp án đúng)</span>
                                    )}
                                    {isUserAnswer && !isCorrectAnswer && (
                                      <span className="ml-2 text-red-600 font-semibold">(Bạn chọn)</span>
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          ) : (
                            <div className="bg-amber-50 border border-amber-200 rounded p-3">
                              <p className="text-sm text-amber-800">
                                Đây là câu hỏi tự luận. Học sinh cần làm bài và nộp theo hướng dẫn của giáo viên.
                              </p>
                              {userAnswer !== null && userAnswer !== undefined && (
                                <p className="mt-2 text-sm font-medium">
                                  Học sinh đã chọn: {String.fromCharCode(65 + userAnswer)}
                                </p>
                              )}
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

