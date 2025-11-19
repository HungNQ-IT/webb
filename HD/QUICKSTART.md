# ⚡ Quick Start Guide

## 🚀 Chạy local (Development)

1. **Cài đặt dependencies:**
```bash
npm install
```

2. **Chạy development server:**
```bash
npm run dev
```

3. **Mở trình duyệt:**
```
http://localhost:5173
```

## 📦 Build cho production

```bash
npm run build
```

File build sẽ được tạo trong thư mục `dist/`.

## 🌐 Deploy lên GitHub Pages

### Bước nhanh:

1. **Tạo repository trên GitHub** (ví dụ: `Gia-su-10-diem`)

2. **Cập nhật base path trong 3 file:**
   - `vite.config.js`: Đổi `base: '/Gia-su-10-diem/'` thành tên repo của bạn
   - `src/App.jsx`: Đổi `basename="/Gia-su-10-diem"` thành tên repo của bạn  
   - `public/404.html`: Đổi `BASE_PATH = '/Gia-su-10-diem'` thành tên repo của bạn

3. **Push code lên GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO-NAME.git
git push -u origin main
```

4. **Bật GitHub Pages:**
   - Vào Settings → Pages
   - Source: Chọn "GitHub Actions"
   - Lưu lại

5. **Chờ deploy xong** (xem trong tab Actions)

6. **Truy cập website:**
```
https://USERNAME.github.io/REPO-NAME/
```

## 📝 Thêm bài tập mới

Chỉ cần chỉnh sửa file `public/questions.json` và push lên GitHub!

Xem ví dụ trong file `public/questions.json` để biết cấu trúc.

## 🎯 Tính năng chính

- ✅ Chọn môn học → Chọn bài tập → Làm bài
- ✅ Chấm điểm tự động
- ✅ Xem kết quả chi tiết với lời giải
- ✅ Lưu lịch sử làm bài (localStorage)
- ✅ Timer đếm ngược (nếu có timeLimit)
- ✅ Responsive design

## 🐛 Troubleshooting

**Lỗi 404 khi vào trang con:**
- Kiểm tra base path có đúng không
- Kiểm tra file 404.html đã được copy vào dist/

**Không load được questions.json:**
- Kiểm tra file có trong `public/` không
- Kiểm tra base path trong App.jsx

**Website không cập nhật:**
- Kiểm tra GitHub Actions có chạy thành công không
- Đợi vài phút và thử hard refresh (Ctrl+F5)

---

Xem `README.md` và `DEPLOY.md` để biết thêm chi tiết!

