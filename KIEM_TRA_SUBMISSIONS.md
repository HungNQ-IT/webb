# 🔍 Hướng dẫn kiểm tra Submissions

## Bước 1: Kiểm tra trong Supabase Dashboard

### 1.1. Kiểm tra bảng submissions

1. Vào Supabase Dashboard: https://supabase.com/dashboard/project/cocnanimvgcwzwgteaax
2. Vào **Table Editor**
3. Tìm bảng `submissions`
4. Xem có dữ liệu nào không

**Nếu không có dữ liệu:**
- Có thể chưa có học sinh nào làm bài
- Hoặc có lỗi khi lưu submissions

### 1.2. Chạy script test

1. Vào **SQL Editor**
2. Mở file `TEST_SUBMISSIONS.sql`
3. Copy và chạy từng query một để kiểm tra:
   - Bảng có tồn tại không
   - Có bao nhiêu submissions
   - Function có tồn tại không
   - Policies có đúng không

## Bước 2: Test lưu submission

### Cách 1: Test bằng cách làm bài thật

1. **Tạo tài khoản học sinh mới:**
   - Đăng xuất khỏi tài khoản admin
   - Đăng ký tài khoản mới (hoặc dùng tài khoản học sinh khác)
   - Đăng nhập

2. **Làm bài và nộp:**
   - Chọn một môn học
   - Chọn một bài quiz
   - Làm bài và nộp
   - Kiểm tra console (F12) xem có lỗi không

3. **Kiểm tra trong Supabase:**
   - Vào Table Editor → submissions
   - Xem có record mới không

### Cách 2: Test bằng SQL (tạo submission thủ công)

⚠️ **Lưu ý**: Cần có user_id thật từ auth.users

```sql
-- Lấy user_id của một user
SELECT id, email FROM auth.users LIMIT 1;

-- Tạo submission thủ công (thay USER_ID bằng id thật)
INSERT INTO submissions (user_id, quiz_id, score, total, details)
VALUES (
  'USER_ID_HERE',  -- Thay bằng user_id thật
  1,               -- quiz_id
  5,               -- score
  10,              -- total
  '{"questionCount": 10, "answers": [0,1,2,3,4,5,6,7,8,9], "questions": []}'::jsonb
);
```

## Bước 3: Kiểm tra Admin Dashboard

### 3.1. Kiểm tra console

1. Mở trang admin: https://hungnq-it.github.io/webb/admin
2. Mở Developer Tools (F12)
3. Vào tab **Console**
4. Xem có lỗi gì không:
   - Lỗi "permission denied" → RLS policy chưa đúng
   - Lỗi "function does not exist" → Function chưa được tạo
   - Lỗi "network" → Kết nối Supabase có vấn đề

### 3.2. Kiểm tra Network tab

1. Vào tab **Network** trong Developer Tools
2. Refresh trang admin
3. Tìm request tới Supabase
4. Xem response:
   - Status 200: Thành công
   - Status 401/403: Lỗi permission
   - Status 500: Lỗi server/function

## Bước 4: Kiểm tra code

### 4.1. Kiểm tra function getAllSubmissions

Mở browser console và chạy:

```javascript
// Kiểm tra Supabase client
import { supabase } from './utils/supabase'
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)

// Test function
import { getAllSubmissions } from './utils/supabaseSubmissions'
getAllSubmissions().then(data => {
  console.log('Submissions:', data)
}).catch(err => {
  console.error('Error:', err)
})
```

### 4.2. Kiểm tra RLS policies

Trong Supabase SQL Editor, chạy:

```sql
-- Kiểm tra policies
SELECT * FROM pg_policies WHERE tablename = 'submissions';

-- Test policy admin (thay USER_ID bằng id của admin)
SELECT 
  auth.uid() as current_user_id,
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND (auth.users.raw_user_meta_data->>'role')::TEXT = 'admin'
  ) AS is_admin;
```

## Bước 5: Sửa lỗi thường gặp

### Lỗi: "permission denied for table submissions"

**Nguyên nhân:** RLS policy chưa cho phép admin xem

**Giải pháp:**
1. Kiểm tra user có role = 'admin' trong metadata không
2. Chạy lại script SQL để tạo policies
3. Hoặc sửa policy thủ công:

```sql
-- Xóa policy cũ
DROP POLICY IF EXISTS "Admins can view all submissions" ON submissions;

-- Tạo lại policy (đơn giản hơn - cho phép tất cả authenticated users xem)
CREATE POLICY "Admins can view all submissions"
  ON submissions
  FOR SELECT
  TO authenticated
  USING (true);  -- Tạm thời cho phép tất cả, sau đó sửa lại
```

### Lỗi: "function get_submissions_with_users() does not exist"

**Nguyên nhân:** Function chưa được tạo

**Giải pháp:**
1. Chạy lại phần tạo function trong script SQL
2. Hoặc tạo function thủ công (xem file SUPABASE_SUBMISSIONS_SETUP.sql)

### Lỗi: "No submissions found" nhưng có dữ liệu

**Nguyên nhân:** Function trả về sai format hoặc RLS chặn

**Giải pháp:**
1. Test function trực tiếp trong SQL Editor:
   ```sql
   SELECT * FROM get_submissions_with_users();
   ```
2. Nếu function không hoạt động, sửa code để query trực tiếp:

```javascript
// Trong src/utils/supabaseSubmissions.js
export async function getAllSubmissions() {
  const { data, error } = await supabase
    .from('submissions')
    .select(`
      *,
      user:auth.users!submissions_user_id_fkey (
        email,
        raw_user_meta_data
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching submissions:', error)
    throw new Error(error.message || 'Không thể tải dữ liệu')
  }

  return (data || []).map(item => ({
    id: item.id,
    quizId: item.quiz_id,
    score: item.score,
    total: item.total,
    details: item.details,
    createdAt: item.created_at,
    user: {
      id: item.user?.id,
      email: item.user?.email,
      name: item.user?.raw_user_meta_data?.name,
      grade: item.user?.raw_user_meta_data?.grade
    }
  }))
}
```

## ✅ Checklist

- [ ] Đã kiểm tra bảng submissions có tồn tại
- [ ] Đã kiểm tra có dữ liệu trong bảng không
- [ ] Đã test lưu submission (học sinh làm bài)
- [ ] Đã kiểm tra console không có lỗi
- [ ] Đã kiểm tra Network tab
- [ ] Đã kiểm tra RLS policies
- [ ] Đã kiểm tra function get_submissions_with_users

## 🆘 Nếu vẫn không hoạt động

1. Copy toàn bộ lỗi từ console (F12)
2. Copy response từ Network tab
3. Chụp screenshot Supabase Table Editor
4. Cho tôi biết để tôi hỗ trợ tiếp

