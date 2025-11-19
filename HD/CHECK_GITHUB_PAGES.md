# ✅ Checklist kiểm tra GitHub Pages

## 🔍 Kiểm tra trước khi deploy:

### 1. Base Path Configuration

Kiểm tra các file sau có base path đúng không:

#### ✅ vite.config.js
```js
base: mode === 'production' ? '/webb/' : '/',
```
**Phải là**: `/webb/` (có dấu `/` ở cuối)

#### ✅ public/404.html
```js
var BASE_PATH = '/webb';
```
**Phải là**: `/webb` (KHÔNG có dấu `/` ở cuối trong BASE_PATH)

#### ✅ src/App.jsx
```js
const basePath = import.meta.env.BASE_URL || '/'
const basename = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath || '/'
```
**Tự động lấy từ vite.config.js** - không cần sửa thủ công

### 2. Build và kiểm tra dist/

```bash
npm run build
```

Sau khi build, kiểm tra:

#### ✅ dist/index.html
- Phải có path `/webb/` trong các link assets
- Ví dụ: `src="/webb/assets/index-xxx.js"`

#### ✅ dist/404.html
- File phải tồn tại
- BASE_PATH phải là `/webb`

#### ✅ dist/questions.json
- File phải tồn tại
- Nằm ở root của dist/

### 3. GitHub Repository Settings

#### ✅ Repository Name
- Tên repo: `webb`
- URL sẽ là: `https://hungnq-it.github.io/webb/`

#### ✅ GitHub Pages Settings
1. Vào: `https://github.com/HungNQ-IT/webb/settings/pages`
2. **Source**: Phải chọn **"GitHub Actions"**
3. **KHÔNG** chọn "Deploy from a branch"

#### ✅ GitHub Actions
1. Vào: `https://github.com/HungNQ-IT/webb/actions`
2. Workflow phải chạy thành công
3. Xem log nếu có lỗi

### 4. Sau khi deploy

#### ✅ Kiểm tra URL
- URL chính: `https://hungnq-it.github.io/webb/`
- Phải redirect đúng và hiển thị trang chủ

#### ✅ Kiểm tra Routing
- `/webb/subjects` - Danh sách môn học
- `/webb/subject/Toán` - Danh sách bài tập
- `/webb/quiz/1` - Làm bài
- `/webb/result/1` - Xem kết quả

#### ✅ Kiểm tra Console (F12)
- Không có lỗi 404
- Không có lỗi load assets
- Không có lỗi JavaScript

## 🐛 Nếu vẫn không hoạt động:

### Lỗi: Trang trắng hoặc 404

**Kiểm tra**:
1. GitHub Pages có được bật không? (Settings → Pages)
2. Source có phải "GitHub Actions" không?
3. Workflow có chạy thành công không?
4. Base path có đúng không?

**Giải pháp**:
```bash
# 1. Kiểm tra lại base path
grep -r "Gia-su-10-diem" . --exclude-dir=node_modules --exclude-dir=dist

# 2. Rebuild
npm run build

# 3. Kiểm tra dist/
ls -la dist/

# 4. Commit và push lại
git add .
git commit -m "Fix base path"
git push origin main
```

### Lỗi: Assets không load (404 cho .js, .css)

**Nguyên nhân**: Base path không đúng

**Giải pháp**:
1. Kiểm tra `vite.config.js`: base phải là `/webb/`
2. Rebuild: `npm run build`
3. Kiểm tra `dist/index.html`: các link phải có `/webb/`
4. Push lại code

### Lỗi: Routing không hoạt động (trang con bị 404)

**Nguyên nhân**: File 404.html không hoạt động hoặc BASE_PATH sai

**Giải pháp**:
1. Kiểm tra `public/404.html`: BASE_PATH phải là `/webb`
2. Kiểm tra `dist/404.html` có tồn tại không
3. Clear cache trình duyệt
4. Thử truy cập trực tiếp: `https://hungnq-it.github.io/webb/index.html`

## 📝 Commands hữu ích:

```bash
# Build local
npm run build

# Xem file đã build
ls -la dist/

# Kiểm tra base path trong các file
grep -r "/webb" vite.config.js public/404.html

# Test local với production build
npm run build
npm run preview
```

## 🎯 Kết quả mong đợi:

Sau khi deploy thành công:
- ✅ Truy cập `https://hungnq-it.github.io/webb/` → Hiển thị trang chủ
- ✅ Click vào "Bắt đầu ngay" → Chuyển đến `/webb/subjects`
- ✅ Chọn môn học → Chuyển đến `/webb/subject/Toán`
- ✅ Chọn bài tập → Chuyển đến `/webb/quiz/1`
- ✅ Làm bài và nộp → Chuyển đến `/webb/result/1`
- ✅ Tất cả đều hoạt động không lỗi

---

**Nếu tất cả các bước trên đều đúng mà vẫn không hoạt động, hãy:**
1. Chụp screenshot lỗi
2. Copy log từ GitHub Actions
3. Copy lỗi từ browser console (F12)
4. Gửi cho tôi để kiểm tra thêm

