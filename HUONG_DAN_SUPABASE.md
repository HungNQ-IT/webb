# Hướng dẫn cấu hình Supabase cho ứng dụng

## 1. Tạo tài khoản và project Supabase

1. Truy cập https://supabase.com
2. Đăng ký/đăng nhập tài khoản
3. Tạo một project mới:
   - Click "New Project"
   - Điền tên project
   - Chọn database password (lưu lại password này)
   - Chọn region gần nhất (Singapore cho Việt Nam)
   - Click "Create new project"

## 2. Lấy thông tin cấu hình

1. Vào **Project Settings** (biểu tượng bánh răng ở sidebar)
2. Chọn tab **API**
3. Copy các giá trị sau:
   - **Project URL** (ví dụ: `https://xxxxx.supabase.co`)
   - **anon public key** (key bắt đầu bằng `eyJ...`)

## 3. Cấu hình ứng dụng

1. Tạo file `.env` trong thư mục gốc của project (sao chép từ `.env.example`):
   ```bash
   cp .env.example .env
   ```

2. Mở file `.env` và điền thông tin:
   ```env
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   VITE_ADMIN_EMAILS=admin@example.com
   ```

3. Thay thế `admin@example.com` bằng email của bạn (nếu muốn có quyền admin)

## 4. Cấu hình Authentication trong Supabase

1. Vào **Authentication** > **Providers** trong Supabase Dashboard
2. Đảm bảo **Email** provider được bật
3. Tùy chọn cấu hình:
   - **Confirm email**: Tắt nếu muốn đăng ký ngay không cần xác nhận email
   - **Secure email change**: Bật nếu muốn bảo mật hơn
   - **Enable sign ups**: Bật để cho phép đăng ký mới

## 5. Cấu hình Row Level Security (RLS) - Tùy chọn

Nếu bạn muốn lưu thêm dữ liệu vào Supabase Database (như submissions), cần cấu hình RLS:

1. Vào **Table Editor** trong Supabase Dashboard
2. Tạo bảng mới nếu cần
3. Vào **Authentication** > **Policies** để cấu hình quyền truy cập

## 6. Chạy ứng dụng

```bash
npm install
npm run dev
```

## Lưu ý

- Supabase cung cấp miễn phí cho các dự án nhỏ (500MB database, 2GB bandwidth/tháng)
- Authentication được xử lý hoàn toàn bởi Supabase, không cần server backend riêng
- Token được quản lý tự động bởi Supabase client
- Session được lưu trong localStorage tự động

## Khắc phục sự cố

### Lỗi "Invalid API key"
- Kiểm tra lại `VITE_SUPABASE_ANON_KEY` trong file `.env`
- Đảm bảo đã copy đầy đủ key (rất dài)

### Lỗi "Invalid URL"
- Kiểm tra lại `VITE_SUPABASE_URL` trong file `.env`
- URL phải có dạng `https://xxxxx.supabase.co`

### User đăng ký nhưng không đăng nhập được
- Kiểm tra trong Supabase Dashboard > Authentication > Users
- Nếu email chưa được confirm, có thể cần xác nhận email hoặc tắt yêu cầu xác nhận

### Session không được lưu
- Kiểm tra localStorage trong browser DevTools
- Đảm bảo không có extension chặn cookies/localStorage

