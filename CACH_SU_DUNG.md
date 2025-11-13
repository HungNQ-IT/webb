# 🚀 CÁCH SỬ DỤNG - ĐỌC KỸ ĐỂ KHÔNG BỊ LỖI

## ⚠️ QUAN TRỌNG: KHÔNG THỂ MỞ FILE HTML TRỰC TIẾP

**File HTML không thể chạy bằng cách double-click!**

React/Vite cần **web server** để hoạt động. Đây là cách hoạt động bình thường của các ứng dụng web hiện đại.

## ✅ 3 CÁCH CHẠY ĐÚNG:

### 1️⃣ Development (Khi đang code)

```bash
npm run dev
```

Sau đó mở: **http://localhost:5173**

→ Dùng khi đang sửa code, tự động refresh khi lưu file

---

## 🔐 BẬT BACKEND (Đăng nhập & lưu kết quả)

### Bước 1: Tạo file cấu hình

```bash
cp server/env.example server/.env
```

Sau đó mở `server/.env` và điền:

- `JWT_SECRET`: chuỗi bí mật bất kỳ (dài > 16 ký tự)
- `CLIENT_ORIGINS`: mặc định `http://localhost:5173`
- `ADMIN_EMAILS`: danh sách email quản trị (ví dụ: `admin@gmail.com`)

### Bước 2: Chạy server

```bash
npm run server
```

Server sẽ chạy tại **http://localhost:5000**. Giữ cửa sổ terminal này mở.

> Muốn build/deploy server miễn phí có thể dùng Render/Railway. Khi đó cập nhật `VITE_API_BASE_URL` ở bước tiếp theo.

### Bước 3: Cho frontend biết URL API

Tạo file `.env` ở thư mục gốc (cùng cấp `package.json`):

```
VITE_API_BASE_URL=http://localhost:5000
```

Sau đó chạy lại `npm run dev` để Vite đọc biến môi trường.

---

### 2️⃣ Preview Production Build (Test trước khi deploy)

```bash
npm run build
npm run preview
```

Sau đó mở: **http://localhost:4173**

→ Dùng để test xem build có đúng không, giống như trên GitHub Pages

---

### 3️⃣ Deploy lên GitHub Pages

```bash
git add .
git commit -m "Update"
git push origin main
```

Sau đó đợi GitHub Actions deploy xong, mở: **https://hungnq-it.github.io/webb/**

→ Dùng khi muốn publish lên web

---

## 🎯 QUY TRÌNH THỰC TẾ:

### Khi làm việc hàng ngày:
```bash
npm run dev
```
→ Mở http://localhost:5173
→ Sửa code → Tự động refresh

### Trước khi push lên GitHub:
```bash
npm run build
npm run preview
```
→ Mở http://localhost:4173
→ Test xem có lỗi gì không

### Khi muốn publish:
```bash
git add .
git commit -m "Update"
git push origin main
```
→ Đợi GitHub Actions deploy
→ Mở https://hungnq-it.github.io/webb/

---

## ❌ NHỮNG ĐIỀU KHÔNG LÀM:

1. ❌ **KHÔNG** double-click vào file `index.html`
2. ❌ **KHÔNG** mở file HTML trực tiếp từ Finder/Explorer
3. ❌ **KHÔNG** bấm vào file HTML trên GitHub và mong nó chạy
4. ❌ **KHÔNG** copy file vào thư mục khác và mở trực tiếp

## ✅ NHỮNG ĐIỀU NÊN LÀM:

1. ✅ **LUÔN** dùng `npm run dev` khi development
2. ✅ **LUÔN** dùng `npm run preview` để test production build
3. ✅ **LUÔN** dùng web server (localhost)
4. ✅ **LUÔN** push lên GitHub để deploy

---

## 🐛 NẾU THẤY MÀN HÌNH TRẮNG:

### Kiểm tra 1: Server có chạy không?
```bash
# Xem terminal có hiện "Local: http://localhost:5173" không
npm run dev
```

### Kiểm tra 2: Mở đúng URL không?
- Development: `http://localhost:5173`
- Preview: `http://localhost:4173`
- GitHub: `https://hungnq-it.github.io/webb/`

### Kiểm tra 3: Console có lỗi không?
- Mở DevTools (F12)
- Xem tab Console
- Copy lỗi và tìm trên Google

### Kiểm tra 4: Port có bị chiếm không?
```bash
# Kiểm tra port 5173
lsof -i :5173

# Nếu có process, kill nó
kill -9 <PID>
```

---

## 📋 CHECKLIST:

Trước khi báo lỗi, đảm bảo:

- [ ] Đã chạy `npm install` chưa?
- [ ] Đã chạy `npm run dev` hoặc `npm run preview` chưa?
- [ ] Đã mở đúng URL (localhost:5173 hoặc localhost:4173) chưa?
- [ ] Server có đang chạy không? (xem terminal)
- [ ] Console có lỗi gì không? (F12 → Console)
- [ ] Network có load được file không? (F12 → Network)

---

## 🎓 TẠI SAO CẦN SERVER?

1. **CORS Policy**: Browser block việc load file từ file://
2. **ES Modules**: React dùng import/export, cần server
3. **Routing**: React Router cần server để xử lý routes
4. **Security**: Browser không cho phép load file local trực tiếp

Đây là cách hoạt động **BÌNH THƯỜNG** của mọi ứng dụng web hiện đại (React, Vue, Angular, etc.)

---

## 💡 TÓM TẮT:

| Muốn làm gì? | Command | URL |
|--------------|---------|-----|
| Development | `npm run dev` | `http://localhost:5173` |
| Test Production | `npm run build && npm run preview` | `http://localhost:4173` |
| Deploy | `git push origin main` | `https://hungnq-it.github.io/webb/` |
| ❌ KHÔNG LÀM | Double-click HTML | ❌ Không hoạt động |

---

**NHỚ**: Luôn dùng web server, không mở file HTML trực tiếp!

