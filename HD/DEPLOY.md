# 🚀 Hướng dẫn Deploy lên GitHub Pages

## Bước 1: Tạo Repository trên GitHub

1. Đăng nhập vào GitHub
2. Tạo repository mới (ví dụ: `Gia-su-10-diem`)
3. **Lưu ý**: Ghi nhớ tên repository của bạn

## Bước 2: Cập nhật Base Path

Sau khi tạo repository, bạn cần cập nhật base path trong 2 file:

### File 1: `vite.config.js`

```js
export default defineConfig({
  plugins: [react()],
  base: '/TEN-REPO-CUA-BAN/', // Thay bằng tên repo thực tế
})
```

### File 2: `src/App.jsx`

Tìm dòng:
```js
<BrowserRouter basename="/Gia-su-10-diem">
```

Đổi thành:
```js
<BrowserRouter basename="/TEN-REPO-CUA-BAN">
```

### File 3: `public/404.html`

Tìm dòng:
```js
var base = '/Gia-su-10-diem';
```

Đổi thành:
```js
var base = '/TEN-REPO-CUA-BAN';
```

## Bước 3: Push code lên GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME/TEN-REPO-CUA-BAN.git
git push -u origin main
```

## Bước 4: Bật GitHub Pages

1. Vào repository trên GitHub
2. Vào **Settings** → **Pages**
3. Trong phần **Source**, chọn:
   - **Source**: `GitHub Actions`
4. Lưu lại

## Bước 5: Chờ Deploy

1. GitHub Actions sẽ tự động build và deploy
2. Xem tiến trình trong tab **Actions**
3. Sau khi hoàn thành, website sẽ có tại:
   ```
   https://USERNAME.github.io/TEN-REPO-CUA-BAN/
   ```

## ⚠️ Lưu ý quan trọng

1. **Base path phải khớp**: Đảm bảo base path trong cả 3 file (`vite.config.js`, `App.jsx`, `404.html`) đều giống nhau và khớp với tên repository

2. **Tên repository**: Nếu repository có ký tự đặc biệt hoặc khoảng trắng, GitHub sẽ tự động convert. Kiểm tra URL thực tế trên GitHub Pages

3. **Case sensitive**: Tên repository trên GitHub có thể phân biệt chữ hoa/thường

## 🔧 Troubleshooting

### Lỗi 404 khi vào trang con

- Kiểm tra file `404.html` đã được copy vào `dist/` chưa
- Kiểm tra base path có đúng không
- Thử clear cache trình duyệt

### Lỗi không load được questions.json

- Kiểm tra file `public/questions.json` có tồn tại không
- Kiểm tra base path trong `App.jsx` có đúng không
- Mở DevTools → Network để xem request có lỗi gì không

### Website không cập nhật sau khi push

- Kiểm tra GitHub Actions có chạy thành công không
- Đợi vài phút để GitHub Pages cập nhật
- Thử hard refresh (Ctrl+F5 hoặc Cmd+Shift+R)

## 📝 Thêm bài tập mới

Sau khi deploy, để thêm bài tập mới:

1. Chỉnh sửa file `public/questions.json`
2. Commit và push lên GitHub
3. GitHub Actions sẽ tự động rebuild và deploy
4. Website sẽ tự động cập nhật (có thể cần đợi 1-2 phút)

---

**Chúc bạn deploy thành công! 🎉**

