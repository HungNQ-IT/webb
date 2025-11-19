# 📝 Hướng dẫn thêm bài tập lên web

## 🎯 Cách thêm bài tập mới (3 bước đơn giản)

### Bước 1: Mở file questions.json

Mở file: `public/questions.json`

File này chứa tất cả các bài tập. Bạn chỉ cần thêm bài tập mới vào đây.

---

### Bước 2: Thêm bài tập mới

Copy cấu trúc bài tập mẫu và sửa thông tin:

```json
{
  "id": 5,
  "subject": "Toán",
  "title": "Tên bài tập của bạn",
  "type": "tracnghiem",
  "description": "Mô tả bài tập",
  "timeLimit": 15,
  "questions": [
    {
      "q": "Câu hỏi 1?",
      "choices": ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
      "answer": 0,
      "explain": "Giải thích tại sao đáp án đúng"
    },
    {
      "q": "Câu hỏi 2?",
      "choices": ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
      "answer": 1,
      "explain": "Giải thích tại sao đáp án đúng"
    }
  ]
}
```

#### Giải thích các trường:

- **id**: Số thứ tự bài tập (phải khác với các bài tập khác)
- **subject**: Môn học (ví dụ: "Toán", "Vật Lý", "Hóa Học")
- **title**: Tên bài tập
- **type**: Loại bài tập (luôn là "tracnghiem")
- **description**: Mô tả ngắn về bài tập
- **timeLimit**: Thời gian làm bài (phút), có thể bỏ qua nếu không giới hạn
- **questions**: Mảng các câu hỏi
  - **q**: Nội dung câu hỏi
  - **choices**: Mảng 4 đáp án
  - **answer**: Index của đáp án đúng (0, 1, 2, hoặc 3)
  - **explain**: Giải thích đáp án

---

### Bước 3: Push lên GitHub

Sau khi thêm bài tập, làm theo các bước sau:

```bash
# 1. Kiểm tra file đã sửa
git status

# 2. Thêm file vào staging
git add public/questions.json

# 3. Commit (ghi chú về bài tập mới)
git commit -m "Thêm bài tập mới: [Tên bài tập]"

# 4. Push lên GitHub
git push origin main
```

---

## 📋 Ví dụ cụ thể

### Ví dụ: Thêm bài tập môn Sinh Học

1. **Mở file** `public/questions.json`

2. **Thêm bài tập mới vào cuối file** (trước dấu `]` cuối cùng):

```json
,
{
  "id": 5,
  "subject": "Sinh Học",
  "title": "Tế bào và cấu trúc tế bào",
  "type": "tracnghiem",
  "description": "Bài tập về cấu trúc và chức năng của tế bào",
  "timeLimit": 10,
  "questions": [
    {
      "q": "Tế bào nào sau đây không có nhân?",
      "choices": ["Tế bào thực vật", "Tế bào động vật", "Tế bào vi khuẩn", "Tế bào nấm"],
      "answer": 2,
      "explain": "Tế bào vi khuẩn là tế bào nhân sơ, không có nhân thật sự"
    },
    {
      "q": "Bào quan nào có chức năng sản xuất năng lượng?",
      "choices": ["Lục lạp", "Ty thể", "Nhân", "Ribosome"],
      "answer": 1,
      "explain": "Ty thể là nơi sản xuất năng lượng ATP cho tế bào"
    },
    {
      "q": "Màng tế bào được cấu tạo chủ yếu bởi?",
      "choices": ["Protein", "Lipid", "Carbohydrate", "Nucleic acid"],
      "answer": 1,
      "explain": "Màng tế bào được cấu tạo chủ yếu bởi phospholipid và protein"
    }
  ]
}
```

3. **Lưu file**

4. **Push lên GitHub:**
```bash
git add public/questions.json
git commit -m "Thêm bài tập Sinh Học: Tế bào và cấu trúc tế bào"
git push origin main
```

5. **Đợi GitHub Actions deploy** (1-2 phút)

6. **Kiểm tra website:** `https://hungnq-it.github.io/webb/`

---

## ✅ Checklist trước khi push

- [ ] File `questions.json` có cú pháp JSON đúng (không có lỗi)
- [ ] ID bài tập mới không trùng với bài tập cũ
- [ ] Mỗi câu hỏi có đủ 4 đáp án
- [ ] Answer là số từ 0-3 (index của đáp án đúng)
- [ ] Đã test local bằng `npm run dev` (nếu muốn)

---

## 🎨 Mẹo và Lưu ý

### 1. ID bài tập
- Phải là số duy nhất
- Nếu không chắc, dùng số lớn (ví dụ: 100, 101, 102...)
- Hoặc xem ID lớn nhất hiện tại và +1

### 2. Subject (Môn học)
- Có thể dùng môn học mới
- Ví dụ: "Sinh Học", "Lịch Sử", "Địa Lý", "Tiếng Anh"

### 3. Câu hỏi
- Có thể thêm bao nhiêu câu hỏi cũng được
- Mỗi câu hỏi phải có đủ 4 đáp án
- Answer phải là index (0, 1, 2, hoặc 3)

### 4. Giải thích
- Nên viết giải thích rõ ràng
- Giúp học sinh hiểu tại sao đáp án đúng

---

## 🔄 Quy trình tự động

Sau khi push lên GitHub:

1. **GitHub Actions tự động chạy**
   - Build project
   - Deploy lên GitHub Pages

2. **Đợi 1-2 phút**
   - Xem tiến trình trong tab Actions

3. **Website tự động cập nhật**
   - Bài tập mới xuất hiện trên website
   - Không cần làm gì thêm

---

## 🐛 Xử lý lỗi

### Lỗi: JSON syntax error

**Nguyên nhân**: Cú pháp JSON sai (thiếu dấu phẩy, dấu ngoặc, etc.)

**Giải pháp**:
1. Dùng công cụ validate JSON online
2. Kiểm tra dấu phẩy giữa các object
3. Kiểm tra dấu ngoặc đóng mở

### Lỗi: Website không cập nhật

**Nguyên nhân**: GitHub Actions chưa chạy hoặc có lỗi

**Giải pháp**:
1. Kiểm tra tab Actions trên GitHub
2. Xem có lỗi gì không
3. Thử push lại

### Lỗi: Bài tập không hiển thị

**Nguyên nhân**: ID trùng hoặc cấu trúc JSON sai

**Giải pháp**:
1. Kiểm tra ID có trùng không
2. Kiểm tra cấu trúc JSON đúng không
3. Test local bằng `npm run dev`

---

## 📝 Tóm tắt

**3 bước đơn giản:**

1. **Sửa file** `public/questions.json` - Thêm bài tập mới
2. **Commit**: `git add public/questions.json && git commit -m "Thêm bài tập mới"`
3. **Push**: `git push origin main`

**Xong!** Website sẽ tự động cập nhật sau 1-2 phút.

---

**Lưu ý**: 
- Luôn kiểm tra cú pháp JSON trước khi push
- ID bài tập phải duy nhất
- Mỗi câu hỏi phải có đủ 4 đáp án
- Answer phải là số từ 0-3

