# 📝 Question Templates Guide

## 📂 Template Files

Tất cả templates nằm trong thư mục `templates/`:
- `essay-question.json` - Câu hỏi tự luận
- `listening-test.json` - Bài test listening

---

## 📚 Quiz Questions Template

### Multiple Choice Question
```json
{
  "id": 1,
  "question": "Câu hỏi của bạn?",
  "type": "multiple-choice",
  "options": [
    "Đáp án A",
    "Đáp án B",
    "Đáp án C",
    "Đáp án D"
  ],
  "answer": 0,
  "explanation": "Giải thích đáp án đúng"
}
```

### True/False Question
```json
{
  "id": 2,
  "question": "Câu hỏi đúng/sai?",
  "type": "true-false",
  "answer": true,
  "explanation": "Giải thích"
}
```

### Essay Question
```json
{
  "id": 3,
  "question": "Viết một đoạn văn về...",
  "type": "essay",
  "minWords": 150,
  "maxWords": 250,
  "rubric": {
    "content": "Nội dung phải bao gồm...",
    "organization": "Cấu trúc rõ ràng...",
    "language": "Sử dụng ngữ pháp đúng..."
  }
}
```

---

## 🎧 IELTS Listening Template

### Basic Structure
```json
{
  "id": 1,
  "title": "IELTS Cambridge 14 Test 1 - Listening",
  "description": "Full listening test",
  "timeLimit": 40,
  "audioUrl": "https://drive.google.com/...",
  "sections": [...]
}
```

### Section Types

#### 1. Form Completion
```json
{
  "id": 1,
  "title": "Section 1",
  "instruction": "Complete the form below. Write NO MORE THAN TWO WORDS...",
  "questions": [
    {
      "type": "form-completion",
      "instruction": "Complete the Library Membership Application Form",
      "form": {
        "title": "Library Membership Application Form",
        "fields": [
          {
            "label": "Surname",
            "answer": "Smith"
          },
          {
            "label": "First name",
            "answer": "John"
          }
        ]
      }
    }
  ]
}
```

#### 2. Multiple Choice
```json
{
  "type": "multiple-choice",
  "instruction": "Choose the correct letter, A, B or C.",
  "items": [
    {
      "question": "What is the main topic?",
      "options": [
        "Option A",
        "Option B",
        "Option C"
      ],
      "answer": 0
    }
  ]
}
```

#### 3. Note Completion
```json
{
  "type": "note-completion",
  "instruction": "Complete the notes below. Write NO MORE THAN TWO WORDS...",
  "notes": {
    "title": "Notes on...",
    "items": [
      "The building was constructed in 1______",
      "It has 2______ floors",
      "The main material is 3______"
    ]
  },
  "answers": ["1850", "five", "brick"]
}
```

#### 4. Matching
```json
{
  "type": "matching",
  "instruction": "Match each statement with the correct person.",
  "items": [
    {
      "question": "Prefers morning classes",
      "options": [
        "Person A",
        "Person B",
        "Person C"
      ],
      "answer": 0
    }
  ]
}
```

---

## 🎯 IELTS Reading Template

```json
{
  "id": 1,
  "title": "IELTS Reading Test",
  "timeLimit": 60,
  "passages": [
    {
      "id": 1,
      "title": "Passage 1",
      "text": "Full passage text here...",
      "questions": [
        {
          "type": "multiple-choice",
          "question": "What is the main idea?",
          "options": ["A", "B", "C", "D"],
          "answer": 0
        }
      ]
    }
  ]
}
```

---

## 📝 Best Practices

### 1. Question IDs
- Sử dụng ID duy nhất cho mỗi câu hỏi
- Tăng dần theo thứ tự

### 2. Answer Format
- Multiple choice: Dùng index (0, 1, 2, 3)
- True/False: Dùng boolean (true, false)
- Text: Dùng string, lowercase

### 3. Instructions
- Rõ ràng, cụ thể
- Theo format IELTS chuẩn
- Có word limit nếu cần

### 4. Audio URLs
- Dùng Google Drive với link share
- Format: `https://drive.google.com/uc?id=FILE_ID`
- Test link trước khi deploy

### 5. Explanations
- Giải thích tại sao đáp án đúng
- Giải thích tại sao các đáp án khác sai
- Ngắn gọn, dễ hiểu

---

## 🔧 Validation

Trước khi thêm questions:

- [ ] Kiểm tra JSON syntax
- [ ] Test tất cả đáp án
- [ ] Kiểm tra audio links
- [ ] Review instructions
- [ ] Test trên nhiều devices

---

## 📚 Examples

Xem file trong `templates/` để có ví dụ đầy đủ:
- `templates/essay-question.json`
- `templates/listening-test.json`

---

## 💡 Tips

1. Copy template và sửa, đừng viết từ đầu
2. Validate JSON trước khi commit
3. Test trên local trước khi deploy
4. Backup trước khi sửa file lớn
5. Commit thường xuyên
