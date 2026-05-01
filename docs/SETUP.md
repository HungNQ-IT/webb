# 🚀 Setup & Deployment Guide

## ⚡ Quick Start

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Chạy development server
```bash
npm run dev
```

Mở trình duyệt: **http://localhost:5173**

---

## 🔐 Cấu hình Backend (Optional)

### Bước 1: Tạo file .env
```bash
cp .env.example .env
```

### Bước 2: Cấu hình Supabase

1. Tạo project tại https://supabase.com
2. Copy URL và anon key vào `.env`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Bước 3: Setup Database

1. Mở file `database/supabase_setup.sql`
2. Copy toàn bộ nội dung
3. Vào Supabase Dashboard → SQL Editor
4. Paste và Run

✅ Database đã sẵn sàng!

---

## 🌐 Deploy lên GitHub Pages

### Bước 1: Cập nhật base path

Sửa 3 file sau với tên repo của bạn:

**vite.config.js:**
```js
base: '/your-repo-name/'
```

**src/App.jsx:**
```jsx
basename="/your-repo-name"
```

**public/404.html:**
```js
BASE_PATH = '/your-repo-name'
```

### Bước 2: Push lên GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO-NAME.git
git push -u origin main
```

### Bước 3: Bật GitHub Pages

1. Vào Settings → Pages
2. Source: Chọn "GitHub Actions"
3. Lưu lại

### Bước 4: Truy cập website

```
https://USERNAME.github.io/REPO-NAME/
```

---

## 📦 Build cho Production

```bash
npm run build
```

Preview build:
```bash
npm run preview
```

---

## ⚠️ Lưu ý quan trọng

### KHÔNG mở file HTML trực tiếp!

React/Vite cần web server để hoạt động. Luôn dùng:
- `npm run dev` - Development
- `npm run preview` - Test production build
- GitHub Pages - Deploy online

### Quy trình làm việc

1. **Development**: `npm run dev` → http://localhost:5173
2. **Test**: `npm run build && npm run preview` → http://localhost:4173
3. **Deploy**: `git push origin main` → GitHub Pages

---

## 🐛 Troubleshooting

### Màn hình trắng?
- Kiểm tra server có chạy không
- Mở DevTools (F12) → Console xem lỗi
- Kiểm tra base path có đúng không

### Lỗi 404 khi vào trang con?
- Kiểm tra file `public/404.html` đã có chưa
- Kiểm tra base path trong 3 file đã đúng chưa

### Không load được data?
- Kiểm tra file JSON trong `public/`
- Kiểm tra Supabase URL và key trong `.env`
- Mở Network tab (F12) xem request

---

## 📋 Checklist

Trước khi báo lỗi:

- [ ] Đã chạy `npm install`?
- [ ] Đã chạy `npm run dev`?
- [ ] Đã mở đúng URL (localhost:5173)?
- [ ] Console có lỗi gì không? (F12)
- [ ] Base path đã đúng chưa?

---

## 💡 Tips

- Dùng `npm run dev` khi code
- Dùng `npm run preview` trước khi push
- Commit thường xuyên
- Test trên nhiều trình duyệt
