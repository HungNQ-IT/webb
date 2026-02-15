export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden animate-pulse">
      <div className="h-1.5 w-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-slate-700 dark:to-slate-600"></div>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="h-6 w-16 bg-gray-200 dark:bg-slate-700 rounded-full"></div>
        </div>
        <div className="h-6 w-3/4 bg-gray-200 dark:bg-slate-700 rounded mb-2"></div>
        <div className="h-4 w-full bg-gray-200 dark:bg-slate-700 rounded mb-2"></div>
        <div className="h-4 w-2/3 bg-gray-200 dark:bg-slate-700 rounded"></div>
        
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 dark:border-slate-700">
          <div className="flex gap-4">
            <div className="h-4 w-16 bg-gray-200 dark:bg-slate-700 rounded"></div>
            <div className="h-4 w-12 bg-gray-200 dark:bg-slate-700 rounded"></div>
          </div>
        </div>
        
        <div className="mt-4 h-11 w-full bg-gray-200 dark:bg-slate-700 rounded-xl"></div>
      </div>
    </div>
  )
}

export function SkeletonSubjectCard() {
  return (
    <div className="group relative overflow-hidden bg-white dark:bg-slate-800 rounded-3xl p-1 shadow-sm animate-pulse">
      <div className="h-full p-6 flex flex-col">
        <div className="w-14 h-14 bg-gray-200 dark:bg-slate-700 rounded-2xl mb-6"></div>
        <div className="h-6 w-32 bg-gray-200 dark:bg-slate-700 rounded mb-2"></div>
        <div className="h-4 w-full bg-gray-200 dark:bg-slate-700 rounded mb-4"></div>
        <div className="h-4 w-24 bg-gray-200 dark:bg-slate-700 rounded"></div>
      </div>
    </div>
  )
}

export function SkeletonQuiz() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-6 md:py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header Skeleton */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 animate-pulse">
            <div className="h-1 w-full bg-gray-200 dark:bg-slate-700 mb-6"></div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="h-4 w-20 bg-gray-200 dark:bg-slate-700 rounded mb-2"></div>
                <div className="h-8 w-3/4 bg-gray-200 dark:bg-slate-700 rounded"></div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-10 w-24 bg-gray-200 dark:bg-slate-700 rounded-xl"></div>
                <div className="h-10 w-24 bg-gray-200 dark:bg-slate-700 rounded-xl"></div>
              </div>
            </div>
          </div>
          
          {/* Question Skeleton */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 md:p-8 min-h-[400px] animate-pulse">
            <div className="h-6 w-full bg-gray-200 dark:bg-slate-700 rounded mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-16 w-full bg-gray-200 dark:bg-slate-700 rounded-xl"></div>
              ))}
            </div>
          </div>
          
          {/* Pagination Skeleton */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 animate-pulse">
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                <div key={i} className="w-10 h-10 bg-gray-200 dark:bg-slate-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function SkeletonList({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"
          style={{ width: i === lines - 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  )
}

export function SkeletonAvatar({ size = 'md' }) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  }
  
  return (
    <div className={`${sizes[size]} bg-gray-200 dark:bg-slate-700 rounded-full animate-pulse`} />
  )
}

export function SkeletonButton({ className = '' }) {
  return (
    <div className={`h-10 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse ${className}`} />
  )
}
