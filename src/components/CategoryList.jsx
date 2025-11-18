import { Link, useParams } from 'react-router-dom'
import { useMemo } from 'react'

function CategoryList({ quizzes, ieltsTests = [] }) {
  const { subject } = useParams()
  const decodedSubject = decodeURIComponent(subject)

  const categories = useMemo(() => {
    // Nếu là IELTS hoặc Ngoại ngữ, lấy từ ieltsTests
    const allTests = decodedSubject === 'IELTS' || decodedSubject === 'Ngoại ngữ'
      ? ieltsTests
      : quizzes
    
    const subjectQuizzes = allTests.filter(q => q.subject === decodedSubject)
    const uniqueCategories = [...new Set(subjectQuizzes.map(q => q.category).filter(Boolean))]
    return uniqueCategories
  }, [quizzes, ieltsTests, decodedSubject])

  const getCategoryConfig = (category) => {
    const configs = {
      'Reading': {
        color: 'from-blue-500 to-blue-600',
        icon: (
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
          </svg>
        ),
        description: 'Luyện đọc hiểu'
      },
      'Listening': {
        color: 'from-green-500 to-green-600',
        icon: (
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m0 0a5 5 0 007.072 0"/>
          </svg>
        ),
        description: 'Luyện nghe'
      },
      'Writing': {
        color: 'from-purple-500 to-purple-600',
        icon: (
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
          </svg>
        ),
        description: 'Luyện viết'
      },
      'Speaking': {
        color: 'from-orange-500 to-orange-600',
        icon: (
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>
          </svg>
        ),
        description: 'Luyện nói'
      },
      'Tiếng Nhật': {
        color: 'from-pink-500 to-pink-600',
        icon: (
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/>
          </svg>
        ),
        description: 'Học tiếng Nhật từ cơ bản'
      }
    }
    
    return configs[category] || {
      color: 'from-gray-500 to-gray-600',
      icon: (
        <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
        </svg>
      ),
      description: 'Luyện tập'
    }
  }

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
              {decodedSubject}
            </h1>
            <p className="text-gray-600">
              Chọn kỹ năng bạn muốn luyện tập
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => {
              const config = getCategoryConfig(category)
              const allTests = decodedSubject === 'IELTS' || decodedSubject === 'Ngoại ngữ'
                ? ieltsTests
                : quizzes
              const categoryQuizzes = allTests.filter(
                q => q.subject === decodedSubject && q.category === category
              )

              return (
                <Link
                  key={category}
                  to={`/subject/${encodeURIComponent(decodedSubject)}/category/${encodeURIComponent(category)}`}
                  className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all"
                >
                  <div className={`bg-gradient-to-br ${config.color} rounded-2xl p-6 mb-4`}>
                    <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto transition-transform group-hover:scale-110">
                      {config.icon}
                    </div>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {category}
                  </h2>
                  <p className="text-gray-600 text-sm mb-3">
                    {config.description}
                  </p>
                  <div className="text-sm text-gray-500">
                    {categoryQuizzes.length} bài tập
                  </div>
                </Link>
              )
            })}
          </div>

          {categories.length === 0 && (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <p className="text-gray-600">Chưa có danh mục nào.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CategoryList
