# 🎓 Gia Sư 10 Điểm

Nền tảng luyện thi online với Quiz, IELTS Tests, và AI Grading.

## ✨ Tính năng

### 📚 Quiz System
- ✅ Multiple choice, True/False, Essay questions
- ✅ Timer đếm ngược
- ✅ Chấm điểm tự động
- ✅ Lời giải chi tiết
- ✅ Lịch sử làm bài

### 🎧 IELTS Tests
- ✅ Reading & Listening tests
- ✅ Audio player với Google Drive
- ✅ Multiple question types (Form completion, Multiple choice, Matching, Note completion)
- ✅ Real-time scoring

### 🤖 AI Grading
- ✅ Tự động chấm bài tự luận
- ✅ Phân tích nội dung, ngữ pháp, từ vựng
- ✅ Feedback chi tiết

### 📄 Document Library
- ✅ Upload & manage PDF documents
- ✅ Categorize by subject & grade
- ✅ Search & filter

### 👥 User Management
- ✅ Authentication với Supabase
- ✅ User profiles & progress tracking
- ✅ Admin dashboard với real-time updates

### 🌙 Dark Theme
- ✅ Toggle light/dark mode
- ✅ High contrast for accessibility
- ✅ Persistent preference

---

## 🚀 Quick Start

### 1. Cài đặt
```bash
npm install
```

### 2. Cấu hình
```bash
cp .env.example .env
```

Điền thông tin Supabase vào `.env`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Setup Database
```bash
# Copy nội dung từ database/supabase_setup.sql
# Paste vào Supabase SQL Editor và Run
```

### 4. Chạy
```bash
npm run dev
```

Mở: **http://localhost:5173**

---

## 📦 Build & Deploy

### Build
```bash
npm run build
```

### Deploy lên GitHub Pages
```bash
git push origin main
```

GitHub Actions sẽ tự động deploy.

**Lưu ý**: Cập nhật base path trong 3 file:
- `vite.config.js`
- `src/App.jsx`
- `public/404.html`

---

## 📚 Documentation

Xem thư mục `docs/` để biết thêm chi tiết:

- **[SETUP.md](docs/SETUP.md)** - Hướng dẫn cài đặt & deploy
- **[FEATURES.md](docs/FEATURES.md)** - Danh sách tính năng
- **[SUPABASE.md](docs/SUPABASE.md)** - Hướng dẫn database
- **[TEMPLATES.md](docs/TEMPLATES.md)** - Mẫu câu hỏi

---

## 📁 Cấu trúc Project

```
.
├── docs/                   # Documentation
├── database/               # SQL setup files
├── templates/              # Question templates
├── public/                 # Static assets
│   ├── questions.json      # Quiz data
│   └── ielts.json         # IELTS tests data
├── src/
│   ├── components/        # React components
│   ├── context/           # React context
│   ├── utils/             # Utilities
│   ├── App.jsx
│   └── main.jsx
├── .env.example           # Environment template
├── package.json
├── vite.config.js
└── tailwind.config.js
```

---

## 🔧 Tech Stack

- **Frontend**: React 18, React Router v6
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Auth, Database, Storage)
- **Build**: Vite
- **Deploy**: GitHub Pages
- **AI**: OpenAI API (for grading)

---

## 📝 Thêm Nội Dung Mới

### Thêm Quiz
Chỉnh sửa `public/questions.json`:
```json
{
  "id": 1,
  "subject": "Toán",
  "title": "Bài tập mới",
  "questions": [...]
}
```

### Thêm IELTS Test
Chỉnh sửa `public/ielts.json` hoặc dùng Admin Dashboard.

### Thêm Audio
Upload lên Google Drive và thêm link vào database qua Admin Dashboard.

Xem `docs/TEMPLATES.md` để biết format chi tiết.

---

## 🐛 Troubleshooting

### Màn hình trắng?
- Kiểm tra console (F12) xem lỗi
- Kiểm tra base path có đúng không
- Chạy `npm run dev` thay vì mở file HTML trực tiếp

### Không load được data?
- Kiểm tra file JSON trong `public/`
- Kiểm tra Supabase config trong `.env`
- Xem Network tab (F12)

### Lỗi 404 trên GitHub Pages?
- Kiểm tra file `public/404.html`
- Kiểm tra base path trong 3 file

Xem thêm trong `docs/SETUP.md`

---

## 📄 License

MIT

## 👨‍💻 Author

Gia Sư 10 Điểm Team

---

## 🔗 Links

- **Live Demo**: [Your GitHub Pages URL]
- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues]

---

**⚡ Quick Links:**
- [Setup Guide](docs/SETUP.md)
- [Features](docs/FEATURES.md)
- [Database Guide](docs/SUPABASE.md)
- [Templates](docs/TEMPLATES.md)
