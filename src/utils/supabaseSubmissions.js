import { supabase } from './supabase'

/**
 * Lưu submission vào Supabase
 */
export async function saveSubmission(quizId, score, total, details) {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User chưa đăng nhập')
  }

  // Lấy thông tin user từ metadata
  const userMeta = user.user_metadata || {}
  
  const submissionData = {
    user_id: user.id,
    quiz_id: quizId,
    score,
    total,
    details: details || null,
    // Lưu thêm thông tin user để dễ query sau này
    user_email: user.email,
    user_name: userMeta.name || null,
    user_grade: userMeta.grade || null
  }

  console.log('Inserting submission:', submissionData)

  const { data, error } = await supabase
    .from('submissions')
    .insert(submissionData)
    .select()
    .single()

  if (error) {
    console.error('Error saving submission:', error)
    console.error('Error code:', error.code)
    console.error('Error details:', error.details)
    console.error('Error hint:', error.hint)
    
    // Thông báo lỗi chi tiết hơn
    let errorMessage = error.message || 'Không thể lưu kết quả'
    if (error.code === '42501') {
      errorMessage = 'Không có quyền lưu submission. Vui lòng kiểm tra RLS policies.'
    } else if (error.code === '42703') {
      errorMessage = 'Cột không tồn tại. Vui lòng chạy script SUPABASE_ADD_USER_COLUMNS.sql'
    } else if (error.message?.includes('column') && error.message?.includes('does not exist')) {
      errorMessage = 'Bảng chưa có đủ cột. Vui lòng chạy script SUPABASE_ADD_USER_COLUMNS.sql trong Supabase SQL Editor'
    }
    
    throw new Error(errorMessage)
  }

  console.log('Submission saved successfully:', data)
  return data
}

/**
 * Lấy submissions của user hiện tại
 */
export async function getMySubmissions() {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User chưa đăng nhập')
  }

  const { data, error } = await supabase
    .from('submissions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching submissions:', error)
    throw new Error(error.message || 'Không thể tải lịch sử')
  }

  return data || []
}

/**
 * Lấy tất cả submissions (chỉ dành cho admin)
 */
export async function getAllSubmissions() {
  // Query trực tiếp từ bảng submissions (đã có thông tin user trong bảng)
  const { data, error } = await supabase
    .from('submissions')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching all submissions:', error)
    if (error.message.includes('permission') || error.message.includes('policy')) {
      throw new Error('Bạn không có quyền xem submissions. Vui lòng kiểm tra quyền admin.')
    }
    throw new Error(error.message || 'Không thể tải dữ liệu')
  }

  // Format data để tương thích với code hiện tại
  return (data || []).map(item => ({
    id: item.id,
    quizId: item.quiz_id,
    score: item.score,
    total: item.total,
    details: item.details,
    createdAt: item.created_at,
    user: {
      id: item.user_id,
      email: item.user_email || '',
      name: item.user_name || null,
      grade: item.user_grade || null
    }
  }))
}

