import { Link, useParams } from 'react-router-dom'
import { useMemo } from 'react'

function QuizList({ quizzes }) {
  const { subject, grade, category } = useParams()
  const decodedSubject = decodeURIComponent(subject)
  const decodedCategory = category ? decodeURIComponent(category) : null

  const subjectQuizzes = useMemo(() => {
    let filtered = quizzes.filter(q => q.subject === decodedSubject)
    
    // Nếu có grade (lớp), lọc theo grade
    if (grade) {
      filtered = filtered.filter(q => q.grade === parseInt(grade))
    }
    
    // Nếu có category, lọc theo category
    if (decodedCategory) {
      filtered = filtered.filter(q => q.category === decodedCategory)
    }
    
    return filtered
  }, [quizzes, decodedSubject, grade, decodedCategory])

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
              {decodedSubject} {grade && `- Lớp ${grade}`} {decodedCategory && `- ${decodedCategory}`}
            </h1>
            <p className="text-gray-600">
              {decodedCategory 
                ? `Luyện tập ${decodedCategory} - ${decodedSubject}`
                : `Kiểm tra kiến thức về ${decodedSubject.toLowerCase()}`
              }
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {subjectQuizzes.map((quiz) => {
              // Tính số phần thi (sections) nếu có
              const sections = quiz.sections || 3
              
              return (
                <div
                  key={quiz.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all"
                >
                  <div className="mb-4">
                    <div className="flex items-start gap-2 mb-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                        </svg>
                      </div>
                      <h3 className="font-bold text-gray-900 text-base leading-tight">
                        {quiz.title}
                      </h3>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600 mb-3">
                      {quiz.timeLimit && (
                        <div className="flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                          <span>{quiz.timeLimit} phút</span>
                        </div>
                      )}
                      <div className="text-gray-700">
                        {sections} phần thi | {quiz.questions.length} câu hỏi
                      </div>
                    </div>
                  </div>
                  
                  <Link
                    to={`/quiz/${quiz.id}`}
                    className="block w-full text-center bg-white border-2 border-blue-600 text-blue-600 px-4 py-2.5 rounded-lg font-medium hover:bg-blue-50 transition-all"
                  >
                    Làm bài
                  </Link>
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

