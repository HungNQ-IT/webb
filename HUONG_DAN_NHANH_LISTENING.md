# 🎧 HƯỚNG DẪN NHANH: THÊM BÀI LISTENING

## TÓM TẮT

Listening có 2 phần riêng biệt:
1. **Audio** → Admin thêm qua web (lưu vào Supabase)
2. **Đề bài** → Thêm thủ công vào `ielts.json`

---

## BƯỚC 1: THÊM ĐỀ BÀI (JSON)

### Mở file `public/ielts.json`

Thêm object mới vào cuối array (trước dấu `]`):

```json
{
  "id": 107,
  "subject": "IELTS",
  "category": "Listening",
  "title": "IELTS Cambridge 15 Test 1",
  "difficulty": "medium",
  "type": "ielts-listening",
  "description": "Full IELTS Listening test",
  "timeLimit": 30,
  "sections": [
    {
      "id": 1,
      "title": "Section 1",
      "instruction": "Listen and answer questions 1-10.",
      "questions": [
        {
          "type": "form-completion",
          "instruction": "Complete the form.",
          "form": {
            "title": "Application Form",
            "fields": [
              { "label": "Name", "answer": "John Smith" },
              { "label": "Phone", "answer": "0412345678" }
            ]
          }
        }
      ]
    }
  ]
}
```

**Lưu ý:**
- ID phải unique (107, 108, 109...)
- `type` = `"ielts-listening"`
- `category` = `"Listening"`
- `sections` phải là **array** `[]`
- Không cần thêm `audioUrl` (sẽ thêm qua Admin)

---

## BƯỚC 2: THÊM AUDIO (ADMIN PANEL)

### 2.1. Upload lên Google Drive

1. Upload file audio lên Google Drive
2. Click chuột phải → **Share** → **Anyone with the link**
3. Copy link (dạng: `https://drive.google.com/file/d/FILE_ID/view`)

### 2.2. Thêm vào hệ thống

1. **Login admin**: `/login`
2. **Vào Admin Panel**: Menu → Admin → Audio Manager
   - Hoặc: `/admin/audio`
3. **Chọn bài test** từ danh sách bên trái
4. **Paste link** Google Drive vào ô input
5. **Test audio** (click play để kiểm tra)
6. **Click "Lưu Audio"**

✅ Xong! Audio đã được lưu vào database.

---

## CÁC DẠNG CÂU HỎI

### 1. Form Completion
```json
{
  "type": "form-completion",
  "instruction": "Complete the form below.",
  "form": {
    "title": "Registration Form",
    "fields": [
      { "label": "Full name", "answer": "Sarah Johnson" },
      { "label": "Email", "answer": "sarah@email.com" }
    ]
  }
}
```

### 2. Multiple Choice
```json
{
  "type": "multiple-choice",
  "instruction": "Choose the correct letter.",
  "items": [
    {
      "question": "What time does it start?",
      "options": ["9:00 AM", "10:00 AM", "11:00 AM"],
      "answer": 1
    }
  ]
}
```

### 3. Note Completion
```json
{
  "type": "note-completion",
  "instruction": "Complete the notes below.",
  "notes": {
    "title": "Lecture Notes",
    "items": [
      "Built in 1______",
      "Main topic: 2______"
    ]
  },
  "answers": ["1895", "ancient Egypt"]
}
```

### 4. Matching
```json
{
  "type": "matching",
  "instruction": "Match each item.",
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

## CHECKLIST

### Thêm đề bài
- [ ] Mở `public/ielts.json`
- [ ] Copy template
- [ ] Đổi ID (unique)
- [ ] Đổi title
- [ ] Thêm 4 sections
- [ ] Thêm questions cho mỗi section
- [ ] Save file

### Thêm audio
- [ ] Upload audio lên Google Drive
- [ ] Set permission: Anyone with link
- [ ] Copy link
- [ ] Login admin
- [ ] Vào `/admin/audio`
- [ ] Chọn bài test
- [ ] Paste link
- [ ] Test audio
- [ ] Click "Lưu Audio"

### Kiểm tra
- [ ] Clear cache: `localStorage.removeItem('ielts_cache')`
- [ ] Reload trang
- [ ] Vào IELTS → Listening
- [ ] Thấy bài mới
- [ ] Click "Làm bài"
- [ ] Audio phát được
- [ ] Làm bài và nộp OK

---

## TROUBLESHOOTING

### Không thấy bài mới?
```javascript
localStorage.removeItem('ielts_cache')
location.reload()
```

### Audio không phát?
- Kiểm tra link Google Drive có public không
- Thử paste link vào browser xem download được không
- Kiểm tra format file (MP3, WAV, OGG)

### Lỗi màn hình trắng?
- Kiểm tra `sections` phải là array `[]`
- Kiểm tra JSON syntax (dấu phẩy, ngoặc)
- Xem Console (F12) để biết lỗi cụ thể

---

## FILES LIÊN QUAN

- `public/ielts.json` - Đề bài
- `src/components/AdminAudioManager.jsx` - Admin panel
- `src/components/IELTSListening.jsx` - Trang làm bài
- `src/components/AudioPlayer.jsx` - Audio player
- `MAU_LISTENING.json` - Template mẫu

---

## VÍ DỤ HOÀN CHỈNH

Xem file `MAU_LISTENING.json` để có ví dụ đầy đủ với 4 sections và tất cả dạng câu hỏi.

---

**Tạo bởi**: Kiro AI
**Ngày**: 2025-11-19
