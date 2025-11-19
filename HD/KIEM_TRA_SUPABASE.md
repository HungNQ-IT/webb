# 🔍 Checklist kiểm tra lỗi "Failed to fetch"

## Bước 1: Xác định môi trường đang chạy

### Đang test LOCAL (localhost)?
- ✅ Kiểm tra file `.env` trong thư mục gốc
- ✅ File `.env` phải có 2 dòng:
  ```
  VITE_SUPABASE_URL=https://xxxxx.supabase.co
  VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```
- ✅ **KHÔNG** được là:
  ```
  VITE_SUPABASE_URL=your_supabase_project_url
  VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
  ```
- ✅ Sau khi sửa `.env`, **phải restart dev server**:
  ```bash
  # Dừng server (Ctrl+C)
  npm run dev
  ```

### Đang test trên GITHUB PAGES?
- ✅ Kiểm tra GitHub Secrets đã được thêm chưa:
  1. Vào: `https://github.com/HungNQ-IT/webb/settings/secrets/actions`
  2. Phải có 2 secrets:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
- ✅ Kiểm tra workflow đã chạy lại sau khi thêm Secrets chưa:
  1. Vào: `https://github.com/HungNQ-IT/webb/actions`
  2. Phải có workflow mới nhất chạy **SAU KHI** thêm Secrets
  3. Workflow phải có dấu ✅ (màu xanh)

## Bước 2: Kiểm tra Supabase Configuration

### 1. Lấy thông tin từ Supabase
1. Vào: https://supabase.com/dashboard
2. Chọn project của bạn
3. Vào **Settings** → **API**
4. Copy **chính xác**:
   - **Project URL**: Ví dụ `https://abcdefgh.supabase.co`
   - **anon public key**: Key rất dài, bắt đầu bằng `eyJ...`

### 2. Kiểm tra URL và Key
- ✅ URL phải có dạng: `https://xxxxx.supabase.co` (KHÔNG có `/` ở cuối)
- ✅ URL KHÔNG được là: `your_supabase_project_url` hoặc placeholder
- ✅ Key phải rất dài (hàng trăm ký tự)
- ✅ Key bắt đầu bằng: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`

## Bước 3: Kiểm tra CORS trong Supabase

**QUAN TRỌNG**: CORS phải được cấu hình để cho phép domain GitHub Pages!

1. Vào Supabase Dashboard → **Settings** → **API**
2. Tìm phần **CORS** hoặc **Additional Redirect URLs**
3. **Thêm** (nếu chưa có):
   ```
   https://hungnq-it.github.io
   ```
   Hoặc để `*` để cho phép tất cả (chỉ dùng cho testing)
4. **Lưu lại**
5. Đợi 1-2 phút để settings được apply

## Bước 4: Kiểm tra Console trong Browser

1. Mở website: https://hungnq-it.github.io/webb/register
2. Mở Developer Tools: **F12** (hoặc Right-click → Inspect)
3. Vào tab **Console**
4. Thử đăng ký và xem lỗi chi tiết:
   - Nếu thấy: `⚠️ Supabase chưa được cấu hình!` → Chưa cấu hình đúng
   - Nếu thấy: `CORS policy` → Chưa cấu hình CORS trong Supabase
   - Nếu thấy: `Failed to fetch` → Có thể là network hoặc URL/Key sai

## Bước 5: Debug Step by Step

### Test 1: Kiểm tra Supabase có hoạt động không
Mở browser console (F12) và chạy:
```javascript
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Đã có' : 'CHƯA CÓ')
```

**Nếu trên GitHub Pages**:
- Phải thấy URL thật (không phải `undefined` hoặc placeholder)
- Key phải có

### Test 2: Kiểm tra CORS
Mở browser console và chạy:
```javascript
fetch('https://YOUR_SUPABASE_URL.supabase.co/auth/v1/settings', {
  headers: {
    'apikey': 'YOUR_ANON_KEY'
  }
}).then(r => console.log('CORS OK', r)).catch(e => console.error('CORS Error', e))
```

Nếu thấy lỗi CORS → Cần thêm domain vào Supabase CORS settings

## Bước 6: Deploy lại (nếu trên GitHub Pages)

1. **Cách 1**: Push code mới
   ```bash
   git add .
   git commit -m "Fix Supabase config"
   git push
   ```

2. **Cách 2**: Chạy workflow thủ công trên GitHub
   - Vào tab **Actions**
   - Chọn workflow "Deploy to GitHub Pages"
   - Click **Run workflow** → **Run workflow**
   - Chờ workflow chạy xong

3. Sau khi deploy xong, **hard refresh** browser:
   - Windows: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

## ✅ Checklist tóm tắt

### Cho LOCAL:
- [ ] File `.env` tồn tại và có nội dung đúng
- [ ] `VITE_SUPABASE_URL` không phải là placeholder
- [ ] `VITE_SUPABASE_ANON_KEY` không phải là placeholder
- [ ] Đã restart dev server sau khi sửa `.env`

### Cho GITHUB PAGES:
- [ ] Đã thêm `VITE_SUPABASE_URL` vào GitHub Secrets
- [ ] Đã thêm `VITE_SUPABASE_ANON_KEY` vào GitHub Secrets
- [ ] Đã cấu hình CORS trong Supabase (thêm `https://hungnq-it.github.io`)
- [ ] Đã deploy lại sau khi thêm Secrets
- [ ] Workflow build thành công (dấu ✅)
- [ ] Đã hard refresh browser sau khi deploy

### Cho CẢ HAI:
- [ ] Supabase URL đúng format (`https://xxxxx.supabase.co`)
- [ ] Supabase Key đầy đủ (rất dài)
- [ ] CORS đã được cấu hình trong Supabase
- [ ] Không có lỗi trong browser console (F12)

## 🆘 Nếu vẫn lỗi

1. Copy toàn bộ lỗi trong browser console (F12)
2. Kiểm tra network tab (F12 → Network) xem request nào failed
3. Kiểm tra Supabase Dashboard → Logs xem có request đến không
4. Thử tạo Supabase project mới và cấu hình lại từ đầu

