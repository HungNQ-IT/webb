# ⚡ Cấu hình Supabase nhanh cho GitHub Pages

## 🎯 Cấu hình trong Supabase Dashboard

### Bước 1: Vào URL Configuration

1. Vào: https://supabase.com/dashboard/project/cocnanimvgcwzwgteaax
2. Click **Authentication** (sidebar trái)
3. Vào **URL Configuration**

### Bước 2: Cấu hình Site URL

**Site URL** (bắt buộc):
```
https://hungnq-it.github.io/webb
```

⚠️ **Lưu ý**: Phải có `/webb` ở cuối!

### Bước 3: Cấu hình Redirect URLs

**Redirect URLs** (thêm các URL sau, mỗi URL một dòng):

```
https://hungnq-it.github.io/webb/**
https://hungnq-it.github.io/webb
https://hungnq-it.github.io/**
```

### Bước 4: Lưu lại

Click **Save** để lưu cấu hình.

## ✅ Checklist

- [ ] Site URL = `https://hungnq-it.github.io/webb`
- [ ] Redirect URLs có 3 dòng như trên
- [ ] Đã click Save
- [ ] Đã deploy lại trên GitHub Pages (nếu cần)

## 🔍 Kiểm tra sau khi cấu hình

1. Mở website: https://hungnq-it.github.io/webb/
2. Thử đăng ký hoặc đăng nhập
3. Nếu vẫn lỗi, kiểm tra console (F12) để xem lỗi chi tiết

## 💡 Lưu ý

- Site URL **KHÔNG** được là: `https://hungnq-it.github.io` (thiếu `/webb`)
- Site URL **KHÔNG** được là: `http://localhost:5173` (chỉ dùng khi test local)
- Redirect URLs phải có pattern với `/webb` để match đúng base path

