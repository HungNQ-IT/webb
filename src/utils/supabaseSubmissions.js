import { supabase } from './supabase'

/**
 * Lưu submission vào Supabase
 */
export async function saveSubmission(quizId, score, total, details) {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User chưa đăng nhập')
  }

  const { data, error } = await supabase
    .from('submissions')
    .insert({
      user_id: user.id,
      quiz_id: quizId,
      score,
      total,
      details: details || null
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
  // Gọi function trong Supabase để lấy submissions với thông tin user
  const { data, error } = await supabase
    .rpc('get_submissions_with_users')

  if (error) {
    console.error('Error fetching all submissions:', error)
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
      email: item.user_email,
      name: item.user_name,
      grade: item.user_grade
    }
  }))
}

