import { Link } from 'react-router-dom'
import { useMemo } from 'react'

function SubjectList({ quizzes }) {
  const subjects = useMemo(() => {
    const uniqueSubjects = [...new Set(quizzes.map(q => q.subject))]
    // Sắp xếp các môn học: ưu tiên các môn chính trước
    const prioritySubjects = ['Toán', 'Vật Lý', 'Hóa Học', 'Khoa Học Tự Nhiên', 'Sinh Học', 'Tiếng Anh']
    const sortedSubjects = [
      ...uniqueSubjects.filter(s => prioritySubjects.includes(s)).sort((a, b) => {
        return prioritySubjects.indexOf(a) - prioritySubjects.indexOf(b)
      }),
      ...uniqueSubjects.filter(s => !prioritySubjects.includes(s)).sort()
    ]
    return sortedSubjects
  }, [quizzes])

  const getSubjectConfig = (subject) => {
    const configs = {
      'Toán': {
        color: 'from-blue-500 to-cyan-500',
        bg: 'bg-blue-100 dark:bg-blue-900/50',
        text: 'text-blue-600 dark:text-blue-400',
        icon: (
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        ),
        description: 'Đại số, Hình học và các bài toán tư duy logic.'
      },
      'Vật Lý': {
        color: 'from-purple-500 to-pink-500',
        bg: 'bg-purple-100 dark:bg-purple-900/50',
        text: 'text-purple-600 dark:text-purple-400',
        icon: (
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        ),
        description: 'Cơ học, Điện học và các hiện tượng tự nhiên.'
      },
      'Hóa Học': {
        color: 'from-green-500 to-emerald-500',
        bg: 'bg-green-100 dark:bg-green-900/50',
        text: 'text-green-600 dark:text-green-400',
        icon: (
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        ),
        description: 'Phản ứng hóa học và bảng tuần hoàn nguyên tố.'
      },
      'Khoa Học Tự Nhiên': {
        color: 'from-teal-500 to-cyan-600',
        bg: 'bg-teal-100 dark:bg-teal-900/50',
        text: 'text-teal-600 dark:text-teal-400',
        icon: (
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        description: 'Khám phá thế giới tự nhiên xung quanh.'
      },
      'Tiếng Anh': {
        color: 'from-orange-500 to-amber-500',
        bg: 'bg-orange-100 dark:bg-orange-900/50',
        text: 'text-orange-600 dark:text-orange-400',
        icon: (
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
        ),
        description: 'Ngữ pháp, từ vựng và kỹ năng giao tiếp.'
      },
      'IELTS': {
        color: 'from-red-500 to-rose-500',
        bg: 'bg-red-100 dark:bg-red-900/50',
        text: 'text-red-600 dark:text-red-400',
        icon: (
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        ),
        description: 'Luyện thi chứng chỉ quốc tế 4 kỹ năng.'
      },
      'Ngoại ngữ': {
        color: 'from-pink-500 to-rose-500',
        bg: 'bg-pink-100 dark:bg-pink-900/50',
        text: 'text-pink-600 dark:text-pink-400',
        icon: (
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
        ),
        description: 'Học tiếng Nhật và các ngôn ngữ khác.'
      }
    }

    return configs[subject] || {
      color: 'from-gray-500 to-gray-600',
      bg: 'bg-gray-100 dark:bg-gray-800',
      text: 'text-gray-600 dark:text-gray-400',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      description: 'Luyện tập và nâng cao kiến thức.'
    }
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 animate-fade-in-up">
            <button
              onClick={() => window.history.back()}
              className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium flex items-center gap-2 mb-6 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Quay lại
            </button>

            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Chọn <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">môn học</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
              Khám phá kho tàng kiến thức đa dạng. Chọn môn học bạn yêu thích và bắt đầu hành trình chinh phục điểm 10.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {subjects.map((subject, index) => {
              const subjectsWithGrades = ['Toán', 'Vật Lý', 'Hóa Học', 'Khoa Học Tự Nhiên', 'Sinh Học', 'Tiếng Anh']
              const linkTo = subjectsWithGrades.includes(subject)
                ? `/subject/${encodeURIComponent(subject)}/grades`
                : `/subject/${encodeURIComponent(subject)}`

              const config = getSubjectConfig(subject)

              return (
                <Link
                  key={subject}
                  to={linkTo}
                  className="group relative overflow-hidden bg-white dark:bg-slate-800 rounded-3xl p-1 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${config.color} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
                  <div className="h-full p-6 flex flex-col relative z-10">
                    <div className={`w-14 h-14 ${config.bg} rounded-2xl flex items-center justify-center ${config.text} mb-6 group-hover:scale-110 transition-transform`}>
                      {config.icon}
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {subject}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex-1 leading-relaxed">
                      {config.description}
                    </p>
                    <div className={`flex items-center ${config.text} text-sm font-bold`}>
                      Bắt đầu học <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubjectList
