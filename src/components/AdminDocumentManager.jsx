import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../utils/supabase'

const SUBJECTS = [
  { value: 'Toán', label: 'Toán' },
  { value: 'Vật Lý', label: 'Vật Lý' },
  { value: 'Hóa Học', label: 'Hóa Học' },
  { value: 'Tiếng Anh', label: 'Tiếng Anh' },
  { value: 'Sinh Học', label: 'Sinh Học' },
  { value: 'Lịch Sử', label: 'Lịch Sử' },
  { value: 'Địa Lý', label: 'Địa Lý' },
]

const GRADES = [6, 7, 8, 9, 10, 11, 12]

function AdminDocumentManager() {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingDoc, setEditingDoc] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  
  // Form state
  const [formData, setFormData] = useState({
    subject: 'Toán',
    grade: 10,
    title: '',
    description: '',
    file_url: '',
    file_type: 'pdf',
    file_size: null
  })

  // File upload
  const [selectedFile, setSelectedFile] = useState(null)

  useEffect(() => {
    loadDocuments()
  }, [])

  const loadDocuments = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setDocuments(data || [])
    } catch (err) {
      console.error('Error loading documents:', err)
      setError('Không thể tải danh sách tài liệu. Hãy chắc chắn đã tạo bảng documents trong Supabase.')
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
      file_url: '',
      file_type: 'pdf',
      file_size: null
    })
    setSelectedFile(null)
    setEditingDoc(null)
    setUploadProgress(0)
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    if (file.type !== 'application/pdf') {
      setError('Chỉ chấp nhận file PDF')
      return
    }

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      setError('File không được vượt quá 50MB')
      return
    }

    setSelectedFile(file)
    setFormData(prev => ({
      ...prev,
      file_size: file.size,
      title: prev.title || file.name.replace('.pdf', '')
    }))
    setError('')
  }

  const uploadFileToSupabase = async (file) => {
    try {
      setUploading(true)
      setUploadProgress(0)

      // Generate unique filename
      const timestamp = Date.now()
      const filename = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      const filePath = `documents/${filename}`

      // Upload file
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath)

      setUploadProgress(100)
      return publicUrl
    } catch (err) {
      console.error('Upload error:', err)
      throw new Error('Lỗi khi upload file: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const saveDocument = async () => {
    if (!formData.title.trim()) {
      setError('Vui lòng nhập tiêu đề tài liệu')
      return
    }

    try {
      setSaving(true)
      setError('')

      let fileUrl = formData.file_url

      // Upload file if selected
      if (selectedFile) {
        fileUrl = await uploadFileToSupabase(selectedFile)
      }

      if (!fileUrl) {
        setError('Vui lòng chọn file hoặc nhập link tài liệu')
        return
      }

      const docData = {
        subject: formData.subject,
        grade: formData.grade,
        title: formData.title,
        description: formData.description,
        file_url: fileUrl,
        file_type: formData.file_type,
        file_size: formData.file_size,
        updated_at: new Date().toISOString()
      }

      let result
      if (editingDoc) {
        result = await supabase
          .from('documents')
          .update(docData)
          .eq('id', editingDoc.id)
          .select()
          .single()
      } else {
        result = await supabase
          .from('documents')
          .insert(docData)
          .select()
          .single()
      }

      if (result.error) throw result.error

      setSuccess(editingDoc ? 'Đã cập nhật tài liệu!' : 'Đã thêm tài liệu mới!')
      resetForm()
      setShowForm(false)
      loadDocuments()
    } catch (err) {
      console.error('Error saving document:', err)
      setError('Lỗi khi lưu: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const deleteDocument = async (id, fileUrl) => {
    if (!confirm('Bạn có chắc muốn xóa tài liệu này?')) return

    try {
      // Delete from database
      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', id)

      if (dbError) throw dbError

      // Try to delete file from storage (if it's a Supabase storage URL)
      if (fileUrl && fileUrl.includes('supabase')) {
        try {
          const path = fileUrl.split('/documents/')[1]
          if (path) {
            await supabase.storage
              .from('documents')
              .remove([`documents/${path}`])
          }
        } catch (storageErr) {
          console.warn('Could not delete file from storage:', storageErr)
        }
      }

      setSuccess('Đã xóa tài liệu!')
      loadDocuments()
    } catch (err) {
      setError('Lỗi khi xóa: ' + err.message)
    }
  }

  const editDocument = (doc) => {
    setFormData({
      subject: doc.subject,
      grade: doc.grade,
      title: doc.title,
      description: doc.description || '',
      file_url: doc.file_url,
      file_type: doc.file_type || 'pdf',
      file_size: doc.file_size
    })
    setEditingDoc(doc)
    setShowForm(true)
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A'
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
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
                Quản lý Tài liệu
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Upload và quản lý tài liệu PDF cho học sinh
              </p>
            </div>
            <button
              onClick={() => { resetForm(); setShowForm(true) }}
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-teal-700"
            >
              + Thêm tài liệu mới
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
                {editingDoc ? 'Sửa tài liệu' : 'Thêm tài liệu mới'}
              </h2>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tiêu đề *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="VD: Công thức toán học cơ bản"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mô tả</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Mô tả ngắn về tài liệu..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              {/* File Upload */}
              <div className="mb-6 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-slate-600">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Upload file PDF</h3>
                
                <div className="mb-4">
                  <label className="block w-full">
                    <div className="flex items-center justify-center px-4 py-8 border-2 border-gray-300 dark:border-slate-600 border-dashed rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition">
                      <div className="text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                          {selectedFile ? selectedFile.name : 'Click để chọn file PDF'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          Tối đa 50MB
                        </p>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                </div>

                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="mb-4">
                    <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                      Đang upload... {uploadProgress}%
                    </p>
                  </div>
                )}

                <div className="text-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                  hoặc
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nhập link tài liệu (Google Drive, Dropbox, etc.)
                  </label>
                  <input
                    type="url"
                    value={formData.file_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, file_url: e.target.value }))}
                    placeholder="https://drive.google.com/file/d/..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    💡 Tip: Với Google Drive, dùng link dạng /preview để xem trực tiếp
                  </p>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-slate-700">
                <button
                  onClick={saveDocument}
                  disabled={saving || uploading}
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-teal-700 disabled:opacity-50"
                >
                  {saving || uploading ? 'Đang lưu...' : (editingDoc ? 'Cập nhật' : 'Lưu tài liệu')}
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

          {/* Documents List */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-slate-700">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">
                Danh sách tài liệu ({documents.length})
              </h2>
            </div>

            {loading ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                Đang tải...
              </div>
            ) : documents.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-2">Chưa có tài liệu nào</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Hãy tạo bảng <code className="bg-gray-100 dark:bg-slate-700 px-1 rounded">documents</code> trong Supabase
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-slate-700">
                {documents.map(doc => (
                  <div key={doc.id} className="p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                          </svg>
                          <h3 className="font-medium text-gray-900 dark:text-gray-100">
                            {doc.title}
                          </h3>
                        </div>
                        {doc.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {doc.description}
                          </p>
                        )}
                        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                          <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
                            {doc.subject}
                          </span>
                          <span>Lớp {doc.grade}</span>
                          <span>•</span>
                          <span>{formatFileSize(doc.file_size)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg"
                          title="Xem tài liệu"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </a>
                        <button
                          onClick={() => editDocument(doc)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteDocument(doc.id, doc.file_url)}
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

          {/* Setup Instructions */}
          <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg">
            <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-2">📋 Hướng dẫn setup</h3>
            <p className="text-sm text-amber-700 dark:text-amber-400 mb-2">
              Để sử dụng tính năng này, bạn cần:
            </p>
            <ol className="text-sm text-amber-700 dark:text-amber-400 list-decimal list-inside space-y-1">
              <li>Tạo bảng <code className="bg-amber-100 dark:bg-amber-900/50 px-1 rounded">documents</code> trong Supabase</li>
              <li>Tạo bucket <code className="bg-amber-100 dark:bg-amber-900/50 px-1 rounded">documents</code> trong Storage (nếu muốn upload trực tiếp)</li>
              <li>Hoặc dùng Google Drive để lưu file PDF</li>
            </ol>
            <details className="mt-3">
              <summary className="cursor-pointer text-sm font-semibold text-amber-800 dark:text-amber-300">
                Xem SQL script →
              </summary>
              <pre className="text-xs bg-amber-100 dark:bg-amber-900/50 p-3 rounded overflow-x-auto text-amber-900 dark:text-amber-200 mt-2">
{`CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject TEXT NOT NULL,
  grade INTEGER,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT DEFAULT 'pdf',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read documents" 
ON documents FOR SELECT USING (true);

CREATE POLICY "Admin can manage documents" 
ON documents FOR ALL USING (
  (auth.jwt() ->> 'email') = 'hungquocnguyen252@gmail.com'
  OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);`}
              </pre>
            </details>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDocumentManager
