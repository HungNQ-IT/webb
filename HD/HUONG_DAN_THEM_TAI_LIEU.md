# 📚 Hướng dẫn thêm tài liệu PDF lên web

## 🎯 Tổng quan

Hệ thống hỗ trợ 2 loại nội dung cho mỗi môn học:
1. **Bài tập trắc nghiệm** - Làm trực tiếp trên web
2. **Tài liệu PDF** - Xem và tải về

---

## 📋 Cách 1: Upload PDF lên Supabase Storage (Khuyên dùng)

### Bước 1: Tạo bucket trong Supabase

1. Vào Supabase Dashboard → Storage
2. Tạo bucket mới tên `documents`
3. Cấu hình public access:

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
  AND (auth.jwt() ->> 'email') = 'hungquocnguyen252@gmail.com'
);
```

### Bước 2: Upload PDF

**Cách A: Upload qua Supabase Dashboard**
1. Vào Storage → documents
2. Click "Upload file"
3. Chọn file PDF
4. Copy URL của file

**Cách B: Upload qua Admin Panel** (Sẽ tạo giao diện)
- Vào `/admin/documents`
- Kéo thả file PDF
- Hệ thống tự động upload và lưu link

### Bước 3: Thêm thông tin tài liệu vào database

Tạo bảng `documents`:

```sql
CREATE TABLE documents (
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
ON documents FOR SELECT 
USING (true);

-- Cho phép admin quản lý
CREATE POLICY "Admin can manage documents" 
ON documents FOR ALL 
USING (
  (auth.jwt() ->> 'email') = 'hungquocnguyen252@gmail.com'
  OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);
```

---

## 📋 Cách 2: Upload PDF lên Google Drive (Đơn giản)

### Bước 1: Upload file lên Google Drive

1. Vào Google Drive
2. Upload file PDF
3. Click chuột phải → "Get link"
4. Chọn "Anyone with the link can view"
5. Copy link

### Bước 2: Chuyển đổi link

Link Google Drive có dạng:
```
https://drive.google.com/file/d/FILE_ID/view?usp=sharing
```

Chuyển thành link xem trực tiếp:
```
https://drive.google.com/file/d/FILE_ID/preview
```

Hoặc link tải về:
```
https://drive.google.com/uc?export=download&id=FILE_ID
```

### Bước 3: Thêm vào database

Dùng Admin Panel để thêm thông tin tài liệu với link Google Drive

---

## 📋 Cách 3: Lưu PDF trong project (Không khuyên dùng)

### Bước 1: Thêm file vào thư mục

```bash
# Tạo thư mục documents
mkdir -p public/documents

# Copy file PDF vào
cp /path/to/file.pdf public/documents/
```

### Bước 2: Commit và push

```bash
git add public/documents/
git commit -m "Thêm tài liệu PDF"
git push origin main
```

### Bước 3: Sử dụng link

Link file sẽ là:
```
/documents/ten-file.pdf
```

**⚠️ Lưu ý**: Cách này không tốt vì:
- File PDF thường lớn → Tăng kích thước repo
- Mỗi lần thêm phải push code
- Khó quản lý khi có nhiều file

---

## 🎨 Giao diện hiển thị tài liệu

Tài liệu sẽ hiển thị trong trang môn học:

```
📚 Toán - Lớp 10
├── 📝 Bài tập
│   ├── Phương trình bậc hai
│   ├── Hàm số bậc nhất
│   └── ...
└── 📄 Tài liệu
    ├── Công thức toán học cơ bản.pdf
    ├── Bài tập nâng cao.pdf
    └── ...
```

---

## 🔧 Tính năng Admin Panel sẽ có

### Quản lý tài liệu (`/admin/documents`)

- ✅ Upload file PDF trực tiếp
- ✅ Xem danh sách tài liệu
- ✅ Sửa thông tin (tiêu đề, mô tả)
- ✅ Xóa tài liệu
- ✅ Lọc theo môn học, lớp
- ✅ Xem trước PDF

### Tính năng cho học sinh

- 📖 Xem PDF trực tiếp trên web
- 💾 Tải về máy
- 🔍 Tìm kiếm tài liệu
- 📊 Lọc theo môn, lớp

---

## 📝 Ví dụ cụ thể

### Ví dụ 1: Thêm tài liệu Toán lớp 10

1. **Upload PDF lên Google Drive**
   - File: "Công thức toán học cơ bản.pdf"
   - Link: `https://drive.google.com/file/d/1ABC.../view`

2. **Vào Admin Panel** (`/admin/documents`)
   - Click "Thêm tài liệu mới"
   - Điền thông tin:
     - Môn: Toán
     - Lớp: 10
     - Tiêu đề: Công thức toán học cơ bản
     - Mô tả: Tổng hợp các công thức quan trọng
     - Link: `https://drive.google.com/file/d/1ABC.../preview`
   - Click "Lưu"

3. **Kiểm tra**
   - Vào trang Toán lớp 10
   - Thấy tài liệu mới trong tab "Tài liệu"

---

## 🎯 So sánh các cách

| Tiêu chí | Supabase Storage | Google Drive | File trong project |
|----------|------------------|--------------|-------------------|
| Dễ upload | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| Tốc độ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| Quản lý | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| Chi phí | Free 1GB | Free 15GB | Free |
| Khuyên dùng | ✅ Tốt nhất | ✅ Đơn giản | ❌ Không nên |

---

## 🚀 Kế hoạch triển khai

### Phase 1: Cơ bản (1-2 giờ)
- ✅ Tạo bảng `documents` trong Supabase
- ✅ Tạo Admin Panel quản lý tài liệu
- ✅ Hiển thị danh sách tài liệu trong trang môn học

### Phase 2: Nâng cao (2-3 giờ)
- ✅ Upload file trực tiếp từ Admin Panel
- ✅ Xem trước PDF trên web
- ✅ Tìm kiếm và lọc tài liệu
- ✅ Thống kê lượt xem/tải

---

## 📞 Hỗ trợ

Nếu cần giúp đỡ:
1. Tạo issue trên GitHub
2. Liên hệ admin
3. Xem video hướng dẫn (sẽ có)

---

**Tóm tắt**: 
- Dùng **Supabase Storage** hoặc **Google Drive** để lưu PDF
- Dùng **Admin Panel** để quản lý thông tin tài liệu
- Học sinh xem và tải tài liệu trực tiếp trên web
