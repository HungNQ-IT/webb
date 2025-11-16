-- Script để sửa RLS policy cho admin xem submissions
-- Chạy script này trong Supabase SQL Editor

-- Xóa policy cũ
DROP POLICY IF EXISTS "Admins can view all submissions" ON submissions;

-- Tạo lại policy - kiểm tra email admin trực tiếp
CREATE POLICY "Admins can view all submissions"
  ON submissions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (
        -- Kiểm tra role từ metadata
        (auth.users.raw_user_meta_data->>'role')::TEXT = 'admin'
        -- Hoặc kiểm tra email trực tiếp
        OR LOWER(auth.users.email) = LOWER('hungquocnguyen252@gmail.com')
        -- Hoặc email nằm trong danh sách admin (nếu có)
        OR LOWER(auth.users.email) IN (
          SELECT LOWER(unnest(string_to_array(current_setting('app.admin_emails', true), ',')))
        )
      )
    )
  );

