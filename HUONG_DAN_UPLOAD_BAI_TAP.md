# 🚀 Hướng dẫn Upload Bài tập và Tài liệu

## 📋 Tổng quan

Hệ thống hỗ trợ **2 loại nội dung**:

1. **📝 Bài tập** (Trắc nghiệm/Tự luận) - Làm trực tiếp trên web
2. **📄 Tài liệu PDF** - Xem và tải về

---

## ✅ Giải pháp tốt nhất: Dùng Supabase

### **Ưu điểm:**
- ✨ Giao diện Admin trên web - Không cần code
- 📤 Upload dễ dàng - Không cần push GitHub
- 🔄 Cập nhật realtime
- 👥 Nhiều admin có thể quản lý
- 📊 Theo dõi kết quả học sinh

---

## 🎯 Hướng dẫn nhanh

### **A. Thêm bài tập**

1. Vào: `https://your-website.com/admin/quizzes`
2. Click "Thêm bài tập mới"
3. Điền thông tin:
   - Môn học, Lớp, Tiêu đề
   - Loại: Trắc nghiệm / Tự luận
   - Thời gian làm bài
4. Thêm câu hỏi:
   - **Trắc nghiệm**: 4 đáp án + đáp án đúng
   - **Tự luận**: Rubric chấm điểm
5. Click "Lưu bài tập"

✅ **Xong!** Bài tập hiển thị ngay trên web.

---

### **B. Thêm tài liệu PDF**

1. Vào: `https://your-website.com/admin/documents`
2. Click "Thêm tài liệu mới"
3. Chọn 1 trong 2 cách:

**Cách 1: Upload trực tiếp**
- Chọn file PDF từ máy tính
- Tối đa 50MB

**Cách 2: Dùng Google Drive** (Khuyên dùng)
- Upload file lên Google Drive
- Lấy link chia sẻ
- Chuyển thành link preview:
  ```
  https://drive.google.com/file/d/FILE_ID/preview
  ```
- Paste vào ô "Nhập link tài liệu"

4. Điền thông tin: Môn học, Lớp, Tiêu đề
5. Click "Lưu tài liệu"

✅ **Xong!** Tài liệu hiển thị ngay trong trang môn học.

---

## 🔧 Setup ban đầu (Chỉ làm 1 lần)

### **1. Setup Database**

Vào Supabase Dashboard → SQL Editor → Chạy:

```sql
-- Bảng bài tập
-- Xem file: supabase_setup.sql

-- Bảng tài liệu
-- Xem file: documents_setup.sql
```

### **2. Setup Storage (Tùy chọn)**

Nếu muốn upload file trực tiếp:

1. Vào Supabase Dashboard → Storage
2. Create bucket: `documents` (Public)
3. Chạy policies trong `documents_setup.sql`

---

## 📊 Ví dụ thực tế

### **Ví dụ 1: Thêm đề kiểm tra Toán**

```
Môn: Toán
Lớp: 10
Tiêu đề: Đề kiểm tra giữa kỳ 1
Loại: Trắc nghiệm
Thời gian: 45 phút
Số câu: 20 câu

→ Học sinh làm bài trực tiếp trên web
→ Hệ thống tự động chấm điểm
```

### **Ví dụ 2: Thêm tài liệu công thức**

```
Môn: Toán
Lớp: 10
Tiêu đề: Công thức toán học cơ bản
File: Upload lên Google Drive
Link: https://drive.google.com/.../preview

→ Học sinh xem PDF trực tiếp trên web
→ Có thể tải về máy
```

---

## 📁 Cấu trúc hiển thị

```
📚 Toán - Lớp 10
├── 📝 Bài tập
│   ├── Đề kiểm tra giữa kỳ 1
│   ├── Bài tập phương trình
│   └── Đề thi thử
│
└── 📄 Tài liệu
    ├── Công thức cơ bản.pdf
    ├── Bài giảng.pdf
    └── Đề thi tham khảo.pdf
```

---

## 🔄 So sánh với cách cũ (File JSON)

| Tiêu chí | File JSON (Cũ) | Supabase (Mới) |
|----------|----------------|----------------|
| Thêm bài | Sửa code → Push GitHub | Giao diện web |
| Cập nhật | Phải push code | Realtime |
| Quản lý | Khó | Dễ |
| Kết quả | Không lưu | Lưu database |
| Khuyên dùng | ❌ | ✅ |

---

## 📚 Tài liệu chi tiết

Xem thêm trong thư mục `HD/`:

- `HUONG_DAN_TONG_HOP_UPLOAD.md` - Hướng dẫn đầy đủ
- `HUONG_DAN_THEM_TAI_LIEU.md` - Chi tiết về tài liệu PDF
- `HUONG_DAN_THEM_BAI_TAP.md` - Chi tiết về bài tập (cách cũ)

---

## 🐛 Xử lý lỗi

### **"Không thể tải danh sách"**
→ Chưa tạo bảng trong Supabase
→ Chạy file SQL setup

### **"Không thể upload file"**
→ Chưa tạo Storage bucket
→ Hoặc dùng Google Drive thay thế

### **"File quá lớn"**
→ Nén file PDF
→ Hoặc dùng Google Drive

---

## 📞 Liên hệ

Nếu cần hỗ trợ:
- Xem file hướng dẫn trong `HD/`
- Kiểm tra console log (F12)
- Xem Supabase Dashboard logs

---

## 🎯 Tóm tắt

**Cách tiện nhất:**

1. **Bài tập**: Vào `/admin/quizzes` → Thêm trực tiếp trên web
2. **Tài liệu**: Upload lên Google Drive → Paste link vào `/admin/documents`

**Không cần:**
- ❌ Sửa file JSON
- ❌ Push code lên GitHub
- ❌ Biết lập trình

**Chỉ cần:**
- ✅ Vào Admin Panel
- ✅ Điền form
- ✅ Click "Lưu"

→ **Xong!** Nội dung hiển thị ngay lập tức.
