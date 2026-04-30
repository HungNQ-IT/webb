import { Link, useParams, useNavigate } from 'react-router-dom'
import { useMemo } from 'react'

function GradeList({ quizzes = [], ieltsTests = [] }) {
  const { subject } = useParams()
  const decodedSubject = decodeURIComponent(subject)
  const navigate = useNavigate()

  const subjectQuizzes = useMemo(() => {
    if (decodedSubject === 'IELTS') {
      return ieltsTests.filter((item) => item.subject === 'IELTS')
    }
    return quizzes.filter((item) => item.subject === decodedSubject)
  }, [decodedSubject, ieltsTests, quizzes])

  const availableGrades = useMemo(() => {
    return [...new Set(
      subjectQuizzes
        .map((item) => item.grade)
        .filter((value) => Number.isInteger(value))
    )].sort((a, b) => a - b)
  }, [subjectQuizzes])

  const hasGeneralContent = useMemo(() => {
    return subjectQuizzes.some((item) => item.grade === undefined || item.grade === null)
  }, [subjectQuizzes])

  const roadmapCards = useMemo(() => {
    const cards = availableGrades.map((grade) => {
      const items = subjectQuizzes.filter((item) => item.grade === grade)
      const totalQuestions = items.reduce((sum, item) => sum + (item.questions?.length || item.passages?.length || 0), 0)

      return {
        key: `grade-${grade}`,
        title: `Lớp ${grade}`,
        subtitle: `${items.length} bài luyện sẵn có`,
        stats: `${items.length} đề • ${totalQuestions} câu`,
        to: `/subject/${encodeURIComponent(decodedSubject)}/grade/${grade}`,
        badge: grade >= 10 ? 'THPT' : 'Nền tảng',
        color: grade >= 10
          ? 'border-semantic-warning-border text-semantic-warning-base bg-semantic-warning-subtle'
          : 'border-semantic-success-border text-semantic-success-base bg-semantic-success-subtle'
      }
    })

    if (hasGeneralContent) {
      const generalItems = subjectQuizzes.filter((item) => item.grade === undefined || item.grade === null)
      const totalQuestions = generalItems.reduce((sum, item) => sum + (item.questions?.length || item.passages?.length || 0), 0)

      cards.unshift({
        key: 'general',
        title: 'Tổng hợp',
        subtitle: 'Bộ bài không chia theo lớp',
        stats: `${generalItems.length} đề • ${totalQuestions} câu`,
        to: decodedSubject === 'IELTS'
          ? `/subject/${encodeURIComponent(decodedSubject)}`
          : `/subject/${encodeURIComponent(decodedSubject)}/grade/all`,
        badge: 'Tổng ôn',
        color: 'border-semantic-info-border text-semantic-info-base bg-semantic-info-subtle'
      })
    }

    return cards
  }, [availableGrades, decodedSubject, hasGeneralContent, subjectQuizzes])

  const recommendation = useMemo(() => {
    if (roadmapCards.length > 0) {
      return `Hệ thống đang có ${subjectQuizzes.length} bài cho ${decodedSubject}. Mình đã lọc sẵn những lớp/bộ bài thực sự có nội dung để bạn bấm vào là thấy ngay.`
    }
    return `Hiện tại ${decodedSubject} chưa có dữ liệu bài tập trong thư viện. Khi thêm đề cho môn này, trang sẽ tự hiện các lớp hoặc bộ bài tương ứng.`
  }, [decodedSubject, roadmapCards.length, subjectQuizzes.length])

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-slate-900 pb-20 selection:bg-primary-subtle selection:text-primary-base">
      <div className="bg-surface dark:bg-slate-800 border-b border-neutral-200 dark:border-slate-800 pt-10 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => navigate(-1)}
              className="group flex items-center gap-2 text-neutral-600 hover:text-primary-base dark:text-neutral-400 dark:hover:text-primary-400 transition-colors mb-6 font-medium"
            >
              <div className="p-2 bg-surface dark:bg-slate-800 rounded-full shadow-sm group-hover:shadow-md transition-all border border-neutral-200 dark:border-slate-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
              <span className="text-body-sm font-medium">Quay lại</span>
            </button>

            <h1 className="text-display text-neutral-900 dark:text-white mb-2 tracking-tight">
              {decodedSubject}
            </h1>
            <p className="text-body-lg text-neutral-600 dark:text-neutral-400">
              Chọn đúng phần nội dung đang có sẵn để bắt đầu luyện tập.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-semantic-info-subtle border border-semantic-info-border rounded-lg p-5 mb-10 flex gap-4 items-start">
            <div className="text-2xl mt-0.5">i</div>
            <div>
              <h3 className="text-body font-bold text-semantic-info-base mb-1">Trạng thái nội dung</h3>
              <p className="text-body-sm text-semantic-info-base opacity-90 leading-relaxed">
                {recommendation}
              </p>
            </div>
          </div>

          {roadmapCards.length > 0 ? (
            <>
              <h2 className="text-h3 text-neutral-900 dark:text-white mb-6">Nội dung khả dụng</h2>
              <div className="relative border-l-2 border-neutral-200 dark:border-slate-700 ml-6 md:ml-8 space-y-10">
                {roadmapCards.map((item) => (
                  <div key={item.key} className="relative pl-8 md:pl-12 group">
                    <div className="absolute w-5 h-5 bg-surface dark:bg-slate-800 border-4 border-primary-base rounded-full -left-[11px] top-1.5 z-10 group-hover:scale-125 group-hover:bg-primary-base transition-transform"></div>

                    <Link
                      to={item.to}
                      className="block bg-surface dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-neutral-200 dark:border-slate-700 hover:shadow-md hover:border-primary-base transition-all group-hover:-translate-y-1"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-h2 text-neutral-900 dark:text-white">{item.title}</h2>
                            <span className={`px-2 py-0.5 rounded-sm text-caption font-bold border ${item.color}`}>
                              {item.badge}
                            </span>
                          </div>
                          <h3 className="text-body font-semibold text-neutral-700 dark:text-neutral-300 mb-3">
                            {item.subtitle}
                          </h3>
                          <div className="text-caption text-neutral-500 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            {item.stats}
                          </div>
                        </div>

                        <div className="flex md:items-center justify-start md:justify-end mt-4 md:mt-0">
                          <div className="px-5 py-2.5 rounded-base bg-primary-subtle dark:bg-slate-700 text-primary-base dark:text-primary-400 font-semibold text-body-sm group-hover:bg-primary-base group-hover:text-white transition-colors flex items-center gap-2">
                            Xem bài luyện
                            <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="bg-surface dark:bg-slate-800 rounded-lg p-8 border border-neutral-200 dark:border-slate-700 text-center">
              <h2 className="text-h3 text-neutral-900 dark:text-white mb-3">Môn này chưa có bài để hiển thị</h2>
              <p className="text-body text-neutral-600 dark:text-neutral-400 mb-6">
                Hiện thư viện chưa có đề cho {decodedSubject}. Mình đã giữ trang này ở trạng thái rõ ràng để bạn không bị vào chỗ trống.
              </p>
              <button
                onClick={() => navigate('/subjects')}
                className="px-5 py-2.5 rounded-base bg-primary-base text-white font-semibold hover:bg-primary-hover transition-colors"
              >
                Quay về thư viện môn học
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default GradeList
