-- Script để chỉ cho phép email admin xem submissions
-- Chạy script này trong Supabase SQL Editor

-- Xóa tất cả SELECT policies cũ
DROP POLICY IF EXISTS "Admins can view all submissions" ON submissions;
DROP POLICY IF EXISTS "Users can view own submissions" ON submissions;
DROP POLICY IF EXISTS "All authenticated users can view submissions" ON submissions;

-- Policy: Chỉ cho phép email admin hoặc role = 'admin' xem tất cả submissions
CREATE POLICY "Admin can view all submissions"
  ON submissions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (
        -- Kiểm tra email admin
        LOWER(auth.users.email) = LOWER('hungquocnguyen252@gmail.com')
        -- Hoặc kiểm tra role = 'admin' trong metadata
        OR (auth.users.raw_user_meta_data->>'role')::TEXT = 'admin'
      )
    )
  );

-- Policy: Users có thể xem submissions của chính họ (nếu cần)
-- CREATE POLICY "Users can view own submissions"
--   ON submissions
--   FOR SELECT
--   TO authenticated
--   USING (auth.uid() = user_id);

-- Kiểm tra policies đã được tạo
SELECT 
  policyname,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'submissions';

