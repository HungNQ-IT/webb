import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Gia Sư 10 Điểm
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Nền tảng luyện bài tập online miễn phí
          </p>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Chào mừng bạn đến với Gia Sư 10 Điểm!
            </h2>
            <p className="text-gray-600 mb-6">
              Luyện tập với các bài tập từ nhiều môn học khác nhau. 
              Làm bài, được chấm điểm tự động và xem lời giải chi tiết.
            </p>
            <Link
              to="/subjects"
              className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Bắt đầu ngay →
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="font-semibold text-gray-800 mb-2">Nhiều môn học</h3>
              <p className="text-gray-600 text-sm">
                Toán, Lý, Hóa và nhiều môn học khác
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="font-semibold text-gray-800 mb-2">Chấm điểm tự động</h3>
              <p className="text-gray-600 text-sm">
                Kết quả ngay lập tức sau khi nộp bài
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="font-semibold text-gray-800 mb-2">Lời giải chi tiết</h3>
              <p className="text-gray-600 text-sm">
                Xem giải thích cho từng câu hỏi
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home

