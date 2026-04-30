# ✅ Checklist: Setup Upload PDF

## 📋 Setup lần đầu (Chỉ làm 1 lần)

### Bước 1: Setup Database
- [ ] Vào Supabase Dashboard
- [ ] Mở SQL Editor
- [ ] Copy nội dung file `setup_documents_simple.sql`
- [ ] Paste và chạy
- [ ] Kiểm tra: Vào Table Editor → Thấy bảng `documents`

### Bước 2: Test Admin Panel
- [ ] Chạy: `npm run dev`
- [ ] Login với tài khoản admin
- [ ] Vào: `http://localhost:5173/admin/documents`
- [ ] Kiểm tra: Thấy trang quản lý tài liệu

### Bước 3: Tích hợp UI (Tùy chọn)
- [ ] Mở file `src/components/QuizList.jsx`
- [ ] Import: `import DocumentList from './DocumentList'`
- [ ] Thêm component `<DocumentList subject={subject} grade={grade} />`
- [ ] Test: Vào trang môn học, thấy danh sách tài liệu

---

## 📤 Upload tài liệu mới (Làm mỗi khi cần thêm PDF)

### Cách 1: Dùng Google Drive (Đơn giản)

- [ ] Upload file PDF lên Google Drive
- [ ] Click chuột phải → Get link
- [ ] Chọn: "Anyone with the link can view"
- [ ] Copy link (dạng: `https://drive.google.com/file/d/1ABC123/view`)
- [ ] Chuyển `/view` thành `/preview`
- [ ] Vào `/admin/documents`
- [ ] Click "Thêm tài liệu mới"
- [ ] Điền thông tin:
  - [ ] Môn học
  - [ ] Lớp
  - [ ] Tiêu đề
  - [ ] Mô tả (tùy chọn)
  - [ ] Paste link preview
- [ ] Click "Lưu tài liệu"
- [ ] Kiểm tra: Thấy tài liệu trong danh sách

### Cách 2: Upload trực tiếp (Nếu đã setup Storage)

- [ ] Vào `/admin/documents`
- [ ] Click "Thêm tài liệu mới"
- [ ] Kéo thả file PDF vào ô upload
- [ ] Điền thông tin
- [ ] Click "Lưu tài liệu"
- [ ] Kiểm tra: Thấy tài liệu trong danh sách

---

## 🧪 Test tính năng

### Test Admin
- [ ] Vào `/admin/documents`
- [ ] Thấy danh sách tài liệu
- [ ] Click "Xem" → Mở PDF trong tab mới
- [ ] Click "Sửa" → Sửa được thông tin
- [ ] Click "Xóa" → Xóa được tài liệu

### Test học sinh
- [ ] Vào trang môn học (VD: `/subject/Toán/grade/10`)
- [ ] Thấy tab hoặc section "Tài liệu"
- [ ] Thấy danh sách tài liệu đúng môn/lớp
- [ ] Click "Xem" → Mở PDF
- [ ] Click "Tải về" → Download file

### Test responsive
- [ ] Mở trên mobile
- [ ] Kiểm tra hiển thị OK
- [ ] Test dark mode

---

## 🐛 Troubleshooting

### Lỗi: "Cannot read documents"
- [ ] Kiểm tra đã chạy SQL script chưa
- [ ] Vào Supabase → Table Editor → Thấy bảng `documents`
- [ ] Kiểm tra RLS policies đã enable

### Lỗi: "Upload failed"
- [ ] Kiểm tra đã tạo bucket `documents` chưa
- [ ] Vào Supabase → Storage → Thấy bucket
- [ ] Kiểm tra policies đã cấu hình

### File Google Drive không xem được
- [ ] Kiểm tra link có dạng `/preview` không
- [ ] Kiểm tra file đã share "Anyone with the link"
- [ ] Thử mở link trong incognito mode

### Không thấy tài liệu trong trang môn học
- [ ] Kiểm tra đã import `DocumentList` chưa
- [ ] Kiểm tra props `subject` và `grade` đúng chưa
- [ ] Mở console xem có lỗi không

---

## 📊 Thống kê

- Tổng số tài liệu: _____
- Theo môn:
  - Toán: _____
  - Vật Lý: _____
  - Hóa Học: _____
  - Tiếng Anh: _____
  - Khác: _____

---

## 📝 Ghi chú

```
Ngày setup: _______________
Người setup: _______________
Vấn đề gặp phải: _______________
Giải pháp: _______________
```

---

## 🎯 Mục tiêu

- [ ] Setup xong trong 15 phút
- [ ] Upload được 5 tài liệu đầu tiên
- [ ] Học sinh xem được tài liệu
- [ ] Responsive trên mobile
- [ ] Dark mode hoạt động

---

**In file này ra và tick vào từng mục khi hoàn thành! ✅**
