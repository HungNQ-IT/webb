import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

function AdminAudioManager({ ieltsTests }) {
  const { user } = useAuth()
  const [selectedTest, setSelectedTest] = useState(null)
  const [audioUrl, setAudioUrl] = useState('')
  const [showInstructions, setShowInstructions] = useState(false)

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

  // Lọc chỉ các bài Listening
  const listeningTests = ieltsTests.filter(test => test.category === 'Listening')

  const handleTestSelect = (test) => {
    setSelectedTest(test)
    setAudioUrl(test.audioUrl || '')
  }

  const convertGoogleDriveLink = (link) => {
    // Chuyển đổi link Google Drive thành direct link
    const match = link.match(/\/d\/([a-zA-Z0-9_-]+)/)
    if (match) {
      return `https://drive.google.com/uc?export=download&id=${match[1]}`
    }
    return link
  }

  const handleSave = () => {
    // Trong thực tế, bạn sẽ cần API để lưu vào database
    // Hiện tại chỉ hiển thị thông báo
    alert(`Audio URL đã được cập nhật cho bài test #${selectedTest.id}\n\nLưu ý: Để thay đổi có hiệu lực, bạn cần cập nhật file ielts.json thủ công với URL:\n${audioUrl}`)
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
                          {test.audioUrl ? (
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

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Google Drive Link
                    </label>
                    <input
                      type="text"
                      value={audioUrl}
                      onChange={(e) => setAudioUrl(e.target.value)}
                      placeholder="https://drive.google.com/file/d/FILE_ID/view"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Paste link chia sẻ từ Google Drive
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

                  <div className="space-y-3">
                    <button
                      onClick={handleSave}
                      disabled={!audioUrl}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      💾 Lưu Audio URL
                    </button>
                    
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <strong>⚠️ Lưu ý:</strong> Sau khi lưu, bạn cần cập nhật file <code className="bg-yellow-100 px-1 rounded">public/ielts.json</code> thủ công với URL mới.
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
