# 🔍 Debug: Submissions không được lưu

## Bước 1: Kiểm tra bảng có đủ cột chưa

Trong Supabase Table Editor, kiểm tra bảng `submissions` có các cột sau:
- ✅ `id`
- ✅ `user_id`
- ✅ `quiz_id`
- ✅ `score`
- ✅ `total`
- ✅ `details`
- ✅ `created_at`
- ❓ `user_email` (cần có)
- ❓ `user_name` (cần có)
- ❓ `user_grade` (cần có)

**Nếu thiếu 3 cột cuối:**
1. Vào SQL Editor
2. Chạy script `SUPABASE_ADD_USER_COLUMNS.sql`

## Bước 2: Kiểm tra Console trong Browser

1. Mở website: https://hungnq-it.github.io/webb/
2. Đăng nhập với tài khoản học sinh
3. Làm một bài quiz
4. Mở Developer Tools (F12)
5. Vào tab **Console**
6. Nộp bài và xem có lỗi gì không

**Các lỗi thường gặp:**
- `Error saving submission: ...` → Có lỗi khi lưu
- `permission denied` → RLS policy chưa đúng
- `column "user_email" does not exist` → Chưa thêm cột

## Bước 3: Kiểm tra Network Tab

1. Vào tab **Network** trong Developer Tools
2. Nộp bài lại
3. Tìm request tới Supabase (tìm `supabase.co`)
4. Click vào request
5. Xem:
   - **Status**: Phải là 200 hoặc 201
   - **Request Payload**: Xem có gửi đúng dữ liệu không
   - **Response**: Xem có lỗi gì không

## Bước 4: Test thủ công trong Supabase

Chạy query này trong SQL Editor để test insert:

```sql
-- Lấy user_id của một user
SELECT id, email FROM auth.users LIMIT 1;

-- Thay USER_ID_HERE bằng id thật từ query trên
-- Test insert thủ công
INSERT INTO submissions (user_id, quiz_id, score, total, user_email, user_name, user_grade, details)
VALUES (
  'USER_ID_HERE',  -- Thay bằng user_id thật
  1,               -- quiz_id
  5,               -- score
  10,              -- total
  'test@example.com',  -- user_email
  'Test User',     -- user_name
  '12',            -- user_grade
  '{"test": true}'::jsonb  -- details
);

-- Kiểm tra xem có insert được không
SELECT * FROM submissions ORDER BY created_at DESC LIMIT 1;
```

**Nếu insert thủ công thành công:**
- Bảng và policies đúng
- Vấn đề ở code frontend

**Nếu insert thủ công thất bại:**
- Có lỗi với RLS policies
- Cần sửa policies

## Bước 5: Kiểm tra RLS Policies

Chạy query này:

```sql
-- Xem tất cả policies của bảng submissions
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'submissions';
```

**Phải có 3 policies:**
1. "Users can view own submissions" (SELECT)
2. "Users can insert own submissions" (INSERT)
3. "Admins can view all submissions" (SELECT)

## Bước 6: Sửa lỗi thường gặp

### Lỗi: "column user_email does not exist"

**Giải pháp:**
Chạy script `SUPABASE_ADD_USER_COLUMNS.sql` trong SQL Editor

### Lỗi: "permission denied for table submissions"

**Giải pháp:**
1. Kiểm tra policies đã được tạo chưa
2. Chạy lại script `SUPABASE_SUBMISSIONS_SETUP.sql`

### Lỗi: "new row violates row-level security policy"

**Giải pháp:**
Sửa policy INSERT:

```sql
-- Xóa policy cũ
DROP POLICY IF EXISTS "Users can insert own submissions" ON submissions;

-- Tạo lại policy (đơn giản hơn)
CREATE POLICY "Users can insert own submissions"
  ON submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
```

## Bước 7: Kiểm tra code đã được deploy chưa

1. Vào GitHub: https://github.com/HungNQ-IT/webb
2. Vào tab **Actions**
3. Kiểm tra workflow gần nhất có chạy thành công không
4. Nếu chưa deploy, push code mới:

```bash
git add .
git commit -m "Fix submissions saving"
git push
```

## ✅ Checklist

- [ ] Đã kiểm tra bảng có đủ cột (user_email, user_name, user_grade)
- [ ] Đã chạy script thêm cột nếu thiếu
- [ ] Đã kiểm tra console không có lỗi
- [ ] Đã kiểm tra Network tab
- [ ] Đã test insert thủ công trong SQL
- [ ] Đã kiểm tra RLS policies
- [ ] Đã deploy code mới lên GitHub Pages

