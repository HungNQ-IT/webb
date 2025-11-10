# 📚 Hướng dẫn thêm lớp (grade) cho bài tập Vật Lý

## 🎯 Cách thêm lớp vào bài tập Vật Lý

### Bước 1: Mở file `public/questions.json`

### Bước 2: Thêm trường "grade" vào bài tập Vật Lý

Đối với bài tập Vật Lý, thêm trường `"grade": 10` (hoặc 11, 12) vào object bài tập.

---

## 📋 Cấu trúc bài tập Vật Lý có lớp:

```json
{
  "id": 5,
  "subject": "Vật Lý",
  "grade": 10,
  "title": "Tên bài tập Vật Lý 10",
  "type": "tracnghiem",
  "description": "Mô tả bài tập",
  "timeLimit": 15,
  "questions": [
    {
      "q": "Câu hỏi?",
      "choices": ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
      "answer": 0,
      "explain": "Giải thích"
    }
  ]
}
```

**Lưu ý**: 
- `"grade"` chỉ cần cho bài tập **Vật Lý**
- Giá trị: `10`, `11`, hoặc `12`
- Các môn khác (Toán, Hóa Học, ...) không cần trường `grade`

---

## 🔄 Cách hoạt động:

### Đối với Vật Lý:
1. Click vào **Vật Lý** → Hiển thị trang chọn lớp (10, 11, 12)
2. Click vào **Lớp 10** → Hiển thị danh sách bài tập Vật Lý lớp 10
3. Click vào bài tập → Làm bài

### Đối với các môn khác (Toán, Hóa Học, ...):
1. Click vào môn học → Hiển thị danh sách bài tập trực tiếp
2. Click vào bài tập → Làm bài

---

## 📝 Ví dụ: Cập nhật bài tập Vật Lý hiện tại

Bài tập Vật Lý hiện tại (id: 3) chưa có `grade`. Để thêm lớp 10:

### Trước (chưa có grade):
```json
{
  "id": 3,
  "subject": "Vật Lý",
  "title": "Chuyển động thẳng đều",
  "type": "tracnghiem",
  ...
}
```

### Sau (có grade):
```json
{
  "id": 3,
  "subject": "Vật Lý",
  "grade": 10,
  "title": "Chuyển động thẳng đều",
  "type": "tracnghiem",
  ...
}
```

Chỉ cần thêm dòng `"grade": 10,` sau `"subject": "Vật Lý",`

---

## 🎨 Ví dụ: Thêm bài tập Vật Lý mới

### Bài tập Vật Lý 10:
```json
{
  "id": 5,
  "subject": "Vật Lý",
  "grade": 10,
  "title": "Động học chất điểm",
  "type": "tracnghiem",
  "description": "Bài tập về động học",
  "timeLimit": 15,
  "questions": [
    {
      "q": "Câu hỏi về động học?",
      "choices": ["A", "B", "C", "D"],
      "answer": 0,
      "explain": "Giải thích"
    }
  ]
}
```

### Bài tập Vật Lý 11:
```json
{
  "id": 6,
  "subject": "Vật Lý",
  "grade": 11,
  "title": "Điện trường",
  "type": "tracnghiem",
  "description": "Bài tập về điện trường",
  "timeLimit": 15,
  "questions": [
    {
      "q": "Câu hỏi về điện trường?",
      "choices": ["A", "B", "C", "D"],
      "answer": 0,
      "explain": "Giải thích"
    }
  ]
}
```

### Bài tập Vật Lý 12:
```json
{
  "id": 7,
  "subject": "Vật Lý",
  "grade": 12,
  "title": "Dao động và sóng",
  "type": "tracnghiem",
  "description": "Bài tập về dao động",
  "timeLimit": 15,
  "questions": [
    {
      "q": "Câu hỏi về dao động?",
      "choices": ["A", "B", "C", "D"],
      "answer": 0,
      "explain": "Giải thích"
    }
  ]
}
```

---

## ✅ Checklist:

- [ ] Bài tập Vật Lý có trường `"grade": 10` (hoặc 11, 12)
- [ ] Bài tập các môn khác KHÔNG có trường `grade`
- [ ] ID bài tập không trùng
- [ ] Cú pháp JSON đúng

---

## 🚀 Sau khi thêm grade:

1. **Lưu file** `public/questions.json`
2. **Push lên GitHub**:
   ```bash
   git add public/questions.json
   git commit -m "Thêm lớp cho bài tập Vật Lý"
   git push origin main
   ```
3. **Đợi deploy** (1-2 phút)
4. **Kiểm tra**: 
   - Click vào **Vật Lý** → Sẽ thấy trang chọn lớp (10, 11, 12)
   - Click vào **Lớp 10** → Sẽ thấy bài tập Vật Lý lớp 10

---

## 💡 Lưu ý:

- **Chỉ Vật Lý** mới có trang chọn lớp
- **Các môn khác** (Toán, Hóa Học, ...) vẫn hoạt động bình thường (không có lớp)
- Nếu bài tập Vật Lý **không có** trường `grade`, nó sẽ **không hiển thị** trong danh sách lớp
- Đảm bảo mỗi bài tập Vật Lý đều có `grade: 10`, `grade: 11`, hoặc `grade: 12`

