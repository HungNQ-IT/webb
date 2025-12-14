import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <header className="bg-white dark:bg-slate-800 shadow-md dark:shadow-slate-900/50 border-b border-gray-200 dark:border-slate-700">
      <div className="container mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:shadow-lg group-hover:scale-105">
            <svg
              className="w-7 h-7 text-white transition-all duration-500 ease-out group-hover:-translate-y-1 group-hover:rotate-12 group-hover:scale-110"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
            </svg>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Gia Sư 10 Điểm</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link to="/subjects" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Môn học</Link>
          {isAuthenticated && user?.role === 'admin' && (
            <Link to="/admin" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Quản lý</Link>
          )}
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">Đăng nhập</Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
              >
                Đăng ký
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-slate-700"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                    {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="hidden md:inline">
                  Xin chào, <strong className="text-gray-900 dark:text-gray-100">{user.name || user.email}</strong>
                </span>
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 font-medium transition-colors"
              >
                Đăng xuất
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar

