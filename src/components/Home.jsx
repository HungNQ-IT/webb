import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

function Home() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  // Countdown Timer Logic
  const [timeLeft, setTimeLeft] = useState({ days: 45, hours: 12, minutes: 30, seconds: 0 })

  const practiceStartPath = isAuthenticated ? '/exams' : '/register'

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 }
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 }
        return prev
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const scrollToSubjects = (e) => {
    e.preventDefault()
    const element = document.getElementById('subjects')
    if (element) {
      const targetPosition = element.getBoundingClientRect().top + window.pageYOffset
      const startPosition = window.pageYOffset
      const distance = targetPosition - startPosition - 80 // offset header
      const duration = 800
      let start = null

      window.requestAnimationFrame(function step(timestamp) {
        if (!start) start = timestamp
        const progress = timestamp - start
        const ease = progress / duration < 0.5
          ? 2 * progress * progress / (duration * duration)
          : -1 + (4 - 2 * progress / duration) * progress / duration
        window.scrollTo(0, startPosition + distance * ease)
        if (progress < duration) window.requestAnimationFrame(step)
      })
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-slate-900 pb-20 selection:bg-primary-subtle selection:text-primary-base">

      {/* 1. HERO SECTION */}
      <div className="relative pt-24 pb-20 lg:pt-32 lg:pb-28 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

            {/* Content */}
            <div className="lg:w-1/2 text-center lg:text-left z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-semantic-info-subtle border border-semantic-info-border text-semantic-info-base text-caption font-semibold animate-fade-in-up">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-semantic-info-base opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-semantic-info-base"></span>
                </span>
                Cập nhật cấu trúc đề ĐGNL 2024
              </div>

              <h1 className="text-display text-neutral-900 dark:text-neutral-50 mb-6 animate-fade-in-up animation-delay-200">
                Ôn luyện <br />
                <span className="text-primary-base">ĐGNL & THPT Quốc Gia</span>
              </h1>

              <p className="text-body-lg text-neutral-600 dark:text-neutral-400 mb-8 max-w-xl mx-auto lg:mx-0 animate-fade-in-up animation-delay-400">
                Hơn <strong className="text-neutral-900 dark:text-neutral-100">15,000+</strong> học sinh đã trúng tuyển đại học top đầu bằng lộ trình luyện đề cá nhân hóa tại Gia Sư 10 Điểm. Không nhồi nhét, học đúng trọng tâm.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-fade-in-up animation-delay-600">
                <Link
                  to={practiceStartPath}
                  className="w-full sm:w-auto px-8 py-3.5 bg-primary-base text-white rounded-base font-semibold transition-all hover:bg-primary-hover shadow-base hover:shadow-md hover:-translate-y-0.5 text-center"
                >
                  Luyện thi ngay — Miễn phí
                </Link>
                <a
                  href="#subjects"
                  onClick={scrollToSubjects}
                  className="w-full sm:w-auto px-8 py-3.5 bg-surface dark:bg-slate-800 text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-slate-600 rounded-base font-semibold hover:bg-neutral-50 dark:hover:bg-slate-700 hover:border-neutral-400 transition-all text-center"
                >
                  Xem lộ trình ôn thi
                </a>
              </div>

              <div className="mt-8 flex items-center justify-center lg:justify-start gap-4 text-caption text-neutral-500 animate-fade-in-up animation-delay-800">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className={`w-8 h-8 rounded-full border-2 border-surface bg-neutral-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden z-[${10 - i}]`}>
                      <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <p>Cùng 15,000+ học sinh 2k6 đang ôn luyện</p>
              </div>
            </div>

            {/* Visual Dashboard Mockup (Academic Edtech Feel) */}
            <div className="lg:w-1/2 w-full animate-fade-in-up animation-delay-400 relative flex justify-center items-center mt-10 lg:mt-0">
              {/* Decorative elements behind mockup */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-lg pointer-events-none">
                <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 w-[250px] lg:w-[300px] h-[250px] lg:h-[300px] bg-primary-base/20 rounded-full blur-3xl z-0"></div>
                <div className="absolute bottom-0 left-0 transform -translate-x-1/4 translate-y-1/4 w-[200px] lg:w-[250px] h-[200px] lg:h-[250px] bg-accent-base/20 rounded-full blur-3xl z-0"></div>
              </div>

              <div className="bg-surface dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 rounded-lg shadow-lg p-6 lg:p-8 transform transition-transform hover:-translate-y-2 hover:shadow-xl w-full max-w-lg relative z-10 mx-auto">

                {/* Mockup Header */}
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-neutral-100 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-base bg-semantic-info-subtle text-semantic-info-base flex items-center justify-center font-bold">
                      H
                    </div>
                    <div>
                      <div className="text-body-sm font-semibold text-neutral-900 dark:text-neutral-100">Lộ trình ĐGNL ĐHQG HCM</div>
                      <div className="text-caption text-neutral-500">Mục tiêu: 850+</div>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-semantic-success-subtle text-semantic-success-base text-caption font-bold rounded-full">
                    Sẵn sàng
                  </div>
                </div>

                {/* Progress Tracking */}
                <div className="mb-6">
                  <div className="flex justify-between text-body-sm mb-2 font-medium">
                    <span className="text-neutral-600 dark:text-neutral-400">Tiến độ tuần</span>
                    <span className="text-primary-base">75%</span>
                  </div>
                  <div className="w-full bg-neutral-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-primary-base h-2.5 rounded-full w-3/4"></div>
                  </div>
                </div>

                {/* Simulated Quiz Question */}
                <div className="bg-neutral-50 dark:bg-slate-900 rounded-base border border-neutral-200 dark:border-slate-700 p-5">
                  <div className="flex gap-2 mb-3">
                    <span className="px-2 py-0.5 rounded-sm bg-neutral-200 dark:bg-slate-600 text-caption font-semibold text-neutral-700 dark:text-neutral-300">Câu 15</span>
                    <span className="px-2 py-0.5 rounded-sm bg-semantic-warning-subtle text-semantic-warning-base border border-semantic-warning-border text-caption font-semibold">Toán Logic</span>
                  </div>
                  <p className="text-body-sm text-neutral-800 dark:text-neutral-200 mb-4 font-medium leading-relaxed">
                    Đồ thị hàm số <code className="bg-neutral-200 dark:bg-slate-800 px-1 rounded">y = f(x)</code> có đường tiệm cận ngang là...
                  </p>

                  <div className="space-y-2">
                    {['y = 1', 'y = -1', 'y = 2'].map((ans, idx) => (
                      <div key={idx} className={`px-4 py-2 border rounded-base text-body-sm flex items-center gap-3 ${idx === 0 ? 'bg-primary-subtle border-primary-base text-primary-base font-medium' : 'bg-surface dark:bg-slate-800 border-neutral-200 dark:border-slate-600 text-neutral-600 dark:text-neutral-400'}`}>
                        <div className={`w-4 h-4 rounded-full border flex-shrink-0 ${idx === 0 ? 'border-primary-base bg-primary-base shadow-inner' : 'border-neutral-300'}`}></div>
                        {ans}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit button Mock */}
                <div className="mt-5 flex justify-end">
                  <div className="px-6 py-2 bg-primary-base text-white rounded-base text-body-sm font-semibold shadow-sm">
                    Nộp bài
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0"></div>
      </div>

      {/* 2. SOCIAL PROOF SECTION */}
      <div className="border-y border-neutral-200 dark:border-slate-800 bg-surface dark:bg-slate-900 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center max-w-5xl mx-auto">
            <div>
              <div className="text-h1 text-neutral-900 dark:text-neutral-50 mb-1">15K+</div>
              <div className="text-body-sm text-neutral-500 font-medium">Học viên đang ôn luyện</div>
            </div>
            <div>
              <div className="text-h1 text-neutral-900 dark:text-neutral-50 mb-1">50K+</div>
              <div className="text-body-sm text-neutral-500 font-medium">Câu hỏi trắc nghiệm</div>
            </div>
            <div>
              <div className="text-h1 text-neutral-900 dark:text-neutral-50 mb-1">300+</div>
              <div className="text-body-sm text-neutral-500 font-medium">Đề thi ĐGNL & THPT</div>
            </div>
            <div>
              <div className="text-h1 text-neutral-900 dark:text-neutral-50 mb-1">98%</div>
              <div className="text-body-sm text-neutral-500 font-medium">Đạt điểm mục tiêu</div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonial Cards */}
      <div className="py-20 bg-neutral-50 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <h2 className="text-h2 text-center text-neutral-900 dark:text-neutral-100 mb-12 tracking-tight">Thành tích học viên</h2>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                name: 'Minh Anh', quote: 'Lộ trình Toán Logic trên web siêu hay, mình đã làm đi làm lại và đạt 920 ĐGNL ĐHQG.',
                score: '920 ĐGNL', exam: 'ĐHQG HCM'
              },
              {
                name: 'Hoàng Long', quote: 'Giải thích đáp án cực kỳ chi tiết, giúp mình lấp lỗ hổng Hóa học chỉ trong 1 tháng.',
                score: '26.5', exam: 'THPT Quốc Gia'
              },
              {
                name: 'Thảo Vy', quote: 'Tính năng track thời gian phòng thi áp lực hệt như thi thật, giúp mình không bị tâm lý.',
                score: '7.5', exam: 'IELTS'
              }
            ].map((testi, idx) => (
              <div key={idx} className="bg-surface dark:bg-slate-800 p-6 rounded-lg border border-neutral-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex text-accent-base mb-4">
                    {'★★★★★'.split('').map((star, i) => <span key={i}>{star}</span>)}
                  </div>
                  <p className="text-body text-neutral-700 dark:text-neutral-300 mb-6 italic">
                    "{testi.quote}"
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-neutral-100 dark:border-slate-700">
                  <div className="w-10 h-10 rounded-full bg-primary-subtle flex items-center justify-center font-bold text-primary-base">
                    {testi.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-body-sm text-neutral-900 dark:text-neutral-100">{testi.name}</div>
                    <div className="text-caption text-neutral-500 font-medium">
                      <span className="text-primary-base font-bold">{testi.score}</span> • {testi.exam}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. FEATURES SECTION */}
      <div className="py-20 bg-surface dark:bg-slate-900 border-t border-neutral-200 dark:border-slate-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <div className="text-primary-base font-semibold text-body-sm uppercase tracking-wider mb-3">Phương pháp học tập</div>
            <h2 className="text-h2 text-neutral-900 dark:text-white mb-4 tracking-tight">Học đúng trọng tâm, ôn chuẩn cấu trúc</h2>
            <p className="text-body text-neutral-600 dark:text-neutral-400">
              Công cụ mạnh mẽ giúp bạn tối ưu từng phút giây tự học.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                ),
                title: "Đề thi cấu trúc thật",
                desc: "Kho đề khổng lồ được biên soạn bám sát ma trận đề thi mới nhất của Bộ GD&ĐT và ĐHQG."
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                ),
                title: "Giải thích Step-by-step",
                desc: "Không chỉ cung cấp đáp án đúng. Mọi câu hỏi đều có hướng dẫn tư duy giải quyết vấn đề cặn kẽ."
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 13v-1m4 1v-3m4 3V8M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
                ),
                title: "Phân tích điểm mạnh/yếu",
                desc: "Dashboard thống kê tự động chỉ ra những mảng kiến thức bạn đang làm sai nhiều nhất để kịp thời bù lấp."
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-neutral-50 dark:bg-slate-800 p-8 rounded-lg border border-neutral-100 dark:border-slate-700 hover:border-primary-base transition-colors duration-300">
                <div className="w-12 h-12 bg-surface text-primary-base rounded-base flex items-center justify-center mb-6 shadow-sm border border-neutral-200">
                  {feature.icon}
                </div>
                <h3 className="text-h3 text-neutral-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-body-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. EXAMS PREVIEW */}
      <div id="subjects" className="py-24 bg-neutral-50 dark:bg-slate-900 scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 max-w-6xl mx-auto gap-4">
            <div>
              <h2 className="text-h2 text-neutral-900 dark:text-white mb-2 tracking-tight">Kỳ thi trọng tâm</h2>
              <p className="text-body text-neutral-600 dark:text-neutral-400">Chọn kỳ thi của bạn để xem cấu trúc và bắt đầu luyện tập phân môn.</p>
            </div>
            <Link to="/exams" className="inline-flex items-center gap-2 text-primary-base hover:text-primary-hover font-semibold transition-colors">
              Xem toàn bộ đề thi <span className="text-lg">&rarr;</span>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">

            {/* Exam Card 1: DGNL HCM */}
            <Link to="/exam/dgnl-hcm" className="group bg-surface dark:bg-slate-800 rounded-lg p-6 border border-neutral-200 dark:border-slate-700 hover:shadow-md transition-all flex flex-col items-start hover:border-primary-base relative overflow-hidden">
              <div className="absolute top-0 right-0 py-1 px-3 bg-semantic-error-subtle text-semantic-error-base text-caption font-bold rounded-bl-base border-b border-l border-semantic-error-border">HOT</div>
              <div className="w-12 h-12 bg-primary-subtle text-primary-base rounded-base flex items-center justify-center mb-4 border border-primary-200 text-2xl">
                🎯
              </div>
              <h3 className="text-h3 text-neutral-900 dark:text-white mb-2">ĐGNL ĐHQG HCM</h3>
              <p className="text-body-sm text-neutral-500 mb-6 flex-1">Toán logic, Phân tích số liệu, Ngôn ngữ, và Khoa học tự nhiên.</p>
              <div className="w-full flex justify-between items-center text-caption font-semibold">
                <span className="text-neutral-500">Mục tiêu 850+</span>
                <span className="text-primary-base group-hover:translate-x-1 transition-transform">Khám phá &rarr;</span>
              </div>
            </Link>

            {/* Exam Card 2: DGNL HN */}
            <Link to="/exam/dgnl-hn" className="group bg-surface dark:bg-slate-800 rounded-lg p-6 border border-neutral-200 dark:border-slate-700 hover:shadow-md transition-all flex flex-col items-start hover:border-semantic-info-base relative overflow-hidden">
              <div className="w-12 h-12 bg-semantic-info-subtle text-semantic-info-base rounded-base flex items-center justify-center mb-4 border border-semantic-info-border text-2xl">
                🏛️
              </div>
              <h3 className="text-h3 text-neutral-900 dark:text-white mb-2">ĐGNL ĐHQG HN</h3>
              <p className="text-body-sm text-neutral-500 mb-6 flex-1">Tư duy định lượng, định tính và Khoa học theo form HSA.</p>
              <div className="w-full flex justify-between items-center text-caption font-semibold">
                <span className="text-neutral-500">Mục tiêu 100+</span>
                <span className="text-semantic-info-base group-hover:translate-x-1 transition-transform">Khám phá &rarr;</span>
              </div>
            </Link>

            {/* Exam Card 3: THPT QG */}
            <Link to="/exam/thpt-qg" className="group bg-surface dark:bg-slate-800 rounded-lg p-6 border border-neutral-200 dark:border-slate-700 hover:shadow-md transition-all flex flex-col items-start hover:border-semantic-success-base">
              <div className="w-12 h-12 bg-semantic-success-subtle text-semantic-success-base rounded-base flex items-center justify-center mb-4 border border-semantic-success-border text-2xl">
                🎓
              </div>
              <h3 className="text-h3 text-neutral-900 dark:text-white mb-2">THPT Quốc Gia</h3>
              <p className="text-body-sm text-neutral-500 mb-6 flex-1">Ôn luyện tổ hợp các môn KHTN, KHXH xét tuyển đại học.</p>
              <div className="w-full flex justify-between items-center text-caption font-semibold">
                <span className="text-neutral-500">Mục tiêu 27+</span>
                <span className="text-semantic-success-base group-hover:translate-x-1 transition-transform">Khám phá &rarr;</span>
              </div>
            </Link>

            {/* Exam Card 4: IELTS */}
            <Link to="/exam/ielts" className="group bg-surface dark:bg-slate-800 rounded-lg p-6 border border-neutral-200 dark:border-slate-700 hover:shadow-md transition-all flex flex-col items-start hover:border-semantic-error-base">
              <div className="w-12 h-12 bg-semantic-error-subtle text-semantic-error-base rounded-base flex items-center justify-center mb-4 border border-semantic-error-border text-2xl">
                🌏
              </div>
              <h3 className="text-h3 text-neutral-900 dark:text-white mb-2">IELTS Academic</h3>
              <p className="text-body-sm text-neutral-500 mb-6 flex-1">Thư viện luyện tập Listening và Reading chuẩn form quốc tế.</p>
              <div className="w-full flex justify-between items-center text-caption font-semibold">
                <span className="text-neutral-500">Mục tiêu 6.5+</span>
                <span className="text-semantic-error-base group-hover:translate-x-1 transition-transform">Khám phá &rarr;</span>
              </div>
            </Link>

            {/* Exam Card 5: SAT */}
            <Link to="/exam/sat" className="group bg-surface dark:bg-slate-800 rounded-lg p-6 border border-neutral-200 dark:border-slate-700 hover:shadow-md transition-all flex flex-col items-start hover:border-purple-600">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-base flex items-center justify-center mb-4 border border-purple-200 text-2xl">
                📚
              </div>
              <h3 className="text-h3 text-neutral-900 dark:text-white mb-2">Digital SAT</h3>
              <p className="text-body-sm text-neutral-500 mb-6 flex-1">Ôn tập Reading & Writing và Math bằng tiếng Anh chuẩn hóa.</p>
              <div className="w-full flex justify-between items-center text-caption font-semibold">
                <span className="text-neutral-500">Mục tiêu 1400+</span>
                <span className="text-purple-600 group-hover:translate-x-1 transition-transform">Khám phá &rarr;</span>
              </div>
            </Link>

          </div>
        </div>
      </div>

      {/* 5. CTA FINAL WITH URGENCY */}
      <div className="container mx-auto px-4 pb-12">
        <div className="bg-primary-base rounded-lg p-8 lg:p-12 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-10 max-w-6xl mx-auto">

          <div className="relative z-10 lg:w-3/5 text-center lg:text-left">
            <h2 className="text-h2 md:text-display font-bold text-white mb-4 tracking-tight">Kỳ thi đang tới gần!</h2>
            <p className="text-primary-subtle text-body-lg mb-8 opacity-90">
              Đừng để nước đến chân mới nhảy. Hãy bắt đầu ôn luyện ngay hôm nay để tự tin bước vào phòng thi. Gia Sư 10 Điểm miễn phí 100%.
            </p>

            {/* Inline Registration Form Mock */}
            <form
              className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto lg:mx-0"
              onSubmit={(e) => {
                e.preventDefault()
                navigate(practiceStartPath)
              }}
            >
              <input
                type="email"
                placeholder="Nhập email của bạn..."
                className="flex-1 px-4 py-3.5 rounded-base text-body-sm text-neutral-900 border-none outline-none focus:ring-2 focus:ring-accent-base"
                required
              />
              <button
                type="submit"
                className="px-6 py-3.5 bg-accent-base hover:bg-accent-hover text-white rounded-base font-semibold transition-colors shadow-sm whitespace-nowrap"
              >
                Tạo tài khoản học
              </button>
            </form>
            <p className="mt-3 text-caption text-primary-subtle opacity-80">Hoàn toàn miễn phí. Hủy bất kỳ lúc nào.</p>
          </div>

          <div className="relative z-10 lg:w-2/5 flex flex-col items-center">
            <div className="text-caption font-bold text-white uppercase tracking-widest mb-4 opacity-80">Thời gian đếm ngược ĐGNL</div>
            <div className="flex gap-4 text-center">
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-3 w-16 md:w-20">
                <div className="text-h2 font-bold text-white mb-1">{timeLeft.days}</div>
                <div className="text-caption text-primary-subtle uppercase">Ngày</div>
              </div>
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-3 w-16 md:w-20">
                <div className="text-h2 font-bold text-white mb-1">{timeLeft.hours}</div>
                <div className="text-caption text-primary-subtle uppercase">Giờ</div>
              </div>
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-3 w-16 md:w-20">
                <div className="text-h2 font-bold text-white mb-1">{timeLeft.minutes}</div>
                <div className="text-caption text-primary-subtle uppercase">Phút</div>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <svg className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 opacity-20 w-[600px] h-[600px] text-white" fill="none" stroke="currentColor" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="80" strokeWidth="20" />
            <circle cx="100" cy="100" r="40" strokeWidth="20" />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default Home
