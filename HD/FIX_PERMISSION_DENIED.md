# 🔧 Sửa lỗi "permission denied for table users"

## ❌ Lỗi:
```
permission denied for table users
```

## ✅ Nguyên nhân:
Policy đang cố query trực tiếp vào bảng `auth.users`, nhưng Supabase không cho phép client-side query bảng này.

## ✅ Giải pháp:

### Bước 1: Xóa policies cũ (nếu đã tạo)

1. Vào Supabase Dashboard → **Authentication** → **Policies**
2. Tìm bảng `submissions`
3. Xóa 2 policies:
   - "Admins can view all submissions"
   - "Admins can view all submissions for realtime" (nếu có)

### Bước 2: Chạy lại SQL script đã sửa

File `supabase_setup.sql` đã được sửa để dùng `auth.jwt()` thay vì query `auth.users`.

**Hoặc** chạy SQL sau để tạo lại policy đúng:

```sql
-- Xóa policy cũ (nếu có)
DROP POLICY IF EXISTS "Admins can view all submissions" ON submissions;
DROP POLICY IF EXISTS "Admins can view all submissions for realtime" ON submissions;

-- Tạo lại policy mới (dùng JWT thay vì query auth.users)
CREATE POLICY "Admins can view all submissions"
ON submissions
FOR SELECT
TO authenticated
USING (
  (auth.jwt() ->> 'email')::text = 'hungquocnguyen252@gmail.com'
  OR (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'admin'
);
```

### Bước 3: Đảm bảo user admin có role trong metadata

Nếu bạn đã đăng ký trước khi có role, cần cập nhật:

1. Vào Supabase Dashboard → **Authentication** → **Users**
2. Tìm user admin (email: hungquocnguyen252@gmail.com)
3. Click vào user
4. Vào tab **User Metadata**
5. Thêm:
   ```json
   {
     "role": "admin"
   }
   ```
6. Hoặc cập nhật nếu đã có:
   ```json
   {
     "name": "...",
     "grade": "...",
     "role": "admin"
   }
   ```
7. Click **Save**

### Bước 4: Test lại

1. Đăng xuất và đăng nhập lại
2. Vào Admin Dashboard
3. Kiểm tra xem còn lỗi không

## ✅ Nếu vẫn lỗi:

Chạy SQL này để kiểm tra JWT có đúng không:

```sql
-- Test query (chạy trong SQL Editor)
SELECT 
  auth.uid() as user_id,
  auth.jwt() ->> 'email' as email,
  auth.jwt() -> 'user_metadata' ->> 'role' as role
FROM auth.users 
WHERE id = auth.uid()
LIMIT 1;
```

## 💡 Giải thích:

- `auth.jwt()` - Lấy JWT token của user hiện tại
- `auth.jwt() ->> 'email'` - Lấy email từ JWT
- `auth.jwt() -> 'user_metadata' ->> 'role'` - Lấy role từ metadata
- Không cần query `auth.users` trực tiếp nữa

