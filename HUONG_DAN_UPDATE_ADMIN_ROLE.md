# 🔧 Hướng dẫn cập nhật Role Admin

## Vấn đề

Email admin của bạn (`hungquocnguyen252@gmail.com`) đang có role là "student" thay vì "admin" trong Supabase.

## Giải pháp

### Cách 1: Dùng SQL Script (Nhanh nhất)

1. Vào Supabase Dashboard → **SQL Editor**
2. Mở file `UPDATE_ADMIN_ROLE.sql`
3. Copy toàn bộ nội dung và chạy
4. Kiểm tra kết quả - phải thấy `role = 'admin'`

### Cách 2: Cập nhật thủ công trong Dashboard

1. Vào Supabase Dashboard → **Authentication** → **Users**
2. Tìm user với email `hungquocnguyen252@gmail.com`
3. Click vào user đó
4. Scroll xuống phần **User Metadata**
5. Sửa hoặc thêm:
   ```json
   {
     "role": "admin",
     "name": "Nguyễn Quốc Hùng",
     "grade": null
   }
   ```
6. Click **Save**

### Cách 3: Cập nhật khi đăng ký (Nếu cần tạo lại user)

Nếu muốn tạo lại user với role admin ngay từ đầu, khi đăng ký trong code sẽ tự động set role dựa trên `VITE_ADMIN_EMAILS`.

## Sau khi cập nhật

1. **Đăng xuất** khỏi website
2. **Đăng nhập lại** với email `hungquocnguyen252@gmail.com`
3. Vào trang admin: https://hungnq-it.github.io/webb/admin
4. Kiểm tra xem đã xem được submissions chưa

## Kiểm tra role đã đúng chưa

Chạy query này trong SQL Editor:

```sql
SELECT 
  email,
  raw_user_meta_data->>'role' AS role,
  raw_user_meta_data->>'name' AS name
FROM auth.users
WHERE LOWER(email) = LOWER('hungquocnguyen252@gmail.com');
```

Phải thấy: `role = 'admin'`

## ✅ Checklist

- [ ] Đã chạy script `UPDATE_ADMIN_ROLE.sql`
- [ ] Đã kiểm tra role = 'admin' trong query
- [ ] Đã đăng xuất và đăng nhập lại
- [ ] Đã chạy script `FIX_ADMIN_POLICY_SIMPLE.sql` (nếu chưa)
- [ ] Đã test vào trang admin

