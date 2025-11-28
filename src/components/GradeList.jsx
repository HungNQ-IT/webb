import { Link, useParams } from 'react-router-dom'

function GradeList() {
  const { subject } = useParams()
  const decodedSubject = decodeURIComponent(subject)

  // Danh sách các lớp (chỉ áp dụng cho Vật Lý)
  const grades = [6,7,8,9,10, 11, 12]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <button
              onClick={() => window.history.back()}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium flex items-center gap-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Quay lại
            </button>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {decodedSubject}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Luyện tập Toán học từ cơ bản đến nâng cao
          </p>

          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            {grades.map((grade) => (
              <Link
                key={grade}
                to={`/subject/${encodeURIComponent(decodedSubject)}/grade/${grade}`}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-500 dark:hover:border-blue-500 transition-all text-center hover:scale-105"
              >
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-7 h-7 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                  Lớp {grade}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {decodedSubject} {grade}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GradeList

