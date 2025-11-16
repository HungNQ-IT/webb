# 🔧 Hướng dẫn sửa Admin Policy

## Vấn đề

Bạn đăng nhập với email admin (`hungquocnguyen252@gmail.com`) nhưng vẫn báo lỗi "Bạn không có quyền xem submissions".

## Giải pháp

### Bước 1: Chạy script sửa policy

1. Vào Supabase Dashboard: https://supabase.com/dashboard/project/cocnanimvgcwzwgteaax
2. Vào **SQL Editor** (sidebar trái)
3. Mở file `FIX_ADMIN_POLICY_SIMPLE.sql`
4. Copy toàn bộ nội dung
5. Paste vào SQL Editor
6. Click **Run** để chạy

Script này sẽ:
- ✅ Xóa các policies cũ
- ✅ Tạo policy mới chỉ cho phép email `hungquocnguyen252@gmail.com` xem submissions

### Bước 2: Kiểm tra policy đã được tạo

Chạy query này trong SQL Editor:

```sql
SELECT 
  policyname,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'submissions';
```

Phải thấy policy: **"Admin can view all submissions"** với `cmd = SELECT`

### Bước 3: Kiểm tra user hiện tại

Chạy query này để xem user hiện tại:

```sql
SELECT 
  id,
  email,
  LOWER(email) as email_lower
FROM auth.users
WHERE LOWER(email) = LOWER('hungquocnguyen252@gmail.com');
```

### Bước 4: Test lại

1. **Đăng xuất** khỏi website
2. **Đăng nhập lại** với email `hungquocnguyen252@gmail.com`
3. Vào trang: https://hungnq-it.github.io/webb/admin
4. **Hard refresh** browser: Ctrl+Shift+R (Windows) hoặc Cmd+Shift+R (Mac)

### Bước 5: Kiểm tra Console nếu vẫn lỗi

1. Mở Developer Tools (F12)
2. Vào tab **Console**
3. Refresh trang admin
4. Xem có lỗi gì:
   - Nếu vẫn "permission denied" → Policy chưa được apply, đợi 1-2 phút rồi thử lại
   - Nếu lỗi khác → Copy lỗi và gửi cho tôi

## ✅ Checklist

- [ ] Đã chạy script `FIX_ADMIN_POLICY_SIMPLE.sql`
- [ ] Đã kiểm tra policy đã được tạo
- [ ] Đã đăng xuất và đăng nhập lại
- [ ] Đã hard refresh browser
- [ ] Đã kiểm tra console không có lỗi

## 🔍 Troubleshooting

### Vẫn báo "permission denied"

1. Kiểm tra email có đúng không:
   ```sql
   SELECT email FROM auth.users WHERE id = auth.uid();
   ```

2. Kiểm tra policy có hoạt động không:
   ```sql
   -- Test xem policy có cho phép không
   SELECT 
     EXISTS (
       SELECT 1 FROM auth.users
       WHERE auth.users.id = auth.uid()
       AND LOWER(auth.users.email) = LOWER('hungquocnguyen252@gmail.com')
     ) AS is_admin;
   ```

3. Nếu `is_admin = false` → Email không khớp, kiểm tra lại email trong Supabase

### Policy không được apply

- Đợi 1-2 phút sau khi chạy script
- Đăng xuất và đăng nhập lại
- Hard refresh browser

