import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Nếu chưa có cấu hình, tạo client với giá trị mặc định để app không bị crash
// Nhưng các chức năng auth sẽ không hoạt động cho đến khi cấu hình đúng
const safeUrl = supabaseUrl || 'https://placeholder.supabase.co'
const safeKey = supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTIwMDAsImV4cCI6MTk2MDc2ODAwMH0.placeholder'

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️ Supabase chưa được cấu hình!')
  console.error('📝 Vui lòng:')
  console.error('   1. Tạo file .env trong thư mục gốc')
  console.error('   2. Copy nội dung từ .env.example')
  console.error('   3. Điền VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY')
  console.error('   4. Khởi động lại dev server (npm run dev)')
}

export const supabase = createClient(safeUrl, safeKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

// Export flag để check xem có cấu hình đúng không
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

