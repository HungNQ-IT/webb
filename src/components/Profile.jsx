import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from './ThemeToggle'

/**
 * User Dashboard Component
 * Designed to feel like a modern Gamified Edtech dashboard.
 */
function Profile() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)

  // Mock data for new Dashboard features
  const exams = [
    { title: 'ĐGNL HCM 2026', daysRemaining: 45, date: '25/04/2026' },
    { title: 'THPT Quốc Gia 2026', daysRemaining: 112, date: '28/06/2026' }
  ]

  const continueStudy = {
    subject: 'Toán',
    grade: 12,
    chapter: 'Chương 1: Ứng dụng đạo hàm',
    lesson: 'Khảo sát hàm số (Đề số 3)',
    progress: 65
  }

  const weakness = {
    topic: 'Hình học không gian',
    mistakes: 12,
    suggestionCount: 3
  }

  const leaderboardTop = [
    { rank: 1, name: 'Minh Anh', streak: 45, points: 12500, avatar: null },
    { rank: 2, name: 'Hoàng Long', streak: 30, points: 11200, avatar: null },
    { rank: 3, name: user?.name || 'Bạn', streak: 12, points: 9800, avatar: user?.avatar_url, isMe: true },
    { rank: 4, name: 'Thảo Vy', streak: 15, points: 8900, avatar: null },
  ]

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => setLoading(false), 500)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-base"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-slate-900 pb-20 lg:pb-12 pt-8 lg:pt-12 font-sans selection:bg-primary-subtle selection:text-primary-base">
      <div className="container mx-auto px-4 lg:px-6">

        <div className="max-w-6xl mx-auto">
          {/* Welcome Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 animate-fade-in-up">
            <div>
              <h1 className="text-h2 font-bold text-neutral-900 dark:text-white leading-tight">
                Chào buổi sáng, <span className="text-primary-base">{user?.name || user?.email?.split('@')[0] || 'Học viên'}</span>! ✌️
              </h1>
              <p className="text-body-lg text-neutral-600 dark:text-neutral-400 mt-2">Hôm nay là một ngày tuyệt vời để chinh phục tri thức.</p>
            </div>
            {/* Theme Toggle for mobile */}
            <div className="lg:hidden">
              <ThemeToggle />
            </div>
          </div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

            {/* LEFT COLUMN: Activity & Continue */}
            <div className="lg:col-span-8 space-y-6 lg:space-y-8 animate-fade-in-up animation-delay-100">

              {/* 1. Continue Studying Widget */}
              <div className="bg-surface dark:bg-slate-800 rounded-2xl shadow-sm border border-neutral-200 dark:border-slate-700 p-6 lg:p-8 relative overflow-hidden group">
                <div className="absolute -right-10 -bottom-10 opacity-5 dark:opacity-10 group-hover:scale-110 transition-transform duration-700">
                  <svg className="w-64 h-64 text-primary-base" fill="currentColor" viewBox="0 0 20 20"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" /></svg>
                </div>

                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-primary-subtle dark:bg-primary-900/30 flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary-base" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <h2 className="text-h3 font-bold text-neutral-900 dark:text-white">Tiếp tục ôn luyện</h2>
                </div>

                <div className="relative z-10">
                  <div className="flex items-center gap-2 text-caption font-bold text-primary-base mb-2 uppercase tracking-wider">{continueStudy.subject} • Lớp {continueStudy.grade}</div>
                  <div className="text-h3 font-bold text-neutral-900 dark:text-white mb-1 line-clamp-1">{continueStudy.chapter}</div>
                  <div className="text-body text-neutral-600 dark:text-neutral-400 mb-6">{continueStudy.lesson}</div>

                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-body-sm font-semibold text-neutral-700 dark:text-neutral-300">Đã hoàn thành {continueStudy.progress}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-neutral-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-primary-base rounded-full transition-all duration-1000 ease-out" style={{ width: `${continueStudy.progress}%` }}></div>
                    </div>
                  </div>

                  <Link to="/exams" className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold rounded-base hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-md text-body">
                    Vào học tiếp <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </Link>
                </div>
              </div>

              {/* 2. Weakness AI Suggested Widget */}
              <div className="bg-surface dark:bg-slate-800 rounded-2xl shadow-sm border border-semantic-warning-border p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-semantic-warning-base"></div>
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-full bg-semantic-warning-subtle flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-semantic-warning-base" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded-sm bg-semantic-warning-subtle text-semantic-warning-base text-[10px] font-bold uppercase tracking-wider">AI Phân tích</span>
                      <h2 className="text-h3 font-bold text-neutral-900 dark:text-white">Điểm yếu cần khắc phục</h2>
                    </div>
                    <p className="text-body text-neutral-600 dark:text-neutral-300 mt-2 mb-4 leading-relaxed">Hệ thống nhận thấy bạn có xu hướng trả lời sai nhiều câu hỏi phần <strong className="text-neutral-900 dark:text-white">"{weakness.topic}"</strong>. Đã phát hiện {weakness.mistakes} lỗi trong 3 đề gần nhất.</p>

                    <div className="flex items-center justify-between bg-neutral-50 dark:bg-slate-700/50 p-4 rounded-xl border border-neutral-200 dark:border-slate-600">
                      <div className="font-semibold text-neutral-800 dark:text-neutral-200 text-body-sm flex items-center gap-2">
                        <svg className="w-5 h-5 text-primary-base" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                        {weakness.suggestionCount} bài Luyện tập được đề xuất
                      </div>
                      <button className="px-4 py-2 bg-white dark:bg-slate-800 border-2 border-primary-base text-primary-base rounded-base font-bold text-body-sm shadow-sm hover:bg-primary-subtle transition-colors">
                        Ôn ngay
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Streak, Exams, Leaderboard */}
            <div className="lg:col-span-4 space-y-6 lg:space-y-8 animate-fade-in-up animation-delay-200">

              {/* 3. Daily Streak Widget (Duolingo style) */}
              <div className="bg-surface dark:bg-slate-800 rounded-2xl shadow-sm border border-neutral-200 dark:border-slate-700 p-6 flex items-center gap-6">
                <div className="relative">
                  <svg viewBox="0 0 36 36" className="w-20 h-20">
                    <path className="text-neutral-100 dark:text-slate-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                    <path className="text-semantic-warning-base" strokeDasharray="60, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-2xl font-black text-semantic-warning-base tracking-tighter">🔥12</div>
                </div>
                <div>
                  <h3 className="text-h3 font-bold text-neutral-900 dark:text-white mb-1">Chuỗi ngày học</h3>
                  <p className="text-body-sm font-medium text-neutral-500">Giữ lửa để nhận huy hiệu 14 ngày!</p>
                  <div className="flex gap-1.5 mt-3">
                    {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day, idx) => (
                      <div key={idx} className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${idx < 4 ? 'bg-semantic-warning-base text-white' : idx === 4 ? 'bg-semantic-warning-subtle text-semantic-warning-base border border-semantic-warning-base' : 'bg-neutral-100 dark:bg-slate-700 text-neutral-400'}`}>
                        {day}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 4. Upcoming Exams Widget */}
              <div className="bg-surface dark:bg-slate-800 rounded-2xl shadow-sm border border-neutral-200 dark:border-slate-700 overflow-hidden">
                <div className="p-5 border-b border-neutral-200 dark:border-slate-700 flex items-center justify-between">
                  <h3 className="text-body-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                    <svg className="w-5 h-5 text-semantic-error-base" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    Kỳ thi sắp tới
                  </h3>
                </div>
                <div className="p-5 space-y-4">
                  {exams.map((exam, i) => (
                    <div key={i} className="flex items-center justify-between group">
                      <div>
                        <div className="font-bold text-neutral-800 dark:text-neutral-200 text-body mb-0.5">{exam.title}</div>
                        <div className="text-caption font-medium text-neutral-500">{exam.date}</div>
                      </div>
                      <div className="bg-semantic-error-subtle dark:bg-semantic-error-base/20 text-semantic-error-base px-3 py-1.5 rounded-lg flex flex-col items-center justify-center min-w-[70px]">
                        <span className="text-h3 font-black leading-none">{exam.daysRemaining}</span>
                        <span className="text-[10px] uppercase font-bold tracking-wider">Ngày</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Leaderboard Widget */}
              <div className="bg-surface dark:bg-slate-800 rounded-2xl shadow-sm border border-neutral-200 dark:border-slate-700 overflow-hidden">
                <div className="p-5 border-b border-neutral-200 dark:border-slate-700 flex items-center justify-between">
                  <h3 className="text-body-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                    <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" /></svg>
                    Xếp hạng tuần
                  </h3>
                  <button className="text-caption font-semibold text-primary-base hover:text-primary-hover">Xem tất cả</button>
                </div>
                <div className="p-2">
                  {leaderboardTop.map((lb, i) => (
                    <div key={i} className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${lb.isMe ? 'bg-primary-subtle dark:bg-primary-900/40 border border-primary-200 dark:border-primary-800/50' : 'hover:bg-neutral-50 dark:hover:bg-slate-700/50'}`}>
                      <div className={`w-6 text-center font-bold text-body-sm ${lb.rank === 1 ? 'text-yellow-500' : lb.rank === 2 ? 'text-gray-400' : lb.rank === 3 ? 'text-amber-700 dark:text-amber-500' : 'text-neutral-400'}`}>
                        #{lb.rank}
                      </div>
                      <div className="w-8 h-8 rounded-full bg-primary-base text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {lb.avatar ? <img src={lb.avatar} className="w-full h-full rounded-full object-cover" alt="" /> : lb.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-body-sm font-bold truncate ${lb.isMe ? 'text-primary-base dark:text-primary-400' : 'text-neutral-900 dark:text-white'}`}>{lb.name} {lb.isMe && '(Bạn)'}</div>
                        <div className="text-caption text-neutral-500 font-medium flex items-center gap-1">🔥 {lb.streak} ngày</div>
                      </div>
                      <div className="text-body-sm font-black text-neutral-700 dark:text-neutral-300">
                        {lb.points}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  )
}

export default Profile
