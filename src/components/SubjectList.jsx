import { Link } from 'react-router-dom'
import { useMemo } from 'react'

function SubjectList({ quizzes }) {
  const subjects = useMemo(() => {
    const uniqueSubjects = [...new Set(quizzes.map(q => q.subject))]
    // Sắp xếp các môn học: ưu tiên các môn chính trước
    const prioritySubjects = ['Toán', 'Vật Lý', 'Hóa Học', 'Sinh Học', 'Tiếng Anh']
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
        color: 'from-blue-500 to-blue-600',
        icon: (
          <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="0.5">
            <rect x="4" y="4" width="16" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
            <line x1="9" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="15" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="9" y1="12" x2="15" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="12" y1="9" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        ),
        description: 'Luyện tập Toán học từ cơ bản đến nâng cao'
      },
      'Vật Lý': {
        color: 'from-purple-500 to-purple-600',
        icon: (
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41"/>
            <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(45 12 12)"/>
            <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-45 12 12)"/>
          </svg>
        ),
        description: 'Khám phá thế giới vật lý'
      },
      'Hóa Học': {
        color: 'from-green-500 to-green-600',
        icon: (
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
          </svg>
        ),
        description: 'Thí nghiệm và phản ứng hóa học'
      },
      'Tiếng Anh': {
        color: 'from-orange-500 to-orange-600',
        icon: (
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
            <path d="M2 12h20"/>
          </svg>
        ),
        description: 'Nâng cao kỹ năng tiếng Anh'
      },
      'IELTS': {
        color: 'from-red-500 to-red-600',
        icon: (
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
        ),
        description: 'Luyện thi IELTS 4 kỹ năng'
      },
      'Ngoại ngữ': {
        color: 'from-pink-500 to-pink-600',
        icon: (
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/>
          </svg>
        ),
        description: 'Học tiếng Nhật và các ngôn ngữ khác'
      }
    }
    
    return configs[subject] || {
      color: 'from-gray-500 to-gray-600',
      icon: (
        <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
        </svg>
      ),
      description: 'Luyện tập và nâng cao kiến thức'
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

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Chọn môn học
          </h1>
          <p className="text-gray-600 mb-8">
            Chọn môn học bạn muốn luyện tập
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {subjects.map((subject) => {
              const subjectQuizzes = quizzes.filter(q => q.subject === subject)
              const subjectsWithGrades = ['Toán', 'Vật Lý', 'Hóa Học', 'Sinh Học', 'Tiếng Anh']
              const linkTo = subjectsWithGrades.includes(subject)
                ? `/subject/${encodeURIComponent(subject)}/grades`
                : `/subject/${encodeURIComponent(subject)}`
              
              const config = getSubjectConfig(subject)

              return (
                <Link
                  key={subject}
                  to={linkTo}
                  className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all"
                >
                  <div className={`bg-gradient-to-br ${config.color} rounded-2xl p-6 mb-4`}>
                    <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto transition-transform group-hover:scale-110">
                      {config.icon}
                    </div>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {subject}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {config.description}
                  </p>
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

