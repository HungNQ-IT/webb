import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Collapsible Study Sidebar
 * Left panel shown when studying, toggleable.
 */
function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('lessons') // 'lessons' | 'notes'
  const location = useLocation()

  // Hide global generic sidebar since we have Navbar. Only show this specific study sidebar when studying or browsing subjects.
  const isStudyMode = location.pathname.includes('/quiz') || location.pathname.includes('/subject') || location.pathname.includes('/practice')

  if (!isStudyMode) return null

  const pathSegments = useMemo(() => location.pathname.split('/').filter(Boolean), [location.pathname])
  const decodedSubject = pathSegments[1] ? decodeURIComponent(pathSegments[1]) : 'Môn học'
  const grade = pathSegments[3] || null
  const category = pathSegments[3] ? decodeURIComponent(pathSegments[3]) : null

  const sidebarTitle = useMemo(() => {
    if (location.pathname.includes('/quiz/')) return `Làm bài ${decodedSubject}`
    if (location.pathname.includes('/grade/')) return `${decodedSubject} lớp ${grade}`
    if (location.pathname.includes('/category/')) return `${decodedSubject} - ${category}`
    if (location.pathname.includes('/exams')) return `${decodedSubject} - Danh sách đề`
    return decodedSubject
  }, [location.pathname, decodedSubject, grade, category])

  // Use neutral placeholder entries so the UI does not falsely show lessons as completed
  // before the learner has actually started or submitted anything.
  const courseContent = useMemo(() => {
    if (location.pathname.includes('/grade/')) {
      return [
        { title: 'Kiến thức nền tảng', progress: 0, isCurrent: true },
        { title: 'Luyện tập theo chuyên đề', progress: 0, isCurrent: false },
        { title: 'Bộ đề tổng hợp', progress: 0, isCurrent: false }
      ]
    }

    if (location.pathname.includes('/category/')) {
      return [
        { title: 'Chọn bộ bài phù hợp', progress: 0, isCurrent: true },
        { title: 'Bắt đầu làm bài', progress: 0, isCurrent: false },
        { title: 'Xem kết quả và ôn lại', progress: 0, isCurrent: false }
      ]
    }

    if (location.pathname.includes('/quiz/')) {
      return [
        { title: 'Đọc kỹ đề bài', progress: 0, isCurrent: true },
        { title: 'Làm từng câu hỏi', progress: 0, isCurrent: false },
        { title: 'Nộp bài và xem đáp án', progress: 0, isCurrent: false }
      ]
    }

    return [
      { title: 'Chọn chuyên đề hoặc lớp học', progress: 0, isCurrent: true },
      { title: 'Mở bài luyện tập đầu tiên', progress: 0, isCurrent: false },
      { title: 'Theo dõi tiến độ sau khi làm bài', progress: 0, isCurrent: false }
    ]
  }, [location.pathname])

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed left-0 top-1/2 -translate-y-1/2 z-40 bg-white dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 border-l-0 rounded-r-2xl py-4 px-2 shadow-lg hover:px-3 hover:text-primary-base transition-all duration-300 hidden lg:flex items-center group cursor-pointer"
        >
          <svg className="w-5 h-5 text-neutral-500 group-hover:text-primary-base transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <span className="[writing-mode:vertical-lr] text-xs font-bold text-neutral-500 group-hover:text-primary-base uppercase tracking-widest mt-2 transform rotate-180">Mục lục</span>
        </button>
      )}

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-neutral-900/40 z-40 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <div
        className={`fixed left-0 top-[64px] lg:top-[64px] bottom-0 w-80 bg-surface dark:bg-slate-900 shadow-2xl z-50 transform transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] flex flex-col border-r border-neutral-200 dark:border-slate-800 pb-16 lg:pb-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-neutral-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-body font-bold text-neutral-900 dark:text-white leading-tight">{sidebarTitle}</h2>
            <div className="text-caption font-semibold text-primary-base mt-0.5">Mục lục học tập</div>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2 bg-neutral-100 dark:bg-slate-800 text-neutral-500 rounded-full hover:bg-neutral-200 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex p-3 gap-2 bg-neutral-50 dark:bg-slate-800/50 border-b border-neutral-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('lessons')}
            className={`flex-1 py-2 text-body-sm font-bold rounded-lg transition-all ${activeTab === 'lessons' ? 'bg-white dark:bg-slate-700 text-primary-base shadow-sm ring-1 ring-primary-100 dark:ring-primary-900/50' : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-slate-700'}`}
          >
            Danh sách bài
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex-1 py-2 text-body-sm font-bold rounded-lg transition-all ${activeTab === 'notes' ? 'bg-white dark:bg-slate-700 text-primary-base shadow-sm ring-1 ring-primary-100 dark:ring-primary-900/50' : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-slate-700'}`}
          >
            Ghi chú của tôi
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {activeTab === 'lessons' ? (
            <div className="space-y-1 relative before:absolute before:inset-y-0 before:left-4 before:w-[2px] before:bg-neutral-200 dark:before:bg-slate-700">
              {courseContent.map((lesson, idx) => (
                <div key={idx} className="relative pl-10 group cursor-pointer">
                  <div className="py-3 group-hover:bg-neutral-50 dark:group-hover:bg-slate-800/50 -ml-10 pl-10 rounded-lg transition-colors border border-transparent group-hover:border-neutral-200 dark:group-hover:border-slate-700">

                    {/* Timeline Dot */}
                    <div className={`absolute left-4 top-1/2 -translate-y-1/2 -ml-[7px] w-4 h-4 rounded-full border-[3px] shadow-sm z-10 transition-transform ${lesson.progress === 100 ? 'bg-semantic-success-base border-semantic-success-subtle' :
                        lesson.progress > 0 ? 'bg-primary-base border-primary-subtle ring-2 ring-primary-base/20' :
                          'bg-surface dark:bg-slate-800 border-neutral-300 dark:border-slate-600'
                      }`}></div>

                    <div className={`text-body-sm font-bold mb-1 leading-snug line-clamp-2 ${lesson.isCurrent ? 'text-primary-base' : 'text-neutral-700 dark:text-neutral-200 group-hover:text-primary-base transition-colors'}`}>
                      {lesson.title}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{lesson.progress}%</span>
                      <div className="flex-1 h-1.5 bg-neutral-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${lesson.progress === 100 ? 'bg-semantic-success-base' : 'bg-primary-base'}`} style={{ width: `${lesson.progress}%` }}></div>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col">
              <textarea
                className="flex-1 w-full bg-yellow-50 dark:bg-amber-900/10 border border-yellow-200 dark:border-amber-800/50 rounded-xl p-4 text-body text-neutral-800 dark:text-neutral-200 placeholder-yellow-600/50 dark:placeholder-amber-600/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none font-medium leading-relaxed"
                placeholder="Thêm ghi chú cá nhân cho chương này..."
                defaultValue=""
              ></textarea>
              <button className="mt-4 py-2.5 w-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md text-body-sm font-bold hover:opacity-90 transition-opacity">
                Lưu ghi chú
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Sidebar
