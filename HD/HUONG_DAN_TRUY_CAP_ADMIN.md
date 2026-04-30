# 🔐 Hướng dẫn Truy cập Trang Admin

## 📋 Tài khoản Admin hiện tại

Theo cấu hình trong file `.env`, các tài khoản admin là:

1. **hungquocnguyen252@gmail.com**
2. **duchoang305007@gmail.com**

## 🚀 Cách truy cập trang Admin

### Bước 1: Đăng nhập
1. Truy cập trang web
2. Nhấn nút **"Đăng nhập"** ở góc trên bên phải
3. Nhập email admin và mật khẩu
4. Nhấn **"Đăng nhập"**

### Bước 2: Vào trang Admin
Sau khi đăng nhập thành công với tài khoản admin, bạn sẽ thấy:

#### **Trên Desktop (màn hình lớn):**
- Thanh điều hướng trên cùng sẽ hiển thị thêm link **"⚙️ Admin"** (màu cam nổi bật)
- Nhấn vào link này để vào Dashboard Admin

#### **Trên Mobile (điện thoại/tablet):**
- Thanh điều hướng dưới cùng sẽ hiển thị thêm nút **"Admin"** với icon bánh răng (màu cam)
- Nhấn vào nút này để vào Dashboard Admin

### Bước 3: Các trang Admin có sẵn

Sau khi vào Dashboard Admin, bạn có thể truy cập:

1. **Dashboard chính** (`/admin`)
   - Xem thống kê tổng quan
   - Xem danh sách bài nộp của học sinh
   - Xem chi tiết từng bài làm

2. **Quản lý Bài tập** (`/admin/quizzes`)
   - Thêm bài tập mới
   - Chỉnh sửa bài tập hiện có
   - Xóa bài tập

3. **Quản lý Tài liệu** (`/admin/documents`)
   - Upload tài liệu học tập
   - Quản lý file PDF, DOCX, v.v.

4. **Quản lý Audio** (`/admin/audio`)
   - Upload file audio cho bài Listening
   - Quản lý link Google Drive audio
   - Chỉnh sửa thông tin audio

## 🔧 Thêm tài khoản Admin mới

Để thêm email admin mới:

1. Mở file `.env` ở thư mục gốc dự án
2. Tìm dòng `VITE_ADMIN_EMAILS`
3. Thêm email mới vào danh sách, phân cách bằng dấu phẩy:

```env
VITE_ADMIN_EMAILS=hungquocnguyen252@gmail.com,duchoang305007@gmail.com,email_moi@gmail.com
```

4. Lưu file và khởi động lại server

## ⚠️ Lưu ý

- **Chỉ email trong danh sách `VITE_ADMIN_EMAILS` mới có quyền admin**
- Email phải viết chính xác (không phân biệt hoa thường)
- Sau khi thay đổi `.env`, cần restart server để áp dụng
- Không chia sẻ thông tin tài khoản admin cho người khác

## 🆘 Khắc phục sự cố

### Không thấy link Admin sau khi đăng nhập?
- Kiểm tra email đăng nhập có trong danh sách `VITE_ADMIN_EMAILS` không
- Thử đăng xuất và đăng nhập lại
- Xóa cache trình duyệt (Ctrl + Shift + Delete)
- Kiểm tra console browser xem có lỗi không (F12)

### Link Admin bị lỗi 404?
- Kiểm tra routing trong `src/App.jsx`
- Đảm bảo component `AdminDashboard` được import đúng
- Kiểm tra `RequireAuth` wrapper có hoạt động không

### Không vào được trang Admin dù đã đăng nhập?
- Kiểm tra role của user trong AuthContext
- Mở Console (F12) và gõ: `localStorage.getItem('supabase.auth.token')`
- Kiểm tra Supabase có hoạt động bình thường không

## 📚 Tài liệu liên quan

- [Hướng dẫn thêm bài tập](./HUONG_DAN_THEM_BAI_TAP.md)
- [Hướng dẫn thêm đề IELTS](./HUONG_DAN_THEM_DE_IELTS.md)
- [Hướng dẫn thêm Listening](./HUONG_DAN_THEM_LISTENING.md)
- [Hướng dẫn quản lý Audio](./HUONG_DAN_GOOGLE_DRIVE_AUDIO.md)
