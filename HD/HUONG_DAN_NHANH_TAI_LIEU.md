# 🚀 Hướng dẫn nhanh: Upload tài liệu PDF

## ⚡ Bắt đầu trong 5 phút

### Bước 1: Setup Supabase (1 phút)

Vào Supabase Dashboard → SQL Editor, chạy lệnh sau:

```sql
-- Tạo bảng documents
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

-- Enable RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Cho phép mọi người đọc
CREATE POLICY "Anyone can read documents" 
ON documents FOR SELECT USING (true);

-- Cho phép admin quản lý
CREATE POLICY "Admin can manage documents" 
ON documents FOR ALL USING (
  (auth.jwt() ->> 'email') = 'hungquocnguyen252@gmail.com'
  OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);
```

### Bước 2: Thêm route Admin (30 giây)

Kiểm tra file `src/App.jsx` đã có route `/admin/documents` chưa.

### Bước 3: Upload PDF (2 cách)

#### 🎯 Cách 1: Dùng Google Drive (Đơn giản nhất)

1. **Upload file lên Google Drive**
2. **Lấy link chia sẻ**: Click chuột phải → Get link → Anyone with the link
3. **Chuyển đổi link**:
   ```
   Link gốc:
   https://drive.google.com/file/d/1ABC123XYZ/view?usp=sharing
   
   Chuyển thành:
   https://drive.google.com/file/d/1ABC123XYZ/preview
   ```
4. **Vào Admin Panel**: `http://localhost:5173/admin/documents`
5. **Điền thông tin**:
   - Môn học: Toán
   - Lớp: 10
   - Tiêu đề: Công thức toán học
   - Link: Paste link preview ở trên
6. **Click "Lưu tài liệu"**

#### 🎯 Cách 2: Upload trực tiếp lên Supabase

**Setup Storage (chỉ làm 1 lần):**

1. Vào Supabase Dashboard → Storage
2. Create bucket tên `documents`
3. Chọn "Public bucket"
4. Vào SQL Editor, chạy:

```sql
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
```

**Upload file:**

1. Vào Admin Panel: `/admin/documents`
2. Click "Thêm tài liệu mới"
3. Kéo thả file PDF vào ô upload
4. Điền thông tin và lưu
5. ✅ Xong! File tự động upload lên Supabase

---

## 📝 Ví dụ cụ thể

### Thêm tài liệu "Công thức Toán 10"

**Dùng Google Drive:**

```
1. Upload file "cong-thuc-toan-10.pdf" lên Drive
2. Lấy link: https://drive.google.com/file/d/1ABC123/view
3. Chuyển thành: https://drive.google.com/file/d/1ABC123/preview
4. Vào /admin/documents
5. Điền:
   - Môn: Toán
   - Lớp: 10
   - Tiêu đề: Công thức toán học cơ bản
   - Mô tả: Tổng hợp công thức quan trọng
   - Link: https://drive.google.com/file/d/1ABC123/preview
6. Lưu
```

---

## 🎨 Hiển thị tài liệu cho học sinh

Tài liệu sẽ tự động hiển thị trong trang môn học tương ứng.

**Cần tạo component hiển thị:**

```jsx
// Trong SubjectList.jsx hoặc tạo DocumentList.jsx mới
import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'

function DocumentList({ subject, grade }) {
  const [documents, setDocuments] = useState([])
  
  useEffect(() => {
    loadDocuments()
  }, [subject, grade])
  
  const loadDocuments = async () => {
    const { data } = await supabase
      .from('documents')
      .select('*')
      .eq('subject', subject)
      .eq('grade', grade)
      .order('created_at', { ascending: false })
    
    setDocuments(data || [])
  }
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">📚 Tài liệu</h2>
      {documents.map(doc => (
        <div key={doc.id} className="border rounded-lg p-4">
          <h3 className="font-semibold">{doc.title}</h3>
          <p className="text-sm text-gray-600">{doc.description}</p>
          <a 
            href={doc.file_url} 
            target="_blank"
            className="text-blue-600 hover:underline"
          >
            📄 Xem tài liệu
          </a>
        </div>
      ))}
    </div>
  )
}
```

---

## ✅ Checklist

- [ ] Đã tạo bảng `documents` trong Supabase
- [ ] Đã setup Storage bucket (nếu dùng upload trực tiếp)
- [ ] Đã thêm route `/admin/documents` trong App.jsx
- [ ] Đã test upload 1 file PDF thử
- [ ] Đã tạo component hiển thị tài liệu cho học sinh

---

## 🐛 Troubleshooting

### Lỗi: "Cannot read documents"
→ Chưa tạo bảng `documents` hoặc chưa enable RLS policies

### Lỗi: "Upload failed"
→ Chưa tạo bucket `documents` hoặc chưa cấu hình policies

### File Google Drive không xem được
→ Kiểm tra link có dạng `/preview` chứ không phải `/view`

---

## 🎯 Khuyến nghị

**Dùng Google Drive nếu:**
- Bạn muốn đơn giản, nhanh
- Không cần quản lý file phức tạp
- Đã có sẵn file trên Drive

**Dùng Supabase Storage nếu:**
- Muốn quản lý tập trung
- Cần tốc độ tải nhanh
- Muốn tự động hóa hoàn toàn

---

**Tóm tắt**: Setup 1 lần, sau đó chỉ cần upload PDF và điền thông tin là xong! 🚀
