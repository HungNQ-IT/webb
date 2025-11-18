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
                <div className="text-3xl font-bold">20</div>
                <div className="text-sm text-blue-100">Bài tập</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">6</div>
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
              className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all"
            >
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto transition-transform group-hover:scale-110">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="0.5">
                    <rect x="4" y="4" width="16" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
                    <line x1="9" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="15" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="9" y1="12" x2="15" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="12" y1="9" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Toán</h3>
              <p className="text-gray-600 text-sm">Luyện tập Toán học từ cơ bản đến nâng cao</p>
            </Link>

            <Link
              to="/subject/Vật Lý/grades"
              className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all"
            >
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto transition-transform group-hover:scale-110">
                  <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41"/>
                    <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(45 12 12)"/>
                    <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-45 12 12)"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Vật Lý</h3>
              <p className="text-gray-600 text-sm">Khám phá thế giới vật lý</p>
            </Link>

            <Link
              to="/subject/Hóa Học/grades"
              className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all"
            >
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto transition-transform group-hover:scale-110">
                  <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Hóa Học</h3>
              <p className="text-gray-600 text-sm">Thí nghiệm và phản ứng hóa học</p>
            </Link>

            <Link
              to="/subject/Tiếng Anh/grades"
              className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all"
            >
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto transition-transform group-hover:scale-110">
                  <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
                    <path d="M2 12h20"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Tiếng Anh</h3>
              <p className="text-gray-600 text-sm">Nâng cao kỹ năng tiếng Anh</p>
            </Link>

            <Link
              to="/subject/IELTS"
              className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all"
            >
              <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto transition-transform group-hover:scale-110">
                  <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">IELTS</h3>
              <p className="text-gray-600 text-sm">Luyện thi IELTS 4 kỹ năng</p>
            </Link>

            <Link
              to="/subject/Ngoại ngữ"
              className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all"
            >
              <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-6 mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto transition-transform group-hover:scale-110">
                  <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Ngoại ngữ</h3>
              <p className="text-gray-600 text-sm">Học tiếng Nhật và các ngôn ngữ khác</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home

