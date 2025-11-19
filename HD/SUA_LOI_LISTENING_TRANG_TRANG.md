# 🔧 Sửa Lỗi Màn Hình Trắng Khi Vào Listening

## 🐛 Vấn đề
Khi click vào bài Listening, trang web hiển thị màn hình trắng (white screen).

## 🔍 Nguyên nhân
Có thể do:
1. Dữ liệu `ielts.json` không được load đúng
2. Cache cũ đang gây xung đột
3. Component `IELTSListening` gặp lỗi runtime
4. Props `ieltsTests` không được truyền đúng

## ✅ Giải pháp

### Bước 1: Kiểm tra dữ liệu
1. Mở file `test-listening.html` trong trình duyệt:
   ```
   http://localhost:5173/test-listening.html
   ```

2. Click nút "Test Listening ID 106"

3. Kiểm tra xem:
   - ✅ Test có tồn tại không?
   - ✅ `test.sections` có phải là array không?
   - ✅ Mỗi section có `questions` không?

### Bước 2: Clear cache
1. Mở Console trong trình duyệt (F12)
2. Chạy lệnh:
   ```javascript
   localStorage.clear()
   location.reload()
   ```

Hoặc dùng script:
```bash
node clear-all-cache.js
```

### Bước 3: Kiểm tra Console Log
1. Mở trang Listening
2. Mở Console (F12)
3. Xem các log:
   ```
   IELTSListening - ID: 106
   IELTSListening - ieltsTests: [...]
   IELTSListening - test: {...}
   IELTSListening - test.sections: [...]
   ```

4. Nếu thấy lỗi đỏ, copy và báo lại

### Bước 4: Rebuild
```bash
npm run build
npm run dev
```

## 🧪 Test
1. Vào trang chủ
2. Chọn IELTS → Listening
3. Click vào bài test
4. Kiểm tra xem có hiển thị đúng không

## 📝 Debug Checklist
- [ ] File `public/ielts.json` tồn tại
- [ ] Test ID 106 có trong file
- [ ] Test có `type: "ielts-listening"`
- [ ] Test có `sections` array
- [ ] Mỗi section có `questions` array
- [ ] Console không có lỗi đỏ
- [ ] Cache đã được clear
- [ ] Build thành công

## 🆘 Nếu vẫn lỗi
1. Chụp màn hình Console (F12)
2. Chụp màn hình Network tab
3. Copy toàn bộ log từ Console
4. Gửi cho dev để debug

## 🔧 Code đã sửa
- ✅ Thêm debug logging trong `IELTSListening.jsx`
- ✅ Thêm debug logging trong `App.jsx`
- ✅ Fix useCallback dependencies
- ✅ Thêm error boundary
- ✅ Tạo test page `test-listening.html`
