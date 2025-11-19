# 🎧 Hướng dẫn Admin thêm Audio nhanh

## Bước 1: Upload lên Google Drive

1. Đăng nhập Google Drive bằng **tài khoản admin**
2. Upload file audio (MP3, WAV, etc.)
3. Click chuột phải vào file → **Chia sẻ**
4. Chọn **"Bất kỳ ai có link đều có thể xem"**
5. Click **"Sao chép liên kết"**

## Bước 2: Thêm audio trên trang web

1. Đăng nhập vào trang web bằng **email admin**
2. Vào **IELTS → Listening**
3. Tìm bài test cần thêm audio
4. Click nút **"+"** (hoặc **"✏️"** nếu đã có audio) ở góc trên phải của card
5. Paste link Google Drive vào ô
6. Click **"Test Audio"** để kiểm tra audio có phát được không
7. Click **"💾 Lưu Audio"**

## ✅ Xong!

- Audio đã được lưu vào database
- Học sinh có thể nghe audio ngay lập tức
- Bạn có thể sửa/xóa audio bất cứ lúc nào

## 🔍 Kiểm tra

Sau khi lưu, bạn sẽ thấy:
- Icon 🎧 "Có audio" hiển thị trên card
- Nút "+" đổi thành "✏️" (edit)
- Học sinh có thể làm bài với audio

## ⚠️ Lưu ý

- Chỉ admin mới thấy nút "+" / "✏️"
- File audio nên < 50MB để tải nhanh
- Phải đặt quyền "Anyone with the link can view" trên Google Drive
- Hệ thống tự động chuyển đổi link thành direct link

## 🆘 Gặp vấn đề?

### Audio không phát được
- Kiểm tra quyền chia sẻ trên Google Drive
- Thử mở link trực tiếp trên trình duyệt
- Kiểm tra file audio có bị lỗi không

### Không thấy nút "+"
- Đảm bảo đã đăng nhập bằng email admin
- Kiểm tra email trong file `.env` (VITE_ADMIN_EMAILS)
- Refresh trang và đăng nhập lại

### Lỗi khi lưu
- Kiểm tra kết nối internet
- Kiểm tra Supabase có hoạt động không
- Xem console log để biết lỗi chi tiết

---

**Cần trợ giúp?** Xem hướng dẫn chi tiết tại `HD/HUONG_DAN_THEM_LISTENING.md`
