import { Link, useParams } from 'react-router-dom'
import Breadcrumb from './Breadcrumb'

const examData = {
    'dgnl-hcm': {
        title: 'Đánh Giá Năng Lực ĐHQG HCM',
        shortName: 'ĐGNL HCM',
        description: 'Kỳ thi chú trọng đánh giá các năng lực cơ bản để học đại học của thí sinh như: sử dụng ngôn ngữ, tư duy logic, xử lý số liệu, giải quyết vấn đề.',
        colorClass: 'text-primary-base bg-primary-subtle border-primary-200',
        icon: '🎯',
        structure: [
            { name: 'Phần 1: Sử dụng ngôn ngữ', details: 'Tiếng Việt (20 câu), Tiếng Anh (20 câu)' },
            { name: 'Phần 2: Toán học, Tư duy logic, PT Số liệu', details: 'Toán học (10 câu), Tư duy logic (10 câu), Phân tích số liệu (10 câu)' },
            { name: 'Phần 3: Giải quyết vấn đề', details: 'Lý, Hóa, Sinh, Sử, Địa (Mỗi môn 10 câu)' },
        ],
        subjects: [
            { name: 'Tiếng Việt', path: '/subject/Tiếng Việt/grades' },
            { name: 'Tiếng Anh', path: '/subject/Tiếng Anh/grades' },
            { name: 'Toán Logic', path: '/subject/Toán/grades' },
            { name: 'Vật Lý', path: '/subject/Vật Lý/grades' },
            { name: 'Hóa Học', path: '/subject/Hóa Học/grades' },
            { name: 'Sinh Học', path: '/subject/Sinh Học/grades' },
            { name: 'Lịch Sử', path: '/subject/Lịch Sử/grades' },
            { name: 'Địa Lý', path: '/subject/Địa Lý/grades' }
        ]
    },
    'dgnl-hn': {
        title: 'Đánh Giá Năng Lực ĐHQG Hà Nội',
        shortName: 'ĐGNL HN (HSA)',
        description: 'Kỳ thi HSA của ĐHQG HN tập trung vào Toán học và xử lý số liệu, Văn học - Ngôn ngữ và Khoa học tự nhiên - Xã hội.',
        colorClass: 'text-semantic-info-base bg-semantic-info-subtle border-semantic-info-border',
        icon: '🏛️',
        structure: [
            { name: 'Tư duy định lượng', details: 'Toán học, thống kê, xử lý số liệu (50 câu - 75 phút)' },
            { name: 'Tư duy định tính', details: 'Văn học, Ngôn ngữ (50 câu - 60 phút)' },
            { name: 'Khoa học', details: 'Tự nhiên & Xã hội (50 câu - 60 phút)' },
        ],
        subjects: [
            { name: 'Toán Học', path: '/subject/Toán/grades' },
            { name: 'Ngữ Văn', path: '/subject/Ngữ Văn/grades' },
            { name: 'Vật Lý', path: '/subject/Vật Lý/grades' },
            { name: 'Hóa Học', path: '/subject/Hóa Học/grades' },
            { name: 'Sinh Học', path: '/subject/Sinh Học/grades' },
            { name: 'Lịch Sử', path: '/subject/Lịch Sử/grades' },
            { name: 'Địa Lý', path: '/subject/Địa Lý/grades' }
        ]
    },
    'thpt-qg': {
        title: 'THPT Quốc Gia',
        shortName: 'THPT QG',
        description: 'Kỳ thi tốt nghiệp THPT do Bộ Giáo dục và Đào tạo tổ chức, xét tốt nghiệp và xét tuyển Đại học.',
        colorClass: 'text-semantic-success-base bg-semantic-success-subtle border-semantic-success-border',
        icon: '🎓',
        structure: [
            { name: 'Toán', details: 'Trắc nghiệm (50 câu - 90 phút)' },
            { name: 'Ngữ Văn', details: 'Tự luận (120 phút)' },
            { name: 'Ngoại Ngữ', details: 'Trắc nghiệm (50 câu - 60 phút)' },
            { name: 'Tổ hợp KHTN / KHXH', details: 'Trắc nghiệm (120 câu - 150 phút)' },
        ],
        subjects: [
            { name: 'Toán', path: '/subject/Toán/grades' },
            { name: 'Ngữ Văn', path: '/subject/Ngữ Văn/grades' },
            { name: 'Tiếng Anh', path: '/subject/Tiếng Anh/grades' },
            { name: 'Vật Lý', path: '/subject/Vật Lý/grades' },
            { name: 'Hóa Học', path: '/subject/Hóa Học/grades' },
            { name: 'Sinh Học', path: '/subject/Sinh Học/grades' },
            { name: 'Lịch Sử', path: '/subject/Lịch Sử/grades' },
            { name: 'Địa Lý', path: '/subject/Địa Lý/grades' }
        ]
    },
    'ielts': {
        title: 'Kỳ Thi IELTS',
        shortName: 'IELTS',
        description: 'Hệ thống kiểm tra Anh ngữ quốc tế, kiểm tra mức độ thông thạo tiếng Anh.',
        colorClass: 'text-semantic-error-base bg-semantic-error-subtle border-semantic-error-border',
        icon: '🌏',
        structure: [
            { name: 'Listening', details: '4 phần, 40 câu hỏi (30 phút)' },
            { name: 'Reading', details: '3 đoạn văn, 40 câu hỏi (60 phút)' },
            { name: 'Writing', details: '2 task (60 phút)' },
            { name: 'Speaking', details: '3 part (11-14 phút)' },
        ],
        subjects: [
            { name: 'IELTS Listening', path: '/subject/IELTS Listening' },
            { name: 'IELTS Reading', path: '/subject/IELTS Reading' },
            { name: 'IELTS Writing', path: '/subject/IELTS Writing' },
            { name: 'IELTS Speaking', path: '/subject/IELTS Speaking' }
        ]
    },
    'sat': {
        title: 'Kỳ Thi SAT',
        shortName: 'SAT',
        description: 'Bài kiểm tra đánh giá năng lực chuẩn hóa được sử dụng rộng rãi cho xét tuyển đại học ở Hoa Kỳ và quốc tế.',
        colorClass: 'text-purple-600 bg-purple-100 border-purple-200',
        icon: '📚',
        structure: [
            { name: 'Reading & Writing', details: 'Đọc hiểu và Ngữ pháp tiếng Anh (Digital Format)' },
            { name: 'Math', details: 'Toán học (Có máy tính và Không máy tính)' },
        ],
        subjects: [
            { name: 'SAT Math', path: '/subject/SAT Math' },
            { name: 'SAT Reading', path: '/subject/SAT Reading' },
            { name: 'SAT Writing', path: '/subject/SAT Writing' }
        ]
    }
}

export default function ExamDetail() {
    const { examId } = useParams()
    const exam = examData[examId]

    if (!exam) {
        return (
            <div className="min-h-screen bg-neutral-50 dark:bg-slate-900 flex items-center justify-center">
                <p className="text-neutral-500 text-body-lg">Không tìm thấy thông tin kỳ thi.</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-slate-900 pb-20 selection:bg-primary-subtle selection:text-primary-base">
            <div className="bg-surface dark:bg-slate-800 border-b border-neutral-200 dark:border-slate-800 pt-10 pb-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-6">
                            <Breadcrumb items={[{ label: 'Trang chủ', path: '/' }, { label: exam.title }]} />
                        </div>

                        <div className="flex items-start gap-6 mb-8">
                            <div className={`w-20 h-20 text-4xl flex-shrink-0 rounded-2xl flex items-center justify-center border ${exam.colorClass} shadow-sm`}>
                                {exam.icon}
                            </div>
                            <div>
                                <h1 className="text-display font-bold text-neutral-900 dark:text-white mb-2">{exam.title}</h1>
                                <p className="text-body-lg text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">{exam.description}</p>
                            </div>
                        </div>

                        <div className="bg-neutral-50 dark:bg-slate-900 border border-neutral-200 dark:border-slate-700 rounded-xl p-6">
                            <h3 className="text-h3 font-bold text-neutral-900 dark:text-white mb-4">Cấu trúc đề thi</h3>
                            <div className="grid gap-3">
                                {exam.structure.map((part, idx) => (
                                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-neutral-200 dark:border-slate-700 last:border-0 last:pb-0">
                                        <div className="font-bold text-neutral-800 dark:text-neutral-200 w-full sm:w-1/3 mb-1 sm:mb-0">{part.name}</div>
                                        <div className="text-body-sm text-neutral-600 dark:text-neutral-400 w-full sm:w-2/3">{part.details}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-12">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-h2 font-bold text-neutral-900 dark:text-white mb-6">Môn học luyện thi {exam.shortName}</h2>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {exam.subjects.map((sub, idx) => (
                            <Link key={idx} to={sub.path} className="group bg-surface dark:bg-slate-800 rounded-lg p-5 border border-neutral-200 dark:border-slate-700 hover:shadow-md transition-all flex items-center justify-between hover:border-primary-base">
                                <span className="font-bold text-neutral-800 dark:text-neutral-200 group-hover:text-primary-base transition-colors">{sub.name}</span>
                                <svg className="w-5 h-5 text-neutral-400 group-hover:text-primary-base transition-colors group-hover:translate-x-1 transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    )
}
