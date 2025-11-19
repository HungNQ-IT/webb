# 🔧 Hướng dẫn sửa lỗi GitHub Pages

## ✅ Đã sửa:

1. **Base path đã được cập nhật**: Từ `/Gia-su-10-diem/` → `/webb/` (đúng với tên repo)
2. **File 404.html đã được cập nhật**: BASE_PATH = `/webb`
3. **File 404.html đã được copy vào dist/**: Vite tự động copy từ public/

## 📋 Các bước để deploy:

### Bước 1: Commit và push code

```bash
git add .
git commit -m "Fix base path for GitHub Pages"
git push origin main
```

### Bước 2: Kiểm tra GitHub Pages Settings

1. Vào repository trên GitHub: `https://github.com/HungNQ-IT/webb`
2. Vào **Settings** → **Pages**
3. Kiểm tra:
   - **Source**: Phải chọn **"GitHub Actions"** (KHÔNG phải "Deploy from a branch")
   - Nếu chưa có, chọn "GitHub Actions"

### Bước 3: Kiểm tra GitHub Actions

1. Vào tab **Actions** trong repository
2. Kiểm tra xem workflow có chạy không
3. Nếu có lỗi, xem log để biết lỗi gì

### Bước 4: Truy cập website

Sau khi deploy thành công, website sẽ có tại:
```
https://hungnq-it.github.io/webb/
```

## ⚠️ Lưu ý quan trọng:

### 1. Base Path phải khớp với tên repo

- Tên repo: `webb`
- Base path: `/webb/`
- URL: `https://hungnq-it.github.io/webb/`

### 2. File 404.html

File này rất quan trọng để React Router hoạt động trên GitHub Pages. File đã được:
- ✅ Copy vào `dist/404.html` khi build
- ✅ Có BASE_PATH = `/webb`
- ✅ Tự động redirect về `index.html`

### 3. Nếu vẫn không hoạt động:

**Kiểm tra 1: GitHub Pages có được bật không?**
- Settings → Pages → Source = "GitHub Actions"

**Kiểm tra 2: Workflow có chạy thành công không?**
- Actions → Xem workflow có chạy và thành công không

**Kiểm tra 3: Base path có đúng không?**
- Kiểm tra file `vite.config.js`: `base: mode === 'production' ? '/webb/' : '/'`
- Kiểm tra file `public/404.html`: `var BASE_PATH = '/webb';`
- Kiểm tra file `dist/index.html`: có path `/webb/` trong các link không

**Kiểm tra 4: Truy cập đúng URL**
- URL đúng: `https://hungnq-it.github.io/webb/`
- KHÔNG phải: `https://hungnq-it.github.io/webb/index.html` (sẽ redirect)

## 🐛 Troubleshooting:

### Lỗi: "404 Page not found" khi vào trang con

**Nguyên nhân**: File 404.html không hoạt động hoặc base path sai

**Giải pháp**:
1. Kiểm tra file `dist/404.html` có tồn tại không
2. Kiểm tra BASE_PATH trong 404.html có đúng không
3. Clear cache trình duyệt (Ctrl+Shift+Delete)

### Lỗi: Website hiển thị nhưng routing không hoạt động

**Nguyên nhân**: Base path không khớp

**Giải pháp**:
1. Kiểm tra console trong browser (F12)
2. Xem có lỗi 404 nào không
3. Đảm bảo base path trong 3 file đều là `/webb/` hoặc `/webb`

### Lỗi: GitHub Actions fail

**Nguyên nhân**: Có lỗi trong build process

**Giải pháp**:
1. Xem log trong Actions tab
2. Kiểm tra xem có lỗi gì trong build không
3. Thử build local: `npm run build`

## ✅ Checklist trước khi deploy:

- [ ] Base path trong `vite.config.js` = `/webb/`
- [ ] BASE_PATH trong `public/404.html` = `/webb`
- [ ] Đã commit và push code
- [ ] GitHub Pages Settings → Source = "GitHub Actions"
- [ ] GitHub Actions workflow chạy thành công
- [ ] Truy cập đúng URL: `https://hungnq-it.github.io/webb/`

## 🚀 Sau khi deploy thành công:

1. Truy cập: `https://hungnq-it.github.io/webb/`
2. Test các trang:
   - Trang chủ: `/webb/`
   - Danh sách môn: `/webb/subjects`
   - Danh sách bài: `/webb/subject/Toán`
   - Làm bài: `/webb/quiz/1`
   - Kết quả: `/webb/result/1`

Nếu tất cả đều hoạt động, bạn đã thành công! 🎉

