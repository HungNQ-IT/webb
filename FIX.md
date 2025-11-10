# ✅ Đã sửa lỗi "không mở được web"

## Vấn đề đã được fix:

1. **Base path không phù hợp khi chạy local**: 
   - Trước: Base path luôn là `/Gia-su-10-diem/` (chỉ dùng cho GitHub Pages)
   - Sau: Tự động dùng `/` khi chạy dev, `/Gia-su-10-diem/` khi build production

2. **Đã cài đặt dependencies**: Chạy `npm install` thành công

## Cách chạy:

### Development (Local):
```bash
npm run dev
```

Server sẽ chạy tại: `http://localhost:5173`

### Production Build:
```bash
npm run build
```

## Lưu ý khi deploy:

Khi deploy lên GitHub Pages, cần cập nhật base path trong 3 file:

1. **vite.config.js**: 
   - Dòng `base: mode === 'production' ? '/Gia-su-10-diem/' : '/'`
   - Đổi `/Gia-su-10-diem/` thành tên repo của bạn

2. **src/App.jsx**: 
   - Đã tự động lấy từ `import.meta.env.BASE_URL`, không cần sửa thủ công

3. **public/404.html**: 
   - Đổi `BASE_PATH = '/Gia-su-10-diem'` thành tên repo của bạn

## Kiểm tra:

- ✅ Server đã chạy tại http://localhost:5173
- ✅ Base path tự động điều chỉnh theo mode (dev/prod)
- ✅ Dependencies đã được cài đặt
- ✅ Không có lỗi linter

## Nếu vẫn gặp vấn đề:

1. **Xóa cache và chạy lại:**
```bash
rm -rf node_modules
npm install
npm run dev
```

2. **Kiểm tra port 5173 có bị chiếm không:**
```bash
lsof -i :5173
```

3. **Thử port khác:**
```bash
npm run dev -- --port 3000
```

4. **Kiểm tra console trong browser:**
   - Mở DevTools (F12)
   - Xem tab Console có lỗi gì không
   - Xem tab Network có file nào load lỗi không

