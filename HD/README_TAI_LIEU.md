# 📚 Tài liệu hướng dẫn Upload PDF

## 🎯 Bắt đầu nhanh

Bạn muốn thêm tài liệu PDF lên web? Đọc file này trước:

### ⚡ Hướng dẫn nhanh (5 phút)
👉 **[HUONG_DAN_NHANH_TAI_LIEU.md](./HUONG_DAN_NHANH_TAI_LIEU.md)**
- Setup Supabase trong 1 phút
- Upload PDF bằng Google Drive
- Bắt đầu ngay không cần cài đặt phức tạp

---

## 📖 Hướng dẫn chi tiết

### 🔧 Setup hoàn chỉnh (15 phút)
👉 **[SETUP_TAI_LIEU_HOAN_CHINH.md](./SETUP_TAI_LIEU_HOAN_CHINH.md)**
- Checklist đầy đủ từ A-Z
- Setup cả Supabase Storage
- Tích hợp hiển thị cho học sinh
- Troubleshooting các lỗi thường gặp

### 🎨 Tích hợp vào trang web
👉 **[TICH_HOP_TAI_LIEU_VAO_TRANG.md](./TICH_HOP_TAI_LIEU_VAO_TRANG.md)**
- Cách thêm DocumentList vào QuizList
- Tạo tab "Bài tập" và "Tài liệu"
- Ví dụ code hoàn chỉnh

### 📋 Hướng dẫn đầy đủ (Tham khảo)
👉 **[HUONG_DAN_THEM_TAI_LIEU.md](./HUONG_DAN_THEM_TAI_LIEU.md)**
- So sánh các cách upload
- Hướng dẫn chi tiết từng bước
- Kế hoạch triển khai

---

## 🚀 Quy trình làm việc

```
1. Setup Supabase (1 lần duy nhất)
   ↓
2. Upload PDF lên Google Drive hoặc Supabase
   ↓
3. Vào Admin Panel (/admin/documents)
   ↓
4. Điền thông tin và paste link
   ↓
5. ✅ Học sinh có thể xem và tải về
```

---

## 📁 Cấu trúc file

```
HD/
├── README_TAI_LIEU.md                    ← File này (bắt đầu từ đây)
├── HUONG_DAN_NHANH_TAI_LIEU.md          ← Hướng dẫn nhanh ⚡
├── SETUP_TAI_LIEU_HOAN_CHINH.md         ← Setup đầy đủ 🔧
├── TICH_HOP_TAI_LIEU_VAO_TRANG.md       ← Tích hợp UI 🎨
└── HUONG_DAN_THEM_TAI_LIEU.md           ← Chi tiết đầy đủ 📋

src/components/
├── AdminDocumentManager.jsx              ← Admin quản lý tài liệu
└── DocumentList.jsx                      ← Hiển thị cho học sinh

documents_setup.sql                       ← SQL script setup database
```

---

## ✅ Tính năng có sẵn

### Admin Panel (`/admin/documents`)
- ✅ Upload PDF trực tiếp lên Supabase Storage
- ✅ Hoặc dùng link Google Drive/Dropbox
- ✅ Quản lý: Thêm, sửa, xóa tài liệu
- ✅ Lọc theo môn học, lớp
- ✅ Xem trước PDF

### Trang học sinh
- ✅ Component `DocumentList` sẵn sàng
- ✅ Xem PDF trực tiếp trên web
- ✅ Tải về máy
- ✅ Responsive, dark mode
- ✅ Lọc theo môn/lớp tự động

---

## 🎯 Lộ trình đề xuất

### Người mới bắt đầu
1. Đọc **HUONG_DAN_NHANH_TAI_LIEU.md**
2. Setup Supabase theo hướng dẫn
3. Upload 1 file PDF thử nghiệm
4. Test xem có hoạt động không

### Người muốn setup đầy đủ
1. Đọc **SETUP_TAI_LIEU_HOAN_CHINH.md**
2. Làm theo checklist từng bước
3. Setup cả Supabase Storage
4. Tích hợp vào trang web
5. Test toàn bộ tính năng

### Developer muốn customize
1. Đọc **TICH_HOP_TAI_LIEU_VAO_TRANG.md**
2. Xem code trong `AdminDocumentManager.jsx`
3. Xem code trong `DocumentList.jsx`
4. Tùy chỉnh theo nhu cầu

---

## 💡 Tips

### Dùng Google Drive (Khuyên dùng cho người mới)
- ✅ Đơn giản, không cần setup Storage
- ✅ Free 15GB
- ✅ Chỉ cần paste link là xong
- ⚠️ Cần chuyển link sang dạng `/preview`

### Dùng Supabase Storage (Khuyên dùng cho production)
- ✅ Tốc độ nhanh hơn
- ✅ Quản lý tập trung
- ✅ Tự động upload từ Admin Panel
- ⚠️ Cần setup bucket và policies

---

## 🐛 Lỗi thường gặp

| Lỗi | Nguyên nhân | Giải pháp |
|-----|-------------|-----------|
| Cannot read documents | Chưa tạo bảng | Chạy SQL script |
| Upload failed | Chưa setup Storage | Tạo bucket `documents` |
| File không xem được | Link sai format | Dùng `/preview` thay vì `/view` |
| Không thấy tài liệu | Chưa tích hợp UI | Import DocumentList |

---

## 📞 Cần hỗ trợ?

1. Kiểm tra file hướng dẫn tương ứng
2. Xem phần Troubleshooting trong mỗi file
3. Kiểm tra console log trong browser
4. Kiểm tra Supabase logs

---

## 🎉 Kết luận

Hệ thống đã có sẵn **100% code** để upload và quản lý tài liệu PDF. 

Bạn chỉ cần:
1. ⚡ Setup Supabase (1 lần)
2. 📤 Upload PDF
3. ✅ Xong!

**Bắt đầu ngay với [HUONG_DAN_NHANH_TAI_LIEU.md](./HUONG_DAN_NHANH_TAI_LIEU.md)!** 🚀
