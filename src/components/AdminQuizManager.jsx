import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../utils/supabase'

const SUBJECTS = [
  { value: 'Toán', label: 'Toán' },
  { value: 'Vật Lý', label: 'Vật Lý' },
  { value: 'Hóa Học', label: 'Hóa Học' },
  { value: 'Tiếng Anh', label: 'Tiếng Anh' },
  { value: 'Khoa Học Tự Nhiên', label: 'Khoa Học Tự Nhiên' },
]

const GRADES = [6, 7, 8, 9, 10, 11, 12]

const QUIZ_TYPES = [
  { value: 'tracnghiem', label: 'Trắc nghiệm' },
  { value: 'tuluan', label: 'Tự luận' },
  { value: 'mixed', label: 'Trắc nghiệm + Tự luận' },
]

function AdminQuizManager() {
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingQuiz, setEditingQuiz] = useState(null)
  
  // Form state
  const [formData, setFormData] = useState({
    subject: 'Toán',
    grade: 10,
    title: '',
    description: '',
    type: 'tracnghiem',
    timeLimit: 30,
    difficulty: 'medium',
    questions: []
  })
  
  // Current question being edited
  const [currentQuestion, setCurrentQuestion] = useState({
    type: 'multiple-choice',
    q: '',
    choices: ['', '', '', ''],
    answer: 0,
    explain: '',
    image: '',
    maxScore: 2,
    rubric: ''
  })

  useEffect(() => {
    loadQuizzes()
  }, [])

  const loadQuizzes = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setQuizzes(data || [])
    } catch (err) {
      console.error('Error loading quizzes:', err)
      setError('Không thể tải danh sách bài tập. Hãy chắc chắn đã tạo bảng quizzes trong Supabase.')
    } finally {
      setLoading(false)
    }
  }


  const resetForm = () => {
    setFormData({
      subject: 'Toán',
      grade: 10,
      title: '',
      description: '',
      type: 'tracnghiem',
      timeLimit: 30,
      difficulty: 'medium',
      questions: []
    })
    setCurrentQuestion({
      type: 'multiple-choice',
      q: '',
      choices: ['', '', '', ''],
      answer: 0,
      explain: '',
      image: '',
      maxScore: 2,
      rubric: ''
    })
    setEditingQuiz(null)
  }

  const addQuestion = () => {
    if (!currentQuestion.q.trim()) {
      setError('Vui lòng nhập nội dung câu hỏi')
      return
    }

    const newQuestion = { ...currentQuestion }
    
    // Clean up based on question type
    if (newQuestion.type === 'multiple-choice') {
      delete newQuestion.maxScore
      delete newQuestion.rubric
      // Filter empty choices
      newQuestion.choices = newQuestion.choices.filter(c => c.trim())
      if (newQuestion.choices.length < 2) {
        setError('Cần ít nhất 2 đáp án')
        return
      }
    } else {
      delete newQuestion.choices
      delete newQuestion.answer
    }
    
    // Remove empty fields
    if (!newQuestion.explain) delete newQuestion.explain
    if (!newQuestion.image) delete newQuestion.image

    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }))

    // Reset current question
    setCurrentQuestion({
      type: currentQuestion.type,
      q: '',
      choices: ['', '', '', ''],
      answer: 0,
      explain: '',
      image: '',
      maxScore: 2,
      rubric: ''
    })
    setError('')
    setSuccess(`Đã thêm câu ${formData.questions.length + 1}`)
    setTimeout(() => setSuccess(''), 2000)
  }

  const removeQuestion = (index) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }))
  }

  const saveQuiz = async () => {
    if (!formData.title.trim()) {
      setError('Vui lòng nhập tiêu đề bài tập')
      return
    }
    if (formData.questions.length === 0) {
      setError('Vui lòng thêm ít nhất 1 câu hỏi')
      return
    }

    try {
      setSaving(true)
      setError('')

      const quizData = {
        subject: formData.subject,
        grade: formData.grade,
        title: formData.title,
        description: formData.description,
        type: formData.type,
        time_limit: formData.timeLimit,
        difficulty: formData.difficulty,
        questions: formData.questions
      }

      let result
      if (editingQuiz) {
        result = await supabase
          .from('quizzes')
          .update(quizData)
          .eq('id', editingQuiz.id)
          .select()
          .single()
      } else {
        result = await supabase
          .from('quizzes')
          .insert(quizData)
          .select()
          .single()
      }

      if (result.error) throw result.error

      setSuccess(editingQuiz ? 'Đã cập nhật bài tập!' : 'Đã tạo bài tập mới!')
      resetForm()
      setShowForm(false)
      loadQuizzes()
    } catch (err) {
      console.error('Error saving quiz:', err)
      setError('Lỗi khi lưu: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const deleteQuiz = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa bài tập này?')) return

    try {
      const { error } = await supabase
        .from('quizzes')
        .delete()
        .eq('id', id)

      if (error) throw error
      setSuccess('Đã xóa bài tập!')
      loadQuizzes()
    } catch (err) {
      setError('Lỗi khi xóa: ' + err.message)
    }
  }

  const editQuiz = (quiz) => {
    setFormData({
      subject: quiz.subject,
      grade: quiz.grade,
      title: quiz.title,
      description: quiz.description || '',
      type: quiz.type,
      timeLimit: quiz.time_limit,
      difficulty: quiz.difficulty || 'medium',
      questions: quiz.questions || []
    })
    setEditingQuiz(quiz)
    setShowForm(true)
  }


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <Link to="/admin" className="text-blue-600 dark:text-blue-400 hover:underline mb-2 inline-block">
                ← Quay lại Admin
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Quản lý Bài tập
              </h1>
            </div>
            <button
              onClick={() => { resetForm(); setShowForm(true) }}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700"
            >
              + Thêm bài tập mới
            </button>
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-300 rounded-lg">
              {success}
            </div>
          )}

          {/* Form */}
          {showForm && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                {editingQuiz ? 'Sửa bài tập' : 'Tạo bài tập mới'}
              </h2>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Môn học</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                  >
                    {SUBJECTS.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Lớp</label>
                  <select
                    value={formData.grade}
                    onChange={(e) => setFormData(prev => ({ ...prev, grade: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                  >
                    {GRADES.map(g => (
                      <option key={g} value={g}>Lớp {g}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Loại bài</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                  >
                    {QUIZ_TYPES.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tiêu đề</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="VD: Đề kiểm tra giữa kỳ"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Thời gian (phút)</label>
                  <input
                    type="number"
                    value={formData.timeLimit}
                    onChange={(e) => setFormData(prev => ({ ...prev, timeLimit: parseInt(e.target.value) || 30 }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mô tả</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Mô tả ngắn về bài tập"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              {/* Questions List */}
              {formData.questions.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Danh sách câu hỏi ({formData.questions.length})
                  </h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {formData.questions.map((q, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium text-blue-600 dark:text-blue-400 mr-2">
                            Câu {idx + 1}
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-300 truncate">
                            {q.q.substring(0, 50)}...
                          </span>
                          <span className="ml-2 text-xs px-2 py-0.5 bg-gray-200 dark:bg-slate-600 rounded">
                            {q.type === 'essay' ? 'Tự luận' : 'Trắc nghiệm'}
                          </span>
                        </div>
                        <button
                          onClick={() => removeQuestion(idx)}
                          className="ml-2 text-red-600 hover:text-red-800"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}


              {/* Add Question Form */}
              <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Thêm câu hỏi mới
                </h3>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Loại câu hỏi</label>
                  <select
                    value={currentQuestion.type}
                    onChange={(e) => setCurrentQuestion(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full md:w-48 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="multiple-choice">Trắc nghiệm</option>
                    <option value="essay">Tự luận</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nội dung câu hỏi *</label>
                  <textarea
                    value={currentQuestion.q}
                    onChange={(e) => setCurrentQuestion(prev => ({ ...prev, q: e.target.value }))}
                    placeholder="Nhập nội dung câu hỏi..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Link ảnh (tùy chọn)</label>
                  <input
                    type="text"
                    value={currentQuestion.image}
                    onChange={(e) => setCurrentQuestion(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="/asset/ten-anh.png hoặc https://..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                {currentQuestion.type === 'multiple-choice' ? (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Các đáp án</label>
                      <div className="space-y-2">
                        {currentQuestion.choices.map((choice, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="answer"
                              checked={currentQuestion.answer === idx}
                              onChange={() => setCurrentQuestion(prev => ({ ...prev, answer: idx }))}
                              className="w-4 h-4 text-blue-600"
                            />
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-6">
                              {String.fromCharCode(65 + idx)}.
                            </span>
                            <input
                              type="text"
                              value={choice}
                              onChange={(e) => {
                                const newChoices = [...currentQuestion.choices]
                                newChoices[idx] = e.target.value
                                setCurrentQuestion(prev => ({ ...prev, choices: newChoices }))
                              }}
                              placeholder={`Đáp án ${String.fromCharCode(65 + idx)}`}
                              className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                            />
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Chọn radio để đánh dấu đáp án đúng
                      </p>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Giải thích (tùy chọn)</label>
                      <textarea
                        value={currentQuestion.explain}
                        onChange={(e) => setCurrentQuestion(prev => ({ ...prev, explain: e.target.value }))}
                        placeholder="Giải thích đáp án..."
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Điểm tối đa</label>
                        <input
                          type="number"
                          value={currentQuestion.maxScore}
                          onChange={(e) => setCurrentQuestion(prev => ({ ...prev, maxScore: parseInt(e.target.value) || 2 }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rubric chấm điểm</label>
                      <textarea
                        value={currentQuestion.rubric}
                        onChange={(e) => setCurrentQuestion(prev => ({ ...prev, rubric: e.target.value }))}
                        placeholder="Hướng dẫn chấm điểm cho câu tự luận..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                  </>
                )}

                <button
                  onClick={addQuestion}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
                >
                  + Thêm câu hỏi này
                </button>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
                <button
                  onClick={saveQuiz}
                  disabled={saving}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
                >
                  {saving ? 'Đang lưu...' : (editingQuiz ? 'Cập nhật' : 'Lưu bài tập')}
                </button>
                <button
                  onClick={() => { setShowForm(false); resetForm() }}
                  className="px-6 py-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-slate-600"
                >
                  Hủy
                </button>
              </div>
            </div>
          )}


          {/* Quizzes List */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-slate-700">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">
                Danh sách bài tập từ Database ({quizzes.length})
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Các bài tập được lưu trong Supabase
              </p>
            </div>

            {loading ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                Đang tải...
              </div>
            ) : quizzes.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-2">Chưa có bài tập nào</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Hãy tạo bảng <code className="bg-gray-100 dark:bg-slate-700 px-1 rounded">quizzes</code> trong Supabase trước
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-slate-700">
                {quizzes.map(quiz => (
                  <div key={quiz.id} className="p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">
                          {quiz.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
                          <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
                            {quiz.subject}
                          </span>
                          <span>Lớp {quiz.grade}</span>
                          <span>•</span>
                          <span>{quiz.questions?.length || 0} câu</span>
                          <span>•</span>
                          <span>{quiz.time_limit} phút</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => editQuiz(quiz)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteQuiz(quiz.id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg">
            <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-2">📋 Hướng dẫn setup</h3>
            <p className="text-sm text-amber-700 dark:text-amber-400 mb-2">
              Để sử dụng tính năng này, bạn cần tạo bảng <code className="bg-amber-100 dark:bg-amber-900/50 px-1 rounded">quizzes</code> trong Supabase:
            </p>
            <pre className="text-xs bg-amber-100 dark:bg-amber-900/50 p-3 rounded overflow-x-auto text-amber-900 dark:text-amber-200">
{`CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject TEXT NOT NULL,
  grade INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT DEFAULT 'tracnghiem',
  time_limit INTEGER DEFAULT 30,
  difficulty TEXT DEFAULT 'medium',
  questions JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;

-- Allow read for everyone
CREATE POLICY "Anyone can read quizzes" ON quizzes FOR SELECT USING (true);

-- Allow admin to manage
CREATE POLICY "Admin can manage quizzes" ON quizzes FOR ALL USING (
  (auth.jwt() ->> 'email') = 'hungquocnguyen252@gmail.com'
  OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminQuizManager
