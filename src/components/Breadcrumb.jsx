import { Link, useLocation } from 'react-router-dom'

export default function Breadcrumb({ items }) {
    // items: [{ label: 'Trang chủ', path: '/' }, { label: 'Môn học', path: '/subjects' }, ...]

    if (!items || items.length === 0) return null

    return (
        <nav className="flex items-center space-x-2 text-caption font-semibold text-neutral-500 overflow-x-auto whitespace-nowrap pb-2 scrollbar-none">
            {items.map((item, index) => {
                const isLast = index === items.length - 1
                return (
                    <div key={index} className="flex items-center">
                        {isLast ? (
                            <span className="text-neutral-900 dark:text-neutral-100 font-bold">{item.label}</span>
                        ) : item.path ? (
                            <>
                                <Link to={item.path} className="hover:text-primary-base transition-colors">
                                    {item.label}
                                </Link>
                                <svg className="w-3.5 h-3.5 mx-2 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                </svg>
                            </>
                        ) : (
                            <>
                                <span>{item.label}</span>
                                <svg className="w-3.5 h-3.5 mx-2 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                </svg>
                            </>
                        )}
                    </div>
                )
            })}
        </nav>
    )
}
