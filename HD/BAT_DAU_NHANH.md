# 🚀 BẮT ĐẦU NHANH - Tự động cập nhật Admin Dashboard

## ✅ Đã làm gì cho bạn:

1. ✅ **Tích hợp Supabase** - Không cần backend riêng
2. ✅ **Real-time updates** - Tự động cập nhật khi có user nộp bài
3. ✅ **Thông báo mới** - Hiển thị thông báo khi có submission mới
4. ✅ **Chi tiết đầy đủ** - Xem câu hỏi, câu trả lời, điểm số của từng user

## 📋 CHỈ CẦN LÀM 1 BƯỚC:

### Bước 1: Tạo bảng trong Supabase

1. Mở file `supabase_setup.sql` trong project
2. Copy **TOÀN BỘ** nội dung
3. Vào Supabase Dashboard: https://supabase.com/dashboard/project/cocnanimvgcwzwgteaax
4. Click **SQL Editor** (sidebar trái)
5. Click **New Query**
6. Paste nội dung đã copy
7. Click **Run** (hoặc Ctrl+Enter)
8. ✅ Xong!

## 🎉 Sau khi chạy SQL:

- ✅ Bảng `submissions` đã được tạo
- ✅ RLS policies đã được cấu hình
- ✅ Real-time đã được bật
- ✅ Admin có thể xem tất cả submissions
- ✅ Tự động cập nhật khi có user nộp bài mới

## 🧪 Test:

1. Đăng nhập với tài khoản admin
2. Vào **Quản lý** → **Admin Dashboard**
3. Mở tab khác, đăng nhập với tài khoản user khác
4. Làm bài và nộp
5. Quay lại tab Admin Dashboard → **Tự động hiển thị submission mới!** ✨

## 📝 Lưu ý:

- Email admin đã được cấu hình: `hungquocnguyen252@gmail.com`
- Nếu muốn thêm admin khác, sửa email trong file `supabase_setup.sql` (dòng 49 và 62)
- Real-time chỉ hoạt động khi đã bật trong Supabase (đã có trong SQL script)

## 🆘 Nếu gặp lỗi:

1. **Lỗi "relation submissions does not exist"**
   → Chưa chạy SQL script, làm lại Bước 1

2. **Lỗi "permission denied"**
   → Kiểm tra email admin trong SQL script có đúng không

3. **Không tự động cập nhật**
   → Kiểm tra real-time đã được bật trong Supabase chưa (xem trong Database → Replication)

