import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../utils/supabase'
import { Link } from 'react-router-dom'

function Profile() {
  const { user, updateProfile } = useAuth()
  const [uploading, setUploading] = useState(false)
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    completedQuizzes: 0,
    averageScore: 0,
    totalTimeSpent: 0,
    recentSubmissions: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadUserStats()
    }
  }, [user])

  const loadUserStats = async () => {
    try {
      // Lấy tất cả submissions của user
      const { data: submissions, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      if (submissions && submissions.length > 0) {
        // Tính toán thống kê
        const totalSubmissions = submissions.length
        const completedQuizzes = new Set(submissions.map(s => s.quiz_id)).size
        const totalScore = submissions.reduce((sum, s) => sum + (s.score || 0), 0)
        const totalPossible = submissions.reduce((sum, s) => sum + (s.total || 0), 0)
        const averageScore = totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0

        // Tính thời gian (giả sử mỗi bài tập mất trung bình 10 phút)
        const totalTimeSpent = Math.round(totalSubmissions * 10 / 60 * 10) / 10 // giờ

        setStats({
          totalSubmissions,
          completedQuizzes,
          averageScore,
          totalTimeSpent,
          recentSubmissions: submissions.slice(0, 5)
        })
      }
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarUpload = async (event) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        return // User cancelled selection
      }

      const file = event.target.files[0]

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Vui lòng chọn file hình ảnh (JPG, PNG, GIF, ...)')
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        throw new Error('Kích thước ảnh không được vượt quá 2MB')
      }

      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      // Upload image
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) {
        console.error('Supabase storage upload error:', uploadError)
        if (uploadError.message.includes('Bucket not found')) {
          throw new Error('Lỗi hệ thống: Bucket "avatars" chưa được tạo. Vui lòng liên hệ admin chạy script setup.')
        } else if (uploadError.message.includes('new row violates row-level security policy')) {
          throw new Error('Lỗi quyền truy cập: Bạn không có quyền upload ảnh. Vui lòng kiểm tra lại đăng nhập.')
        } else {
          throw new Error(`Lỗi upload: ${uploadError.message}`)
        }
      }

      // Get public URL
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)

      if (data) {
        // Update user profile
        await updateProfile({
          avatar_url: data.publicUrl
        })
        alert('Cập nhật ảnh đại diện thành công!')
      }
    } catch (error) {
      console.error('Error uploading avatar:', error)
      alert(error.message)
    } finally {
      setUploading(false)
      // Reset input value to allow selecting the same file again
      event.target.value = ''
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-pulse">
          <div className="w-20 h-20 bg-gray-200 dark:bg-slate-700 rounded-full mx-auto mb-4"></div>
          <div className="h-4 w-32 bg-gray-200 dark:bg-slate-700 rounded mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none"></div>
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-40 -left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 animate-fade-in-up">
            <button
              onClick={() => window.history.back()}
              className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium flex items-center gap-2 mb-6 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Quay lại
            </button>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Hồ sơ <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">cá nhân</span>
            </h1>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            {/* Left Column: User Info */}
            <div className="lg:col-span-4 space-y-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 dark:border-slate-700/50 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none"></div>

                <div className="relative inline-block mb-6 group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative w-32 h-32 rounded-full p-1 bg-white dark:bg-slate-800">
                    <div className="w-full h-full rounded-full overflow-hidden relative">
                      {user.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center">
                          <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                            {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}

                      {/* Upload Overlay */}
                      <label
                        htmlFor="avatar-upload"
                        className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer backdrop-blur-sm"
                      >
                        {uploading ? (
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-2"></div>
                        ) : (
                          <>
                            <svg className="w-8 h-8 text-white mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="text-white text-xs font-medium">Đổi ảnh</span>
                          </>
                        )}
                      </label>
                      <input
                        type="file"
                        id="avatar-upload"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {user.name || 'Học viên'}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6 font-medium">{user.email}</p>

                <div className="flex flex-wrap justify-center gap-2">
                  <span className={`px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm ${user.role === 'admin'
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                      : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                    }`}>
                    {user.role === 'admin' ? 'Quản trị viên' : 'Học viên'}
                  </span>
                  {user.user_metadata?.grade && (
                    <span className="px-4 py-1.5 rounded-full text-sm font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800 shadow-sm">
                      Lớp {user.user_metadata.grade}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Stats & History */}
            <div className="lg:col-span-8 space-y-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    label: 'Bài tập đã làm',
                    value: stats.totalSubmissions,
                    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
                    color: 'text-blue-600 dark:text-blue-400',
                    bg: 'bg-blue-50 dark:bg-blue-900/20'
                  },
                  {
                    label: 'Hoàn thành',
                    value: stats.completedQuizzes,
                    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
                    color: 'text-green-600 dark:text-green-400',
                    bg: 'bg-green-50 dark:bg-green-900/20'
                  },
                  {
                    label: 'Điểm trung bình',
                    value: `${stats.averageScore}%`,
                    icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
                    color: 'text-orange-600 dark:text-orange-400',
                    bg: 'bg-orange-50 dark:bg-orange-900/20'
                  },
                  {
                    label: 'Giờ học tập',
                    value: stats.totalTimeSpent,
                    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
                    color: 'text-purple-600 dark:text-purple-400',
                    bg: 'bg-purple-50 dark:bg-purple-900/20'
                  },
                ].map((stat, index) => (
                  <div key={index} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md transition-shadow">
                    <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-4`}>
                      <svg className={`w-6 h-6 ${stat.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                      </svg>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-slate-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <span className="w-2 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></span>
                  Hoạt động gần đây
                </h3>

                {stats.recentSubmissions.length > 0 ? (
                  <div className="space-y-6 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100 dark:before:bg-slate-700">
                    {stats.recentSubmissions.map((submission, index) => {
                      const percentage = submission.total > 0
                        ? Math.round((submission.score / submission.total) * 100)
                        : 0

                      return (
                        <div key={index} className="relative pl-16 group">
                          {/* Timeline Dot */}
                          <div className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-4 border-white dark:border-slate-800 ${percentage >= 80 ? 'bg-green-500' : percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            } shadow-sm z-10 group-hover:scale-125 transition-transform`}></div>

                          <div className="bg-gray-50 dark:bg-slate-700/50 rounded-2xl p-4 flex items-center justify-between hover:bg-white dark:hover:bg-slate-700 hover:shadow-md transition-all border border-transparent hover:border-gray-100 dark:hover:border-slate-600">
                            <div>
                              <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                                Bài tập #{submission.quiz_id}
                              </h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                {formatDate(submission.created_at)}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-gray-900 dark:text-white">
                                {submission.score}/{submission.total}
                              </div>
                              <div className={`text-xs font-bold ${percentage >= 80 ? 'text-green-600 dark:text-green-400' : percentage >= 60 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                                }`}>
                                {percentage}%
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gray-50 dark:bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">Bạn chưa có hoạt động nào</p>
                    <Link
                      to="/subjects"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-blue-500/25"
                    >
                      Bắt đầu học ngay
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
