import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'

function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-slate-900 pb-16 lg:pb-0 relative">
      <Sidebar />
      <Navbar />
      <main className="flex-1 w-full relative z-0">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}

export default Layout

