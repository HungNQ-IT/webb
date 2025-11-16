-- Script tạo bảng submissions trong Supabase
-- Chạy script này trong SQL Editor của Supabase Dashboard

-- Bước 1: Tạo bảng submissions
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id BIGINT NOT NULL,
  score BIGINT NOT NULL,
  total BIGINT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Bước 2: Tạo index để query nhanh
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_quiz_id ON submissions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at DESC);

-- Bước 3: Bật Row Level Security
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Bước 4: Tạo policies

-- Policy 1: Users có thể insert submission của chính mình
CREATE POLICY "Users can insert their own submissions"
ON submissions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy 2: Users có thể xem submission của chính mình
CREATE POLICY "Users can view their own submissions"
ON submissions
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy 3: Admin có thể xem tất cả submissions
-- Kiểm tra role từ user_metadata thay vì query auth.users
CREATE POLICY "Admins can view all submissions"
ON submissions
FOR SELECT
TO authenticated
USING (
  (auth.jwt() ->> 'email')::text = 'hungquocnguyen252@gmail.com'
  OR (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'admin'
);

-- Bước 5: Bật realtime cho bảng submissions (nếu chưa có)
-- Lưu ý: Nếu lỗi "relation already exists", bỏ qua bước này
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'submissions'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE submissions;
  END IF;
END $$;

