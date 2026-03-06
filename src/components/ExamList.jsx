import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'
import Breadcrumb from './Breadcrumb'

function ExamList({ quizzes }) {
    const { subject } = useParams()
    const [searchParams] = useSearchParams()
    const examFilter = searchParams.get('exam') || 'Tất cả'
    const filterKeyRaw = examFilter.toLowerCase()

    const navigate = useNavigate()

    // Generate mock exams list based on subject and examFilter
    const examsList = useMemo(() => {
        const list = []

        // Always include a few general tests
        list.push({
            id: 1,
            title: `Đề thi thử ${subject} số 1`,
            year: '2025',
            questionsCount: 50,
            time: 90,
            difficulty: 'Trung bình',
            type: 'general',
            isHot: false
        })
        list.push({
            id: 2,
            title: `Đề thi thử ${subject} số 2`,
            year: '2025',
            questionsCount: 50,
            time: 90,
            difficulty: 'Khó',
            type: 'general',
            isHot: false
        })

        // If filtering by specific exam, inject specific mock formats
        if (filterKeyRaw.includes('đgnl hcm')) {
            return [
                {
                    id: 3,
                    title: `Đề thi ĐGNL HCM 2024 - Môn ${subject}`,
                    year: '2024',
                    questionsCount: subject === 'Toán' ? 10 : 20,
                    time: 30,
                    difficulty: 'Vận dụng cao',
                    type: 'ĐGNL HCM',
                    isHot: true
                },
                {
                    id: 4,
                    title: `Đề thi ĐGNL HCM 2023 - Môn ${subject}`,
                    year: '2023',
                    questionsCount: subject === 'Toán' ? 10 : 20,
                    time: 30,
                    difficulty: 'Trung bình',
                    type: 'ĐGNL HCM',
                    isHot: false
                },
                ...list
            ]
        }

        if (filterKeyRaw.includes('đgnl hn')) {
            return [
                {
                    id: 5,
                    title: `Đề thi ĐGNL HN (HSA) 2024 - Môn ${subject}`,
                    year: '2024',
                    questionsCount: 50,
                    time: 60,
                    difficulty: 'Khó',
                    type: 'ĐGNL HN',
                    isHot: true
                },
                ...list
            ]
        }

        if (filterKeyRaw.includes('thpt quốc gia')) {
            return [
                {
                    id: 6,
                    title: `Đề chính thức THPT QG 2024 - Môn ${subject}`,
                    year: '2024',
                    questionsCount: 50,
                    time: 90,
                    difficulty: 'Theo ma trận bộ GD',
                    type: 'THPT QG',
                    isHot: true
                },
                {
                    id: 7,
                    title: `Đề tham khảo THPT QG 2025 - Môn ${subject}`,
                    year: '2025',
                    questionsCount: 50,
                    time: 90,
                    difficulty: 'Theo ma trận bộ GD',
                    type: 'THPT QG',
                    isHot: true
                },
                ...list
            ]
        }

        // Default returns all
        return list
    }, [subject, examFilter])

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-slate-900 pb-20 selection:bg-primary-subtle selection:text-primary-base">

            {/* Header Section */}
            <div className="bg-surface dark:bg-slate-800 border-b border-neutral-200 dark:border-slate-800 pt-10 pb-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <button
                            onClick={() => navigate(-1)}
                            className="group flex items-center gap-2 text-neutral-600 hover:text-primary-base dark:text-neutral-400 dark:hover:text-primary-400 transition-colors mb-6 font-medium"
                        >
                            <div className="p-2 bg-surface dark:bg-slate-800 rounded-full shadow-sm group-hover:shadow-md transition-all border border-neutral-200 dark:border-slate-700">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                            </div>
                            <span className="text-body-sm font-medium">Quay lại Môn học</span>
                        </button>

                        <div className="mb-6">
                            <Breadcrumb items={[
                                { label: 'Trang chủ', path: '/' },
                                { label: 'Thư viện môn học', path: '/subjects' },
                                { label: subject }
                            ]} />
                        </div>

                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-display font-bold text-neutral-900 dark:text-white tracking-tight">{subject}</h1>
                                    {examFilter !== 'Tất cả' && (
                                        <span className="px-3 py-1 rounded-sm bg-primary-subtle text-primary-base text-caption font-bold shadow-sm border border-primary-200">
                                            {examFilter}
                                        </span>
                                    )}
                                </div>
                                <p className="text-body-lg text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
                                    Danh sách các đề thi, bộ câu hỏi luyện tập chuyên sâu cho môn {subject}.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-8">
                <div className="max-w-4xl mx-auto">

                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-body-lg font-bold text-neutral-900 dark:text-white">Danh sách đề thi ({examsList.length})</h2>

                        <div className="flex items-center gap-2">
                            <select className="bg-surface dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 text-neutral-700 dark:text-neutral-300 text-body-sm font-medium rounded-base px-3 py-2 outline-none focus:ring-2 focus:ring-primary-base">
                                <option value="newest">Mới nhất</option>
                                <option value="popular">Nhiều người làm</option>
                            </select>
                        </div>
                    </div>

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
                                        <span className="flex items-center gap-1.5 hidden sm:flex"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> Độ khó: {exam.difficulty}</span>
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

                </div>
            </div>
        </div>
    )
}

export default ExamList
