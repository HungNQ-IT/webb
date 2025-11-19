# 🎧 HƯỚNG DẪN ĐỌN GIẢN: THÊM AUDIO CHO LISTENING

## Cách đơn giản nhất: Chỉ sửa JSON

### Bước 1: Upload audio lên hosting

Chọn 1 trong các cách sau:

#### A. Dùng Supabase Storage (Khuyên dùng - Miễn phí)

1. Vào https://supabase.com → Project của bạn → Storage
2. Tạo bucket `ielts-audio` (Public)
3. Upload file MP3
4. Click file → Copy URL
5. URL có dạng: `https://xxx.supabase.co/storage/v1/object/public/ielts-audio/test-106.mp3`

#### B. Dùng Cloudinary (Miễn phí 25GB)

1. Đăng ký: https://cloudinary.com
2. Upload audio
3. Copy URL
4. URL có dạng: `https://res.cloudinary.com/xxx/video/upload/test-106.mp3`

#### C. Dùng GitHub (Miễn phí - Cho file nhỏ < 25MB)

1. Tạo repo public trên GitHub
2. Upload file audio vào folder `audio/`
3. Vào file → Click "Raw"
4. Copy URL
5. URL có dạng: `https://raw.githubusercontent.com/username/repo/main/audio/test-106.mp3`

#### D. Dùng Dropbox

1. Upload lên Dropbox
2. Get link → Đổi `dl=0` thành `dl=1`
3. URL có dạng: `https://www.dropbox.com/s/xxx/test-106.mp3?dl=1`

---

### Bước 2: Thêm vào JSON

Mở file `public/ielts.json`, tìm bài listening và sửa `audioUrl`:

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
  "audioUrl": "https://xxx.supabase.co/storage/v1/object/public/ielts-audio/test-106.mp3",
  "sections": [...]
}
```

**Thay link trên bằng link audio thật của bạn!**

---

### Bước 3: Clear cache và test

1. Mở Console (F12)
2. Chạy:
```javascript
localStorage.removeItem('ielts_cache')
location.reload()
```

3. Vào trang Listening
4. Click "Làm bài"
5. Audio sẽ phát! ✅

---

## Ví dụ hoàn chỉnh

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
  "audioUrl": "https://your-audio-hosting.com/test-107.mp3",
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
              { "label": "Name", "answer": "John Smith" }
            ]
          }
        }
      ]
    }
  ]
}
```

---

## Lưu ý

✅ **Link phải là direct link** (trỏ thẳng đến file MP3)
✅ **File phải public** (không cần login để truy cập)
✅ **Format hỗ trợ**: MP3, WAV, OGG, M4A

❌ **Không dùng**:
- Google Drive (bị block streaming)
- Link cần login
- Link redirect

---

## Troubleshooting

### Audio không phát?

1. **Test link trong browser**:
   - Paste link vào address bar
   - Nếu download hoặc phát được → OK
   - Nếu redirect hoặc lỗi → Link sai

2. **Check Console (F12)**:
   - Xem có lỗi CORS không
   - Xem có lỗi 404 không

3. **Clear cache**:
```javascript
localStorage.clear()
location.reload()
```

---

## Khuyến nghị

**Tốt nhất**: Dùng Supabase Storage
- Miễn phí 1GB
- Tốc độ nhanh
- Không bị block
- Dễ quản lý

**Cách làm**:
1. Vào Supabase → Storage → Tạo bucket `ielts-audio` (Public)
2. Upload file MP3
3. Copy URL
4. Paste vào JSON
5. Xong!

---

**Không cần Admin Panel, không cần database - chỉ cần sửa JSON!**
