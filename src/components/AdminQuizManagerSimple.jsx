import { Link } from 'react-router-dom'

// Component đơn giản để test
function AdminQuizManagerSimple() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <Link to="/admin" className="text-blue-600 dark:text-blue-400 hover:underline mb-2 inline-block">
                ← Quay lại Admin
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Quản lý Bài tập (Test Mode)
              </h1>
            </div>
          </div>

          {/* Test Content */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              ✅ Trang đang hoạt động!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Nếu bạn thấy nội dung này, nghĩa là routing và component đang hoạt động bình thường.
            </p>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                🔍 Vấn đề có thể là:
              </h3>
              <ul className="list-disc list-inside text-sm text-blue-700 dark:text-blue-400 space-y-1">
                <li>Component AdminQuizManager gốc bị lỗi khi load</li>
                <li>Supabase connection bị lỗi</li>
                <li>CSS làm nội dung bị ẩn</li>
              </ul>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">
                ✅ Bước tiếp theo:
              </h3>
              <ol className="list-decimal list-inside text-sm text-green-700 dark:text-green-400 space-y-1">
                <li>Mở Console (F12) và kiểm tra lỗi</li>
                <li>Kiểm tra Network tab xem có request nào fail</li>
                <li>Đảm bảo đã tạo bảng quizzes trong Supabase</li>
              </ol>
            </div>

            <div className="mt-6 flex gap-3">
              <Link
                to="/admin"
                className="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-slate-600"
              >
                ← Quay lại Dashboard
              </Link>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
              >
                🔄 Reload trang
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminQuizManagerSimple
