import { Link, useParams } from 'react-router-dom'
import { useMemo } from 'react'

function QuizList({ quizzes }) {
  const { subject } = useParams()
  const decodedSubject = decodeURIComponent(subject)

  const subjectQuizzes = useMemo(() => {
    return quizzes.filter(q => q.subject === decodedSubject)
  }, [quizzes, decodedSubject])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link
              to="/subjects"
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              ← Về danh sách môn học
            </Link>
          </div>

          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {decodedSubject}
          </h1>
          <p className="text-gray-600 mb-8">
            Chọn bài tập bạn muốn làm
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {subjectQuizzes.map((quiz) => (
              <Link
                key={quiz.id}
                to={`/quiz/${quiz.id}`}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border-2 border-transparent hover:border-indigo-500"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {quiz.title}
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                  {quiz.description || 'Bài tập trắc nghiệm'}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{quiz.questions.length} câu hỏi</span>
                  {quiz.timeLimit && (
                    <span>⏱️ {quiz.timeLimit} phút</span>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {subjectQuizzes.length === 0 && (
            <div className="bg-white rounded-xl p-8 text-center">
              <p className="text-gray-600">Chưa có bài tập nào cho môn học này.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default QuizList

