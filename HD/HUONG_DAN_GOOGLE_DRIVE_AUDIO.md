# 🎧 HƯỚNG DẪN DÙNG GOOGLE DRIVE CHO AUDIO

## ✅ ĐÃ FIX XONG!

Bây giờ bạn có thể dùng Google Drive cho audio listening mà không cần Supabase!

---

## Cách thêm audio từ Google Drive

### Bước 1: Upload file lên Google Drive

1. Vào https://drive.google.com
2. Upload file audio (MP3, WAV, OGG, M4A)
3. Click chuột phải vào file → **Share** → **Anyone with the link**
4. Copy link

### Bước 2: Chuyển đổi link

Link bạn copy có dạng:
```
https://drive.google.com/file/d/FILE_ID/view?usp=sharing
```

**Đổi `/view` thành `/preview`:**
```
https://drive.google.com/file/d/FILE_ID/preview
```

**Ví dụ:**
- Link gốc: `https://drive.google.com/file/d/1GK-2p1GfKJJ8W6rnrvjA6f69q3yCJk-_/view?usp=sharing`
- Link dùng: `https://drive.google.com/file/d/1GK-2p1GfKJJ8W6rnrvjA6f69q3yCJk-_/preview`

### Bước 3: Thêm vào JSON

Mở file `public/ielts.json`, tìm bài listening và sửa:

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
  "audioUrl": "https://drive.google.com/file/d/1GK-2p1GfKJJ8W6rnrvjA6f69q3yCJk-_/preview",
  "sections": [...]
}
```

### Bước 4: Clear cache và test

1. Mở Console (F12)
2. Chạy:
```javascript
localStorage.removeItem('ielts_cache')
location.reload()
```

3. Vào IELTS → Listening
4. Click "Làm bài"
5. Audio player sẽ hiện và có thể phát! ✅

---

## Cách hoạt động

- Hệ thống tự động detect link Google Drive
- Dùng **iframe embed** thay vì audio tag
- Google Drive player có sẵn controls (play, pause, volume, seek)
- Không cần download, stream trực tiếp

---

## Ưu điểm

✅ Dùng Google Drive miễn phí 15GB
✅ Không cần Supabase Storage
✅ Không động vào database
✅ Chỉ sửa JSON
✅ Dễ quản lý file
✅ Có thể share/edit file dễ dàng

---

## Lưu ý

⚠️ **Quan trọng**: Phải dùng `/preview` chứ không phải `/view`

⚠️ **Quyền truy cập**: File phải set "Anyone with the link can view"

⚠️ **Format link đúng**:
- ✅ `https://drive.google.com/file/d/FILE_ID/preview`
- ❌ `https://drive.google.com/file/d/FILE_ID/view`
- ❌ `https://drive.google.com/uc?export=download&id=FILE_ID`

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
  "audioUrl": "https://drive.google.com/file/d/ABC123XYZ/preview",
  "sections": [
    {
      "id": 1,
      "title": "Section 1",
      "instruction": "Listen and answer questions 1-10.",
      "questions": [...]
    }
  ]
}
```

---

## Troubleshooting

### Audio không hiện?
→ Check link có đúng format `/preview` không

### Lỗi "Cannot access"?
→ File chưa set public, vào Share → Anyone with the link

### Player không load?
→ Clear cache: `localStorage.clear()` và reload

---

## Tóm tắt

1. Upload audio lên Google Drive
2. Share → Anyone with the link
3. Copy link → Đổi `/view` thành `/preview`
4. Paste vào `audioUrl` trong JSON
5. Clear cache và test
6. ✅ Xong!

**Đơn giản, không cần Supabase, không động database!**
