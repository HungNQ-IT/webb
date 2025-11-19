import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../utils/supabase'

function AdminAudioManager({ ieltsTests }) {
  const { user } = useAuth()
  const [selectedTest, setSelectedTest] = useState(null)
  const [audioUrl, setAudioUrl] = useState('')
  const [showInstructions, setShowInstructions] = useState(false)
  const [audioUrls, setAudioUrls] = useState({})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [uploadingFile, setUploadingFile] = useState(false)

  // Chỉ admin mới có quyền truy cập
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Không có quyền truy cập</h2>
            <p className="text-gray-600">Chỉ admin mới có thể quản lý audio.</p>
          </div>
        </div>
      </div>
    )
  }

  // Load audio URLs từ Supabase
  useEffect(() => {
    const loadAudioUrls = async () => {
      const { data, error } = await supabase
        .from('ielts_audio')
        .select('test_id, audio_url')
      
      if (!error && data) {
        const urlMap = {}
        data.forEach(item => {
          urlMap[item.test_id] = item.audio_url
        })
        setAudioUrls(urlMap)
      }
    }
    
    loadAudioUrls()
  }, [])

  // Lọc chỉ các bài Listening
  const listeningTests = ieltsTests.filter(test => test.category === 'Listening')

  const handleTestSelect = (test) => {
    setSelectedTest(test)
    setAudioUrl(audioUrls[test.id] || '')
    setMessage(null)
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file type
    const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a']
    if (!validTypes.includes(file.type) && !file.name.match(/\.(mp3|wav|ogg|m4a)$/i)) {
      setMessage({ 
        type: 'error', 
        text: '❌ File phải là MP3, WAV, OGG hoặc M4A' 
      })
      return
    }

    // Max 50MB
    if (file.size > 50 * 1024 * 1024) {
      setMessage({ 
        type: 'error', 
        text: '❌ File không được vượt quá 50MB' 
      })
      return
    }

    setUploadingFile(true)
    setMessage({ type: 'info', text: '⏳ Đang upload file...' })

    try {
      // Upload to Supabase Storage
      const fileName = `test-${selectedTest.id}-${Date.now()}.${file.name.split('.').pop()}`
      const { data, error } = await supabase.storage
        .from('ielts-audio')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('ielts-audio')
        .getPublicUrl(fileName)

      // Set URL
      setAudioUrl(publicUrl)
      setMessage({ 
        type: 'success', 
        text: '✅ Upload thành công! Click "Lưu Audio" để hoàn tất.' 
      })

    } catch (error) {
      console.error('Upload error:', error)
      setMessage({ 
        type: 'error', 
        text: `❌ Lỗi upload: ${error.message}` 
      })
    } finally {
      setUploadingFile(false)
    }
  }

  const convertGoogleDriveLink = (link) => {
    // Chuyển đổi link Google Drive thành streaming link
    
    // Pattern: /file/d/FILE_ID/view hoặc /d/FILE_ID
    const match = link.match(/\/d\/([a-zA-Z0-9_-]+)/)
    if (match) {
      const fileId = match[1]
      // Dùng export=open để stream audio (tốt hơn export=download)
      return `https://drive.google.com/uc?export=open&id=${fileId}`
    }
    
    return link
  }

  const handleSave = async () => {
    if (!audioUrl.trim()) {
      setMessage({ type: 'error', text: 'Vui lòng nhập link audio' })
      return
    }

    setLoading(true)
    setMessage(null)
    const directUrl = convertGoogleDriveLink(audioUrl)

    try {
      // Kiểm tra xem đã có audio chưa
      const { data: existing } = await supabase
        .from('ielts_audio')
        .select('id')
        .eq('test_id', selectedTest.id)
        .single()

      if (existing) {
        // Update
        const { error } = await supabase
          .from('ielts_audio')
          .update({ 
            audio_url: directUrl,
            updated_at: new Date().toISOString()
          })
          .eq('test_id', selectedTest.id)

        if (error) throw error
      } else {
        // Insert
        const { error } = await supabase
          .from('ielts_audio')
          .insert({
            test_id: selectedTest.id,
            audio_url: directUrl,
            uploaded_by: user.id
          })

        if (error) throw error
      }

      // Cập nhật state local
      setAudioUrls(prev => ({
        ...prev,
        [selectedTest.id]: directUrl
      }))

      setMessage({ 
        type: 'success', 
        text: `✅ Đã lưu audio cho bài test #${selectedTest.id}` 
      })
      
      // Clear cache để reload data
      localStorage.removeItem('ielts_cache')
      
    } catch (error) {
      console.error('Error saving audio:', error)
      setMessage({ 
        type: 'error', 
        text: `❌ Lỗi: ${error.message}` 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Bạn có chắc muốn xóa audio này?')) return

    setLoading(true)
    setMessage(null)

    try {
      const { error } = await supabase
        .from('ielts_audio')
        .delete()
        .eq('test_id', selectedTest.id)

      if (error) throw error

      // Cập nhật state local
      setAudioUrls(prev => {
        const newUrls = { ...prev }
        delete newUrls[selectedTest.id]
        return newUrls
      })

      setAudioUrl('')
      setMessage({ 
        type: 'success', 
        text: `✅ Đã xóa audio cho bài test #${selectedTest.id}` 
      })
      
      localStorage.removeItem('ielts_cache')
      
    } catch (error) {
      console.error('Error deleting audio:', error)
      setMessage({ 
        type: 'error', 
        text: `❌ Lỗi: ${error.message}` 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  🎧 Quản lý Audio Listening
                </h1>
                <p className="text-gray-600">
                  Thêm hoặc cập nhật link audio từ Google Drive cho bài tập Listening
                </p>
              </div>
              <button
                onClick={() => setShowInstructions(!showInstructions)}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                {showInstructions ? 'Ẩn hướng dẫn' : 'Xem hướng dẫn'}
              </button>
            </div>
          </div>

          {/* Instructions */}
          {showInstructions && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-bold text-blue-900 mb-3">📖 Hướng dẫn thêm Audio</h3>
              <ol className="space-y-2 text-sm text-blue-800">
                <li className="flex gap-2">
                  <span className="font-bold">1.</span>
                  <span>Upload file audio lên Google Drive (đăng nhập bằng tài khoản admin)</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">2.</span>
                  <span>Click chuột phải vào file → Chia sẻ → Chọn "Bất kỳ ai có link đều có thể xem"</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">3.</span>
                  <span>Copy link chia sẻ (dạng: https://drive.google.com/file/d/FILE_ID/view)</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">4.</span>
                  <span>Paste link vào ô bên dưới, hệ thống sẽ tự động chuyển đổi sang direct link</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">5.</span>
                  <span>Click "Lưu" và cập nhật file ielts.json với URL mới</span>
                </li>
              </ol>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {/* Left: List of Listening Tests */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Danh sách bài Listening ({listeningTests.length})
              </h2>
              
              {listeningTests.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>Chưa có bài Listening nào.</p>
                  <p className="text-sm mt-2">Thêm bài mới vào file ielts.json</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {listeningTests.map((test) => (
                    <button
                      key={test.id}
                      onClick={() => handleTestSelect(test)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        selectedTest?.id === test.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            #{test.id} - {test.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {test.sections?.length || 0} sections | {test.timeLimit} phút
                          </p>
                        </div>
                        <div className="ml-2">
                          {audioUrls[test.id] ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              ✓ Có audio
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              ✗ Chưa có
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Audio URL Editor */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              {selectedTest ? (
                <>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Cập nhật Audio
                  </h2>
                  
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {selectedTest.title}
                    </h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>ID: #{selectedTest.id}</p>
                      <p>Sections: {selectedTest.sections?.length || 0}</p>
                      <p>Thời gian: {selectedTest.timeLimit} phút</p>
                    </div>
                  </div>

                  {/* Upload File */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📤 Upload File Audio (Khuyên dùng)
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="flex-1 cursor-pointer">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors text-center">
                          {uploadingFile ? (
                            <div className="flex items-center justify-center gap-2 text-blue-600">
                              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <span>Đang upload...</span>
                            </div>
                          ) : (
                            <>
                              <div className="text-3xl mb-2">🎵</div>
                              <div className="text-sm text-gray-600">
                                Click để chọn file audio
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                MP3, WAV, OGG, M4A (Max 50MB)
                              </div>
                            </>
                          )}
                        </div>
                        <input
                          type="file"
                          accept="audio/*,.mp3,.wav,.ogg,.m4a"
                          onChange={handleFileUpload}
                          disabled={uploadingFile}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Hoặc dùng link */}
                  <div className="mb-4">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Hoặc dùng link</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🔗 Link Audio (Google Drive, Supabase, v.v.)
                    </label>
                    <input
                      type="text"
                      value={audioUrl}
                      onChange={(e) => setAudioUrl(e.target.value)}
                      placeholder="https://your-audio-url.mp3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      disabled={uploadingFile}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Paste link audio từ bất kỳ nguồn nào
                    </p>
                  </div>

                  {audioUrl && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Direct Link (Tự động chuyển đổi)
                      </label>
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <code className="text-xs text-green-800 break-all">
                          {convertGoogleDriveLink(audioUrl)}
                        </code>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Đây là link sẽ được sử dụng trong ielts.json
                      </p>
                    </div>
                  )}

                  {audioUrl && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Test Audio
                      </label>
                      <audio
                        controls
                        src={convertGoogleDriveLink(audioUrl)}
                        className="w-full"
                        onError={(e) => {
                          console.error('Audio error:', e)
                          alert('Không thể tải audio. Vui lòng kiểm tra:\n1. Link có đúng không?\n2. File có quyền "Anyone with the link can view" không?')
                        }}
                      >
                        Trình duyệt không hỗ trợ audio player.
                      </audio>
                      <p className="text-xs text-gray-500 mt-1">
                        Thử phát audio để kiểm tra link có hoạt động không
                      </p>
                    </div>
                  )}

                  {/* Message */}
                  {message && (
                    <div className={`mb-4 p-4 rounded-lg ${
                      message.type === 'success' 
                        ? 'bg-green-50 border border-green-200 text-green-800' 
                        : message.type === 'info'
                        ? 'bg-blue-50 border border-blue-200 text-blue-800'
                        : 'bg-red-50 border border-red-200 text-red-800'
                    }`}>
                      {message.text}
                    </div>
                  )}

                  <div className="space-y-3">
                    <button
                      onClick={handleSave}
                      disabled={!audioUrl || loading}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Đang lưu...</span>
                        </>
                      ) : (
                        <>
                          <span>💾</span>
                          <span>Lưu Audio</span>
                        </>
                      )}
                    </button>

                    {audioUrls[selectedTest.id] && (
                      <button
                        onClick={handleDelete}
                        disabled={loading}
                        className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <span>🗑️</span>
                        <span>Xóa Audio</span>
                      </button>
                    )}
                    
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>💡 Lưu ý:</strong> Audio được lưu vào database Supabase. Không cần cập nhật file JSON thủ công.
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <div className="text-center">
                    <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                    <p>Chọn một bài Listening để thêm/sửa audio</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminAudioManager
