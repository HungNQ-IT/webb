-- =====================================================
-- SETUP NHANH: Tài liệu PDF
-- Copy toàn bộ file này và chạy trong Supabase SQL Editor
-- =====================================================

-- 1. TẠO BẢNG DOCUMENTS
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

-- 3. CHO PHÉP MỌI NGƯỜI ĐỌC
CREATE POLICY "Anyone can read documents" 
ON documents FOR SELECT 
USING (true);

-- 4. CHO PHÉP ADMIN QUẢN LÝ
CREATE POLICY "Admin can manage documents" 
ON documents FOR ALL 
USING (
  (auth.jwt() ->> 'email') = 'hungquocnguyen252@gmail.com'
  OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

-- 5. TẠO INDEX (Tìm kiếm nhanh hơn)
CREATE INDEX IF NOT EXISTS idx_documents_subject ON documents(subject);
CREATE INDEX IF NOT EXISTS idx_documents_grade ON documents(grade);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at DESC);

-- =====================================================
-- ✅ XONG! Bây giờ bạn có thể:
-- 1. Vào /admin/documents để upload tài liệu
-- 2. Dùng Google Drive hoặc Supabase Storage
-- =====================================================

-- Kiểm tra bảng đã tạo thành công:
SELECT * FROM documents;

-- =====================================================
-- TÙY CHỌN: Setup Supabase Storage
-- (Chỉ cần nếu muốn upload trực tiếp, không bắt buộc)
-- =====================================================

-- Trước tiên: Vào Storage → Create bucket tên "documents" (Public)
-- Sau đó chạy các lệnh sau:

-- Cho phép mọi người đọc file
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'documents' );

-- Cho phép admin upload
CREATE POLICY "Admin can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'documents' 
  AND (
    (auth.jwt() ->> 'email') = 'hungquocnguyen252@gmail.com'
    OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  )
);

-- Cho phép admin xóa
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
-- SAMPLE DATA (Để test)
-- =====================================================

-- Thêm 2 tài liệu mẫu (dùng link Google Drive giả)
INSERT INTO documents (subject, grade, title, description, file_url, file_size) VALUES
('Toán', 10, 'Công thức toán học cơ bản', 'Tổng hợp các công thức quan trọng lớp 10', 'https://drive.google.com/file/d/SAMPLE_ID_1/preview', 1024000),
('Vật Lý', 11, 'Bài tập điện trường', 'Bài tập và lời giải chi tiết về điện trường', 'https://drive.google.com/file/d/SAMPLE_ID_2/preview', 2048000);

-- Xem dữ liệu mẫu
SELECT * FROM documents ORDER BY created_at DESC;

-- =====================================================
-- XÓA DỮ LIỆU (Nếu cần reset)
-- =====================================================

-- Xóa tất cả documents
-- TRUNCATE TABLE documents;

-- Xóa bảng documents
-- DROP TABLE IF EXISTS documents CASCADE;
