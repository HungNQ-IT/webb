import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function BottomNav() {
    const location = useLocation()
    const { user } = useAuth()

    const navItems = [
        { path: '/', label: 'Trang chủ', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /> },
        { path: '/exams', label: 'Đề thi', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /> },
        { path: '/roadmap', label: 'Lộ trình', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /> },
        { path: '/progress', label: 'Tiến độ', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /> },
        { path: '/profile', label: 'Tôi', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /> },
    ]

    // Thêm link Admin nếu user có role admin
    const adminNavItem = user?.role === 'admin' ? [
        { path: '/admin', label: 'Admin', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />, highlight: true }
    ] : []

    const allNavItems = [...navItems, ...adminNavItem]

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface dark:bg-slate-900 border-t border-neutral-200 dark:border-slate-800 pb-safe z-50">
            <div className="flex items-center justify-around h-16 px-2">
                {allNavItems.map((item) => {
                    const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                                item.highlight 
                                    ? 'text-orange-600 dark:text-orange-400' 
                                    : isActive 
                                        ? 'text-primary-base' 
                                        : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300'
                            }`}
                        >
                            <div className={`relative p-1 rounded-full transition-all duration-300 ${
                                item.highlight 
                                    ? 'bg-orange-100 dark:bg-orange-900/30' 
                                    : isActive 
                                        ? 'bg-primary-subtle dark:bg-primary-900/30' 
                                        : ''
                            }`}>
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {item.icon}
                                </svg>
                                {isActive && (
                                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-base border-2 border-surface dark:border-slate-900"></span>
                                    </span>
                                )}
                            </div>
                            <span className={`text-[10px] font-semibold ${
                                item.highlight 
                                    ? 'text-orange-600 dark:text-orange-400' 
                                    : isActive 
                                        ? 'text-primary-base' 
                                        : ''
                            }`}>{item.label}</span>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}

export default BottomNav
