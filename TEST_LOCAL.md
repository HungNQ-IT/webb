# 🔧 Cách test local ĐÚNG CÁCH

## ❌ VẤN ĐỀ: Không thể mở file HTML trực tiếp

**KHÔNG THỂ** double-click vào file `index.html` và mong nó chạy được!

### Tại sao?
1. File HTML có đường dẫn tuyệt đối: `/webb/assets/...`
2. Browser cần web server để load các file này
3. React/Vite cần server để hoạt động đúng

## ✅ GIẢI PHÁP: Dùng web server

### Cách 1: Development Server (Khuyến nghị)

```bash
npm run dev
```

Sau đó mở: `http://localhost:5173`

**Ưu điểm**: 
- Hot reload (tự động refresh khi sửa code)
- Nhanh nhất
- Dễ debug

### Cách 2: Preview Production Build

```bash
# Build production
npm run build

# Preview với server
npm run preview
```

Sau đó mở: `http://localhost:4173`

**Ưu điểm**:
- Test giống như trên GitHub Pages
- Kiểm tra build có đúng không

### Cách 3: Dùng Python Simple Server

```bash
# Build production
npm run build

# Vào thư mục dist
cd dist

# Chạy Python server
python3 -m http.server 8000
```

Sau đó mở: `http://localhost:8000/webb/`

### Cách 4: Dùng npx serve

```bash
# Build production
npm run build

# Serve dist folder
npx serve dist -p 8000
```

Sau đó mở: `http://localhost:8000/webb/`

## 🚀 QUY TRÌNH ĐÚNG:

### Khi đang phát triển:
```bash
npm run dev
```
→ Mở `http://localhost:5173`

### Khi test production build:
```bash
npm run build
npm run preview
```
→ Mở `http://localhost:4173`

### Khi deploy lên GitHub:
```bash
git add .
git commit -m "Update"
git push origin main
```
→ GitHub Actions sẽ tự động build và deploy
→ Mở `https://hungnq-it.github.io/webb/`

## ⚠️ LƯU Ý:

1. **KHÔNG BAO GIỜ** mở file HTML trực tiếp (double-click)
2. **LUÔN LUÔN** dùng web server
3. Development: dùng `npm run dev`
4. Test production: dùng `npm run preview`
5. Deploy: push lên GitHub

## 🐛 Nếu vẫn thấy màn hình trắng:

### Kiểm tra 1: Server có chạy không?
```bash
# Xem port có đang được dùng không
lsof -i :5173
lsof -i :4173
```

### Kiểm tra 2: Console có lỗi không?
- Mở DevTools (F12)
- Xem tab Console
- Xem có lỗi gì không

### Kiểm tra 3: Network có load được file không?
- Mở DevTools (F12)
- Xem tab Network
- Xem các file .js, .css có load được không

### Kiểm tra 4: Build có thành công không?
```bash
npm run build
ls -la dist/
```

Nếu thấy file `dist/index.html` và `dist/assets/` thì build thành công.

## 📝 TÓM TẮT:

| Tình huống | Command | URL |
|------------|---------|-----|
| Development | `npm run dev` | `http://localhost:5173` |
| Test Production | `npm run build && npm run preview` | `http://localhost:4173` |
| Deploy GitHub | `git push origin main` | `https://hungnq-it.github.io/webb/` |
| ❌ KHÔNG LÀM | Double-click index.html | ❌ Không hoạt động |

---

**NHỚ**: Luôn dùng web server, không mở file HTML trực tiếp!

