-- Script để test và kiểm tra submissions trong Supabase
-- Chạy script này trong Supabase SQL Editor để kiểm tra

-- 1. Kiểm tra bảng submissions có tồn tại không
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'submissions'
) AS table_exists;

-- 2. Đếm số lượng submissions hiện có
SELECT COUNT(*) AS total_submissions FROM submissions;

-- 3. Xem tất cả submissions (nếu có)
SELECT 
  id,
  user_id,
  quiz_id,
  score,
  total,
  created_at
FROM submissions
ORDER BY created_at DESC
LIMIT 10;

-- 4. Kiểm tra function có tồn tại không
SELECT EXISTS (
  SELECT FROM pg_proc 
  WHERE proname = 'get_submissions_with_users'
) AS function_exists;

-- 5. Test function (chỉ chạy nếu đã đăng nhập với admin)
-- SELECT * FROM get_submissions_with_users();

-- 6. Kiểm tra RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'submissions';

-- 7. Kiểm tra user hiện tại và role
SELECT 
  id,
  email,
  raw_user_meta_data->>'role' AS role,
  raw_user_meta_data->>'name' AS name
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;

