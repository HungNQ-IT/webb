-- Script để test xem user có phải admin không
-- Chạy script này trong Supabase SQL Editor sau khi đăng nhập

-- Kiểm tra user hiện tại và role
SELECT 
  id,
  email,
  raw_user_meta_data->>'role' AS role_from_metadata,
  raw_user_meta_data->>'name' AS name,
  raw_user_meta_data AS full_metadata
FROM auth.users
WHERE id = auth.uid();

-- Kiểm tra xem policy có cho phép xem submissions không
SELECT 
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND (
      (auth.users.raw_user_meta_data->>'role')::TEXT = 'admin'
      OR LOWER(auth.users.email) = LOWER('hungquocnguyen252@gmail.com')
    )
  ) AS is_admin,
  auth.uid() AS current_user_id;

-- Test query submissions (phải chạy được nếu là admin)
SELECT COUNT(*) AS total_submissions FROM submissions;

