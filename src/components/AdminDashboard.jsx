import { useEffect, useState } from 'react'
import React from 'react'
import { useAuth } from '../context/AuthContext'
import { getAllSubmissions } from '../utils/supabaseSubmissions'

function AdminDashboard() {
  const { user, isAuthenticated } = useAuth()
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedSubmission, setSelectedSubmission] = useState(null)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      setLoading(false)
      return
    }

    let isMounted = true
    setLoading(true)
    setError('')

    getAllSubmissions()
      .then((data) => {
        if (!isMounted) return
        setSubmissions(data)
      })
      .catch((err) => {
        if (!isMounted) return
        console.error('Error loading submissions:', err)
        setError(err.message || 'Không thể tải dữ liệu')
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => { isMounted = false }
  }, [isAuthenticated, user])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Kết quả làm bài của học sinh</h1>
          {loading && <p className="text-gray-600">Đang tải dữ liệu...</p>}
          {error && (
            <div className="mb-4 bg-red-100 text-red-700 px-4 py-2 rounded-lg">
              {error}
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
                    <React.Fragment key={submission.id}>
                      <tr className="hover:bg-indigo-50 cursor-pointer" onClick={() => setSelectedSubmission(selectedSubmission?.id === submission.id ? null : submission)}>
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
                          <button className="text-indigo-600 hover:text-indigo-800 font-medium">
                            {selectedSubmission?.id === submission.id ? 'Ẩn' : 'Xem'}
                          </button>
                        </td>
                      </tr>
                      {selectedSubmission?.id === submission.id && submission.details && (
                        <tr>
                          <td colSpan="7" className="px-4 py-6 bg-gray-50">
                            <div className="space-y-4">
                              <h3 className="font-semibold text-gray-800 mb-4">Chi tiết câu trả lời:</h3>
                              {submission.details.questions && submission.details.questions.map((q, idx) => (
                                <div key={idx} className={`p-4 rounded-lg border-2 ${q.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                  <div className="flex items-start justify-between mb-2">
                                    <span className="font-semibold text-gray-800">Câu {idx + 1}:</span>
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${q.isCorrect ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                      {q.isCorrect ? '✓ Đúng' : '✗ Sai'}
                                    </span>
                                  </div>
                                  <div className="text-sm text-gray-700 mb-2" dangerouslySetInnerHTML={{ __html: q.question }} />
                                  <div className="space-y-1 text-sm">
                                    <div>
                                      <span className="font-medium">Câu trả lời của học sinh: </span>
                                      <span className={q.isCorrect ? 'text-green-700' : 'text-red-700'}>
                                        {q.userAnswer !== null && q.userAnswer !== undefined ? String.fromCharCode(65 + q.userAnswer) : 'Chưa trả lời'}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="font-medium">Đáp án đúng: </span>
                                      <span className="text-green-700">
                                        {q.correctAnswer !== null && q.correctAnswer !== undefined ? String.fromCharCode(65 + q.correctAnswer) : 'N/A'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

