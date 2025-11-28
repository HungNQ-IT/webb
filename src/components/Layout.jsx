import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900">
      <Sidebar />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout

