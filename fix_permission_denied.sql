-- Script sửa lỗi "permission denied for table users"
-- Chạy script này trong SQL Editor của Supabase Dashboard

-- Bước 1: Xóa policy cũ (nếu đã tạo)
DROP POLICY IF EXISTS "Admins can view all submissions" ON submissions;
DROP POLICY IF EXISTS "Admins can view all submissions for realtime" ON submissions;

-- Bước 2: Tạo lại policy mới (dùng JWT thay vì query auth.users)
CREATE POLICY "Admins can view all submissions"
ON submissions
FOR SELECT
TO authenticated
USING (
  (auth.jwt() ->> 'email')::text = 'hungquocnguyen252@gmail.com'
  OR (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'admin'
);

-- Bước 3: Cập nhật metadata cho user admin hiện tại (nếu đã đăng ký)
-- Lưu ý: Chạy query này chỉ 1 lần, sau đó có thể xóa
UPDATE auth.users
SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || 
    jsonb_build_object('role', 'admin')
WHERE email = 'hungquocnguyen252@gmail.com'
AND (raw_user_meta_data->>'role' IS NULL OR raw_user_meta_data->>'role' != 'admin');

