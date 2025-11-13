import { useEffect, useState } from 'react'
import { apiRequest } from '../utils/api/client'
import { useAuth } from '../context/AuthContext'

function AdminDashboard() {
  const { token } = useAuth()
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    apiRequest('/submissions/admin', { token })
      .then((data) => {
        if (!isMounted) return
        setSubmissions(data.submissions)
      })
      .catch((err) => {
        if (!isMounted) return
        setError(err.message || 'Không thể tải dữ liệu')
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })
    return () => { isMounted = false }
  }, [token])

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
                    </tr>
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

