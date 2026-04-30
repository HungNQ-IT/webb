# 🚀 Setup hoàn chỉnh tính năng Tài liệu PDF

## ✅ Tổng quan

Hệ thống đã có sẵn:
- ✅ Component `AdminDocumentManager` - Quản lý tài liệu (admin)
- ✅ Component `DocumentList` - Hiển thị tài liệu (học sinh)
- ✅ Route `/admin/documents` - Trang admin
- ✅ Database schema - File `documents_setup.sql`

## 📋 Checklist Setup (15 phút)

### ☐ Bước 1: Setup Supabase Database (2 phút)

1. Vào Supabase Dashboard → SQL Editor
2. Copy và chạy script từ file `documents_setup.sql`:

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

-- Policies
CREATE POLICY "Anyone can read documents" 
ON documents FOR SELECT USING (true);

CREATE POLICY "Admin can manage documents" 
ON documents FOR ALL USING (
  (auth.jwt() ->> 'email') = 'hungquocnguyen252@gmail.com'
  OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);
```

3. ✅ Kiểm tra: Vào Table Editor, thấy bảng `documents`

---

### ☐ Bước 2: Setup Supabase Storage (3 phút) - TÙY CHỌN

**Chỉ cần nếu muốn upload trực tiếp lên Supabase**

1. Vào Supabase Dashboard → Storage
2. Click "Create bucket"
3. Điền:
   - Name: `documents`
   - Public bucket: ✅ Yes
4. Click "Create bucket"
5. Vào SQL Editor, chạy:

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

6. ✅ Kiểm tra: Vào Storage, thấy bucket `documents`

---

### ☐ Bước 3: Test Admin Panel (2 phút)

1. Chạy dev server: `npm run dev`
2. Login với tài khoản admin
3. Vào: `http://localhost:5173/admin/documents`
4. ✅ Kiểm tra: Thấy trang quản lý tài liệu

---

### ☐ Bước 4: Upload tài liệu thử (3 phút)

**Cách A: Dùng Google Drive (Đơn giản)**

1. Upload file PDF lên Google Drive
2. Lấy link chia sẻ: Click chuột phải → Get link → Anyone with the link
3. Chuyển link:
   ```
   Từ: https://drive.google.com/file/d/1ABC123/view?usp=sharing
   Thành: https://drive.google.com/file/d/1ABC123/preview
   ```
4. Vào Admin Panel → Click "Thêm tài liệu mới"
5. Điền thông tin:
   - Môn: Toán
   - Lớp: 10
   - Tiêu đề: Test PDF
   - Link: Paste link preview
6. Click "Lưu tài liệu"

**Cách B: Upload trực tiếp (Nếu đã setup Storage)**

1. Vào Admin Panel → Click "Thêm tài liệu mới"
2. Kéo thả file PDF vào ô upload
3. Điền thông tin
4. Click "Lưu tài liệu"

✅ Kiểm tra: Thấy tài liệu trong danh sách

---

### ☐ Bước 5: Tích hợp hiển thị cho học sinh (5 phút)

**Chọn 1 trong 3 cách:**

#### Cách 1: Thêm vào QuizList (Hiển thị cùng bài tập)

Mở `src/components/QuizList.jsx`:

```jsx
import DocumentList from './DocumentList'

function QuizList({ quizzes, ieltsTests }) {
  const { subject, grade } = useParams()
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* ... existing quiz list ... */}
      
      {/* Thêm phần tài liệu */}
      <div className="mt-12">
        <DocumentList 
          subject={subject} 
          grade={grade ? parseInt(grade) : null} 
        />
      </div>
    </div>
  )
}
```

#### Cách 2: Tạo tab riêng (Khuyên dùng)

Mở `src/components/QuizList.jsx`:

```jsx
import { useState } from 'react'
import DocumentList from './DocumentList'

function QuizList({ quizzes, ieltsTests }) {
  const { subject, grade } = useParams()
  const [activeTab, setActiveTab] = useState('quizzes')
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTab('quizzes')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'quizzes'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600'
          }`}
        >
          📝 Bài tập
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'documents'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600'
          }`}
        >
          📚 Tài liệu
        </button>
      </div>

      {/* Content */}
      {activeTab === 'quizzes' ? (
        <div>{/* Existing quiz list */}</div>
      ) : (
        <DocumentList subject={subject} grade={grade ? parseInt(grade) : null} />
      )}
    </div>
  )
}
```

✅ Kiểm tra: Vào trang môn học, thấy tab "Tài liệu"

---

## 🎯 Kết quả cuối cùng

### Admin Panel (`/admin/documents`)
- ✅ Upload PDF (Supabase hoặc Google Drive)
- ✅ Xem danh sách tài liệu
- ✅ Sửa/Xóa tài liệu
- ✅ Lọc theo môn, lớp

### Trang học sinh
- ✅ Xem danh sách tài liệu theo môn/lớp
- ✅ Xem PDF trực tiếp
- ✅ Tải về máy
- ✅ Responsive, dark mode

---

## 📊 Cấu trúc dữ liệu

### Bảng `documents`

| Cột | Kiểu | Mô tả |
|-----|------|-------|
| id | UUID | ID tự động |
| subject | TEXT | Môn học (Toán, Vật Lý, ...) |
| grade | INTEGER | Lớp (6-12) |
| title | TEXT | Tiêu đề tài liệu |
| description | TEXT | Mô tả ngắn |
| file_url | TEXT | Link file PDF |
| file_size | INTEGER | Kích thước file (bytes) |
| file_type | TEXT | Loại file (mặc định: pdf) |
| created_at | TIMESTAMPTZ | Ngày tạo |
| updated_at | TIMESTAMPTZ | Ngày cập nhật |

---

## 🔧 Các file liên quan

```
src/
├── components/
│   ├── AdminDocumentManager.jsx  ← Admin quản lý tài liệu
│   ├── DocumentList.jsx          ← Hiển thị cho học sinh
│   └── QuizList.jsx              ← Tích hợp DocumentList vào đây
├── utils/
│   └── supabase.js               ← Kết nối Supabase
└── App.jsx                       ← Route /admin/documents

documents_setup.sql               ← SQL script setup database
HD/
├── HUONG_DAN_NHANH_TAI_LIEU.md  ← Hướng dẫn nhanh
├── TICH_HOP_TAI_LIEU_VAO_TRANG.md ← Hướng dẫn tích hợp
└── SETUP_TAI_LIEU_HOAN_CHINH.md ← File này
```

---

## 🐛 Troubleshooting

### Lỗi: "Cannot read documents"
**Nguyên nhân**: Chưa tạo bảng hoặc chưa cấu hình RLS  
**Giải pháp**: Chạy lại SQL script ở Bước 1

### Lỗi: "Upload failed"
**Nguyên nhân**: Chưa tạo bucket hoặc chưa cấu hình policies  
**Giải pháp**: Làm lại Bước 2

### File Google Drive không xem được
**Nguyên nhân**: Link không đúng format  
**Giải pháp**: Đảm bảo link có dạng `/preview` chứ không phải `/view`

### Không thấy tài liệu trong trang môn học
**Nguyên nhân**: Chưa tích hợp DocumentList  
**Giải pháp**: Làm Bước 5

---

## 📝 Ví dụ hoàn chỉnh

### 1. Thêm tài liệu "Công thức Toán 10"

```bash
# 1. Upload file lên Google Drive
# 2. Lấy link: https://drive.google.com/file/d/1ABC123/view
# 3. Chuyển thành: https://drive.google.com/file/d/1ABC123/preview
# 4. Vào /admin/documents
# 5. Điền:
#    - Môn: Toán
#    - Lớp: 10
#    - Tiêu đề: Công thức toán học cơ bản
#    - Mô tả: Tổng hợp công thức quan trọng
#    - Link: https://drive.google.com/file/d/1ABC123/preview
# 6. Lưu
```

### 2. Học sinh xem tài liệu

```bash
# 1. Vào trang: /subject/Toán/grade/10
# 2. Click tab "📚 Tài liệu"
# 3. Thấy: "Công thức toán học cơ bản"
# 4. Click "Xem" → Mở PDF trong tab mới
# 5. Click "Tải về" → Download file
```

---

## 🎉 Hoàn thành!

Sau khi làm xong 5 bước trên, hệ thống sẽ có đầy đủ tính năng:
- ✅ Admin upload và quản lý tài liệu PDF
- ✅ Học sinh xem và tải tài liệu
- ✅ Lọc theo môn học, lớp
- ✅ Responsive, dark mode
- ✅ Hỗ trợ Google Drive và Supabase Storage

---

## 📞 Cần hỗ trợ?

Xem thêm:
- `HD/HUONG_DAN_NHANH_TAI_LIEU.md` - Hướng dẫn nhanh
- `HD/TICH_HOP_TAI_LIEU_VAO_TRANG.md` - Chi tiết tích hợp
- `documents_setup.sql` - SQL script đầy đủ

**Chúc bạn thành công! 🚀**
