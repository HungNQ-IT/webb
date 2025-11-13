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
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
        <Link to="/" className="text-2xl font-bold text-indigo-600">
          Gia Sư 10 Điểm
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link to="/subjects" className="text-gray-700 hover:text-indigo-600">Môn học</Link>
          {isAuthenticated && user?.role === 'admin' && (
            <Link to="/admin" className="text-gray-700 hover:text-indigo-600">Quản lý</Link>
          )}
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="text-indigo-600 hover:text-indigo-800">Đăng nhập</Link>
              <Link
                to="/register"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Đăng ký
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-gray-600">
                Xin chào, <strong>{user.name || user.email}</strong>
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-red-600 font-medium"
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

