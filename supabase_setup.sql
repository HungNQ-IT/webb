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



-- ============================================
-- Bảng lưu audio URLs cho IELTS Listening
-- ============================================

-- Bước 6: Tạo bảng ielts_audio
CREATE TABLE IF NOT EXISTS ielts_audio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id BIGINT NOT NULL UNIQUE,
  audio_url TEXT NOT NULL,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Bước 7: Tạo index cho ielts_audio
CREATE INDEX IF NOT EXISTS idx_ielts_audio_test_id ON ielts_audio(test_id);

-- Bước 8: Bật Row Level Security cho ielts_audio
ALTER TABLE ielts_audio ENABLE ROW LEVEL SECURITY;

-- Bước 9: Tạo policies cho ielts_audio

-- Policy 1: Mọi người có thể đọc audio URLs (để phát audio)
CREATE POLICY "Anyone can read audio URLs"
ON ielts_audio
FOR SELECT
TO authenticated, anon
USING (true);

-- Policy 2: Chỉ admin mới có thể thêm audio URLs
CREATE POLICY "Only admins can insert audio URLs"
ON ielts_audio
FOR INSERT
TO authenticated
WITH CHECK (
  (auth.jwt() ->> 'email')::text = 'hungquocnguyen252@gmail.com'
  OR (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'admin'
);

-- Policy 3: Chỉ admin mới có thể cập nhật audio URLs
CREATE POLICY "Only admins can update audio URLs"
ON ielts_audio
FOR UPDATE
TO authenticated
USING (
  (auth.jwt() ->> 'email')::text = 'hungquocnguyen252@gmail.com'
  OR (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'admin'
);

-- Policy 4: Chỉ admin mới có thể xóa audio URLs
CREATE POLICY "Only admins can delete audio URLs"
ON ielts_audio
FOR DELETE
TO authenticated
USING (
  (auth.jwt() ->> 'email')::text = 'hungquocnguyen252@gmail.com'
  OR (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'admin'
);

-- Bước 10: Bật realtime cho bảng ielts_audio
DO $
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'ielts_audio'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE ielts_audio;
  END IF;
END $;


-- ============================================
-- Bảng lưu bài tập (quizzes) từ Admin Dashboard
-- ============================================

-- Bước 11: Tạo bảng quizzes
CREATE TABLE IF NOT EXISTS quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject TEXT NOT NULL,
  grade INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT DEFAULT 'tracnghiem',
  time_limit INTEGER DEFAULT 30,
  difficulty TEXT DEFAULT 'medium',
  questions JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Bước 12: Tạo index cho quizzes
CREATE INDEX IF NOT EXISTS idx_quizzes_subject ON quizzes(subject);
CREATE INDEX IF NOT EXISTS idx_quizzes_grade ON quizzes(grade);
CREATE INDEX IF NOT EXISTS idx_quizzes_created_at ON quizzes(created_at DESC);

-- Bước 13: Bật Row Level Security cho quizzes
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;

-- Bước 14: Tạo policies cho quizzes

-- Policy 1: Mọi người có thể đọc quizzes (để hiển thị bài tập)
CREATE POLICY "Anyone can read quizzes"
ON quizzes
FOR SELECT
TO authenticated, anon
USING (true);

-- Policy 2: Chỉ admin mới có thể thêm quizzes
CREATE POLICY "Only admins can insert quizzes"
ON quizzes
FOR INSERT
TO authenticated
WITH CHECK (
  (auth.jwt() ->> 'email')::text = 'hungquocnguyen252@gmail.com'
  OR (auth.jwt() ->> 'email')::text = 'duchoang305007@gmail.com'
  OR (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'admin'
);

-- Policy 3: Chỉ admin mới có thể cập nhật quizzes
CREATE POLICY "Only admins can update quizzes"
ON quizzes
FOR UPDATE
TO authenticated
USING (
  (auth.jwt() ->> 'email')::text = 'hungquocnguyen252@gmail.com'
  OR (auth.jwt() ->> 'email')::text = 'duchoang305007@gmail.com'
  OR (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'admin'
);

-- Policy 4: Chỉ admin mới có thể xóa quizzes
CREATE POLICY "Only admins can delete quizzes"
ON quizzes
FOR DELETE
TO authenticated
USING (
  (auth.jwt() ->> 'email')::text = 'hungquocnguyen252@gmail.com'
  OR (auth.jwt() ->> 'email')::text = 'duchoang305007@gmail.com'
  OR (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'admin'
);

-- Bước 15: Bật realtime cho bảng quizzes
DO $
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'quizzes'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE quizzes;
  END IF;
END $;
