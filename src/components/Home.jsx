import { Link } from 'react-router-dom'

function Home() {
  const scrollToSubjects = (e) => {
    e.preventDefault()
    const element = document.getElementById('subjects')
    if (element) {
      // Custom smooth scroll function
      const targetPosition = element.getBoundingClientRect().top + window.pageYOffset
      const startPosition = window.pageYOffset
      const distance = targetPosition - startPosition
      const duration = 1500 // 1.5 seconds (slower)
      let start = null

      window.requestAnimationFrame(step)

      function step(timestamp) {
        if (!start) start = timestamp
        const progress = timestamp - start

        // Ease-in-out cubic function
        const ease = progress / duration < 0.5
          ? 4 * progress * progress * progress / (duration * duration * duration)
          : 1 - Math.pow(-2 * progress / duration + 2, 3) / 2

        window.scrollTo(0, startPosition + distance * ease)

        if (progress < duration) {
          window.requestAnimationFrame(step)
        }
      }
    }
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <div className="relative pt-20 pb-32 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Text Content */}
            <div className="lg:w-1/2 text-center lg:text-left">
              <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium text-sm animate-fade-in-up">
                🚀 Nền tảng ôn luyện số 1 Việt Nam
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight animate-fade-in-up animation-delay-200">
                Chinh phục <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                  điểm 10
                </span>{' '}
                dễ dàng
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0 animate-fade-in-up animation-delay-400">
                Hệ thống bài tập đa dạng, bám sát chương trình học.
                Giúp bạn nắm vững kiến thức và tự tin trong mọi kỳ thi.
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-4 animate-fade-in-up animation-delay-600">
                <a
                  href="#subjects"
                  onClick={scrollToSubjects}
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-blue-500/30"
                >
                  Bắt đầu ngay
                </a>
                <Link to="/register" className="px-8 py-4 bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-700 rounded-2xl font-bold text-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-all hover:scale-105">
                  Đăng ký miễn phí
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 mt-12 border-t border-gray-200 dark:border-slate-800 pt-8 animate-fade-in-up animation-delay-800">
                <div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">20+</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Bài tập</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">7+</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Môn học</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">100%</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Miễn phí</div>
                </div>
              </div>
            </div>

            {/* Visual Content */}
            <div className="lg:w-1/2 relative animate-float">
              <div className="relative z-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-[2rem] p-8 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-inner">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-2xl">📚</div>
                    <div>
                      <div className="h-2 w-32 bg-gray-200 dark:bg-slate-700 rounded mb-2"></div>
                      <div className="h-2 w-20 bg-gray-200 dark:bg-slate-700 rounded"></div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 dark:bg-slate-800">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 font-bold text-sm">
                          {i}
                        </div>
                        <div className="flex-1">
                          <div className="h-2 w-full bg-gray-200 dark:bg-slate-700 rounded"></div>
                        </div>
                        <div className="w-4 h-4 rounded-full border-2 border-green-500"></div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-center">
                    <div className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold">
                      Nộp bài
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Tại sao chọn Gia Sư 10 Điểm?</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Nền tảng được thiết kế tối ưu cho việc tự học và ôn luyện, giúp bạn tiết kiệm thời gian và đạt hiệu quả cao nhất.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: "🎯",
              title: "Bám sát chương trình",
              desc: "Nội dung bài tập được cập nhật liên tục theo chương trình giáo dục mới nhất."
            },
            {
              icon: "💡",
              title: "Giải thích chi tiết",
              desc: "Mỗi câu hỏi đều có lời giải chi tiết giúp bạn hiểu rõ bản chất vấn đề."
            },
            {
              icon: "📊",
              title: "Thống kê tiến độ",
              desc: "Theo dõi quá trình học tập và sự tiến bộ của bản thân qua từng ngày."
            }
          ].map((feature, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-3xl mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Subjects Grid */}
      <div id="subjects" className="container mx-auto px-4 py-20">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Khám phá môn học</h2>
            <p className="text-gray-600 dark:text-gray-400">Chọn môn học bạn muốn chinh phục hôm nay</p>
          </div>
          <Link to="/subjects" className="hidden md:flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium hover:underline">
            Xem tất cả <span className="text-xl">→</span>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Math */}
          <Link to="/subject/Toán/grades" className="group relative overflow-hidden bg-white dark:bg-slate-800 rounded-3xl p-1 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <div className="h-full p-6 flex flex-col relative z-10">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Toán Học</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex-1">Đại số, Hình học và các bài toán tư duy logic.</p>
              <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-bold">
                Bắt đầu học <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>

          {/* Physics */}
          <Link to="/subject/Vật Lý/grades" className="group relative overflow-hidden bg-white dark:bg-slate-800 rounded-3xl p-1 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <div className="h-full p-6 flex flex-col relative z-10">
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/50 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Vật Lý</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex-1">Cơ học, Điện học và các hiện tượng tự nhiên.</p>
              <div className="flex items-center text-purple-600 dark:text-purple-400 text-sm font-bold">
                Bắt đầu học <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>

          {/* Chemistry */}
          <Link to="/subject/Hóa Học/grades" className="group relative overflow-hidden bg-white dark:bg-slate-800 rounded-3xl p-1 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <div className="h-full p-6 flex flex-col relative z-10">
              <div className="w-14 h-14 bg-green-100 dark:bg-green-900/50 rounded-2xl flex items-center justify-center text-green-600 dark:text-green-400 mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Hóa Học</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex-1">Phản ứng hóa học và bảng tuần hoàn nguyên tố.</p>
              <div className="flex items-center text-green-600 dark:text-green-400 text-sm font-bold">
                Bắt đầu học <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>

          {/* English */}
          <Link to="/subject/Tiếng Anh/grades" className="group relative overflow-hidden bg-white dark:bg-slate-800 rounded-3xl p-1 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-amber-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <div className="h-full p-6 flex flex-col relative z-10">
              <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/50 rounded-2xl flex items-center justify-center text-orange-600 dark:text-orange-400 mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Tiếng Anh</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex-1">Ngữ pháp, từ vựng và kỹ năng giao tiếp.</p>
              <div className="flex items-center text-orange-600 dark:text-orange-400 text-sm font-bold">
                Bắt đầu học <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>

          {/* IELTS */}
          <Link to="/subject/IELTS" className="group relative overflow-hidden bg-white dark:bg-slate-800 rounded-3xl p-1 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-rose-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <div className="h-full p-6 flex flex-col relative z-10">
              <div className="w-14 h-14 bg-red-100 dark:bg-red-900/50 rounded-2xl flex items-center justify-center text-red-600 dark:text-red-400 mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">IELTS</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex-1">Luyện thi chứng chỉ quốc tế 4 kỹ năng.</p>
              <div className="flex items-center text-red-600 dark:text-red-400 text-sm font-bold">
                Bắt đầu học <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>

          {/* More Subjects */}
          <Link to="/subjects" className="group relative overflow-hidden bg-gray-50 dark:bg-slate-800/50 rounded-3xl p-1 border-2 border-dashed border-gray-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300">
            <div className="h-full p-6 flex flex-col items-center justify-center text-center relative z-10">
              <div className="w-14 h-14 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-500 mb-4 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Xem thêm</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Khám phá tất cả môn học</p>
            </div>
          </Link>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-[2.5rem] p-12 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Sẵn sàng bứt phá điểm số?</h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Tham gia cộng đồng học tập cùng hàng ngàn học sinh khác ngay hôm nay.
            </p>
            <Link to="/register" className="inline-block px-10 py-4 bg-white text-blue-600 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg">
              Đăng ký tài khoản ngay
            </Link>
          </div>

          {/* Decorative Circles */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-400 opacity-20 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
        </div>
      </div>
    </div>
  )
}

export default Home
