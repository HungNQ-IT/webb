import { Link, useParams } from 'react-router-dom'

function GradeList() {
  const { subject } = useParams()
  const decodedSubject = decodeURIComponent(subject)

  // Danh sách các lớp (chỉ áp dụng cho Vật Lý)
  const grades = [6,7,8,9,10, 11, 12]

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
            Chọn lớp bạn muốn luyện tập
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {grades.map((grade) => (
              <Link
                key={grade}
                to={`/subject/${encodeURIComponent(decodedSubject)}/grade/${grade}`}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border-2 border-transparent hover:border-indigo-500 text-center"
              >
                <div className="text-5xl mb-4">📚</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Lớp {grade}
                </h2>
                <p className="text-gray-600 text-sm">
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

