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

## 6. Chạy ứng dụng (Local Development)

```bash
npm install
npm run dev
```

**Lưu ý quan trọng**: Nếu bạn đã cập nhật file `.env`, cần **restart dev server** (dừng và chạy lại `npm run dev`) để Vite load lại biến môi trường.

## 7. Cấu hình cho GitHub Pages (Production)

Khi deploy lên GitHub Pages, file `.env` không hoạt động. Bạn cần cấu hình biến môi trường qua **GitHub Secrets**:

### Bước 1: Thêm Secrets vào GitHub

1. Vào repository trên GitHub: `https://github.com/HungNQ-IT/webb`
2. Vào **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Thêm 3 secrets sau:

   **Secret 1:**
   - Name: `VITE_SUPABASE_URL`
   - Value: `https://xxxxx.supabase.co` (URL Supabase của bạn)
   
   **Secret 2:**
   - Name: `VITE_SUPABASE_ANON_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (Anon key của bạn)
   
   **Secret 3 (tùy chọn):**
   - Name: `VITE_ADMIN_EMAILS`
   - Value: `admin@example.com` (hoặc danh sách email, phân cách bằng dấu phẩy)

### Bước 2: Cấu hình Authentication trong Supabase

**Lưu ý**: Supabase không còn phần CORS riêng nữa. Thay vào đó, bạn cần cấu hình Site URL và Redirect URLs trong Authentication.

1. Vào Supabase Dashboard → **Authentication** → **URL Configuration**
2. Trong phần **Site URL**, thêm:
   - `https://hungnq-it.github.io` (cho GitHub Pages)
   - Hoặc `http://localhost:5173` (cho local development)
3. Trong phần **Redirect URLs**, thêm các URL sau (mỗi URL một dòng):
   ```
   https://hungnq-it.github.io/webb/**
   https://hungnq-it.github.io/**
   http://localhost:5173/**
   ```
4. Click **Save** để lưu lại

### Bước 3: Deploy lại

1. Push code lên GitHub (nếu đã cập nhật code)
2. GitHub Actions sẽ tự động build và deploy với biến môi trường từ Secrets
3. Kiểm tra trong tab **Actions** để xem build có thành công không

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

### Lỗi "Failed to fetch" trên GitHub Pages
- ⚠️ **Nguyên nhân phổ biến**: Chưa cấu hình GitHub Secrets
- **Giải pháp**: 
  1. Kiểm tra đã thêm Secrets vào GitHub chưa (Settings → Secrets → Actions)
  2. Kiểm tra CORS trong Supabase Dashboard đã cho phép domain GitHub Pages chưa
  3. Deploy lại sau khi thêm Secrets (push code hoặc chạy workflow lại)
  4. Kiểm tra console trong browser (F12) để xem lỗi chi tiết

### Lỗi CORS trên GitHub Pages
- **Lưu ý**: Supabase không còn phần CORS riêng nữa
- Thay vào đó, cấu hình **Authentication** → **URL Configuration**:
  - Thêm Site URL: `https://hungnq-it.github.io`
  - Thêm Redirect URLs: `https://hungnq-it.github.io/webb/**` và `https://hungnq-it.github.io/**`
  - Lưu và thử lại
- Nếu vẫn lỗi, kiểm tra URL Supabase và Anon Key có đúng không

