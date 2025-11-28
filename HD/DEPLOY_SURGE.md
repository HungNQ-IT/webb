# 🚀 Hướng dẫn Deploy lên Surge

## Bước 1: Cài đặt Surge (chỉ làm 1 lần)

```bash
npm install -g surge
```

## Bước 2: Đăng ký/Đăng nhập Surge (chỉ làm 1 lần)

```bash
surge login
```

Hoặc nếu chưa có tài khoản:

```bash
surge
```

Surge sẽ hỏi email và password để tạo tài khoản mới.

## Bước 3: Build và Deploy

### Cách 1: Deploy tự động (Khuyến nghị)

```bash
npm run deploy:surge
```

Script này sẽ:
1. Build project với mode surge (base path = `/`)
2. Tự động deploy thư mục `dist` lên Surge

### Cách 2: Deploy thủ công

```bash
# Build project
npm run build:surge

# Deploy
cd dist
surge
```

## Bước 4: Chọn domain

Khi chạy lần đầu, Surge sẽ hỏi:

```
   domain: random-name-1234.surge.sh
```

Bạn có thể:
- **Nhấn Enter** để dùng domain ngẫu nhiên
- **Gõ tên domain tùy chỉnh**: `gia-su-10-diem.surge.sh`

## 📝 Lưu ý quan trọng

### 1. Domain tùy chỉnh

Nếu muốn dùng domain cố định, tạo file `CNAME` trong thư mục `dist`:

```bash
echo "gia-su-10-diem.surge.sh" > dist/CNAME
```

Hoặc thêm vào script:

```json
"deploy:surge": "npm run build:surge && echo 'gia-su-10-diem.surge.sh' > dist/CNAME && surge dist"
```

### 2. Cập nhật lại (Re-deploy)

Để cập nhật site đã deploy:

```bash
npm run deploy:surge
```

Surge sẽ tự động nhận diện domain cũ và cập nhật.

### 3. Xóa site

```bash
surge teardown gia-su-10-diem.surge.sh
```

### 4. Xem danh sách sites

```bash
surge list
```

## 🎯 So sánh GitHub Pages vs Surge

| Tính năng | GitHub Pages | Surge |
|-----------|--------------|-------|
| **Base URL** | `/webb/` | `/` |
| **Deploy** | Git push | `surge` command |
| **Domain** | username.github.io/webb | custom.surge.sh |
| **Tốc độ** | Trung bình | Rất nhanh |
| **SSL** | Có | Có (miễn phí) |
| **Giới hạn** | 1GB | 1GB (free plan) |

## 🔗 Links hữu ích

- Surge Docs: https://surge.sh/help/
- Tên domain có sẵn: https://surge.sh/help/adding-a-custom-domain

## ⚡ Quick Commands

```bash
# Deploy nhanh
npm run deploy:surge

# Deploy với domain cụ thể
surge dist gia-su-10-diem.surge.sh

# Xem logs
surge list

# Xóa deployment
surge teardown gia-su-10-diem.surge.sh
```

## 🎨 Tùy chỉnh domain

Một số tên domain đẹp bạn có thể thử:

- `gia-su-10-diem.surge.sh`
- `giasuonline.surge.sh`
- `hoc10diem.surge.sh`
- `luyenthi-online.surge.sh`
- `quiz-app-vn.surge.sh`

**Lưu ý:** Domain phải chưa được ai sử dụng!

## 🐛 Troubleshooting

### Lỗi: "You do not have permission to publish"

```bash
surge logout
surge login
```

### Lỗi: "Domain already in use"

Chọn domain khác hoặc xóa domain cũ:

```bash
surge teardown old-domain.surge.sh
```

### Lỗi: "Build failed"

Kiểm tra lại:

```bash
npm run build:surge
# Xem có lỗi không
```

## ✅ Checklist Deploy

- [ ] Đã cài Surge: `npm install -g surge`
- [ ] Đã login: `surge login`
- [ ] Build thành công: `npm run build:surge`
- [ ] Chọn domain đẹp
- [ ] Deploy: `npm run deploy:surge`
- [ ] Test site: mở link Surge
- [ ] Cập nhật README với link mới

## 🎉 Hoàn thành!

Sau khi deploy thành công, bạn sẽ có link dạng:

```
https://gia-su-10-diem.surge.sh
```

Chia sẻ link này với mọi người! 🚀
