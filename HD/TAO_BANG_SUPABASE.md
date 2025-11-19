# 📊 Tạo bảng Submissions trong Supabase

## Bước 1: Tạo bảng trong Supabase

1. Vào Supabase Dashboard: https://supabase.com/dashboard/project/cocnanimvgcwzwgteaax
2. Click **Table Editor** (sidebar trái)
3. Click **New Table**
4. Đặt tên bảng: `submissions`
5. Thêm các cột sau:

### Cột 1: id
- Name: `id`
- Type: `uuid` (hoặc `int8`)
- Default value: `gen_random_uuid()` (nếu dùng uuid)
- Primary key: ✅ Bật
- Is Nullable: ❌ Tắt

### Cột 2: user_id
- Name: `user_id`
- Type: `uuid` (phải khớp với type của id trong bảng auth.users)
- Is Nullable: ❌ Tắt
- Foreign key: 
  - Reference table: `auth.users`
  - Reference column: `id`
  - On delete: `CASCADE`

### Cột 3: quiz_id
- Name: `quiz_id`
- Type: `int8` (hoặc `integer`)
- Is Nullable: ❌ Tắt

### Cột 4: score
- Name: `score`
- Type: `int8` (hoặc `integer`)
- Is Nullable: ❌ Tắt

### Cột 5: total
- Name: `total`
- Type: `int8` (hoặc `integer`)
- Is Nullable: ❌ Tắt

### Cột 6: details
- Name: `details`
- Type: `jsonb` (hoặc `text`)
- Is Nullable: ✅ Bật
- Default: `null`

### Cột 7: created_at
- Name: `created_at`
- Type: `timestamptz`
- Default value: `now()`
- Is Nullable: ❌ Tắt

6. Click **Save** để tạo bảng

## Bước 2: Cấu hình Row Level Security (RLS)

1. Vào **Authentication** → **Policies** (hoặc click vào bảng `submissions` → **Policies**)
2. Tạo policy cho INSERT (cho phép user tự insert submission của mình):

   **Policy Name:** `Users can insert their own submissions`
   - Operation: `INSERT`
   - Target roles: `authenticated`
   - USING expression: `auth.uid() = user_id`
   - WITH CHECK expression: `auth.uid() = user_id`

3. Tạo policy cho SELECT (cho phép user xem submission của mình, admin xem tất cả):

   **Policy Name:** `Users can view their own submissions`
   - Operation: `SELECT`
   - Target roles: `authenticated`
   - USING expression: `auth.uid() = user_id`

   **Policy Name:** `Admins can view all submissions`
   - Operation: `SELECT`
   - Target roles: `authenticated`
   - USING expression: 
     ```sql
     EXISTS (
       SELECT 1 FROM auth.users 
       WHERE auth.users.id = auth.uid() 
       AND auth.users.email = ANY(ARRAY['hungquocnguyen252@gmail.com'])
     )
     ```
     (Thay email admin của bạn vào đây)

4. Click **Save** cho mỗi policy

## Bước 3: Tạo function để lấy submissions cho admin

1. Vào **SQL Editor** trong Supabase Dashboard
2. Chạy query sau để tạo function:

```sql
CREATE OR REPLACE FUNCTION get_all_submissions()
RETURNS TABLE (
  id uuid,
  user_id uuid,
  quiz_id bigint,
  score bigint,
  total bigint,
  details jsonb,
  created_at timestamptz,
  user_email text,
  user_name text,
  user_grade text
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.user_id,
    s.quiz_id,
    s.score,
    s.total,
    s.details,
    s.created_at,
    u.email as user_email,
    (u.raw_user_meta_data->>'name')::text as user_name,
    (u.raw_user_meta_data->>'grade')::text as user_grade
  FROM submissions s
  JOIN auth.users u ON s.user_id = u.id
  ORDER BY s.created_at DESC;
END;
$$;
```

3. Click **Run** để tạo function

## Bước 4: Tạo policy cho function

1. Vào **Authentication** → **Policies**
2. Tạo policy cho function (hoặc dùng SECURITY DEFINER như trên)

## ✅ Kiểm tra

Sau khi tạo xong:
1. Vào **Table Editor** → chọn bảng `submissions`
2. Kiểm tra các cột đã đúng chưa
3. Thử insert một record test (nếu có quyền)

## 📝 Lưu ý

- Nếu dùng `uuid` cho user_id, phải đảm bảo khớp với `auth.users.id
- Nếu dùng `int8`, cần tạo bảng `users` riêng và link với `auth.users` qua email
- Policy phải được cấu hình đúng để bảo mật dữ liệu

