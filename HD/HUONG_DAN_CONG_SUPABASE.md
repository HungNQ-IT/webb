# 🔧 Hướng dẫn cấu hình Supabase cho GitHub Pages (2024)

## ⚠️ Lưu ý quan trọng

Supabase **đã loại bỏ phần CORS** trong dashboard. Thay vào đó, bạn cần cấu hình **Site URL** và **Redirect URLs** trong phần Authentication.

## 📋 Các bước cấu hình

### Bước 1: Lấy thông tin Supabase

1. Vào Supabase Dashboard: https://supabase.com/dashboard
2. Chọn project của bạn
3. Vào **Settings** (⚙️) → **API**
4. Copy 2 giá trị sau:
   - **Project URL**: Ví dụ `https://xxxxx.supabase.co`
   - **anon public key**: Key rất dài, bắt đầu bằng `eyJ...`

⚠️ **Lưu ý**: URL phải là `https://xxxxx.supabase.co`, KHÔNG phải URL của trang dashboard!

### Bước 2: Cấu hình Authentication Settings

1. Vào Supabase Dashboard → **Authentication** (trong sidebar bên trái)
2. Click vào **URL Configuration** (hoặc tìm trong settings)
3. Cấu hình như sau:

   **Site URL:**
   ```
   https://hungnq-it.github.io/webb
   ```
   ⚠️ **Quan trọng**: Phải có `/webb` ở cuối vì repository name là `webb`
   
   💡 **Nếu test local**, có thể đặt:
   ```
   http://localhost:5173
   ```
   Nhưng khi deploy lên GitHub Pages, nhớ đổi lại thành `https://hungnq-it.github.io/webb`

   **Redirect URLs:**
   Thêm các URL sau, mỗi URL một dòng (đảm bảo có `/webb`):
   ```
   https://hungnq-it.github.io/webb/**
   https://hungnq-it.github.io/webb
   https://hungnq-it.github.io/**
   ```
   💡 **Nếu test local**, có thể thêm thêm:
   ```
   http://localhost:5173/**
   http://localhost:5173
   ```

4. Click **Save** để lưu lại

### Bước 3: Kiểm tra Email Provider

1. Vẫn trong **Authentication** → **Providers**
2. Đảm bảo **Email** provider được **bật** (Enabled)
3. Tùy chọn cấu hình:
   - **Confirm email**: Tắt nếu muốn đăng ký ngay không cần xác nhận email (khuyến nghị cho testing)
   - **Enable sign ups**: Phải **BẬT** (ON) để cho phép đăng ký mới

### Bước 4: Cấu hình cho Local Development

Nếu test local, thêm vào file `.env`:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_ADMIN_EMAILS=your_email@example.com
```

Sau đó restart dev server:
```bash
npm run dev
```

### Bước 5: Cấu hình cho GitHub Pages

1. Vào GitHub repository: https://github.com/HungNQ-IT/webb
2. Vào **Settings** → **Secrets and variables** → **Actions**
3. Thêm 2 secrets:

   **Secret 1:**
   - Name: `VITE_SUPABASE_URL`
   - Value: `https://xxxxx.supabase.co` (URL từ Bước 1)

   **Secret 2:**
   - Name: `VITE_SUPABASE_ANON_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (Key từ Bước 1)

4. Deploy lại:
   - Vào tab **Actions**
   - Chọn workflow "Deploy to GitHub Pages"
   - Click **Run workflow** → **Run workflow**

## ✅ Kiểm tra đã cấu hình đúng chưa

### Test 1: Kiểm tra Site URL
1. Vào Supabase Dashboard → **Authentication** → **URL Configuration**
2. Kiểm tra Site URL có đúng không
3. Kiểm tra Redirect URLs đã thêm đầy đủ chưa

### Test 2: Test đăng ký/đăng nhập
1. Mở website: https://hungnq-it.github.io/webb/register
2. Mở Developer Tools (F12)
3. Vào tab **Console**
4. Thử đăng ký
5. Nếu thấy lỗi, xem lỗi chi tiết trong console

### Test 3: Kiểm tra Network
1. Mở Developer Tools (F12)
2. Vào tab **Network**
3. Thử đăng ký
4. Tìm request tới `supabase.co`
5. Xem Status code:
   - **200 OK**: Kết nối thành công
   - **401 Unauthorized**: Key sai
   - **CORS error**: Chưa cấu hình URL đúng
   - **Failed to fetch**: Network hoặc URL sai

## 🔍 Troubleshooting

### Lỗi "Failed to fetch"
**Nguyên nhân có thể:**
1. URL Supabase sai (phải là `https://xxxxx.supabase.co`, không phải URL dashboard)
2. Chưa cấu hình Site URL trong Authentication
3. Chưa thêm Redirect URLs
4. Network bị chặn

**Giải pháp:**
1. Kiểm tra lại URL trong `.env` hoặc GitHub Secrets
2. Kiểm tra Authentication → URL Configuration
3. Kiểm tra network tab trong browser console
4. Thử trên browser khác

### Lỗi CORS
**Nguyên nhân:** Chưa cấu hình Site URL hoặc Redirect URLs đúng

**Giải pháp:**
1. Vào Authentication → URL Configuration
2. Đảm bảo Site URL và Redirect URLs đã được thêm đúng
3. Lưu lại và đợi 1-2 phút
4. Hard refresh browser (Ctrl+Shift+R)

### Lỗi "Invalid API key"
**Nguyên nhân:** Anon key sai hoặc không đầy đủ

**Giải pháp:**
1. Copy lại anon key từ Supabase Dashboard
2. Đảm bảo copy đầy đủ (key rất dài)
3. Kiểm tra không có khoảng trắng thừa
4. Update trong `.env` hoặc GitHub Secrets

### Website không cập nhật sau khi sửa
**Giải pháp:**
1. Hard refresh browser: Ctrl+Shift+R (Windows) hoặc Cmd+Shift+R (Mac)
2. Xóa cache browser
3. Kiểm tra workflow GitHub Actions đã chạy xong chưa

## 📝 Checklist cuối cùng

- [ ] Đã lấy Project URL và Anon Key từ Supabase Dashboard
- [ ] Đã cấu hình Site URL trong Authentication
- [ ] Đã thêm Redirect URLs đầy đủ
- [ ] Đã thêm GitHub Secrets (nếu deploy GitHub Pages)
- [ ] Đã deploy lại sau khi thêm Secrets
- [ ] Đã test đăng ký/đăng nhập thành công

## 🆘 Cần giúp đỡ?

Nếu vẫn gặp lỗi:
1. Copy lỗi chi tiết từ browser console (F12)
2. Copy lỗi từ Network tab
3. Kiểm tra Supabase Dashboard → Logs xem có request đến không
4. Thử tạo Supabase project mới và cấu hình lại từ đầu

