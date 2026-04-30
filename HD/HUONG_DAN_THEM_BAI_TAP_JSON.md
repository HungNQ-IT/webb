# 📝 Hướng dẫn thêm bài tập vào file JSON

## Tại sao dùng JSON thay vì Supabase?

✅ **Ưu điểm:**
- Đơn giản, nhanh chóng
- Không cần setup database
- Dễ backup và chia sẻ
- Có thể edit bằng bất kỳ text editor nào

❌ **Nhược điểm:**
- Phải deploy lại mỗi khi thay đổi
- Không có tính năng real-time
- Không quản lý được submissions

## 📂 File cần chỉnh sửa

### 1. Bài tập thông thường (Toán, Lý, Hóa...)
**File:** `public/questions.json`

### 2. Đề IELTS
**File:** `public/ielts.json`

---

## 🎯 Cấu trúc bài tập

### Mẫu bài tập trắc nghiệm:

```json
{
  "id": 999,
  "subject": "Toán",
  "grade": 10,
  "title": "Tên bài tập",
  "type": "tracnghiem",
  "description": "Mô tả ngắn về bài tập",
  "timeLimit": 30,
  "difficulty": "medium",
  "questions": [
    {
      "q": "Nội dung câu hỏi?",
      "choices": [
        "Đáp án A",
        "Đáp án B",
        "Đáp án C",
        "Đáp án D"
      ],
      "answer": 0,
      "explain": "Giải thích đáp án đúng"
    }
  ]
}
```

### Mẫu bài tập tự luận:

```json
{
  "id": 1000,
  "subject": "Văn",
  "grade": 10,
  "title": "Bài tập tự luận",
  "type": "tuluan",
  "description": "Bài tập viết đoạn văn",
  "timeLimit": 45,
  "questions": [
    {
      "type": "essay",
      "q": "Viết đoạn văn về chủ đề...",
      "maxScore": 10,
      "rubric": "Tiêu chí chấm điểm:\n- Nội dung: 5 điểm\n- Ngôn ngữ: 3 điểm\n- Bố cục: 2 điểm"
    }
  ]
}
```

### Mẫu bài tập có ảnh:

```json
{
  "q": "Tính diện tích hình trong ảnh?",
  "image": "/asset/hinh-vuong.png",
  "choices": ["16 cm²", "25 cm²", "36 cm²", "49 cm²"],
  "answer": 1,
  "explain": "Cạnh = 5cm, diện tích = 5² = 25 cm²"
}
```

### Mẫu bài tập có công thức toán:

```json
{
  "q": "Tính giá trị của biểu thức:",
  "eq": "\\frac{x^2 + 2x + 1}{x + 1}",
  "choices": ["x + 1", "x - 1", "x", "2x"],
  "answer": 0,
  "explain": "Phân tích: (x+1)²/(x+1) = x+1"
}
```

---

## 📋 Các trường dữ liệu

### Thông tin bài tập (Quiz):

| Trường | Bắt buộc | Kiểu | Mô tả |
|--------|----------|------|-------|
| `id` | ✅ | number | ID duy nhất (không trùng) |
| `subject` | ✅ | string | Môn học: "Toán", "Vật Lý", "Hóa Học", "Tiếng Anh", "Văn" |
| `grade` | ✅ | number | Lớp: 6, 7, 8, 9, 10, 11, 12 |
| `title` | ✅ | string | Tiêu đề bài tập |
| `type` | ✅ | string | "tracnghiem", "tuluan", hoặc "mixed" |
| `description` | ❌ | string | Mô tả ngắn |
| `timeLimit` | ✅ | number | Thời gian làm bài (phút) |
| `difficulty` | ❌ | string | "easy", "medium", "hard" |
| `questions` | ✅ | array | Mảng các câu hỏi |

### Câu hỏi trắc nghiệm:

| Trường | Bắt buộc | Kiểu | Mô tả |
|--------|----------|------|-------|
| `q` | ✅ | string | Nội dung câu hỏi |
| `choices` | ✅ | array | Mảng 2-4 đáp án |
| `answer` | ✅ | number | Index đáp án đúng (0, 1, 2, 3) |
| `explain` | ❌ | string | Giải thích đáp án |
| `image` | ❌ | string | Link ảnh |
| `eq` | ❌ | string | Công thức LaTeX |

### Câu hỏi tự luận:

| Trường | Bắt buộc | Kiểu | Mô tả |
|--------|----------|------|-------|
| `type` | ✅ | string | "essay" |
| `q` | ✅ | string | Nội dung câu hỏi |
| `maxScore` | ✅ | number | Điểm tối đa |
| `rubric` | ❌ | string | Tiêu chí chấm điểm |
| `image` | ❌ | string | Link ảnh |

---

## 🚀 Cách thêm bài tập mới

### Bước 1: Mở file JSON

Mở file `public/questions.json` bằng text editor (VS Code, Notepad++, v.v.)

### Bước 2: Tìm ID lớn nhất

Scroll xuống cuối file, xem bài tập cuối cùng có ID là bao nhiêu.

Ví dụ: ID cuối cùng là `50`, thì bài mới sẽ có ID `51`.

### Bước 3: Thêm bài tập mới

**Thêm vào CUỐI mảng, TRƯỚC dấu `]` đóng:**

```json
[
  {
    "id": 1,
    "subject": "Toán",
    ...
  },
  {
    "id": 2,
    "subject": "Lý",
    ...
  },
  // Thêm bài mới ở đây
  {
    "id": 51,
    "subject": "Toán",
    "grade": 10,
    "title": "Bài tập mới của tôi",
    "type": "tracnghiem",
    "description": "Mô tả bài tập",
    "timeLimit": 20,
    "questions": [
      {
        "q": "Câu hỏi 1?",
        "choices": ["A", "B", "C", "D"],
        "answer": 0,
        "explain": "Giải thích"
      },
      {
        "q": "Câu hỏi 2?",
        "choices": ["A", "B", "C", "D"],
        "answer": 1
      }
    ]
  }
]
```

### Bước 4: Kiểm tra JSON hợp lệ

**Lưu ý quan trọng:**
- ✅ Dấu phẩy `,` giữa các object
- ✅ KHÔNG có dấu phẩy sau object cuối cùng
- ✅ Dấu ngoặc `[]` và `{}` phải đóng đúng
- ✅ String phải dùng dấu ngoặc kép `""`

**Kiểm tra online:**
1. Copy toàn bộ nội dung file
2. Vào https://jsonlint.com/
3. Paste và nhấn "Validate JSON"
4. Nếu có lỗi, sửa theo hướng dẫn

### Bước 5: Lưu và test

1. **Lưu file** (Ctrl + S)
2. **Reload trang web** (Ctrl + R)
3. **Xóa cache** nếu không thấy bài mới:
   - Mở DevTools (F12)
   - Right-click nút Reload
   - Chọn "Empty Cache and Hard Reload"

---

## 📝 Ví dụ hoàn chỉnh

### Ví dụ 1: Bài tập Toán lớp 10

```json
{
  "id": 101,
  "subject": "Toán",
  "grade": 10,
  "title": "Hệ phương trình bậc nhất",
  "type": "tracnghiem",
  "description": "Giải hệ phương trình bằng phương pháp thế và cộng đại số",
  "timeLimit": 25,
  "difficulty": "medium",
  "questions": [
    {
      "q": "Giải hệ phương trình: x + y = 5 và x - y = 1",
      "choices": [
        "x = 3, y = 2",
        "x = 2, y = 3",
        "x = 4, y = 1",
        "x = 1, y = 4"
      ],
      "answer": 0,
      "explain": "Cộng hai phương trình: 2x = 6 → x = 3. Thay vào: 3 + y = 5 → y = 2"
    },
    {
      "q": "Hệ phương trình nào sau đây vô nghiệm?",
      "choices": [
        "x + y = 1 và x + y = 2",
        "x + y = 1 và x - y = 1",
        "2x + y = 3 và x + y = 2",
        "x = 1 và y = 1"
      ],
      "answer": 0,
      "explain": "Hai phương trình có cùng vế trái nhưng khác vế phải → vô nghiệm"
    }
  ]
}
```

### Ví dụ 2: Bài tập Văn tự luận

```json
{
  "id": 201,
  "subject": "Văn",
  "grade": 10,
  "title": "Phân tích tác phẩm văn học",
  "type": "tuluan",
  "description": "Viết bài văn phân tích",
  "timeLimit": 60,
  "questions": [
    {
      "type": "essay",
      "q": "Phân tích hình ảnh người lính trong bài thơ 'Đồng chí' của Chính Hữu",
      "maxScore": 10,
      "rubric": "Tiêu chí chấm:\n- Mở bài (1đ): Giới thiệu tác giả, tác phẩm\n- Thân bài (7đ):\n  + Hoàn cảnh sáng tác (1đ)\n  + Phân tích hình ảnh (4đ)\n  + Nghệ thuật (2đ)\n- Kết bài (1đ): Cảm nhận\n- Trình bày (1đ)"
    }
  ]
}
```

### Ví dụ 3: Bài tập có ảnh và công thức

```json
{
  "id": 301,
  "subject": "Vật Lý",
  "grade": 10,
  "title": "Chuyển động thẳng đều",
  "type": "tracnghiem",
  "description": "Bài tập về công thức và đồ thị chuyển động",
  "timeLimit": 20,
  "questions": [
    {
      "q": "Công thức tính quãng đường trong chuyển động thẳng đều:",
      "eq": "s = v \\cdot t",
      "choices": [
        "s = v × t",
        "s = v / t",
        "s = v + t",
        "s = v - t"
      ],
      "answer": 0,
      "explain": "Quãng đường = vận tốc × thời gian"
    },
    {
      "q": "Quan sát đồ thị sau, tính vận tốc của vật:",
      "image": "/asset/do-thi-chuyen-dong.png",
      "choices": [
        "5 m/s",
        "10 m/s",
        "15 m/s",
        "20 m/s"
      ],
      "answer": 1,
      "explain": "Từ đồ thị: v = Δs/Δt = 20/2 = 10 m/s"
    }
  ]
}
```

---

## 🎨 Thêm ảnh vào câu hỏi

### Cách 1: Dùng ảnh trong thư mục public

1. Copy ảnh vào `public/asset/`
2. Đặt tên file: `hinh-1.png`, `do-thi-1.png`, v.v.
3. Trong JSON, dùng đường dẫn: `/asset/hinh-1.png`

```json
{
  "q": "Tính diện tích hình sau:",
  "image": "/asset/hinh-vuong.png",
  "choices": ["16", "25", "36", "49"],
  "answer": 1
}
```

### Cách 2: Dùng link online

```json
{
  "q": "Quan sát hình ảnh:",
  "image": "https://i.imgur.com/abc123.png",
  "choices": ["A", "B", "C", "D"],
  "answer": 0
}
```

---

## 📐 Thêm công thức toán (LaTeX)

Dùng trường `eq` với cú pháp LaTeX:

```json
{
  "q": "Tính giá trị của biểu thức:",
  "eq": "\\frac{x^2 - 4}{x - 2}",
  "choices": ["x + 2", "x - 2", "x", "2"],
  "answer": 0
}
```

**Một số công thức LaTeX thường dùng:**

| Công thức | LaTeX |
|-----------|-------|
| Phân số | `\\frac{a}{b}` |
| Căn bậc hai | `\\sqrt{x}` |
| Lũy thừa | `x^2` hoặc `x^{10}` |
| Chỉ số dưới | `x_1` hoặc `x_{10}` |
| Tích phân | `\\int_{a}^{b} f(x) dx` |
| Tổng | `\\sum_{i=1}^{n} x_i` |
| Giới hạn | `\\lim_{x \\to 0} f(x)` |

---

## ⚠️ Lỗi thường gặp

### Lỗi 1: JSON không hợp lệ

**Triệu chứng:** Trang web không load được bài tập

**Nguyên nhân:**
- Thiếu dấu phẩy
- Dấu ngoặc không đóng đúng
- Dùng dấu nháy đơn `'` thay vì `"`

**Giải pháp:** Validate JSON tại https://jsonlint.com/

### Lỗi 2: ID bị trùng

**Triệu chứng:** Chỉ hiển thị 1 trong 2 bài có cùng ID

**Giải pháp:** Đảm bảo mỗi bài có ID duy nhất

### Lỗi 3: Không thấy bài mới sau khi thêm

**Giải pháp:**
1. Hard reload: Ctrl + Shift + R
2. Xóa cache: DevTools → Application → Clear storage
3. Kiểm tra file đã lưu chưa

### Lỗi 4: Ảnh không hiển thị

**Giải pháp:**
- Kiểm tra đường dẫn ảnh đúng chưa
- Đảm bảo file ảnh tồn tại trong `public/asset/`
- Thử mở trực tiếp: `http://localhost:5173/asset/ten-anh.png`

---

## 🔄 So sánh JSON vs Supabase

| Tính năng | JSON | Supabase |
|-----------|------|----------|
| Dễ setup | ✅ Rất dễ | ❌ Cần config |
| Thêm bài nhanh | ✅ Edit file | ❌ Qua UI/API |
| Real-time | ❌ Không | ✅ Có |
| Quản lý submissions | ❌ Không | ✅ Có |
| Backup | ✅ Copy file | ❌ Export DB |
| Phù hợp cho | Ít bài, test | Nhiều bài, production |

---

## 💡 Tips

1. **Đặt tên ID có quy luật:**
   - Toán lớp 10: 1001-1099
   - Lý lớp 10: 2001-2099
   - Hóa lớp 10: 3001-3099

2. **Backup trước khi sửa:**
   - Copy file `questions.json` thành `questions.json.backup`

3. **Test từng bài:**
   - Thêm 1 bài → Test → OK → Thêm tiếp

4. **Dùng tool hỗ trợ:**
   - VS Code có extension "JSON Tools"
   - Tự động format: Shift + Alt + F

---

## 📚 Tài liệu tham khảo

- [Cú pháp JSON](https://www.json.org/json-vi.html)
- [LaTeX Math](https://katex.org/docs/supported.html)
- [Validate JSON](https://jsonlint.com/)

---

Chúc bạn thêm bài tập thành công! 🎉
