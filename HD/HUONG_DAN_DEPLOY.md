# 🚀 Hướng dẫn Deploy lên GitHub Pages - ĐÃ SỬA LỖI

## ✅ Đã sửa những gì:

### 1. Base Path đã được cập nhật
- **Trước**: `/Gia-su-10-diem/` (sai - không khớp với tên repo)
- **Sau**: `/webb/` (đúng - khớp với tên repo `webb`)

### 2. Files đã được cập nhật:
- ✅ `vite.config.js`: Base path = `/webb/`
- ✅ `public/404.html`: BASE_PATH = `/webb`
- ✅ `src/App.jsx`: Tự động lấy base path từ config

### 3. Build đã test:
- ✅ `npm run build` thành công
- ✅ File `dist/404.html` đã được tạo
- ✅ Assets có path đúng: `/webb/assets/...`

## 📋 Các bước deploy:

### Bước 1: Commit và Push code

```bash
git add .
git commit -m "Fix base path to /webb/ for GitHub Pages"
git push origin main
```

### Bước 2: Kiểm tra GitHub Pages Settings

1. Mở: `https://github.com/HungNQ-IT/webb/settings/pages`

2. Trong phần **"Source"**, phải chọn:
   - ✅ **"GitHub Actions"** (QUAN TRỌNG!)
   - ❌ KHÔNG chọn "Deploy from a branch"

3. Nếu chưa có option "GitHub Actions", làm theo:
   - Vào tab **Actions**
   - Chờ workflow chạy lần đầu
   - Sau đó quay lại Settings → Pages
   - Sẽ có option "GitHub Actions"

### Bước 3: Kiểm tra GitHub Actions

1. Mở: `https://github.com/HungNQ-IT/webb/actions`

2. Kiểm tra workflow có tên "Deploy to GitHub Pages":
   - Nếu có dấu ✅ (màu xanh) = Thành công
   - Nếu có dấu ❌ (màu đỏ) = Có lỗi (xem log)

3. Nếu có lỗi:
   - Click vào workflow failed
   - Xem phần "Build" hoặc "Deploy" để biết lỗi gì
   - Thường là lỗi về permissions hoặc config

### Bước 4: Truy cập Website

Sau khi deploy thành công (workflow có dấu ✅), truy cập:

```
https://hungnq-it.github.io/webb/
```

**Lưu ý**: 
- URL phải có `/webb/` ở cuối (hoặc `/webb` không có `/` ở cuối)
- KHÔNG phải: `https://hungnq-it.github.io/` (thiếu `/webb/`)

## 🔍 Kiểm tra Website hoạt động:

### Test 1: Trang chủ
- URL: `https://hungnq-it.github.io/webb/`
- Phải hiển thị: "Gia Sư 10 Điểm" và nút "Bắt đầu ngay"

### Test 2: Danh sách môn học
- Click "Bắt đầu ngay"
- URL: `https://hungnq-it.github.io/webb/subjects`
- Phải hiển thị: Danh sách các môn học (Toán, Vật Lý, Hóa Học)

### Test 3: Danh sách bài tập
- Click vào môn "Toán"
- URL: `https://hungnq-it.github.io/webb/subject/Toán`
- Phải hiển thị: Danh sách bài tập môn Toán

### Test 4: Làm bài
- Click vào một bài tập
- URL: `https://hungnq-it.github.io/webb/quiz/1`
- Phải hiển thị: Câu hỏi và các lựa chọn

### Test 5: Kết quả
- Làm bài và nộp
- URL: `https://hungnq-it.github.io/webb/result/1`
- Phải hiển thị: Điểm và review chi tiết

## ⚠️ Nếu vẫn gặp lỗi:

### Lỗi 1: "404 Page not found" khi vào website

**Nguyên nhân**: GitHub Pages chưa được bật hoặc config sai

**Giải pháp**:
1. Kiểm tra Settings → Pages → Source = "GitHub Actions"
2. Kiểm tra Actions → Workflow có chạy thành công không
3. Đợi 1-2 phút sau khi push code (GitHub cần thời gian deploy)

### Lỗi 2: Trang trắng hoặc không load được

**Nguyên nhân**: Base path sai hoặc assets không load được

**Giải pháp**:
1. Mở DevTools (F12) → Tab Console
2. Xem có lỗi gì không (thường là 404 cho .js hoặc .css)
3. Kiểm tra base path trong `vite.config.js` = `/webb/`
4. Rebuild và push lại:
   ```bash
   npm run build
   git add dist/
   git commit -m "Rebuild with correct base path"
   git push origin main
   ```

### Lỗi 3: Routing không hoạt động (trang con bị 404)

**Nguyên nhân**: File 404.html không hoạt động

**Giải pháp**:
1. Kiểm tra file `dist/404.html` có tồn tại không
2. Kiểm tra BASE_PATH trong `public/404.html` = `/webb`
3. Clear cache trình duyệt (Ctrl+Shift+Delete)
4. Thử truy cập: `https://hungnq-it.github.io/webb/index.html`

### Lỗi 4: GitHub Actions fail

**Nguyên nhân**: Có lỗi trong build hoặc permissions

**Giải pháp**:
1. Xem log trong Actions tab
2. Kiểm tra lỗi cụ thể
3. Thử build local: `npm run build`
4. Nếu build local thành công nhưng Actions fail, có thể là vấn đề về permissions

## 📝 Quick Commands:

```bash
# 1. Build local để test
npm run build

# 2. Xem file đã build
ls -la dist/

# 3. Test local với production build
npm run preview

# 4. Commit và push
git add .
git commit -m "Fix for GitHub Pages"
git push origin main

# 5. Kiểm tra status
git status
```

## ✅ Checklist cuối cùng:

Trước khi báo là đã deploy thành công, đảm bảo:

- [ ] Base path trong `vite.config.js` = `/webb/`
- [ ] BASE_PATH trong `public/404.html` = `/webb`
- [ ] Đã commit và push code lên GitHub
- [ ] GitHub Pages Settings → Source = "GitHub Actions"
- [ ] GitHub Actions workflow chạy thành công (dấu ✅)
- [ ] Truy cập được: `https://hungnq-it.github.io/webb/`
- [ ] Trang chủ hiển thị đúng
- [ ] Click "Bắt đầu ngay" → Chuyển đến `/webb/subjects`
- [ ] Chọn môn học → Hiển thị danh sách bài tập
- [ ] Click vào bài tập → Hiển thị câu hỏi
- [ ] Làm bài và nộp → Hiển thị kết quả
- [ ] Không có lỗi trong browser console (F12)

## 🎉 Khi tất cả đều ✅:

Website của bạn đã hoạt động trên GitHub Pages!

URL: `https://hungnq-it.github.io/webb/`

Bạn có thể share link này cho người khác sử dụng.

---

**Nếu vẫn gặp vấn đề sau khi làm theo hướng dẫn:**
1. Chụp screenshot lỗi
2. Copy log từ GitHub Actions
3. Copy lỗi từ browser console (F12)
4. Gửi cho tôi để kiểm tra thêm

