# 📚 Upload Tài liệu PDF - Hướng dẫn nhanh

## 🚀 Bắt đầu trong 4 phút

### Bước 1: Setup Database
```bash
# Vào Supabase → SQL Editor
# Copy và chạy file: setup_documents_simple.sql
```

### Bước 2: Upload PDF
```bash
# 1. Upload lên Google Drive
# 2. Get link → Anyone with the link
# 3. Đổi /view thành /preview
```

### Bước 3: Thêm vào Admin
```bash
# 1. Vào: /admin/documents
# 2. Click "Thêm tài liệu mới"
# 3. Paste link và điền thông tin
# 4. Lưu
```

---

## 📖 Tài liệu đầy đủ

### ⚡ Bắt đầu nhanh
- **[BAT_DAU_UPLOAD_PDF.md](./BAT_DAU_UPLOAD_PDF.md)** - 3 bước đơn giản
- **[CHECKLIST_UPLOAD_PDF.md](./CHECKLIST_UPLOAD_PDF.md)** - Checklist từng bước

### 📚 Hướng dẫn chi tiết
- **[HD/README_TAI_LIEU.md](./HD/README_TAI_LIEU.md)** - Mục lục chính
- **[HD/HUONG_DAN_NHANH_TAI_LIEU.md](./HD/HUONG_DAN_NHANH_TAI_LIEU.md)** - Hướng dẫn 5 phút
- **[HD/SETUP_TAI_LIEU_HOAN_CHINH.md](./HD/SETUP_TAI_LIEU_HOAN_CHINH.md)** - Setup đầy đủ
- **[HD/TICH_HOP_TAI_LIEU_VAO_TRANG.md](./HD/TICH_HOP_TAI_LIEU_VAO_TRANG.md)** - Tích hợp UI

### 📊 Tổng quan
- **[TAI_LIEU_UPLOAD_PDF_SUMMARY.md](./TAI_LIEU_UPLOAD_PDF_SUMMARY.md)** - Tổng hợp toàn bộ

---

## 🎯 Tính năng

### Admin (`/admin/documents`)
- ✅ Upload PDF (Supabase hoặc Google Drive)
- ✅ Quản lý: Thêm, sửa, xóa
- ✅ Lọc theo môn, lớp

### Học sinh
- ✅ Xem PDF trực tiếp
- ✅ Tải về máy
- ✅ Responsive, dark mode

---

## 🔧 Code

```
src/components/
├── AdminDocumentManager.jsx  ← Admin quản lý
└── DocumentList.jsx          ← Hiển thị cho học sinh

setup_documents_simple.sql    ← SQL script
```

---

## 💡 Ví dụ

### Upload "Công thức Toán 10"
```
1. Upload lên Drive
2. Link: https://drive.google.com/file/d/1ABC/view
3. Đổi: https://drive.google.com/file/d/1ABC/preview
4. Vào /admin/documents
5. Điền: Toán, Lớp 10, Tiêu đề, Link
6. Lưu → ✅ Xong!
```

---

## 🐛 Lỗi thường gặp

| Lỗi | Giải pháp |
|-----|-----------|
| Cannot read documents | Chạy SQL script |
| Upload failed | Tạo bucket `documents` |
| File không xem được | Dùng link `/preview` |

---

## 📞 Cần hỗ trợ?

1. Đọc: **[BAT_DAU_UPLOAD_PDF.md](./BAT_DAU_UPLOAD_PDF.md)**
2. Xem: **[CHECKLIST_UPLOAD_PDF.md](./CHECKLIST_UPLOAD_PDF.md)**
3. Chi tiết: **[HD/README_TAI_LIEU.md](./HD/README_TAI_LIEU.md)**

---

**Bắt đầu ngay! 🚀**
