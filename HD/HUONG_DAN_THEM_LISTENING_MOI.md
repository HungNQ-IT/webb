# 🎧 HƯỚNG DẪN THÊM BÀI LISTENING MỚI

## Tổng quan

Hệ thống Listening có 2 phần:
1. **Audio (Google Drive)** → Admin thêm qua web interface
2. **Đề bài + Câu hỏi** → Thêm thủ công vào file JSON

---

## BƯỚC 1: Thêm đề bài vào JSON

### 1.1. Mở file `public/ielts.json`

### 1.2. Copy template từ `MAU_LISTENING.json` hoặc dùng mẫu dưới:

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
  "sections": [
    {
      "id": 1,
      "title": "Section 1: Conversation",
      "instruction": "Listen to the conversation. Answer questions 1-10.",
      "questions": [
        {
          "type": "form-completion",
          "instruction": "Complete the form below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.",
          "form": {
            "title": "Application Form",
            "fields": [
              {
                "label": "Name",
                "answer": "John Smith"
              },
              {
                "label": "Phone",
                "answer": "0412345678"
              }
            ]
          }
        }
      ]
    },
    {
      "id": 2,
      "title": "Section 2: Monologue",
      "instruction": "Listen to the talk. Answer questions 11-20.",
      "questions": [
        {
          "type": "multiple-choice",
          "instruction": "Choose the correct letter, A, B or C.",
          "items": [
            {
              "question": "What is the main topic?",
              "options": ["Option A", "Option B", "Option C"],
              "answer": 0
            }
          ]
        }
      ]
    },
    {
      "id": 3,
      "title": "Section 3: Discussion",
      "instruction": "Listen to the discussion. Answer questions 21-30.",
      "questions": [
        {
          "type": "note-completion",
          "instruction": "Complete the notes below. Write ONE WORD ONLY for each answer.",
          "notes": {
            "title": "Notes",
            "items": [
              "The topic is about 21______",
              "Main point: 22______"
            ]
          },
          "answers": [
            "education",
            "technology"
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
          "type": "matching",
          "instruction": "Match each item with its description.",
          "items": [
            {
              "question": "Item 1",
              "options": ["Description A", "Description B", "Description C"],
              "answer": 0
            }
          ]
        }
      ]
    }
  ]
}
```

### 1.3. Lưu ý quan trọng

✅ **ID**: Phải unique (107, 108, 109...)
✅ **type**: Phải là `"ielts-listening"`
✅ **category**: Phải là `"Listening"`
✅ **sections**: Phải là array `[]`, không phải số
✅ **Không cần thêm audioUrl** trong JSON (sẽ thêm qua Admin)

### 1.4. Các dạng câu hỏi hỗ trợ

#### A. Form Completion
```json
{
  "type": "form-completion",
  "instruction": "Complete the form below.",
  "form": {
    "title": "Registration Form",
    "fields": [
      {
        "label": "Full name",
        "answer": "Sarah Johnson"
      }
    ]
  }
}
```

#### B. Multiple Choice
```json
{
  "type": "multiple-choice",
  "instruction": "Choose the correct letter, A, B or C.",
  "items": [
    {
      "question": "What time does it start?",
      "options": ["9:00 AM", "10:00 AM", "11:00 AM"],
      "answer": 1
    }
  ]
}
```

#### C. Note Completion
```json
{
  "type": "note-completion",
  "instruction": "Complete the notes below.",
  "notes": {
    "title": "Lecture Notes",
    "items": [
      "The museum was built in 1______",
      "Main exhibition: 2______"
    ]
  },
  "answers": [
    "1895",
    "ancient Egypt"
  ]
}
```

#### D. Matching
```json
{
  "type": "matching",
  "instruction": "Match each room with its description.",
  "items": [
    {
      "question": "Room 1",
      "options": ["Paintings", "Sculptures", "Pottery"],
      "answer": 0
    }
  ]
}
```

---

## BƯỚC 2: Thêm Audio qua Admin Panel

### 2.1. Chuẩn bị file audio

1. Upload file audio lên **Google Drive**
2. Click chuột phải → **Get link** → **Anyone with the link**
3. Copy link (dạng: `https://drive.google.com/file/d/FILE_ID/view`)

### 2.2. Đăng nhập Admin

1. Vào trang web: `http://localhost:5173/login`
2. Đăng nhập bằng **tài khoản admin**
3. Vào menu → **Admin** → **Audio Manager**

Hoặc truy cập trực tiếp: `http://localhost:5173/admin/audio`

### 2.3. Thêm audio

1. Tìm bài test theo ID (ví dụ: ID 107)
2. Click nút **"+ Thêm Audio"** hoặc **"✏️ Sửa"**
3. Paste link Google Drive vào ô input
4. Click **"Lưu"**

### 2.4. Hệ thống tự động

- Tự động convert link Google Drive sang direct download link
- Lưu vào database Supabase
- Hiển thị trạng thái "🎧 Có audio" trên danh sách

---

## BƯỚC 3: Kiểm tra

### 3.1. Clear cache
```javascript
localStorage.removeItem('ielts_cache')
location.reload()
```

Hoặc mở file `clear-cache.html` và click "Xóa Cache"

### 3.2. Test bài listening

1. Vào: `IELTS` → `Listening`
2. Thấy bài mới với badge "🎧 Có audio"
3. Click "Làm bài"
4. Audio player hiển thị và có thể phát

---

## CẤU TRÚC FILE

```
public/
  ielts.json          ← Thêm đề bài ở đây
  
src/components/
  IELTSListening.jsx  ← Component hiển thị bài listening
  AudioPlayer.jsx     ← Component phát audio
  AdminAudioManager.jsx ← Admin thêm audio
  QuizList.jsx        ← Danh sách bài tập
```

---

## CHECKLIST THÊM BÀI MỚI

- [ ] Thêm bài vào `public/ielts.json`
- [ ] ID unique (không trùng)
- [ ] Type = "ielts-listening"
- [ ] Category = "Listening"
- [ ] Sections là array
- [ ] Có đầy đủ 4 sections
- [ ] Mỗi section có questions
- [ ] Upload audio lên Google Drive
- [ ] Get shareable link
- [ ] Login admin
- [ ] Vào Admin → Audio Manager
- [ ] Thêm link audio cho bài test
- [ ] Clear cache
- [ ] Test bài listening

---

## LƯU Ý

⚠️ **Không thêm audioUrl vào JSON**
- Audio được quản lý riêng qua Admin Panel
- Lưu trong database Supabase
- Linh hoạt thay đổi không cần edit JSON

✅ **Ưu điểm**
- Đề bài version control (Git)
- Audio dễ thay đổi (không cần commit)
- Admin có thể update audio bất kỳ lúc nào
- Không làm file JSON quá lớn

📝 **Mẫu tham khảo**
- `MAU_LISTENING.json` - Template đầy đủ
- `public/ielts.json` - Bài ID 106 đang có

---

## TROUBLESHOOTING

### Lỗi: Không thấy bài mới
→ Clear cache: `localStorage.removeItem('ielts_cache')`

### Lỗi: Không có audio
→ Kiểm tra Admin Panel đã thêm audio chưa

### Lỗi: Audio không phát
→ Kiểm tra link Google Drive có public không

### Lỗi: Màn hình trắng
→ Kiểm tra sections phải là array, không phải số

---

**Tạo bởi**: Kiro AI Assistant
**Ngày**: 2025-11-19
