# Gia Sư 10 Điểm

Nền tảng luyện bài tập online serverless - chỉ có frontend, không cần backend.

## 🎯 Tính năng

- ✅ **Serverless**: Chạy hoàn toàn trên client-side, không cần backend
- ✅ **GitHub Pages**: Host miễn phí trên GitHub Pages
- ✅ **JSON Database**: Dữ liệu bài tập lưu trong file JSON
- ✅ **Chấm điểm tự động**: Tự động chấm bài và hiển thị kết quả
- ✅ **Lời giải chi tiết**: Xem giải thích cho từng câu hỏi
- ✅ **Lịch sử làm bài**: Lưu kết quả trong localStorage
- ✅ **Responsive**: Giao diện thân thiện trên mobile và desktop

## 🚀 Cài đặt và chạy local

### Yêu cầu

- Node.js 16+ và npm/yarn

### Các bước

1. **Clone repository**
```bash
git clone <your-repo-url>
cd "Gia sư 10 điểm (2)"
```

2. **Cài đặt dependencies**
```bash
npm install
```

3. **Chạy development server**
```bash
npm run dev
```

4. **Mở trình duyệt**
```
http://localhost:5173
```

## 📦 Build cho production

```bash
npm run build
```

File build sẽ được tạo trong thư mục `dist/`.

## 🚀 Deploy lên GitHub Pages

### Bước 1: Chuẩn bị repository

1. Tạo repository mới trên GitHub (ví dụ: `Gia-su-10-diem`)
2. Push code lên repository

### Bước 2: Cập nhật base path

Trong file `vite.config.js`, cập nhật `base` path theo tên repository của bạn:

```js
export default defineConfig({
  plugins: [react()],
  base: '/Gia-su-10-diem/', // Thay bằng tên repo của bạn
})
```

Trong file `src/App.jsx`, cập nhật `basename` trong BrowserRouter:

```js
<BrowserRouter basename="/Gia-su-10-diem">
```

### Bước 3: Setup GitHub Pages

**Cách 1: Sử dụng GitHub Actions (Khuyến nghị)**

1. Tạo file `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm install
        
      - name: Build
        run: npm run build
        
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

2. Push code lên GitHub
3. Vào Settings → Pages → Source: chọn "GitHub Actions"

**Cách 2: Deploy thủ công**

1. Build project:
```bash
npm run build
```

2. Cài đặt gh-pages:
```bash
npm install --save-dev gh-pages
```

3. Thêm script vào `package.json`:
```json
{
  "scripts": {
    "deploy": "gh-pages -d dist"
  }
}
```

4. Deploy:
```bash
npm run deploy
```

5. Vào Settings → Pages → Source: chọn branch `gh-pages`

### Bước 4: Cấu hình 404.html (Quan trọng!)

Để React Router hoạt động trên GitHub Pages, cần tạo file `404.html` trong thư mục `public/`:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Gia Sư 10 Điểm</title>
    <script>
      var path = window.location.pathname;
      if (path.startsWith('/Gia-su-10-diem')) {
        window.location.href = '/Gia-su-10-diem/index.html' + window.location.search + window.location.hash;
      }
    </script>
  </head>
  <body>
    <script>
      var path = window.location.pathname;
      var redirect = '/Gia-su-10-diem/index.html' + window.location.search + window.location.hash;
      window.location.replace(redirect);
    </script>
  </body>
</html>
```

Sau khi build, copy file này vào thư mục `dist/` và rename thành `404.html`.

## 📝 Thêm bài tập mới

Để thêm bài tập mới, chỉ cần chỉnh sửa file `public/questions.json`:

```json
{
  "id": 5,
  "subject": "Toán",
  "title": "Tên bài tập",
  "type": "tracnghiem",
  "description": "Mô tả bài tập",
  "timeLimit": 15,
  "questions": [
    {
      "q": "Câu hỏi?",
      "choices": ["Lựa chọn 1", "Lựa chọn 2", "Lựa chọn 3", "Lựa chọn 4"],
      "answer": 0,
      "explain": "Giải thích đáp án"
    }
  ]
}
```

Sau đó commit và push lên GitHub. Website sẽ tự động cập nhật!

## 🎨 Cấu trúc project

```
.
├── public/
│   └── questions.json      # File chứa dữ liệu bài tập
├── src/
│   ├── components/
│   │   ├── Home.jsx        # Trang chủ
│   │   ├── SubjectList.jsx # Danh sách môn học
│   │   ├── QuizList.jsx    # Danh sách bài tập
│   │   ├── Quiz.jsx        # Trang làm bài
│   │   └── Result.jsx      # Trang kết quả
│   ├── utils/
│   │   └── storage.js      # Utility cho localStorage
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # Entry point
│   └── index.css           # Tailwind CSS
├── index.html
├── package.json
├── vite.config.js          # Vite config
└── tailwind.config.js      # Tailwind config
```

## 🔧 Công nghệ sử dụng

- **React 18**: UI framework
- **React Router**: Routing
- **Vite**: Build tool
- **Tailwind CSS**: Styling
- **LocalStorage**: Lưu lịch sử làm bài

## 📄 License

MIT

## 👨‍💻 Tác giả

Gia Sư 10 Điểm Team

---

**Lưu ý**: Nhớ cập nhật `base` path trong `vite.config.js` và `basename` trong `App.jsx` theo tên repository của bạn!

