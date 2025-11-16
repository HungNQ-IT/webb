-- Script để cập nhật role của user thành admin
-- Chạy script này trong Supabase SQL Editor

-- Cập nhật user metadata để set role = 'admin'
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'
)
WHERE LOWER(email) = LOWER('hungquocnguyen252@gmail.com');

-- Kiểm tra đã cập nhật chưa
SELECT 
  id,
  email,
  raw_user_meta_data->>'role' AS role,
  raw_user_meta_data->>'name' AS name,
  raw_user_meta_data AS full_metadata
FROM auth.users
WHERE LOWER(email) = LOWER('hungquocnguyen252@gmail.com');

