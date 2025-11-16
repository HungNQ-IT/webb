-- Script để thêm các cột user_email, user_name, user_grade vào bảng submissions
-- Chạy script này nếu bảng submissions đã tồn tại nhưng chưa có các cột này

-- Thêm các cột mới (nếu chưa có)
DO $$ 
BEGIN
  -- Thêm cột user_email
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'submissions' 
    AND column_name = 'user_email'
  ) THEN
    ALTER TABLE submissions ADD COLUMN user_email TEXT;
  END IF;

  -- Thêm cột user_name
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'submissions' 
    AND column_name = 'user_name'
  ) THEN
    ALTER TABLE submissions ADD COLUMN user_name TEXT;
  END IF;

  -- Thêm cột user_grade
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'submissions' 
    AND column_name = 'user_grade'
  ) THEN
    ALTER TABLE submissions ADD COLUMN user_grade TEXT;
  END IF;
END $$;

-- Cập nhật dữ liệu cho các submissions cũ (nếu có)
-- Lấy thông tin user từ auth.users và cập nhật vào submissions
UPDATE submissions s
SET 
  user_email = COALESCE(
    (SELECT email FROM auth.users WHERE id = s.user_id),
    s.user_email
  ),
  user_name = COALESCE(
    (SELECT raw_user_meta_data->>'name' FROM auth.users WHERE id = s.user_id),
    s.user_name
  ),
  user_grade = COALESCE(
    (SELECT raw_user_meta_data->>'grade' FROM auth.users WHERE id = s.user_id),
    s.user_grade
  )
WHERE s.user_email IS NULL OR s.user_name IS NULL OR s.user_grade IS NULL;

