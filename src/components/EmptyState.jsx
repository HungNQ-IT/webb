import { Link } from 'react-router-dom'

const illustrations = {
  empty: (
    <svg className="w-24 h-24 text-gray-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
    </svg>
  ),
  search: (
    <svg className="w-24 h-24 text-gray-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  error: (
    <svg className="w-24 h-24 text-gray-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  success: (
    <svg className="w-24 h-24 text-gray-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  quiz: (
    <svg className="w-24 h-24 text-gray-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  lock: (
    <svg className="w-24 h-24 text-gray-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  )
}

export default function EmptyState({
  type = 'empty',
  title = 'Không có dữ liệu',
  description = 'Hiện tại chưa có nội dung nào ở đây.',
  action = null,
  secondaryAction = null,
  compact = false
}) {
  return (
    <div className={`flex flex-col items-center justify-center text-center ${compact ? 'py-12' : 'py-20'}`}>
      <div className={`${compact ? 'w-16 h-16' : 'w-24 h-24'} bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 animate-fade-in`}>
        {illustrations[type] || illustrations.empty}
      </div>
      
      <h3 className={`font-bold text-gray-900 dark:text-gray-100 mb-2 ${compact ? 'text-lg' : 'text-xl'}`}>
        {title}
      </h3>
      
      <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
        {description}
      </p>
      
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {action && (
          action.to ? (
            <Link
              to={action.to}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all hover:shadow-lg flex items-center gap-2"
            >
              {action.icon && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
                </svg>
              )}
              {action.label}
            </Link>
          ) : (
            <button
              onClick={action.onClick}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all hover:shadow-lg flex items-center gap-2"
            >
              {action.icon && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
                </svg>
              )}
              {action.label}
            </button>
          )
        )}
        
        {secondaryAction && (
          secondaryAction.to ? (
            <Link
              to={secondaryAction.to}
              className="px-6 py-2.5 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-slate-700 transition-all"
            >
              {secondaryAction.label}
            </Link>
          ) : (
            <button
              onClick={secondaryAction.onClick}
              className="px-6 py-2.5 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-slate-700 transition-all"
            >
              {secondaryAction.label}
            </button>
          )
        )}
      </div>
    </div>
  )
}

// Preset configurations for common use cases
export function EmptyQuizList({ subject, onBack }) {
  return (
    <EmptyState
      type="quiz"
      title="Chưa có bài tập nào"
      description={`Hiện tại chưa có bài tập nào cho ${subject || 'môn học này'}. Vui lòng quay lại sau hoặc chọn môn học khác.`}
      action={{
        label: 'Quay lại',
        onClick: onBack,
        icon: 'M10 19l-7-7m0 0l7-7m-7 7h18'
      }}
    />
  )
}

export function EmptySearch({ searchTerm, onClear }) {
  return (
    <EmptyState
      type="search"
      title="Không tìm thấy kết quả"
      description={`Không tìm thấy kết quả nào cho "${searchTerm}". Vui lên thử từ khóa khác.`}
      action={{
        label: 'Xóa tìm kiếm',
        onClick: onClear,
        icon: 'M6 18L18 6M6 6l12 12'
      }}
    />
  )
}

export function EmptyResults({ onRetry }) {
  return (
    <EmptyState
      type="empty"
      title="Chưa có kết quả"
      description="Bạn chưa làm bài kiểm tra nào. Hãy bắt đầu làm bài để xem kết quả của mình."
      action={{
        label: 'Làm bài ngay',
        to: '/subjects',
        icon: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
      }}
    />
  )
}

export function ErrorState({ error, onRetry }) {
  return (
    <EmptyState
      type="error"
      title="Đã xảy ra lỗi"
      description={error || 'Không thể tải dữ liệu. Vui lòng thử lại sau.'}
      action={{
        label: 'Thử lại',
        onClick: onRetry,
        icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
      }}
    />
  )
}

export function UnauthorizedState() {
  return (
    <EmptyState
      type="lock"
      title="Không có quyền truy cập"
      description="Bạn cần đăng nhập để xem nội dung này."
      action={{
        label: 'Đăng nhập',
        to: '/login',
        icon: 'M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1'
      }}
      secondaryAction={{
        label: 'Về trang chủ',
        to: '/'
      }}
    />
  )
}
