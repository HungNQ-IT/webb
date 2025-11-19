# 📝 CÁC DẠNG CÂU HỎI LISTENING - TEMPLATE

## Tổng quan

Hệ thống hỗ trợ **4 dạng câu hỏi** chính cho IELTS Listening:

1. ✅ **Form Completion** - Điền form
2. ✅ **Multiple Choice** - Chọn đáp án A/B/C
3. ✅ **Note Completion** - Hoàn thành ghi chú
4. ✅ **Matching** - Nối đáp án

---

## 1. FORM COMPLETION (Điền Form)

### Mô tả
Học viên điền thông tin vào các ô trong form (tên, số điện thoại, địa chỉ, v.v.)

### Template

```json
{
  "type": "form-completion",
  "instruction": "Complete the form below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.",
  "form": {
    "title": "Library Membership Application Form",
    "fields": [
      {
        "label": "Full name",
        "answer": "Sarah Johnson"
      },
      {
        "label": "Student ID",
        "answer": "S12345"
      },
      {
        "label": "Course",
        "answer": "Business Studies"
      },
      {
        "label": "Email address",
        "answer": "sarah.j@email.com"
      },
      {
        "label": "Phone number",
        "answer": "0412 345 678"
      }
    ]
  }
}
```

### Lưu ý
- `label`: Tên trường (hiển thị bên trái)
- `answer`: Đáp án đúng (không phân biệt hoa thường)
- Có thể thêm nhiều fields tùy ý

---

## 2. MULTIPLE CHOICE (Chọn đáp án)

### Mô tả
Học viên chọn 1 trong 3 đáp án A, B, C cho mỗi câu hỏi

### Template

```json
{
  "type": "multiple-choice",
  "instruction": "Choose the correct letter, A, B or C.",
  "items": [
    {
      "question": "What time does the library close on weekdays?",
      "options": ["5:00 PM", "6:00 PM", "7:00 PM"],
      "answer": 2
    },
    {
      "question": "How many books can students borrow at once?",
      "options": ["5 books", "10 books", "15 books"],
      "answer": 1
    },
    {
      "question": "How long can students keep the books?",
      "options": ["1 week", "2 weeks", "3 weeks"],
      "answer": 1
    }
  ]
}
```

### Lưu ý
- `question`: Câu hỏi
- `options`: Mảng 3 đáp án (A, B, C)
- `answer`: Index của đáp án đúng (0 = A, 1 = B, 2 = C)
- Có thể thêm nhiều items (câu hỏi)

---

## 3. NOTE COMPLETION (Hoàn thành ghi chú)

### Mô tả
Học viên điền từ vào chỗ trống trong ghi chú (có số thứ tự câu hỏi)

### Template

```json
{
  "type": "note-completion",
  "instruction": "Complete the notes below. Write NO MORE THAN TWO WORDS for each answer.",
  "notes": {
    "title": "City Museum Tour Information",
    "items": [
      "The museum was built in 11______",
      "The main exhibition is about 12______",
      "Tours start every 13______ minutes",
      "The gift shop is located on the 14______ floor",
      "Photography is allowed in the 15______ area only"
    ]
  },
  "answers": [
    "1895",
    "ancient Egypt",
    "30",
    "ground",
    "garden"
  ]
}
```

### Lưu ý
- `items`: Mảng các câu ghi chú (dùng `______` hoặc `11______` để đánh dấu chỗ trống)
- `answers`: Mảng đáp án theo thứ tự
- Hệ thống tự động parse số câu hỏi từ text (11, 12, 13...)

---

## 4. MATCHING (Nối đáp án)

### Mô tả
Học viên nối mỗi item với đáp án phù hợp từ danh sách cho sẵn

### Template

```json
{
  "type": "matching",
  "instruction": "Match each room with its description. Choose the correct letter, A-E.",
  "items": [
    {
      "question": "Room 1",
      "options": [
        "Contains paintings from the 18th century",
        "Displays modern sculptures",
        "Shows ancient pottery",
        "Features historical documents",
        "Exhibits natural history specimens"
      ],
      "answer": 0
    },
    {
      "question": "Room 2",
      "options": [
        "Contains paintings from the 18th century",
        "Displays modern sculptures",
        "Shows ancient pottery",
        "Features historical documents",
        "Exhibits natural history specimens"
      ],
      "answer": 2
    },
    {
      "question": "Room 3",
      "options": [
        "Contains paintings from the 18th century",
        "Displays modern sculptures",
        "Shows ancient pottery",
        "Features historical documents",
        "Exhibits natural history specimens"
      ],
      "answer": 4
    }
  ]
}
```

### Lưu ý
- `question`: Item cần nối (Room 1, Room 2...)
- `options`: Danh sách đáp án (A, B, C, D, E...)
- `answer`: Index của đáp án đúng (0 = A, 1 = B, 2 = C...)
- Tất cả items dùng chung 1 danh sách options

---

## CẤU TRÚC BÀI LISTENING HOÀN CHỈNH

```json
{
  "id": 107,
  "subject": "IELTS",
  "category": "Listening",
  "title": "IELTS Cambridge 15 Test 1 - Listening",
  "difficulty": "medium",
  "type": "ielts-listening",
  "description": "Full IELTS Listening test with 4 sections",
  "timeLimit": 30,
  "audioUrl": "https://drive.google.com/file/d/FILE_ID/preview",
  "sections": [
    {
      "id": 1,
      "title": "Section 1: Conversation",
      "instruction": "Listen to the conversation. Answer questions 1-10.",
      "questions": [
        {
          "type": "form-completion",
          "instruction": "Complete the form below.",
          "form": {
            "title": "Application Form",
            "fields": [
              { "label": "Name", "answer": "John Smith" },
              { "label": "Phone", "answer": "0412345678" }
            ]
          }
        },
        {
          "type": "multiple-choice",
          "instruction": "Choose the correct letter.",
          "items": [
            {
              "question": "What is the main topic?",
              "options": ["Option A", "Option B", "Option C"],
              "answer": 1
            }
          ]
        }
      ]
    },
    {
      "id": 2,
      "title": "Section 2: Monologue",
      "instruction": "Listen to the talk. Answer questions 11-20.",
      "questions": [
        {
          "type": "note-completion",
          "instruction": "Complete the notes below.",
          "notes": {
            "title": "Notes",
            "items": [
              "Built in 11______",
              "Main topic: 12______"
            ]
          },
          "answers": ["1895", "technology"]
        }
      ]
    },
    {
      "id": 3,
      "title": "Section 3: Discussion",
      "instruction": "Listen to the discussion. Answer questions 21-30.",
      "questions": [
        {
          "type": "matching",
          "instruction": "Match each item.",
          "items": [
            {
              "question": "Item 1",
              "options": ["Description A", "Description B", "Description C"],
              "answer": 0
            }
          ]
        }
      ]
    },
    {
      "id": 4,
      "title": "Section 4: Lecture",
      "instruction": "Listen to the lecture. Answer questions 31-40.",
      "questions": [
        {
          "type": "note-completion",
          "instruction": "Complete the notes below.",
          "notes": {
            "title": "Lecture Notes",
            "items": [
              "Definition: 31______",
              "Key point: 32______"
            ]
          },
          "answers": ["education", "technology"]
        }
      ]
    }
  ]
}
```

---

## CÁCH SỬ DỤNG

### Bước 1: Copy template
Chọn dạng câu hỏi phù hợp và copy template

### Bước 2: Sửa nội dung
- Đổi câu hỏi
- Đổi đáp án
- Đổi instruction nếu cần

### Bước 3: Paste vào JSON
Mở `public/ielts.json` → Tìm section → Paste vào mảng `questions`

### Bước 4: Test
Clear cache và test bài listening

---

## VÍ DỤ KẾT HỢP NHIỀU DẠNG

Một section có thể có nhiều dạng câu hỏi:

```json
{
  "id": 1,
  "title": "Section 1",
  "instruction": "Answer questions 1-10.",
  "questions": [
    {
      "type": "form-completion",
      "instruction": "Complete the form (Questions 1-5).",
      "form": {
        "title": "Registration Form",
        "fields": [
          { "label": "Name", "answer": "John" },
          { "label": "Age", "answer": "25" }
        ]
      }
    },
    {
      "type": "multiple-choice",
      "instruction": "Choose the correct answer (Questions 6-10).",
      "items": [
        {
          "question": "Question 6: What is...?",
          "options": ["A", "B", "C"],
          "answer": 0
        }
      ]
    }
  ]
}
```

---

## TIPS

✅ **Đáp án không phân biệt hoa thường** (Sarah = sarah = SARAH)

✅ **Có thể dùng nhiều dạng trong 1 section**

✅ **Số câu hỏi tùy ý** (không bắt buộc 10 câu/section)

✅ **Instruction có thể tùy chỉnh** theo đề bài

✅ **Xem file `MAU_LISTENING.json`** để có ví dụ đầy đủ

---

**Tạo bởi**: Kiro AI Assistant
**Ngày**: 2025-11-19
