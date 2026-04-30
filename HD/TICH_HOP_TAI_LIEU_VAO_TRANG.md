# 🔧 Tích hợp hiển thị tài liệu vào trang môn học

## 📝 Đã tạo component DocumentList

Component `src/components/DocumentList.jsx` đã sẵn sàng để hiển thị danh sách tài liệu PDF.

## 🎯 Cách tích hợp

### Cách 1: Thêm vào QuizList.jsx (Hiển thị cùng bài tập)

Mở file `src/components/QuizList.jsx` và thêm:

```jsx
import DocumentList from './DocumentList'

// Trong component QuizList, thêm DocumentList sau phần hiển thị bài tập:

function QuizList({ quizzes, ieltsTests }) {
  // ... existing code ...
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* ... existing quiz list code ... */}
      
      {/* Thêm phần tài liệu */}
      <div className="mt-12">
        <DocumentList subject={subject} grade={grade} />
      </div>
    </div>
  )
}
```

### Cách 2: Thêm vào SubjectEntry.jsx (Trang chủ môn học)

Mở file `src/components/SubjectEntry.jsx` và thêm:

```jsx
import DocumentList from './DocumentList'

function SubjectEntry({ quizzes, ieltsTests }) {
  // ... existing code ...
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* ... existing subject info ... */}
      
      {/* Tab hoặc section cho tài liệu */}
      <div className="mt-8">
        <DocumentList subject={subject} />
      </div>
    </div>
  )
}
```

### Cách 3: Tạo tab riêng cho tài liệu

Nếu muốn có tab "Bài tập" và "Tài liệu" riêng biệt:

```jsx
import { useState } from 'react'
import DocumentList from './DocumentList'

function QuizList({ quizzes, ieltsTests }) {
  const [activeTab, setActiveTab] = useState('quizzes') // 'quizzes' hoặc 'documents'
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTab('quizzes')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'quizzes'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          📝 Bài tập ({filteredQuizzes.length})
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'documents'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          📚 Tài liệu
        </button>
      </div>

      {/* Content */}
      {activeTab === 'quizzes' ? (
        <div>
          {/* Existing quiz list code */}
        </div>
      ) : (
        <DocumentList subject={subject} grade={grade} />
      )}
    </div>
  )
}
```

## 🎨 Ví dụ hoàn chỉnh cho QuizList.jsx

```jsx
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import DocumentList from './DocumentList'

function QuizList({ quizzes, ieltsTests }) {
  const { subject, grade, category } = useParams()
  const [activeTab, setActiveTab] = useState('quizzes')
  
  // Filter quizzes logic...
  const filteredQuizzes = quizzes.filter(q => {
    if (subject && q.subject !== subject) return false
    if (grade && q.grade !== parseInt(grade)) return false
    if (category && q.category !== category) return false
    return true
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {subject} {grade && `- Lớp ${grade}`}
            </h1>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTab('quizzes')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'quizzes'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              📝 Bài tập ({filteredQuizzes.length})
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'documents'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              📚 Tài liệu
            </button>
          </div>

          {/* Content */}
          {activeTab === 'quizzes' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredQuizzes.map(quiz => (
                <Link
                  key={quiz.id}
                  to={`/quiz/${quiz.id}`}
                  className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {quiz.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {quiz.description}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <DocumentList subject={subject} grade={grade ? parseInt(grade) : null} />
          )}
        </div>
      </div>
    </div>
  )
}

export default QuizList
```

## ✅ Checklist tích hợp

- [ ] Import component DocumentList vào file cần dùng
- [ ] Truyền props `subject` và `grade` (nếu có)
- [ ] Test hiển thị với dữ liệu thật
- [ ] Kiểm tra responsive trên mobile
- [ ] Test dark mode

## 🎯 Kết quả mong đợi

Sau khi tích hợp, học sinh sẽ thấy:

```
📚 Toán - Lớp 10
├── Tab: 📝 Bài tập (15)
│   ├── Phương trình bậc hai
│   ├── Hàm số bậc nhất
│   └── ...
└── Tab: 📚 Tài liệu
    ├── [PDF] Công thức toán học cơ bản
    │   └── [Xem] [Tải về]
    ├── [PDF] Bài tập nâng cao
    │   └── [Xem] [Tải về]
    └── ...
```

## 🐛 Troubleshooting

### Không hiển thị tài liệu
→ Kiểm tra đã tạo bảng `documents` trong Supabase chưa

### Lỗi import DocumentList
→ Kiểm tra đường dẫn import: `import DocumentList from './DocumentList'`

### Tài liệu hiển thị sai môn/lớp
→ Kiểm tra props `subject` và `grade` có đúng không

---

**Tóm tắt**: Import DocumentList, truyền subject/grade, và hiển thị trong trang môn học! 🚀
