function Loading({ message = 'Đang tải...', fullScreen = true }) {
  const containerClasses = fullScreen
    ? 'min-h-screen bg-gray-50 dark:bg-slate-900'
    : 'w-full h-full bg-gray-50/80 dark:bg-slate-900/80 backdrop-blur-sm absolute inset-0 z-50'

  return (
    <div className={`${containerClasses} flex items-center justify-center`}>
      <div className="text-center">
        <div className="relative inline-block">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur-lg opacity-50 animate-pulse"></div>
          
          {/* Main loader */}
          <div className="relative w-24 h-24 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-2xl">
            {/* Spinner */}
            <div className="absolute inset-0 rounded-2xl border-4 border-blue-100 dark:border-slate-700"></div>
            <div className="absolute inset-0 rounded-2xl border-4 border-transparent border-t-blue-600 animate-spin"></div>
            
            {/* Icon */}
            <svg 
              className="w-12 h-12 text-blue-600 animate-bounce-subtle" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
            </svg>
          </div>
        </div>
        
        <div className="mt-8 space-y-2">
          <p className="text-lg font-semibold text-gray-900 dark:text-white animate-fade-in">
            {message}
          </p>
          <div className="flex justify-center gap-1">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Loading
