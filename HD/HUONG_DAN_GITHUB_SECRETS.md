# 🔐 Hướng dẫn cấu hình GitHub Secrets cho Supabase

## ⚠️ Vấn đề

Khi deploy lên GitHub Pages, file `.env` **KHÔNG hoạt động** vì:
- File `.env` không được commit vào git (trong `.gitignore`)
- GitHub Pages chỉ serve các file static, không có access vào biến môi trường

## ✅ Giải pháp: Dùng GitHub Secrets

GitHub Secrets cho phép lưu trữ thông tin nhạy cảm (như API keys) và sử dụng khi build trong GitHub Actions.

## 📋 Các bước cấu hình

### Bước 1: Lấy thông tin Supabase

1. Vào Supabase Dashboard: https://supabase.com/dashboard
2. Chọn project của bạn
3. Vào **Project Settings** → **API**
4. Copy 2 giá trị:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Bước 2: Thêm Secrets vào GitHub

1. Mở repository trên GitHub:
   ```
   https://github.com/HungNQ-IT/webb
   ```

2. Vào **Settings** (tab trên cùng)

3. Vào **Secrets and variables** → **Actions** (trong sidebar bên trái)

4. Click nút **New repository secret** (màu xanh, ở góc trên bên phải)

5. Thêm từng secret một:

   **🔑 Secret 1: VITE_SUPABASE_URL**
   - Name: `VITE_SUPABASE_URL`
   - Secret: `https://xxxxx.supabase.co` (URL từ Supabase)
   - Click **Add secret**

   **🔑 Secret 2: VITE_SUPABASE_ANON_KEY**
   - Click **New repository secret** lần nữa
   - Name: `VITE_SUPABASE_ANON_KEY`
   - Secret: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (Key từ Supabase)
   - Click **Add secret**

   **🔑 Secret 3: VITE_ADMIN_EMAILS (tùy chọn)**
   - Click **New repository secret** lần nữa
   - Name: `VITE_ADMIN_EMAILS`
   - Secret: `admin@example.com` (hoặc danh sách email, phân cách bằng dấu phẩy)
   - Click **Add secret**

### Bước 3: Cấu hình CORS trong Supabase

Supabase mặc định chỉ cho phép requests từ domain của project. Cần thêm GitHub Pages domain:

1. Vào Supabase Dashboard → **Project Settings** → **API**
2. Tìm phần **CORS** hoặc **Additional Redirect URLs**
3. Thêm domain GitHub Pages:
   ```
   https://hungnq-it.github.io
   ```
4. Lưu lại

### Bước 4: Deploy lại

Sau khi thêm Secrets, GitHub Actions sẽ tự động sử dụng chúng khi build:

1. **Cách 1**: Push code bất kỳ lên GitHub (nếu có thay đổi code)
   ```bash
   git add .
   git commit -m "Update code"
   git push
   ```

2. **Cách 2**: Chạy workflow thủ công:
   - Vào tab **Actions** trên GitHub
   - Chọn workflow "Deploy to GitHub Pages"
   - Click **Run workflow** → **Run workflow**

3. Chờ workflow chạy xong (thấy dấu ✅ màu xanh)

4. Kiểm tra website: https://hungnq-it.github.io/webb/

## ✅ Kiểm tra đã cấu hình đúng chưa

1. Vào tab **Actions** → Chọn workflow gần nhất
2. Click vào job **build-and-deploy**
3. Click vào step **Build**
4. Kiểm tra log có lỗi gì không
5. Nếu build thành công (exit code 0), secrets đã được cấu hình đúng

## 🔍 Troubleshooting

### Lỗi "Failed to fetch" vẫn còn

1. ✅ Kiểm tra đã thêm cả 2 secrets (`VITE_SUPABASE_URL` và `VITE_SUPABASE_ANON_KEY`) chưa
2. ✅ Kiểm tra giá trị secrets có đúng không (copy đầy đủ, không thiếu ký tự)
3. ✅ Kiểm tra CORS trong Supabase đã thêm domain GitHub Pages chưa
4. ✅ Đợi một vài phút để CORS settings được apply
5. ✅ Xóa cache browser và thử lại (Ctrl+Shift+Delete)

### Workflow build fail

- Xem log trong tab **Actions** → chọn workflow failed → xem step **Build**
- Thường là do:
  - Secrets chưa được thêm
  - Tên secrets sai (phải đúng: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
  - Code có lỗi syntax

### Website vẫn hiển thị lỗi sau khi deploy

- Hard refresh browser: Ctrl+Shift+R (Windows) hoặc Cmd+Shift+R (Mac)
- Xóa cache browser
- Kiểm tra console (F12) để xem lỗi chi tiết

## 📝 Lưu ý

- ⚠️ **KHÔNG** commit file `.env` vào git (đã có trong `.gitignore`)
- ✅ **CHỈ** dùng GitHub Secrets cho production (GitHub Pages)
- ✅ File `.env` vẫn cần cho local development
- ✅ Mỗi khi thay đổi Secrets, cần deploy lại

