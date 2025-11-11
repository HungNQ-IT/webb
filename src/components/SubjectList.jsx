import { Link } from 'react-router-dom'
import { useMemo } from 'react'

function SubjectList({ quizzes }) {
  const subjects = useMemo(() => {
    const uniqueSubjects = [...new Set(quizzes.map(q => q.subject))]
    return uniqueSubjects
  }, [quizzes])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link
              to="/"
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              ← Về trang chủ
            </Link>
          </div>

          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Chọn môn học
          </h1>
          <p className="text-gray-600 mb-8">
            Chọn môn học bạn muốn luyện tập
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => {
              const subjectQuizzes = quizzes.filter(q => q.subject === subject)
              // Các môn có phân lớp: Toán, Vật Lý, Hóa Học, Sinh Học, Tiếng Anh
              const subjectsWithGrades = ['Toán', 'Vật Lý', 'Hóa Học', 'Sinh Học', 'Tiếng Anh']
              const linkTo = subjectsWithGrades.includes(subject)
                ? `/subject/${encodeURIComponent(subject)}/grades`
                : `/subject/${encodeURIComponent(subject)}`

              return (
                <Link
                  key={subject}
                  to={linkTo}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border-2 border-transparent hover:border-indigo-500"
                >
                  <div className="text-4xl mb-4">
                    {subject === 'Toán' && '📐'}
                    {subject === 'Vật Lý' && '⚛️'}
                    {subject === 'Hóa Học' && '🧪'}
                    {subject === 'Sinh Học' && '🔬'}
                    {subject === 'Tiếng Anh' && '🗣️'}
                    {!['Toán', 'Vật Lý', 'Hóa Học', 'Sinh Học', 'Tiếng Anh'].includes(subject) && '📚'}
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    {subject}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {subjectQuizzes.length} bài tập
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

