import { Link, useParams, useNavigate } from 'react-router-dom'

function GradeList() {
  const { subject } = useParams()
  const decodedSubject = decodeURIComponent(subject)
  const navigate = useNavigate()

  // Custom configuration for each subject's roadmap
  const getSubjectRoadmap = () => {
    if (decodedSubject === 'Khoa Học Tự Nhiên') {
      return {
        title: 'Khám phá Tự nhiên',
        examTags: ['Cấp 2', 'Thi Học Sinh Giỏi'],
        recommendation: 'Nếu bạn cần bổ sung kiến thức THCS, hãy bắt đầu từ Lớp 6 để xây dựng tư duy logic khoa học sớm.',
        grades: [
          { grade: 6, title: 'Nền tảng Sinh thái', stats: '8 Chương • 120 Bài • 800+ Câu', difficulty: 'Cơ bản', color: 'border-semantic-success-border text-semantic-success-base bg-semantic-success-subtle' },
          { grade: 7, title: 'Vật lý & Sự sống', stats: '9 Chương • 140 Bài • 950+ Câu', difficulty: 'Cơ bản', color: 'border-semantic-success-border text-semantic-success-base bg-semantic-success-subtle' },
          { grade: 8, title: 'Hóa học đại cương', stats: '10 Chương • 160 Bài • 1100+ Câu', difficulty: 'Nâng cao', color: 'border-semantic-warning-border text-semantic-warning-base bg-semantic-warning-subtle' },
          { grade: 9, title: 'Tổng ôn chuyển cấp', stats: '12 Chương • 200 Bài • 1500+ Câu', difficulty: 'Chuyên sâu', color: 'border-semantic-error-border text-semantic-error-base bg-semantic-error-subtle' }
        ]
      }
    }

    return {
      title: 'Lộ trình THPT Quốc Gia & ĐGNL',
      examTags: ['THPT QG', 'ĐGNL VNU'],
      recommendation: 'Để chinh phục điểm 9+ ĐGNL hoặc đại học top đầu, bạn CẦN nắm chắc kiến thức Lớp 11 và 12. Không nên bỏ qua lớp 10 nếu mất gốc.',
      grades: [
        { grade: 10, title: 'Kiến thức cốt lõi', stats: '10 Chương • 150 Bài • 1200+ Câu', difficulty: 'Cơ bản', color: 'border-semantic-success-border text-semantic-success-base bg-semantic-success-subtle' },
        { grade: 11, title: 'Vận dụng cao', stats: '12 Chương • 180 Bài • 1600+ Câu', difficulty: 'Nâng cao', color: 'border-semantic-warning-border text-semantic-warning-base bg-semantic-warning-subtle' },
        { grade: 12, title: 'Luyện thi cực đại', stats: '15 Chương • 250 Bài • 3000+ Câu', difficulty: 'Chuyên sâu', color: 'border-semantic-error-border text-semantic-error-base bg-semantic-error-subtle' }
      ]
    }
  }

  const roadmap = getSubjectRoadmap()

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-slate-900 pb-20 selection:bg-primary-subtle selection:text-primary-base">

      {/* Header Section */}
      <div className="bg-surface dark:bg-slate-800 border-b border-neutral-200 dark:border-slate-800 pt-10 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => navigate('/subjects')}
              className="group flex items-center gap-2 text-neutral-600 hover:text-primary-base dark:text-neutral-400 dark:hover:text-primary-400 transition-colors mb-6 font-medium"
            >
              <div className="p-2 bg-surface dark:bg-slate-800 rounded-full shadow-sm group-hover:shadow-md transition-all border border-neutral-200 dark:border-slate-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
              <span className="text-body-sm font-medium">Thư viện môn học</span>
            </button>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-3 text-caption font-bold">
                  {roadmap.examTags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 rounded-sm bg-neutral-100 dark:bg-slate-700 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-slate-600">
                      🎯 {tag}
                    </span>
                  ))}
                </div>
                <h1 className="text-display text-neutral-900 dark:text-white mb-2 tracking-tight flex items-center gap-3">
                  <span className="text-primary-base">{decodedSubject}</span>
                </h1>
                <p className="text-body-lg text-neutral-600 dark:text-neutral-400">
                  {roadmap.title}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 mt-8">
        <div className="max-w-4xl mx-auto">

          {/* Recommendation Box */}
          <div className="bg-semantic-info-subtle border border-semantic-info-border rounded-lg p-5 mb-10 flex gap-4 items-start">
            <div className="text-2xl mt-0.5">💡</div>
            <div>
              <h3 className="text-body font-bold text-semantic-info-base mb-1">Cố vấn học tập Giasu10Diem:</h3>
              <p className="text-body-sm text-semantic-info-base opacity-90 leading-relaxed">
                {roadmap.recommendation}
              </p>
            </div>
          </div>

          <h2 className="text-h3 text-neutral-900 dark:text-white mb-6">Chọn lớp học</h2>

          {/* Timeline Roadmap Layout */}
          <div className="relative border-l-2 border-neutral-200 dark:border-slate-700 ml-6 md:ml-8 space-y-10">
            {roadmap.grades.map((item, idx) => (
              <div key={item.grade} className="relative pl-8 md:pl-12 group">

                {/* Timeline Node */}
                <div className="absolute w-5 h-5 bg-surface dark:bg-slate-800 border-4 border-primary-base rounded-full -left-[11px] top-1.5 z-10 group-hover:scale-125 group-hover:bg-primary-base transition-transform"></div>

                <Link
                  to={`/subject/${encodeURIComponent(decodedSubject)}/grade/${item.grade}`}
                  className="block bg-surface dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-neutral-200 dark:border-slate-700 hover:shadow-md hover:border-primary-base transition-all group-hover:-translate-y-1"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-h2 text-neutral-900 dark:text-white">Lớp {item.grade}</h2>
                        <span className={`px-2 py-0.5 rounded-sm text-caption font-bold border ${item.color}`}>
                          {item.difficulty}
                        </span>
                      </div>
                      <h3 className="text-body font-semibold text-neutral-700 dark:text-neutral-300 mb-3">
                        {item.title}
                      </h3>
                      <div className="text-caption text-neutral-500 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                        {item.stats}
                      </div>
                    </div>

                    <div className="flex md:items-center justify-start md:justify-end mt-4 md:mt-0">
                      <div className="px-5 py-2.5 rounded-base bg-primary-subtle dark:bg-slate-700 text-primary-base dark:text-primary-400 font-semibold text-body-sm group-hover:bg-primary-base group-hover:text-white transition-colors flex items-center gap-2">
                        Bắt đầu lộ trình
                        <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}

export default GradeList

