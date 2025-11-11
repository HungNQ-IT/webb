import { Link, useParams } from 'react-router-dom'

function GradeSelection() {
  const { subject } = useParams()
  const grades = [6, 7, 8, 9, 10, 11, 12]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-8">
          <Link
            to="/subjects"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            ← Quay lại chọn môn
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Chọn lớp cho môn {subject}
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-8">
          {grades.map((grade) => (
            <Link
              key={grade}
              to={`/subject/${encodeURIComponent(subject)}/grade/${grade}`}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border-2 border-transparent hover:border-indigo-500 text-center text-lg font-semibold text-gray-700"
            >
              Lớp {grade}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default GradeSelection