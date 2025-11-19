# 🚀 Hướng Dẫn Sửa Lỗi Listening Nhanh

## ⚡ Làm ngay bây giờ:

### Bước 1: Clear cache
Mở Console trong trình duyệt (nhấn F12), paste và Enter:
```javascript
localStorage.clear()
location.reload()
```

### Bước 2: Rebuild
```bash
npm run build
npm run dev
```

### Bước 3: Test
1. Vào http://localhost:5173
2. Chọn IELTS → Listening
3. Click vào bài test
4. Xem Console (F12) có lỗi gì không

## 🔍 Nếu vẫn lỗi:

### Kiểm tra Console Log
Mở Console (F12) và tìm các dòng:
```
App - Loaded IELTS tests: ...
IELTSListening - ID: ...
IELTSListening - test: ...
```

### Nếu thấy lỗi đỏ:
1. Chụp màn hình
2. Copy toàn bộ text lỗi
3. Gửi cho dev

## ✅ Đã sửa:
- ✅ Fix circular dependency trong useEffect
- ✅ Thêm ErrorBoundary
- ✅ Thêm debug logging
- ✅ Build thành công

## 📞 Cần giúp:
Nếu vẫn lỗi, cung cấp:
1. Screenshot Console (F12)
2. URL đang truy cập
3. Bài test nào bị lỗi (ID)
