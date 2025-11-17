import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-8 mb-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-3">Chào mừng đến với nền tảng học tập</h2>
            <p className="text-blue-100 mb-4">Hãy chọn môn học và bắt đầu hành trình chinh phục tri thức của bạn!</p>
            <div className="flex items-center justify-center gap-8 mt-6">
              <div className="text-center">
                <div className="text-3xl font-bold">5</div>
                <div className="text-sm text-blue-100">Bài tập</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">4</div>
                <div className="text-sm text-blue-100">Môn học</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">10</div>
                <div className="text-sm text-blue-100">Điểm mục tiêu</div>
              </div>
            </div>
          </div>

          {/* Subjects Section */}
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Chọn môn học</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              to="/subject/Toán/grades"
              className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">Toán</h3>
              <p className="text-blue-100 text-sm">Luyện tập Toán học từ cơ bản đến nâng cao</p>
            </Link>

            <Link
              to="/subject/Vật Lý/grades"
              className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-8 text-white hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">Vật Lý</h3>
              <p className="text-purple-100 text-sm">Khám phá thế giới vật lý</p>
            </Link>

            <Link
              to="/subject/Hóa Học/grades"
              className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-8 text-white hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-4 4C.817 14.769 2.156 18 4.828 18h10.343c2.673 0 4.012-3.231 2.122-5.121l-4-4A1 1 0 0113 8.172V4.414l.707-.707A1 1 0 0013 2H7zm2 6.172V4h2v4.172a3 3 0 00.879 2.12l1.027 1.028a4 4 0 00-2.171.102l-.47.156a4 4 0 01-2.53 0l-.563-.187a1.993 1.993 0 00-.114-.035l1.063-1.063A3 3 0 009 8.172z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">Hóa Học</h3>
              <p className="text-green-100 text-sm">Thí nghiệm và phản ứng hóa học</p>
            </Link>

            <Link
              to="/subject/Tiếng Anh/grades"
              className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-8 text-white hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">Tiếng Anh</h3>
              <p className="text-orange-100 text-sm">Nâng cao kỹ năng tiếng Anh</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home

