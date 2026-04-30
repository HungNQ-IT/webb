# 🚀 Bắt đầu Upload PDF - 3 bước đơn giản

## ⚡ TL;DR (Quá dài không đọc)

```bash
1. Chạy SQL script trong Supabase
2. Upload PDF lên Google Drive, lấy link
3. Vào /admin/documents, paste link, xong!
```

---

## 📋 Bước 1: Setup Supabase (2 phút)

1. Vào: https://supabase.com/dashboard
2. Chọn project của bạn
3. Click **SQL Editor** (bên trái)
4. Copy toàn bộ file `setup_documents_simple.sql`
5. Paste vào và click **Run**
6. ✅ Xong! Thấy thông báo "Success"

---

## 📤 Bước 2: Upload PDF lên Google Drive (1 phút)

1. Vào Google Drive
2. Upload file PDF
3. Click chuột phải → **Get link**
4. Chọn: **Anyone with the link can view**
5. Copy link (dạng: `https://drive.google.com/file/d/1ABC123/view`)
6. **Quan trọng**: Đổi `/view` thành `/preview`
   ```
   Từ: https://drive.google.com/file/d/1ABC123/view?usp=sharing
   Thành: https://drive.google.com/file/d/1ABC123/preview
   ```

---

## 💾 Bước 3: Thêm vào Admin Panel (1 phút)

1. Chạy web: `npm run dev`
2. Login với tài khoản admin
3. Vào: `http://localhost:5173/admin/documents`
4. Click **"+ Thêm tài liệu mới"**
5. Điền thông tin:
   - **Môn học**: Chọn môn (VD: Toán)
   - **Lớp**: Chọn lớp (VD: 10)
   - **Tiêu đề**: VD: "Công thức toán học cơ bản"
   - **Mô tả**: VD: "Tổng hợp công thức quan trọng" (tùy chọn)
   - **Link**: Paste link preview từ bước 2
6. Click **"Lưu tài liệu"**
7. ✅ Xong! Thấy tài liệu trong danh sách

---

## 🎉 Kết quả

Học sinh giờ có thể:
- Vào trang môn học
- Xem danh sách tài liệu
- Click "Xem" để đọc PDF
- Click "Tải về" để download

---

## 📚 Ví dụ cụ thể

### Upload "Công thức Toán 10"

```
1. Upload file "cong-thuc-toan-10.pdf" lên Drive
2. Lấy link: https://drive.google.com/file/d/1XYZ789/view
3. Đổi thành: https://drive.google.com/file/d/1XYZ789/preview
4. Vào /admin/documents
5. Điền:
   Môn: Toán
   Lớp: 10
   Tiêu đề: Công thức toán học cơ bản
   Link: https://drive.google.com/file/d/1XYZ789/preview
6. Lưu
7. ✅ Xong!
```

---

## 🐛 Gặp lỗi?

### "Cannot read documents"
→ Chưa chạy SQL script. Quay lại Bước 1.

### "Upload failed"
→ Không ảnh hưởng nếu dùng Google Drive. Bỏ qua.

### File không xem được
→ Kiểm tra link có `/preview` chưa.

---

## 📖 Muốn tìm hiểu thêm?

- **Hướng dẫn nhanh**: `HD/HUONG_DAN_NHANH_TAI_LIEU.md`
- **Setup đầy đủ**: `HD/SETUP_TAI_LIEU_HOAN_CHINH.md`
- **Checklist**: `CHECKLIST_UPLOAD_PDF.md`
- **Tổng quan**: `HD/README_TAI_LIEU.md`

---

## ⏱️ Tổng thời gian: 4 phút

- Setup Supabase: 2 phút
- Upload Drive: 1 phút
- Thêm vào Admin: 1 phút

**Bắt đầu ngay! 🚀**

---

## 🎯 Checklist nhanh

- [ ] Chạy SQL script trong Supabase
- [ ] Upload PDF lên Google Drive
- [ ] Lấy link và đổi thành `/preview`
- [ ] Vào `/admin/documents`
- [ ] Điền thông tin và paste link
- [ ] Click "Lưu tài liệu"
- [ ] ✅ Xong!

---

**Tip**: Sau khi setup lần đầu, mỗi lần thêm tài liệu mới chỉ mất 2 phút! 💪
