import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { path: '/subjects', label: 'Môn học' },
    { path: '/exams', label: 'Đề thi' },
    { path: '/roadmap', label: 'Lộ trình ôn' },
    { path: '/leaderboard', label: 'Bảng xếp hạng' },
  ]

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 hidden lg:block ${isScrolled
        ? 'bg-surface/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm border-b border-neutral-200 dark:border-slate-800'
        : 'bg-surface dark:bg-slate-900 border-b border-transparent'
      }`}>
      <div className="container mx-auto px-6 h-16 flex items-center justify-between gap-8">

        {/* Left: Logo & Links */}
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary-base rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-sm">
              <span className="text-white font-black text-xl tracking-tighter">10</span>
            </div>
            <span className="text-xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">Giasu10Diem</span>
          </Link>

          <nav className="flex items-center gap-8 text-body-sm font-semibold">
            {navLinks.map(link => {
              const isActive = location.pathname.startsWith(link.path)
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative py-5 transition-colors ${isActive ? 'text-primary-base' : 'text-neutral-600 dark:text-neutral-300 hover:text-primary-base dark:hover:text-primary-400'}`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-base rounded-t-sm"></span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Right: Search, Notifications, Profile */}
        <div className="flex items-center gap-6">
          <button className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors p-2 bg-neutral-100 dark:bg-slate-800 rounded-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </button>

          {isAuthenticated && (
            <button className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors p-2 bg-neutral-100 dark:bg-slate-800 rounded-full relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-semantic-error-base rounded-full border-2 border-surface dark:border-slate-800"></span>
            </button>
          )}

          {!isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-neutral-700 dark:text-neutral-200 font-semibold hover:text-primary-base transition-colors text-body-sm">Đăng nhập</Link>
              <Link
                to="/register"
                className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-5 py-2.5 rounded-base hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-sm font-semibold text-body-sm"
              >
                Tạo tài khoản
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4 pl-6 border-l border-neutral-200 dark:border-slate-700">
              <Link to="/profile" className="flex items-center gap-3 group">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt="Avatar" className="w-9 h-9 rounded-full object-cover border-2 border-transparent group-hover:border-primary-base transition-all shadow-sm" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-primary-subtle text-primary-base flex items-center justify-center font-bold text-sm border-2 border-transparent group-hover:border-primary-base transition-all">
                    {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="hidden xl:block text-left">
                  <div className="text-body-sm font-bold text-neutral-900 dark:text-white leading-tight group-hover:text-primary-base transition-colors">{user.name || 'Học viên'}</div>
                  <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">{user.user_metadata?.grade ? `Lớp ${user.user_metadata.grade}` : 'Thành viên'}</div>
                </div>
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  )
}

export default Navbar
