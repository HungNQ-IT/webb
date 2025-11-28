# 🔧 Fix Lỗi "Project Not Found" trên Surge

## Nguyên nhân

Lỗi này xảy ra khi:
1. Deploy sai thư mục (deploy thư mục gốc thay vì thư mục `dist`)
2. Chưa build project trước khi deploy
3. File `index.html` không có trong thư mục deploy

## ✅ Cách fix (Khuyến nghị)

### Bước 1: Xóa deployment cũ

```bash
surge teardown gia-su-10-diem.surge.sh
```

### Bước 2: Build project

```bash
npm run build:surge
```

Kiểm tra xem thư mục `dist` đã được tạo chưa:

```bash
ls dist
# Phải thấy: index.html, assets/, vite.svg, ...
```

### Bước 3: Deploy đúng cách

**Cách 1: Dùng script tự động (Khuyến nghị)**

```bash
npm run deploy:surge
```

**Cách 2: Deploy thủ công**

```bash
cd dist
surge
```

Khi Surge hỏi domain, gõ: `gia-su-10-diem.surge.sh`

### Bước 4: Kiểm tra

Mở trình duyệt và truy cập:
```
https://gia-su-10-diem.surge.sh
```

## 🎯 Deploy với domain cố định

Để không phải nhập domain mỗi lần, tạo file `CNAME` trong thư mục `dist`:

```bash
echo "gia-su-10-diem.surge.sh" > dist/CNAME
surge dist
```

Hoặc cập nhật script trong `package.json`:

```json
"deploy:surge": "npm run build:surge && echo 'gia-su-10-diem.surge.sh' > dist/CNAME && surge dist"
```

## 🐛 Các lỗi thường gặp

### 1. "project not found"

**Nguyên nhân:** Deploy sai thư mục

**Fix:**
```bash
# Đảm bảo đang ở thư mục gốc project
npm run build:surge
surge dist gia-su-10-diem.surge.sh
```

### 2. "You do not have permission"

**Nguyên nhân:** Chưa đăng nhập hoặc domain đã được người khác sử dụng

**Fix:**
```bash
surge logout
surge login
# Hoặc chọn domain khác
```

### 3. "404 Not Found" khi refresh trang

**Nguyên nhân:** React Router cần file `200.html` cho client-side routing

**Fix:** Tôi đã tạo file `public/200.html` - nó sẽ tự động copy vào `dist` khi build

### 4. Build thất bại

**Fix:**
```bash
# Xóa cache và build lại
rm -rf dist node_modules/.vite
npm run build:surge
```

## 📋 Checklist Deploy

- [ ] Đã cài Surge: `npm install -g surge`
- [ ] Đã login: `surge login`
- [ ] Build thành công: `npm run build:surge`
- [ ] Thư mục `dist` có file `index.html`
- [ ] Deploy: `surge dist gia-su-10-diem.surge.sh`
- [ ] Site hoạt động: mở link kiểm tra

## 🚀 Deploy nhanh (All-in-one)

```bash
# Xóa deployment cũ (nếu có lỗi)
surge teardown gia-su-10-diem.surge.sh

# Build và deploy
npm run build:surge && surge dist gia-su-10-diem.surge.sh
```

## 💡 Tips

1. **Luôn deploy thư mục `dist`**, không phải thư mục gốc
2. **Build trước khi deploy**: `npm run build:surge`
3. **Kiểm tra thư mục dist** có đầy đủ file trước khi deploy
4. **Dùng domain cố định** để dễ quản lý

## 🎉 Sau khi deploy thành công

Site của bạn sẽ có:
- ✅ URL: https://gia-su-10-diem.surge.sh
- ✅ SSL/HTTPS tự động
- ✅ CDN toàn cầu
- ✅ Deploy trong vài giây

Chia sẻ link với mọi người! 🚀
