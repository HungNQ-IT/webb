-- SQL script để tạo bảng submissions trong Supabase
-- Chạy script này trong Supabase Dashboard → SQL Editor

-- Tạo bảng submissions
CREATE TABLE IF NOT EXISTS submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id INTEGER NOT NULL,
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  details JSONB, -- Lưu câu trả lời và thông tin chi tiết
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tạo index để query nhanh hơn
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_quiz_id ON submissions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at DESC);

-- Tạo RLS (Row Level Security) policies
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Policy: Users có thể xem submissions của chính họ
CREATE POLICY "Users can view own submissions"
  ON submissions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users có thể tạo submissions của chính họ
CREATE POLICY "Users can insert own submissions"
  ON submissions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Admins có thể xem tất cả submissions
-- Kiểm tra role từ user metadata
CREATE POLICY "Admins can view all submissions"
  ON submissions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (
        (auth.users.raw_user_meta_data->>'role')::TEXT = 'admin'
        OR auth.users.email IN (
          SELECT unnest(string_to_array(current_setting('app.admin_emails', true), ','))
        )
      )
    )
  );

-- Tạo function để lấy submissions với thông tin user (cho admin)
CREATE OR REPLACE FUNCTION get_submissions_with_users()
RETURNS TABLE (
  id UUID,
  user_id UUID,
  user_email TEXT,
  user_name TEXT,
  user_grade TEXT,
  quiz_id INTEGER,
  score INTEGER,
  total INTEGER,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.user_id,
    u.email::TEXT as user_email,
    (u.raw_user_meta_data->>'name')::TEXT as user_name,
    (u.raw_user_meta_data->>'grade')::TEXT as user_grade,
    s.quiz_id,
    s.score,
    s.total,
    s.details,
    s.created_at
  FROM submissions s
  JOIN auth.users u ON s.user_id = u.id
  ORDER BY s.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT SELECT ON submissions TO authenticated;
GRANT INSERT ON submissions TO authenticated;
GRANT EXECUTE ON FUNCTION get_submissions_with_users() TO authenticated;

