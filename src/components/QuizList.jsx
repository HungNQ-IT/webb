import { Link, useParams } from 'react-router-dom'
import { useMemo } from 'react'

function QuizList({ quizzes }) {
  const { subject, grade } = useParams()
  const decodedSubject = decodeURIComponent(subject)

  const subjectQuizzes = useMemo(() => {
    let filtered = quizzes.filter(q => q.subject === decodedSubject)
    
    // Nếu có grade (lớp), lọc theo grade
    if (grade) {
      filtered = filtered.filter(q => q.grade === parseInt(grade))
    }
    
    return filtered
  }, [quizzes, decodedSubject, grade])

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
              {decodedSubject} {grade && `- Lớp ${grade}`}
            </h1>
            <p className="text-gray-600">
              Kiểm tra kiến thức về {decodedSubject.toLowerCase()} và công thức nghiệm
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {subjectQuizzes.map((quiz, index) => {
              // Màu và badge dựa theo difficulty trong JSON
              const difficultyConfig = {
                easy: {
                  color: 'from-green-500 to-green-600',
                  badge: { text: 'Dễ', color: 'bg-green-500' }
                },
                medium: {
                  color: 'from-orange-500 to-orange-600',
                  badge: { text: 'Trung bình', color: 'bg-orange-500' }
                },
                hard: {
                  color: 'from-red-500 to-red-600',
                  badge: { text: 'Khó', color: 'bg-red-500' }
                }
              }
              
              // Nếu không có difficulty, dùng màu mặc định theo thứ tự
              const defaultColors = [
                'from-orange-500 to-orange-600',
                'from-green-500 to-green-600',
                'from-blue-500 to-blue-600',
                'from-purple-500 to-purple-600'
              ]
              
              const config = quiz.difficulty 
                ? difficultyConfig[quiz.difficulty] 
                : { 
                    color: defaultColors[index % defaultColors.length],
                    badge: null
                  }
              
              const colorClass = config.color
              const badge = config.badge
              
              return (
                <div
                  key={quiz.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all"
                >
                  <div className={`bg-gradient-to-r ${colorClass} p-6 text-white`}>
                    <div className="flex items-start justify-between mb-3">
                      <h2 className="text-xl font-bold flex-1">
                        {quiz.title}
                      </h2>
                      {badge && (
                        <span className={`${badge.color} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
                          {badge.text}
                        </span>
                      )}
                    </div>
                    <p className="text-white/90 text-sm">
                      {quiz.description || 'Kiểm tra kiến thức về phương trình bậc hai và công thức nghiệm'}
                    </p>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                        <span>{quiz.questions.length} câu</span>
                      </div>
                      {quiz.timeLimit && (
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                          <span>{quiz.timeLimit} phút</span>
                        </div>
                      )}
                    </div>
                    <Link
                      to={`/quiz/${quiz.id}`}
                      className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-all"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                      Bắt đầu làm bài
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>

          {subjectQuizzes.length === 0 && (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <p className="text-gray-600">Chưa có bài tập nào cho môn học này.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default QuizList

