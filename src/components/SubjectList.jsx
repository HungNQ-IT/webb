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
          <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z" clipRule="evenodd"/>
          </svg>
        ),
        description: 'Luyện tập Toán học từ cơ bản đến nâng cao'
      },
      'Vật Lý': {
        color: 'from-purple-500 to-purple-600',
        icon: (
          <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
            <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z"/>
          </svg>
        ),
        description: 'Khám phá thế giới vật lý'
      },
      'Hóa Học': {
        color: 'from-green-500 to-green-600',
        icon: (
          <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-4 4C.817 14.769 2.156 18 4.828 18h10.343c2.673 0 4.012-3.231 2.122-5.121l-4-4A1 1 0 0113 8.172V4.414l.707-.707A1 1 0 0013 2H7zm2 6.172V4h2v4.172a3 3 0 00.879 2.12l1.027 1.028a4 4 0 00-2.171.102l-.47.156a4 4 0 01-2.53 0l-.563-.187a1.993 1.993 0 00-.114-.035l1.063-1.063A3 3 0 009 8.172z" clipRule="evenodd"/>
          </svg>
        ),
        description: 'Thí nghiệm và phản ứng hóa học'
      },
      'Tiếng Anh': {
        color: 'from-orange-500 to-orange-600',
        icon: (
          <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd"/>
          </svg>
        ),
        description: 'Nâng cao kỹ năng tiếng Anh'
      }
    }
    
    return configs[subject] || {
      color: 'from-gray-500 to-gray-600',
      icon: (
        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
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
                  className={`bg-gradient-to-br ${config.color} rounded-2xl p-8 text-white hover:shadow-xl transition-all transform hover:-translate-y-1`}
                >
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                    {config.icon}
                  </div>
                  <h2 className="text-2xl font-bold mb-2">
                    {subject}
                  </h2>
                  <p className="text-white/90 text-sm">
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

