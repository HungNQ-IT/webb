# 🚀 START HERE - Upload PDF

## ⚡ 3 bước - 4 phút

### 1️⃣ Setup Database (2 phút)
```
Vào Supabase → SQL Editor
Copy file: setup_documents_simple.sql
Paste và Run
```

### 2️⃣ Upload PDF (1 phút)
```
Upload lên Google Drive
Get link → Đổi /view thành /preview
```

### 3️⃣ Thêm vào Web (1 phút)
```
Vào: /admin/documents
Click "Thêm tài liệu mới"
Paste link và điền thông tin
Lưu
```

## ✅ Xong!

Học sinh giờ có thể xem và tải PDF.

---

## 📖 Đọc thêm

### Bắt đầu
- **[BAT_DAU_UPLOAD_PDF.md](./BAT_DAU_UPLOAD_PDF.md)** - Chi tiết 3 bước

### Checklist
- **[CHECKLIST_UPLOAD_PDF.md](./CHECKLIST_UPLOAD_PDF.md)** - Tick từng bước

### Tham khảo
- **[QUICK_REFERENCE_PDF.md](./QUICK_REFERENCE_PDF.md)** - Lệnh nhanh

### Mục lục
- **[INDEX_TAI_LIEU_PDF.md](./INDEX_TAI_LIEU_PDF.md)** - Tất cả file

### FAQ
- **[FAQ_UPLOAD_PDF.md](./FAQ_UPLOAD_PDF.md)** - 45+ câu hỏi

---

## 🐛 Gặp lỗi?

| Lỗi | Fix |
|-----|-----|
| Cannot read documents | Chạy SQL script |
| File không xem được | Dùng link `/preview` |

Xem thêm: **[FAQ_UPLOAD_PDF.md](./FAQ_UPLOAD_PDF.md)**

---

## 💡 Ví dụ

```
1. Upload "cong-thuc-toan-10.pdf" lên Drive
2. Link: https://drive.google.com/file/d/1ABC/view
3. Đổi: https://drive.google.com/file/d/1ABC/preview
4. Vào /admin/documents
5. Điền: Toán, Lớp 10, Tiêu đề, Link
6. Lưu → ✅ Xong!
```

---

## 🎯 Tính năng

- ✅ Upload PDF (Drive hoặc Supabase)
- ✅ Quản lý: Thêm, sửa, xóa
- ✅ Học sinh xem và tải
- ✅ Responsive, dark mode

---

## 📁 File quan trọng

```
setup_documents_simple.sql        ← SQL script
src/components/AdminDocumentManager.jsx  ← Admin
src/components/DocumentList.jsx   ← Student
```

---

**Bắt đầu ngay! 🚀**

Đọc chi tiết: **[BAT_DAU_UPLOAD_PDF.md](./BAT_DAU_UPLOAD_PDF.md)**
