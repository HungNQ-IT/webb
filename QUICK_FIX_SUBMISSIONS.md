# ⚡ Sửa nhanh: Submissions không được lưu

## 🔧 Các bước sửa nhanh

### Bước 1: Kiểm tra và thêm cột (QUAN TRỌNG!)

Trong Supabase Table Editor, kiểm tra bảng `submissions` có các cột:
- `user_email`
- `user_name`  
- `user_grade`

**Nếu THIẾU 3 cột này:**

1. Vào **SQL Editor** trong Supabase
2. Mở file `SUPABASE_ADD_USER_COLUMNS.sql`
3. Copy toàn bộ và chạy
4. Kiểm tra lại Table Editor xem đã có cột chưa

### Bước 2: Kiểm tra Console

1. Mở website: https://hungnq-it.github.io/webb/
2. Đăng nhập với tài khoản học sinh
3. Mở Developer Tools (F12) → **Console**
4. Làm bài và nộp
5. Xem console có lỗi gì:
   - Nếu thấy: `column "user_email" does not exist` → Chưa chạy script thêm cột
   - Nếu thấy: `permission denied` → RLS policy chưa đúng
   - Nếu thấy: `Submission saved successfully` → Đã lưu thành công!

### Bước 3: Test lại

1. Sau khi chạy script thêm cột
2. Refresh trang
3. Đăng nhập lại
4. Làm bài và nộp
5. Kiểm tra Supabase Table Editor → submissions → xem có record mới không

### Bước 4: Nếu vẫn không được

Chạy query test trong SQL Editor:

```sql
-- Lấy user_id
SELECT id, email FROM auth.users WHERE email = 'EMAIL_CUA_BAN@example.com';

-- Test insert (thay USER_ID và EMAIL)
INSERT INTO submissions (user_id, quiz_id, score, total, user_email, user_name, user_grade, details)
VALUES (
  'USER_ID_HERE',
  1,
  5,
  10,
  'EMAIL_HERE',
  'Test',
  '12',
  '{"test": true}'::jsonb
);
```

Nếu insert thủ công thành công → Vấn đề ở code frontend
Nếu insert thủ công thất bại → Vấn đề ở RLS policies

## 🎯 Nguyên nhân phổ biến

1. **Thiếu cột** (90% trường hợp)
   - Giải pháp: Chạy `SUPABASE_ADD_USER_COLUMNS.sql`

2. **RLS policy chưa đúng**
   - Giải pháp: Chạy lại `SUPABASE_SUBMISSIONS_SETUP.sql`

3. **Code chưa được deploy**
   - Giải pháp: Push code lên GitHub và chờ deploy

## ✅ Checklist nhanh

- [ ] Đã chạy script `SUPABASE_ADD_USER_COLUMNS.sql`
- [ ] Đã kiểm tra bảng có đủ cột
- [ ] Đã mở Console (F12) và xem lỗi
- [ ] Đã test lại sau khi sửa

