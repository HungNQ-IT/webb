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
          <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        ),
        description: 'Luyện đọc hiểu'
      },
      'Listening': {
        color: 'from-green-500 to-green-600',
        icon: (
          <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m0 0a5 5 0 007.072 0" />
          </svg>
        ),
        description: 'Luyện nghe'
      },
      'Writing': {
        color: 'from-purple-500 to-purple-600',
        icon: (
          <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        ),
        description: 'Luyện viết'
      },
      'Speaking': {
        color: 'from-orange-500 to-orange-600',
        icon: (
          <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        ),
        description: 'Luyện nói'
      },
      'Tiếng Nhật': {
        color: 'from-pink-500 to-pink-600',
        icon: (
          <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
        ),
        description: 'Học tiếng Nhật từ cơ bản'
      }
    }

    return configs[category] || {
      color: 'from-gray-500 to-gray-600',
      icon: (
        <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
        </svg>
      ),
      description: 'Luyện tập'
    }
  }

  return (
    <div className="min-h-screen py-12 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none"></div>
      <div className="absolute top-20 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 animate-fade-in-up">
            <button
              onClick={() => window.history.back()}
              className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium flex items-center gap-2 mb-6 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Quay lại
            </button>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {decodedSubject}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Chọn kỹ năng bạn muốn <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-bold">luyện tập</span>
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            {categories.map((category, index) => {
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
                  className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-white/20 dark:border-slate-700/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`bg-gradient-to-br ${config.color} rounded-2xl p-6 mb-6 shadow-lg transform group-hover:scale-105 transition-transform duration-300`}>
                    <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto backdrop-blur-sm">
                      {config.icon}
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                    {category}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 text-center font-medium">
                    {config.description}
                  </p>
                  <div className="flex justify-center">
                    <span className="px-4 py-1.5 bg-gray-100 dark:bg-slate-700/50 text-gray-600 dark:text-gray-300 rounded-full text-sm font-semibold group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {categoryQuizzes.length} bài tập
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>

          {categories.length === 0 && (
            <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl rounded-3xl p-12 text-center border border-white/20 dark:border-slate-700/50 animate-fade-in-up">
              <div className="w-20 h-20 bg-gray-100 dark:bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Chưa có nội dung</h3>
              <p className="text-gray-500 dark:text-gray-400">Danh mục này hiện đang được cập nhật.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CategoryList
