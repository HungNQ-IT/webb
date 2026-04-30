# 📋 Quick Reference - Upload PDF

## ⚡ Lệnh nhanh

### Setup (1 lần duy nhất)
```bash
# 1. Chạy SQL trong Supabase
# Copy file: setup_documents_simple.sql

# 2. Test
npm run dev
# Vào: http://localhost:5173/admin/documents
```

### Upload PDF mới (2 phút)
```bash
# 1. Upload lên Google Drive
# 2. Get link → Đổi /view thành /preview
# 3. Vào /admin/documents
# 4. Paste link và điền thông tin
# 5. Lưu
```

---

## 📁 File quan trọng

| File | Mục đích |
|------|----------|
| `BAT_DAU_UPLOAD_PDF.md` | Bắt đầu nhanh |
| `setup_documents_simple.sql` | SQL script |
| `src/components/AdminDocumentManager.jsx` | Admin UI |
| `src/components/DocumentList.jsx` | Student UI |

---

## 🔗 Link quan trọng

| Trang | URL |
|-------|-----|
| Admin Panel | `/admin/documents` |
| Supabase Dashboard | `https://supabase.com/dashboard` |
| Google Drive | `https://drive.google.com` |

---

## 🎯 Checklist nhanh

### Setup
- [ ] Chạy SQL script
- [ ] Test admin panel
- [ ] Upload 1 file thử

### Upload mới
- [ ] Upload lên Drive
- [ ] Lấy link preview
- [ ] Điền form
- [ ] Lưu

---

## 🐛 Fix lỗi nhanh

| Lỗi | Fix |
|-----|-----|
| Cannot read documents | Chạy SQL script |
| Upload failed | Dùng Google Drive |
| File không xem được | Dùng link `/preview` |
| Không thấy tài liệu | Import DocumentList |

---

## 💡 Tips

### Google Drive Link
```
❌ Sai: https://drive.google.com/file/d/1ABC/view
✅ Đúng: https://drive.google.com/file/d/1ABC/preview
```

### SQL Script
```sql
-- Tạo bảng
CREATE TABLE documents (...);

-- Enable RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can read" ...
CREATE POLICY "Admin can manage" ...
```

### Import Component
```jsx
import DocumentList from './DocumentList'

<DocumentList subject="Toán" grade={10} />
```

---

## 📊 Database Schema

```
documents
├── id (UUID)
├── subject (TEXT)
├── grade (INTEGER)
├── title (TEXT)
├── description (TEXT)
├── file_url (TEXT)
├── file_size (INTEGER)
├── file_type (TEXT)
├── created_at (TIMESTAMPTZ)
└── updated_at (TIMESTAMPTZ)
```

---

## 🎨 Component Props

### DocumentList
```jsx
<DocumentList 
  subject="Toán"    // Optional: Lọc theo môn
  grade={10}        // Optional: Lọc theo lớp
/>
```

---

## 🔐 Permissions

| Action | Who |
|--------|-----|
| Read | Everyone |
| Create | Admin only |
| Update | Admin only |
| Delete | Admin only |

---

## 📈 Workflow

```
Upload → Drive/Supabase → Get URL → Save to DB → Display
```

---

## 🚀 Commands

### Dev
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Deploy
```bash
npm run deploy
```

---

## 📞 Help

| Cần gì | Xem file |
|--------|----------|
| Bắt đầu | `BAT_DAU_UPLOAD_PDF.md` |
| Chi tiết | `HD/SETUP_TAI_LIEU_HOAN_CHINH.md` |
| FAQ | `FAQ_UPLOAD_PDF.md` |
| Checklist | `CHECKLIST_UPLOAD_PDF.md` |

---

## 🎯 Mục tiêu

- ✅ Setup trong 4 phút
- ✅ Upload PDF trong 2 phút
- ✅ Học sinh xem được ngay

---

**In file này ra để tham khảo nhanh! 📋**
