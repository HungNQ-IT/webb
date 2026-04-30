# 🚀 Hướng dẫn tổng hợp: Upload bài tập và tài liệu lên web

## 📋 Tổng quan hệ thống

Hệ thống của bạn hỗ trợ **2 loại nội dung** cho mỗi môn học:

### 1. 📝 **Bài tập trắc nghiệm/tự luận** (Làm trực tiếp trên web)
- Học sinh làm bài trực tiếp trên website
- Hệ thống tự động chấm điểm (trắc nghiệm)
- Hỗ trợ AI chấm điểm (tự luận)
- Lưu kết quả vào database

### 2. 📄 **Tài liệu PDF** (Xem và tải về)
- Học sinh xem PDF trực tiếp trên web
- Có thể tải về máy
- Phù hợp cho: Công thức, lý thuyết, bài giảng LaTeX

---

## 🎯 So sánh 2 cách quản lý

| Tiêu chí | File JSON (Cũ) | Supabase Database (Mới) |
|----------|----------------|-------------------------|
| **Thêm bài tập** | Sửa file JSON → Push GitHub | Giao diện Admin trên web |
| **Cập nhật** | Phải push code | Realtime, không cần push |
| **Quản lý** | Khó, phải đọc code | Dễ, có giao diện trực quan |
| **Theo dõi kết quả** | Không | Có, lưu trong database |
| **Nhiều người dùng** | Khó | Dễ, mỗi người có tài khoản |
| **Tốc độ** | Nhanh (static) | Nhanh (có cache) |
| **Khuyên dùng** | ❌ Không | ✅ Nên dùng |

---

## 🚀 Giải pháp đề xuất

### **Chuyển hoàn toàn sang Supabase** vì:

✅ **Tiện lợi hơn**
- Thêm bài tập trực tiếp trên web
- Không cần push code lên GitHub
- Cập nhật realtime

✅ **Quản lý tốt hơn**
- Giao diện Admin đầy đủ
- Sửa, xóa, tìm kiếm dễ dàng
- Theo dõi kết quả học sinh

✅ **Mở rộng dễ dàng**
- Thêm tính năng mới không cần sửa code nhiều
- Hỗ trợ nhiều admin cùng quản lý
- Backup và restore dễ dàng

---

## 📝 Hướng dẫn chi tiết

### **A. Thêm bài tập trắc nghiệm/tự luận**

#### Bước 1: Vào Admin Panel
```
https://your-website.com/admin/quizzes
```

#### Bước 2: Click "Thêm bài tập mới"

#### Bước 3: Điền thông tin
- **Môn học**: Toán, Vật Lý, Hóa Học, etc.
- **Lớp**: 6, 7, 8, 9, 10, 11, 12
- **Tiêu đề**: Tên bài tập
- **Loại**: Trắc nghiệm / Tự luận / Hỗn hợp
- **Thời gian**: Giới hạn thời gian (phút)

#### Bước 4: Thêm câu hỏi
**Trắc nghiệm:**
- Nhập câu hỏi
- Nhập 4 đáp án
- Chọn đáp án đúng
- Thêm giải thích (tùy chọn)
- Thêm ảnh/công thức LaTeX (tùy chọn)

**Tự luận:**
- Nhập câu hỏi
- Nhập điểm tối đa
- Nhập rubric chấm điểm
- Thêm ảnh/công thức LaTeX (tùy chọn)

#### Bước 5: Lưu bài tập
- Click "Lưu bài tập"
- Bài tập hiển thị ngay lập tức trên web

---

### **B. Thêm tài liệu PDF**

#### Bước 1: Vào Admin Panel
```
https://your-website.com/admin/documents
```

#### Bước 2: Click "Thêm tài liệu mới"

#### Bước 3: Chọn cách upload

**Cách 1: Upload trực tiếp (Khuyên dùng)**
1. Click vào khung "Click để chọn file PDF"
2. Chọn file PDF từ máy tính (tối đa 50MB)
3. File sẽ tự động upload lên Supabase Storage

**Cách 2: Dùng Google Drive (Đơn giản)**
1. Upload file lên Google Drive
2. Click chuột phải → "Get link"
3. Chọn "Anyone with the link can view"
4. Copy link và chuyển đổi:
   ```
   Link gốc:
   https://drive.google.com/file/d/FILE_ID/view?usp=sharing
   
   Chuyển thành:
   https://drive.google.com/file/d/FILE_ID/preview
   ```
5. Paste link vào ô "Nhập link tài liệu"

**Cách 3: Dùng Dropbox, OneDrive**
- Tương tự Google Drive
- Lấy link public của file

#### Bước 4: Điền thông tin
- **Môn học**: Toán, Vật Lý, etc.
- **Lớp**: 6-12
- **Tiêu đề**: Tên tài liệu
- **Mô tả**: Mô tả ngắn về nội dung

#### Bước 5: Lưu tài liệu
- Click "Lưu tài liệu"
- Tài liệu hiển thị ngay trong trang môn học

---

## 🔧 Setup ban đầu (Chỉ làm 1 lần)

### **1. Setup bảng quizzes (Bài tập)**

Vào Supabase Dashboard → SQL Editor → Chạy:
```sql
-- Xem file: supabase_setup.sql
```

### **2. Setup bảng documents (Tài liệu)**

Vào Supabase Dashboard → SQL Editor → Chạy:
```sql
-- Xem file: documents_setup.sql
```

### **3. Setup Storage (Nếu muốn upload trực tiếp)**

1. Vào Supabase Dashboard → Storage
2. Click "Create new bucket"
3. Bucket name: `documents`
4. Public bucket: Yes
5. Chạy SQL policies trong file `documents_setup.sql`

---

## 📊 Workflow thực tế

### **Kịch bản 1: Thêm đề kiểm tra Toán lớp 10**

1. Vào `/admin/quizzes`
2. Click "Thêm bài tập mới"
3. Chọn:
   - Môn: Toán
   - Lớp: 10
   - Tiêu đề: "Đề kiểm tra giữa kỳ 1"
   - Loại: Trắc nghiệm
   - Thời gian: 45 phút
4. Thêm 20 câu hỏi trắc nghiệm
5. Click "Lưu bài tập"
6. ✅ Học sinh có thể làm bài ngay

### **Kịch bản 2: Thêm tài liệu công thức Toán**

1. Tạo file PDF công thức bằng LaTeX
2. Upload lên Google Drive
3. Lấy link preview
4. Vào `/admin/documents`
5. Click "Thêm tài liệu mới"
6. Chọn:
   - Môn: Toán
   - Lớp: 10
   - Tiêu đề: "Công thức toán học cơ bản"
   - Link: (paste link Google Drive)
7. Click "Lưu tài liệu"
8. ✅ Học sinh có thể xem và tải về

### **Kịch bản 3: Thêm bài tập tự luận Văn**

1. Vào `/admin/quizzes`
2. Click "Thêm bài tập mới"
3. Chọn:
   - Môn: Ngữ Văn
   - Lớp: 11
   - Tiêu đề: "Phân tích tác phẩm"
   - Loại: Tự luận
   - Thời gian: 90 phút
4. Thêm câu hỏi:
   - Câu hỏi: "Phân tích hình ảnh người lính trong bài thơ..."
   - Điểm tối đa: 10
   - Rubric: "Nội dung 5đ, Hình thức 3đ, Ngôn ngữ 2đ"
5. Click "Lưu bài tập"
6. ✅ Học sinh làm bài, AI chấm điểm tự động

---

## 🎨 Hiển thị trên web

### **Trang môn học sẽ có 2 tab:**

```
📚 Toán - Lớp 10
├── 📝 Bài tập (Tab 1)
│   ├── Đề kiểm tra giữa kỳ 1
│   ├── Bài tập phương trình bậc hai
│   └── Đề thi thử cuối kỳ
│
└── 📄 Tài liệu (Tab 2)
    ├── Công thức toán học cơ bản.pdf
    ├── Bài giảng hàm số.pdf
    └── Đề thi tham khảo.pdf
```

---

## 🔄 Migration từ JSON sang Supabase

Nếu bạn đã có bài tập trong `questions.json`:

### **Cách 1: Import thủ công**
1. Mở file `questions.json`
2. Copy từng bài tập
3. Thêm vào Admin Panel

### **Cách 2: Import tự động (Script)**
```javascript
// Tạo script import (nếu cần)
// Đọc questions.json
// Insert vào Supabase
```

---

## 📈 Lợi ích của hệ thống mới

### **Cho Admin:**
- ✅ Thêm bài tập nhanh chóng
- ✅ Quản lý tập trung
- ✅ Theo dõi kết quả học sinh
- ✅ Không cần biết code

### **Cho Học sinh:**
- ✅ Làm bài trực tiếp trên web
- ✅ Xem kết quả ngay lập tức
- ✅ Xem tài liệu PDF online
- ✅ Tải tài liệu về máy

### **Cho Hệ thống:**
- ✅ Dễ bảo trì
- ✅ Dễ mở rộng
- ✅ Backup tự động
- ✅ Realtime updates

---

## 🐛 Xử lý lỗi thường gặp

### **Lỗi: "Không thể tải danh sách bài tập"**
**Nguyên nhân**: Chưa tạo bảng `quizzes` trong Supabase

**Giải pháp**:
1. Vào Supabase Dashboard
2. SQL Editor
3. Chạy file `supabase_setup.sql`

### **Lỗi: "Không thể upload file"**
**Nguyên nhân**: Chưa tạo bucket `documents` trong Storage

**Giải pháp**:
1. Vào Supabase Dashboard → Storage
2. Create new bucket: `documents`
3. Chạy policies trong `documents_setup.sql`

### **Lỗi: "File quá lớn"**
**Nguyên nhân**: File PDF > 50MB

**Giải pháp**:
- Nén file PDF
- Hoặc dùng Google Drive thay vì upload trực tiếp

---

## 📞 Hỗ trợ

Nếu cần giúp đỡ:
1. Xem các file hướng dẫn trong thư mục `HD/`
2. Kiểm tra console log trong browser (F12)
3. Xem logs trong Supabase Dashboard

---

## 📝 Tóm tắt

**3 bước đơn giản:**

### **Thêm bài tập:**
1. Vào `/admin/quizzes`
2. Click "Thêm bài tập mới"
3. Điền thông tin và lưu

### **Thêm tài liệu:**
1. Vào `/admin/documents`
2. Upload file hoặc paste link
3. Điền thông tin và lưu

**Xong!** Nội dung hiển thị ngay lập tức trên web.

---

**Lưu ý quan trọng:**
- ✅ Dùng Supabase thay vì file JSON
- ✅ Upload PDF qua Google Drive hoặc Supabase Storage
- ✅ Không cần push code lên GitHub mỗi lần thêm bài
- ✅ Mọi thay đổi hiển thị realtime
