-- =====================================================
-- SETUP DOCUMENTS TABLE & STORAGE
-- Hướng dẫn quản lý tài liệu PDF cho hệ thống
-- =====================================================

-- 1. TẠO BẢNG DOCUMENTS
-- Lưu thông tin về các tài liệu PDF
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject TEXT NOT NULL,
  grade INTEGER,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT DEFAULT 'pdf',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ENABLE ROW LEVEL SECURITY
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- 3. POLICIES - Cho phép mọi người đọc
CREATE POLICY "Anyone can read documents" 
ON documents FOR SELECT 
USING (true);

-- 4. POLICIES - Cho phép admin quản lý
CREATE POLICY "Admin can manage documents" 
ON documents FOR ALL 
USING (
  (auth.jwt() ->> 'email') = 'hungquocnguyen252@gmail.com'
  OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

-- 5. TẠO INDEX để tìm kiếm nhanh hơn
CREATE INDEX IF NOT EXISTS idx_documents_subject ON documents(subject);
CREATE INDEX IF NOT EXISTS idx_documents_grade ON documents(grade);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at DESC);

-- =====================================================
-- SETUP STORAGE BUCKET (Chạy trong Supabase Dashboard)
-- =====================================================

-- Vào Storage → Create new bucket
-- Bucket name: documents
-- Public bucket: Yes (để học sinh có thể xem)

-- Sau khi tạo bucket, chạy SQL sau để cấu hình policies:

-- Policy 1: Cho phép mọi người đọc file
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'documents' );

-- Policy 2: Cho phép admin upload file
CREATE POLICY "Admin can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'documents' 
  AND (
    (auth.jwt() ->> 'email') = 'hungquocnguyen252@gmail.com'
    OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  )
);

-- Policy 3: Cho phép admin xóa file
CREATE POLICY "Admin can delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'documents' 
  AND (
    (auth.jwt() ->> 'email') = 'hungquocnguyen252@gmail.com'
    OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  )
);

-- =====================================================
-- SAMPLE DATA (Tùy chọn - Để test)
-- =====================================================

INSERT INTO documents (subject, grade, title, description, file_url, file_size, file_type) VALUES
('Toán', 10, 'Công thức toán học cơ bản', 'Tổng hợp các công thức quan trọng lớp 10', 'https://example.com/sample.pdf', 1024000, 'pdf'),
('Vật Lý', 11, 'Bài tập điện trường', 'Bài tập và lời giải chi tiết', 'https://example.com/sample2.pdf', 2048000, 'pdf');

-- =====================================================
-- HƯỚNG DẪN SỬ DỤNG
-- =====================================================

-- Cách 1: Upload file qua Supabase Storage
-- 1. Vào Admin Panel: /admin/documents
-- 2. Click "Thêm tài liệu mới"
-- 3. Chọn file PDF từ máy tính
-- 4. Điền thông tin và lưu
-- → File sẽ được upload lên Supabase Storage tự động

-- Cách 2: Dùng link Google Drive
-- 1. Upload file lên Google Drive
-- 2. Lấy link chia sẻ (Anyone with the link can view)
-- 3. Chuyển link thành dạng preview:
--    https://drive.google.com/file/d/FILE_ID/preview
-- 4. Paste link vào Admin Panel

-- Cách 3: Dùng link Dropbox, OneDrive, etc.
-- Tương tự như Google Drive, lấy link public của file

-- =====================================================
-- XÓA DỮ LIỆU (Nếu cần reset)
-- =====================================================

-- Xóa tất cả documents
-- TRUNCATE TABLE documents;

-- Xóa bảng documents
-- DROP TABLE IF EXISTS documents;

-- Xóa storage bucket (Chạy trong Supabase Dashboard)
-- Vào Storage → documents → Delete bucket

-- =====================================================
-- KIỂM TRA
-- =====================================================

-- Xem tất cả documents
SELECT * FROM documents ORDER BY created_at DESC;

-- Đếm số documents theo môn học
SELECT subject, COUNT(*) as total 
FROM documents 
GROUP BY subject 
ORDER BY total DESC;

-- Xem documents của một môn học cụ thể
SELECT * FROM documents 
WHERE subject = 'Toán' 
ORDER BY grade, created_at DESC;
