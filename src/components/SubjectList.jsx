import { Link, useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'
import Breadcrumb from './Breadcrumb'

function SubjectList({ quizzes = [], ieltsTests = [], initialView = 'subjects' }) {
  const defaultSection = initialView === 'exams' ? 'exams' : initialView === 'roadmap' ? 'roadmap' : initialView === 'documents' ? 'documents' : 'subjects'
  const [activeSection, setActiveSection] = useState(defaultSection)
  const [activeTab, setActiveTab] = useState('Tất cả')
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const tabs = ['Tất cả', 'ĐGNL HCM', 'ĐGNL HN', 'THPT Quốc Gia', 'IELTS', 'SAT']
  const sectionTabs = [
    { key: 'subjects', label: 'Môn học', description: 'Chọn môn và lớp để luyện đúng dữ liệu đang có.' },
    { key: 'exams', label: 'Đề thi', description: 'Xem cấu trúc các kỳ thi và nhóm môn cần ôn.' },
    { key: 'roadmap', label: 'Lộ trình ôn', description: 'Bắt đầu theo mục tiêu thi thay vì tự mò từng phần.' },
    { key: 'documents', label: 'Tài liệu', description: 'Xem và tải tài liệu PDF theo môn học.' }
  ]
  const examCards = [
    { title: 'ĐGNL ĐHQG HCM', subtitle: 'Ngôn ngữ, Toán logic, số liệu và giải quyết vấn đề.', path: '/exam/dgnl-hcm', badge: '150 phút', icon: '🎯' },
    { title: 'ĐGNL ĐHQG Hà Nội', subtitle: 'Tư duy định lượng, định tính và khoa học.', path: '/exam/dgnl-hn', badge: 'HSA', icon: '🏛️' },
    { title: 'THPT Quốc Gia', subtitle: 'Toán, Văn, Ngoại ngữ và tổ hợp KHTN/KHXH.', path: '/exam/thpt-qg', badge: 'Chuẩn Bộ', icon: '🎓' },
    { title: 'IELTS', subtitle: 'Reading, Listening, Writing và Speaking.', path: '/exam/ielts', badge: '4 kỹ năng', icon: '🌏' },
    { title: 'SAT', subtitle: 'Digital SAT Reading & Writing và Math.', path: '/exam/sat', badge: 'Quốc tế', icon: '📚' }
  ]
  const roadmapCards = [
    { title: 'Mất gốc Toán', subtitle: 'Đi từ lớp 10, củng cố nền trước khi luyện đề.', path: '/subject/Toán/grades', badge: 'Nền tảng' },
    { title: 'Ôn THPT Quốc Gia', subtitle: 'Chọn môn theo lớp 12 và luyện đề theo thời gian.', path: '/exam/thpt-qg', badge: 'Thi tốt nghiệp' },
    { title: 'Ôn ĐGNL', subtitle: 'Nắm cấu trúc bài thi rồi luyện theo từng nhóm năng lực.', path: '/exam/dgnl-hcm', badge: 'Đại học' },
    { title: 'IELTS Skills', subtitle: 'Tách Reading, Listening, Writing, Speaking để luyện đúng kỹ năng.', path: '/subject/IELTS', badge: 'Ngoại ngữ' }
  ]

  const subjectsData = useMemo(() => {
    const baseSubjects = ['Toán', 'Vật Lý', 'Hóa Học', 'Sinh Học', 'Tiếng Anh', 'Ngữ Văn', 'Lịch Sử', 'Địa Lý']
    const dataSubjects = [
      ...new Set([
        ...quizzes.map((quiz) => quiz.subject).filter(Boolean),
        ...ieltsTests.map((test) => test.subject).filter(Boolean)
      ])
    ]
    const pureSubjects = [...new Set([...baseSubjects, ...dataSubjects])]

    return pureSubjects.map(sub => {
      let data = {
        name: sub,
        exams: [],
        description: 'Luyện tập và nâng cao kiến thức.',
        stats: { quizzes: '100+', parts: '20+' },
        isHot: false,
        icon: '📚',
        colorClass: 'text-neutral-600 bg-neutral-100',
        route: sub === 'IELTS'
          ? `/subject/${encodeURIComponent(sub)}`
          : `/subject/${encodeURIComponent(sub)}/grades`
      }

      if (sub === 'Toán') {
        data = { ...data, exams: ['THPT Quốc Gia', 'ĐGNL HCM', 'ĐGNL HN', 'SAT'], description: 'Đại số, Hình học và bộ đề thi phân loại cao.', stats: { quizzes: '500+', parts: '150+' }, icon: '📐', colorClass: 'text-semantic-info-base bg-semantic-info-subtle border-semantic-info-border', isHot: true }
      } else if (sub.includes('Vật Lý')) {
        data = { ...data, exams: ['THPT Quốc Gia', 'ĐGNL HCM', 'ĐGNL HN'], description: 'Cơ học, Điện học và các hiện tượng tự nhiên.', stats: { quizzes: '350+', parts: '120+' }, icon: '⚡', colorClass: 'text-purple-600 bg-purple-100 border-purple-200' }
      } else if (sub.includes('Hóa Học')) {
        data = { ...data, exams: ['THPT Quốc Gia', 'ĐGNL HCM', 'ĐGNL HN'], description: 'Phản ứng hóa học và bảng tuần hoàn nguyên tố.', stats: { quizzes: '300+', parts: '100+' }, icon: '🧪', colorClass: 'text-semantic-success-base bg-semantic-success-subtle border-semantic-success-border' }
      } else if (sub.includes('Sinh Học')) {
        data = { ...data, exams: ['THPT Quốc Gia', 'ĐGNL HCM', 'ĐGNL HN'], description: 'Di truyền học, Tế bào và Tiến hóa sinh học.', stats: { quizzes: '250+', parts: '80+' }, icon: '🧬', colorClass: 'text-teal-600 bg-teal-100 border-teal-200' }
      } else if (sub.includes('Tiếng Anh')) {
        data = { ...data, exams: ['THPT Quốc Gia', 'ĐGNL HCM', 'SAT'], description: 'Ngữ pháp, từ vựng, đọc hiểu và luyện đề tiếng Anh.', stats: { quizzes: '650+', parts: '230+' }, icon: '📝', colorClass: 'text-semantic-warning-base bg-semantic-warning-subtle border-semantic-warning-border', isHot: true }
      } else if (sub === 'Ngữ Văn' || sub === 'Tiếng Việt') {
        data = { ...data, name: 'Ngữ Văn', exams: ['THPT Quốc Gia', 'ĐGNL HCM', 'ĐGNL HN'], description: 'Phân tích tác phẩm, đọc hiểu và nghị luận xã hội.', stats: { quizzes: '200+', parts: '50+' }, icon: '📖', colorClass: 'text-rose-600 bg-rose-100 border-rose-200' }
      } else if (sub === 'Lịch Sử') {
        data = { ...data, exams: ['THPT Quốc Gia', 'ĐGNL HCM', 'ĐGNL HN'], description: 'Lịch sử Việt Nam và Lịch sử Thế giới hiện đại.', stats: { quizzes: '150+', parts: '40+' }, icon: '⏳', colorClass: 'text-amber-700 bg-amber-100 border-amber-200' }
      } else if (sub === 'Địa Lý') {
        data = { ...data, exams: ['THPT Quốc Gia', 'ĐGNL HCM', 'ĐGNL HN'], description: 'Địa lý tự nhiên, dân cư và kinh tế Việt Nam.', stats: { quizzes: '150+', parts: '40+' }, icon: '🌍', colorClass: 'text-emerald-700 bg-emerald-100 border-emerald-200' }
      } else if (sub === 'IELTS') {
        data = { ...data, exams: ['IELTS'], description: 'Reading, Listening, Writing và Speaking theo định dạng IELTS.', stats: { quizzes: `${ieltsTests.length}+`, parts: '4 kỹ năng' }, icon: '🎧', colorClass: 'text-sky-700 bg-sky-100 border-sky-200', isHot: true }
      }

      return data
    })
  }, [quizzes, ieltsTests])

  // Filter Logic
  const filteredSubjects = useMemo(() => {
    return subjectsData.filter(sub => {
      const matchTab = activeTab === 'Tất cả' || sub.exams.includes(activeTab)
      const matchSearch = sub.name.toLowerCase().includes(searchQuery.toLowerCase()) || sub.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchTab && matchSearch
    })
  }, [subjectsData, activeTab, searchQuery])

  const showSubjects = ['Tất cả', 'THPT Quốc Gia', 'IELTS', 'SAT'].includes(activeTab);

  const examsList = useMemo(() => {
    if (showSubjects) return []
    const isHCM = activeTab === 'ĐGNL HCM'
    const prefix = isHCM ? 'ĐGNL HCM' : 'ĐGNL HN'

    return [
      {
        id: isHCM ? 'hcm-2024' : 'hn-2024',
        title: `Đề thi ${prefix} 2024`,
        year: '2024',
        questionsCount: 120,
        time: 150,
        type: prefix,
        isHot: true
      },
      {
        id: isHCM ? 'hcm-2023' : 'hn-2023',
        title: `Đề thi ${prefix} 2023`,
        year: '2023',
        questionsCount: 120,
        time: 150,
        type: prefix,
        isHot: false
      },
      {
        id: isHCM ? 'hcm-test-1' : 'hn-test-1',
        title: `Đề thử ${prefix} số 1`,
        year: '2025',
        questionsCount: 120,
        time: 150,
        type: 'general',
        isHot: false
      },
      {
        id: isHCM ? 'hcm-test-2' : 'hn-test-2',
        title: `Đề thử ${prefix} số 2`,
        year: '2025',
        questionsCount: 120,
        time: 150,
        type: 'general',
        isHot: false
      },
      {
        id: isHCM ? 'hcm-test-3' : 'hn-test-3',
        title: `Đề thử ${prefix} số 3`,
        year: '2025',
        questionsCount: 120,
        time: 150,
        type: 'general',
        isHot: false
      }
    ]
  }, [activeTab, showSubjects])

  const getSubjectPath = (subject) => {
    if (activeTab === 'ĐGNL HCM' || activeTab === 'ĐGNL HN' || activeTab === 'SAT') {
      return `/subject/${encodeURIComponent(subject.name)}/exams?exam=${encodeURIComponent(activeTab)}`
    }

    return subject.route
  }


  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-slate-900 pb-20 selection:bg-primary-subtle selection:text-primary-base">

      {/* Header Section */}
      <div className="bg-surface dark:bg-slate-800 border-b border-neutral-200 dark:border-slate-800 pt-10 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <button
              onClick={() => navigate(-1)}
              className="group flex items-center gap-2 text-neutral-600 hover:text-primary-base dark:text-neutral-400 dark:hover:text-primary-400 transition-colors mb-6 font-medium"
            >
              <div className="p-2 bg-surface dark:bg-slate-800 rounded-full shadow-sm group-hover:shadow-md transition-all border border-neutral-200 dark:border-slate-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
              <span className="text-body-sm font-medium">Trang chủ</span>
            </button>

            <div className="mb-6">
              <Breadcrumb items={[{ label: 'Trang chủ', path: '/' }, { label: 'Thư viện môn học' }]} />
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="text-display text-neutral-900 dark:text-white mb-4 tracking-tight">
                  Thư viện môn học
                </h1>
                <p className="text-body-lg text-neutral-600 dark:text-neutral-400 max-w-2xl">
                  Chọn môn học và bắt đầu lộ trình làm bài được cá nhân hóa dành riêng cho bạn.
                </p>
              </div>

              {/* Search */}
              <div className="relative w-full md:w-80">
                <input
                  type="text"
                  placeholder="Tìm môn học, kỳ thi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-neutral-100 dark:bg-slate-900 border-none rounded-base text-body-sm focus:ring-2 focus:ring-primary-base outline-none transition-shadow"
                />
                <svg className="w-5 h-5 text-neutral-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        <div className="max-w-6xl mx-auto">

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {sectionTabs.map(section => (
              <button
                key={section.key}
                onClick={() => setActiveSection(section.key)}
                className={`text-left rounded-lg border p-5 shadow-sm transition-all ${activeSection === section.key
                  ? 'bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-neutral-900 dark:border-white'
                  : 'bg-surface dark:bg-slate-800 border-neutral-200 dark:border-slate-700 text-neutral-700 dark:text-neutral-300 hover:border-primary-base'
                  }`}
              >
                <span className="block text-body font-bold mb-1">{section.label}</span>
                <span className={`block text-body-sm ${activeSection === section.key ? 'text-white/75 dark:text-neutral-600' : 'text-neutral-500 dark:text-neutral-400'}`}>
                  {section.description}
                </span>
              </button>
            ))}
          </div>

          {activeSection === 'subjects' && (
            <div className="flex overflow-x-auto pb-4 mb-8 scrollbar-hide gap-2">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`whitespace-nowrap px-5 py-2.5 rounded-full text-body-sm font-semibold transition-all ${activeTab === tab
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-md'
                    : 'bg-surface dark:bg-slate-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-slate-700 hover:bg-neutral-100 dark:hover:bg-slate-700'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          )}

          {activeSection === 'exams' && (
            <div className="grid md:grid-cols-2 gap-6">
              {examCards.map((exam) => (
                <Link
                  key={exam.path}
                  to={exam.path}
                  className="group bg-surface dark:bg-slate-800 rounded-lg p-6 shadow-sm hover:shadow-md border border-neutral-200 dark:border-slate-700 hover:border-primary-base transition-all"
                >
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-base bg-primary-subtle text-3xl flex items-center justify-center border border-primary-200">
                        {exam.icon}
                      </div>
                      <div>
                        <h2 className="text-h3 text-neutral-900 dark:text-white group-hover:text-primary-base transition-colors">{exam.title}</h2>
                        <span className="inline-block mt-2 px-2 py-0.5 rounded-sm bg-neutral-100 dark:bg-slate-700 text-caption font-semibold text-neutral-600 dark:text-neutral-300">
                          {exam.badge}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-body-sm text-neutral-500 dark:text-neutral-400 mb-5">{exam.subtitle}</p>
                  <div className="text-body-sm font-semibold text-primary-base">Xem cấu trúc đề &rarr;</div>
                </Link>
              ))}
            </div>
          )}

          {activeSection === 'roadmap' && (
            <div className="grid md:grid-cols-2 gap-6">
              {roadmapCards.map((roadmap) => (
                <Link
                  key={roadmap.path}
                  to={roadmap.path}
                  className="group bg-surface dark:bg-slate-800 rounded-lg p-6 shadow-sm hover:shadow-md border border-neutral-200 dark:border-slate-700 hover:border-primary-base transition-all"
                >
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <h2 className="text-h3 text-neutral-900 dark:text-white group-hover:text-primary-base transition-colors">{roadmap.title}</h2>
                    <span className="px-2 py-0.5 rounded-sm bg-semantic-info-subtle text-semantic-info-base border border-semantic-info-border text-caption font-bold">
                      {roadmap.badge}
                    </span>
                  </div>
                  <p className="text-body-sm text-neutral-500 dark:text-neutral-400 mb-5">{roadmap.subtitle}</p>
                  <div className="text-body-sm font-semibold text-primary-base">Bắt đầu lộ trình &rarr;</div>
                </Link>
              ))}
            </div>
          )}

          {activeSection === 'documents' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSubjects.map((subject, index) => (
                <Link
                  key={index}
                  to={`/documents/${encodeURIComponent(subject.name)}`}
                  className="group bg-surface dark:bg-slate-800 rounded-lg p-6 shadow-sm hover:shadow-md border border-neutral-200 dark:border-slate-700 transition-all duration-300 hover:-translate-y-1 flex flex-col"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-14 h-14 rounded-base flex items-center justify-center text-3xl border ${subject.colorClass} shadow-sm group-hover:scale-110 transition-transform`}>
                      📚
                    </div>
                    <div className="pt-1 flex-1">
                      <h2 className="text-h3 text-neutral-900 dark:text-white group-hover:text-primary-base transition-colors">
                        {subject.name}
                      </h2>
                      <p className="text-caption text-neutral-500 dark:text-neutral-400 mt-1">
                        Tài liệu PDF
                      </p>
                    </div>
                  </div>

                  <p className="text-body-sm text-neutral-500 dark:text-neutral-400 mb-6 flex-1">
                    Xem và tải tài liệu học tập cho môn {subject.name}
                  </p>

                  <div className="w-full py-2.5 rounded-base bg-primary-subtle dark:bg-slate-700 text-primary-base dark:text-primary-400 font-semibold text-center text-body-sm group-hover:bg-primary-base group-hover:text-white transition-colors">
                    Xem tài liệu &rarr;
                  </div>
                </Link>
              ))}
            </div>
          )}

          {activeSection === 'subjects' && (showSubjects ? (
            filteredSubjects.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSubjects.map((subject, index) => (
                  <Link
                    key={index}
                    to={getSubjectPath(subject)}
                    className="group bg-surface dark:bg-slate-800 rounded-lg p-6 shadow-sm hover:shadow-md border border-neutral-200 dark:border-slate-700 transition-all duration-300 hover:-translate-y-1 flex flex-col relative overflow-hidden"
                  >
                    {subject.isHot && (
                      <div className="absolute top-0 right-0 py-1 px-3 bg-semantic-error-subtle text-semantic-error-base text-caption font-bold rounded-bl-sm border-b border-l border-semantic-error-border">
                        HOT
                      </div>
                    )}

                    {/* Header: Icon + Name */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-14 h-14 rounded-base flex items-center justify-center text-3xl border ${subject.colorClass} shadow-sm group-hover:scale-110 transition-transform`}>
                        {subject.icon}
                      </div>
                      <div className="pt-1">
                        <h2 className="text-h3 text-neutral-900 dark:text-white group-hover:text-primary-base transition-colors line-clamp-2">
                          {subject.name}
                        </h2>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {subject.exams.map(ex => (
                            <button
                              key={ex}
                              onClick={(e) => { e.preventDefault(); setActiveTab(ex); }}
                              className="px-2 py-0.5 rounded-sm bg-neutral-100 dark:bg-slate-700 border border-neutral-200 dark:border-slate-600 text-caption font-medium text-neutral-600 dark:text-neutral-300 hover:bg-primary-subtle hover:text-primary-base hover:border-primary-200 transition-colors z-10 relative"
                            >
                              {ex}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <p className="text-body-sm text-neutral-500 dark:text-neutral-400 mb-6 flex-1">
                      {subject.description}
                    </p>

                    <div className="border-t border-neutral-100 dark:border-slate-700 pt-4 flex flex-col gap-4">
                      {/* Stats */}
                      <div className="flex justify-between items-center text-caption font-medium text-neutral-500">
                        <span className="flex items-center gap-1.5"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> {subject.stats.quizzes} Đề thi</span>
                        <span className="flex items-center gap-1.5"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> {subject.stats.parts} Câu hỏi</span>
                      </div>

                      {/* Action Button */}
                      <div className="w-full py-2.5 rounded-base bg-primary-subtle dark:bg-slate-700 text-primary-base dark:text-primary-400 font-semibold text-center text-body-sm group-hover:bg-primary-base group-hover:text-white transition-colors">
                        Vào ôn luyện ngay &rarr;
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-h3 text-neutral-900 dark:text-white mb-2">Không tìm thấy môn học</h3>
                <p className="text-neutral-500">Thử tìm kiếm bằng từ khóa khác hoặc chuyển khối thi.</p>
              </div>
            )
          ) : (
            <div className="space-y-4">
              {examsList.map((exam) => (
                <div key={exam.id} className="group bg-surface dark:bg-slate-800 rounded-lg p-5 sm:p-6 shadow-sm hover:shadow-md border border-neutral-200 dark:border-slate-700 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-primary-base relative overflow-hidden">

                  {/* Left side info */}
                  <div className="flex-1 min-w-0 pr-4 sm:pr-0">
                    <div className="flex items-center gap-2 mb-2">
                      {exam.isHot && <span className="px-2 py-0.5 rounded-sm bg-semantic-error-subtle text-semantic-error-base text-[10px] uppercase font-black tracking-wider">MỚI</span>}
                      {exam.type !== 'general' && <span className="px-2 py-0.5 rounded-sm bg-neutral-100 dark:bg-slate-700 text-neutral-600 dark:text-neutral-300 text-caption font-semibold">{exam.type}</span>}
                      <span className="px-2 py-0.5 rounded-sm bg-neutral-100 dark:bg-slate-700 text-neutral-600 dark:text-neutral-300 text-caption font-semibold">Năm {exam.year}</span>
                    </div>

                    <h3 className="text-h3 font-bold text-neutral-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary-base transition-colors">{exam.title}</h3>

                    <div className="flex items-center gap-4 text-caption font-medium text-neutral-500">
                      <span className="flex items-center gap-1.5"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> {exam.questionsCount} Câu hỏi</span>
                      <span className="flex items-center gap-1.5"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> {exam.time} Phút</span>
                    </div>
                  </div>

                  {/* Right side CTA */}
                  <div className="flex-shrink-0 flex justify-end">
                    <Link to={`/quiz/${exam.id}`} className="inline-flex items-center justify-center bg-primary-subtle text-primary-base hover:bg-primary-base hover:text-white font-bold px-6 py-2.5 rounded-base transition-colors w-full sm:w-auto shadow-sm">
                      Làm bài <span className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">&rarr;</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ))}

        </div>
      </div>
    </div>
  )
}

export default SubjectList
