# Hướng dẫn thêm bài tập IELTS Listening

## Tổng quan
Bài tập IELTS Listening có 2 phần chính:
1. **Audio**: Upload lên Google Drive và thêm link **TRỰC TIẾP TRÊN TRANG WEB** (chỉ admin)
2. **Đề bài và câu hỏi**: Thêm thủ công vào file JSON

---

## Phần 1: Thêm Audio (Chỉ Admin) - TRÊN TRANG WEB

### Bước 1: Upload audio lên Google Drive

1. Đăng nhập vào Google Drive bằng **tài khoản admin**
2. Upload file audio (MP3, WAV, etc.) lên Drive
3. Click chuột phải vào file → **Chia sẻ** (Share)
4. Chọn **Bất kỳ ai có link đều có thể xem** (Anyone with the link can view)
5. Copy link chia sẻ

### Bước 2: Chuyển đổi link Google Drive

Link Google Drive có dạng:
```
https://drive.google.com/file/d/FILE_ID/view?usp=sharing
```

Chuyển thành dạng direct link:
```
https://drive.google.com/uc?export=download&id=FILE_ID
```

**Ví dụ:**
- Link gốc: `https://drive.google.com/file/d/1ABC123xyz/view?usp=sharing`
- Direct link: `https://drive.google.com/uc?export=download&id=1ABC123xyz`

### Bước 3: Thêm link trên trang web

1. **Đăng nhập** bằng tài khoản admin
2. Vào trang **IELTS → Listening**
3. Tìm bài test cần thêm audio
4. Click nút **"+"** ở góc trên bên phải của card bài test
5. Paste link Google Drive vào ô
6. Hệ thống sẽ tự động chuyển đổi sang direct link
7. Click **"Test Audio"** để kiểm tra
8. Click **"💾 Lưu Audio"**

✅ **Xong!** Audio đã được lưu vào database và sẵn sàng sử dụng.

---

## Phần 2: Thêm đề bài và câu hỏi vào JSON

### Cấu trúc JSON cho Listening

```json
{
  "id": 106,
  "subject": "IELTS",
  "category": "Listening",
  "title": "IELTS Listening Test 1 - Section 1",
  "difficulty": "medium",
  "type": "ielts-listening",
  "description": "Practice test for IELTS Listening section",
  "timeLimit": 30,
  "audioUrl": "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID",
  "sections": [
    {
      "id": 1,
      "title": "Section 1: Social Needs",
      "instruction": "Listen to the conversation and answer questions 1-10",
      "questions": [
        {
          "type": "form-completion",
          "instruction": "Complete the form below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.",
          "form": {
            "title": "Library Registration Form",
            "fields": [
              {
                "label": "Name",
                "answer": "Sarah Johnson"
              },
              {
                "label": "Address",
                "answer": "25 Park Street"
              },
              {
                "label": "Phone number",
                "answer": "0412 345 678"
              },
              {
                "label": "Membership type",
                "answer": "student"
              }
            ]
          }
        },
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
              "question": "How much does a student membership cost?",
              "options": ["$20", "$30", "$40"],
              "answer": 1
            }
          ]
        }
      ]
    }
  ]
}
```

### Các loại câu hỏi Listening

#### 1. Form Completion (Điền form)
```json
{
  "type": "form-completion",
  "instruction": "Complete the form below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.",
  "form": {
    "title": "Booking Form",
    "fields": [
      {
        "label": "Name",
        "answer": "John Smith"
      },
      {
        "label": "Date",
        "answer": "15 March"
      }
    ]
  }
}
```

#### 2. Multiple Choice (Trắc nghiệm)
```json
{
  "type": "multiple-choice",
  "instruction": "Choose the correct letter, A, B or C.",
  "items": [
    {
      "question": "What is the main topic?",
      "options": ["History", "Science", "Art"],
      "answer": 1
    }
  ]
}
```

#### 3. Note Completion (Điền ghi chú)
```json
{
  "type": "note-completion",
  "instruction": "Complete the notes below. Write ONE WORD ONLY for each answer.",
  "notes": {
    "title": "Study Tips",
    "items": [
      "Make a 1______ before studying",
      "Take regular 2______ every hour"
    ]
  },
  "answers": ["plan", "breaks"]
}
```

#### 4. Matching (Nối)
```json
{
  "type": "matching",
  "instruction": "Match each person with their opinion.",
  "items": [
    {
      "question": "Speaker A",
      "options": ["Agrees", "Disagrees", "Not sure"],
      "answer": 0
    }
  ]
}
```

#### 5. Map/Diagram Labeling (Ghi nhãn bản đồ/sơ đồ)
```json
{
  "type": "diagram-labeling",
  "instruction": "Label the diagram below. Write NO MORE THAN TWO WORDS for each answer.",
  "diagram": {
    "imageUrl": "path/to/diagram.png",
    "labels": [
      {
        "position": 1,
        "answer": "entrance"
      },
      {
        "position": 2,
        "answer": "reception desk"
      }
    ]
  }
}
```

---

## Ví dụ hoàn chỉnh

```json
{
  "id": 106,
  "subject": "IELTS",
  "category": "Listening",
  "title": "IELTS Cambridge 14 Test 1 - Listening",
  "difficulty": "medium",
  "type": "ielts-listening",
  "description": "Full IELTS Listening test with 4 sections",
  "timeLimit": 30,
  "audioUrl": "https://drive.google.com/uc?export=download&id=1ABC123xyz",
  "sections": [
    {
      "id": 1,
      "title": "Section 1: Conversation about library membership",
      "instruction": "Listen to the conversation between a student and a librarian.",
      "questions": [
        {
          "type": "form-completion",
          "instruction": "Complete the form below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.",
          "form": {
            "title": "Library Membership Form",
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
                "label": "Email",
                "answer": "sarah.j@email.com"
              }
            ]
          }
        },
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
            }
          ]
        }
      ]
    },
    {
      "id": 2,
      "title": "Section 2: Monologue about a museum tour",
      "instruction": "Listen to the tour guide describing the museum.",
      "questions": [
        {
          "type": "note-completion",
          "instruction": "Complete the notes below. Write NO MORE THAN TWO WORDS for each answer.",
          "notes": {
            "title": "Museum Tour Information",
            "items": [
              "The museum was built in 11______",
              "The main exhibition is about 12______",
              "Tours start every 13______ minutes",
              "The gift shop is located on the 14______ floor"
            ]
          },
          "answers": ["1895", "ancient Egypt", "30", "ground"]
        }
      ]
    }
  ]
}
```

---

## Lưu ý quan trọng

### 1. Audio từ Google Drive
- ✅ Chỉ admin mới có quyền thêm/sửa link audio
- ✅ Phải đặt quyền "Anyone with the link can view"
- ✅ Hệ thống tự động chuyển đổi sang direct link
- ✅ Audio được lưu trong database Supabase, không cần chỉnh sửa file JSON
- ⚠️ Không upload file audio quá lớn (khuyến nghị < 50MB)

### 2. Đề bài và câu hỏi
- ✅ Thêm thủ công vào file `public/ielts.json`
- ✅ Tuân thủ đúng cấu trúc JSON
- ✅ Kiểm tra syntax JSON trước khi lưu (dùng JSONLint.com)
- ✅ Đánh số câu hỏi liên tục (1, 2, 3...)
- ⚠️ **KHÔNG CẦN** thêm trường `audioUrl` vào JSON nữa

### 3. Kiểm tra sau khi thêm
1. Vào trang Listening, kiểm tra icon 🎧 "Có audio" hiển thị
2. Click "Làm bài" và kiểm tra audio có phát được không
3. Làm thử bài tập để đảm bảo câu hỏi hiển thị đúng
4. Kiểm tra đáp án có chính xác không

---

## Troubleshooting

### Audio không phát được
- Kiểm tra link Google Drive có đúng format không
- Kiểm tra quyền chia sẻ file trên Drive: "Anyone with the link can view"
- Thử mở link trực tiếp trên trình duyệt
- Kiểm tra trong modal "Test Audio" trước khi lưu

### Không thấy nút "+" để thêm audio
- Đảm bảo bạn đã đăng nhập bằng tài khoản admin
- Kiểm tra email admin trong file `.env` (VITE_ADMIN_EMAILS)
- Refresh trang và đăng nhập lại

### Lỗi khi lưu audio
- Kiểm tra bảng `ielts_audio` đã được tạo trong Supabase chưa
- Chạy script `supabase_setup.sql` trong SQL Editor của Supabase
- Kiểm tra policies có đúng không (admin có quyền INSERT/UPDATE)

### JSON bị lỗi
- Sử dụng JSONLint.com để kiểm tra syntax
- Kiểm tra dấu phẩy, ngoặc kép, ngoặc nhọn
- Đảm bảo không có dấu phẩy thừa ở cuối

### Câu hỏi không hiển thị
- Kiểm tra `type` của câu hỏi có đúng không
- Kiểm tra cấu trúc JSON có khớp với ví dụ không
- Xem console log trong trình duyệt để tìm lỗi

---

## Công cụ hỗ trợ

- **JSONLint**: https://jsonlint.com/ - Kiểm tra syntax JSON
- **Google Drive**: https://drive.google.com - Upload và chia sẻ audio
- **VS Code**: Editor tốt nhất để chỉnh sửa JSON

---

Chúc bạn thành công! 🎧
