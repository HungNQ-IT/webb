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
  
  const { data, error } = await supabase
    .from('submissions')
    .insert({
      user_id: user.id,
      quiz_id: quizId,
      score,
      total,
      details: details || null,
      // Lưu thêm thông tin user để dễ query sau này
      user_email: user.email,
      user_name: userMeta.name || null,
      user_grade: userMeta.grade || null
    })
    .select()
    .single()

  if (error) {
    console.error('Error saving submission:', error)
    throw new Error(error.message || 'Không thể lưu kết quả')
  }

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

