# ⚡ SỬA LỖI "permission denied" - CHỈ 2 BƯỚC!

## 🔧 Bước 1: Chạy SQL script sửa lỗi

1. Mở file `fix_permission_denied.sql`
2. Copy **TOÀN BỘ** nội dung
3. Vào Supabase Dashboard: https://supabase.com/dashboard/project/cocnanimvgcwzwgteaax
4. Click **SQL Editor** → **New Query**
5. Paste và Click **Run**

✅ Script này sẽ:
- Xóa policy cũ (gây lỗi)
- Tạo policy mới (dùng JWT, không query auth.users)
- Cập nhật metadata cho user admin của bạn

## 🔄 Bước 2: Đăng xuất và đăng nhập lại

1. **Đăng xuất** khỏi website
2. **Đăng nhập lại** với tài khoản admin
3. Vào **Quản lý** → **Admin Dashboard**
4. ✅ Xong! Không còn lỗi nữa!

## 🎯 Giải thích ngắn gọn:

**Trước:** Policy cố query `auth.users` → Lỗi permission denied

**Sau:** Policy dùng `auth.jwt()` → Lấy thông tin từ token → Không cần query database

## ✅ Kiểm tra:

Sau khi chạy script và đăng nhập lại:
- Vào Admin Dashboard
- Phải thấy danh sách submissions (nếu có)
- Không còn lỗi "permission denied"

## 🆘 Nếu vẫn lỗi:

1. Kiểm tra đã chạy script `fix_permission_denied.sql` chưa
2. Đảm bảo đã đăng xuất và đăng nhập lại
3. Kiểm tra console (F12) xem có lỗi gì khác không
4. Xem file `FIX_PERMISSION_DENIED.md` để biết thêm chi tiết

