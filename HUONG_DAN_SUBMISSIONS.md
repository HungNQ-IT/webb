# 📊 Hướng dẫn cấu hình Submissions trong Supabase

## 🎯 Mục tiêu

Tích hợp Supabase để lưu và hiển thị lịch sử làm bài của học sinh trong phần quản lý admin, bao gồm:
- Kết quả làm bài
- Tổng điểm
- Chi tiết câu trả lời của từng học sinh

## 📋 Các bước cấu hình

### Bước 1: Tạo bảng submissions trong Supabase

1. Vào Supabase Dashboard: https://supabase.com/dashboard/project/cocnanimvgcwzwgteaax
2. Vào **SQL Editor** (trong sidebar)
3. Mở file `SUPABASE_SUBMISSIONS_SETUP.sql` trong project
4. Copy toàn bộ nội dung SQL
5. Paste vào SQL Editor
6. Click **Run** để chạy script

Script này sẽ:
- ✅ Tạo bảng `submissions` để lưu kết quả làm bài
- ✅ Tạo các index để query nhanh hơn
- ✅ Cấu hình Row Level Security (RLS) policies
- ✅ Tạo function để admin xem tất cả submissions

### Bước 2: Kiểm tra bảng đã được tạo

1. Vào **Table Editor** trong Supabase Dashboard
2. Kiểm tra có bảng `submissions` chưa
3. Kiểm tra các cột:
   - `id` (UUID)
   - `user_id` (UUID, foreign key)
   - `quiz_id` (INTEGER)
   - `score` (INTEGER)
   - `total` (INTEGER)
   - `details` (JSONB)
   - `created_at` (TIMESTAMP)

### Bước 3: Kiểm tra RLS Policies

1. Vào **Authentication** → **Policies**
2. Tìm bảng `submissions`
3. Kiểm tra có 3 policies:
   - "Users can view own submissions"
   - "Users can insert own submissions"
   - "Admins can view all submissions"

### Bước 4: Cấu hình Admin Emails

Để function `get_submissions_with_users()` hoạt động, cần cấu hình admin emails:

1. Vào **Project Settings** → **API**
2. Tìm phần **Config** hoặc **Environment Variables**
3. Thêm biến môi trường (nếu có) hoặc cập nhật trong code

Hoặc đơn giản hơn, sửa policy trong SQL để check role từ user metadata:

```sql
-- Sửa policy admin để check role từ metadata
CREATE POLICY "Admins can view all submissions"
  ON submissions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'role')::TEXT = 'admin'
    )
  );
```

### Bước 5: Test chức năng

1. **Test lưu submission:**
   - Đăng nhập với tài khoản học sinh
   - Làm một bài quiz
   - Nộp bài
   - Kiểm tra trong Supabase Table Editor xem có record mới không

2. **Test xem submissions (admin):**
   - Đăng nhập với tài khoản admin
   - Vào trang Quản lý
   - Kiểm tra xem có hiển thị danh sách submissions không
   - Click "Xem" để xem chi tiết câu trả lời

## 📊 Cấu trúc dữ liệu

### Bảng submissions

```sql
{
  id: UUID,
  user_id: UUID (foreign key → auth.users),
  quiz_id: INTEGER,
  score: INTEGER,
  total: INTEGER,
  details: JSONB {
    questionCount: number,
    answers: number[],
    questions: [
      {
        question: string,
        userAnswer: number,
        correctAnswer: number,
        isCorrect: boolean
      }
    ]
  },
  created_at: TIMESTAMP
}
```

## 🔍 Troubleshooting

### Lỗi "permission denied" khi lưu submission

**Nguyên nhân:** RLS policy chưa được cấu hình đúng

**Giải pháp:**
1. Kiểm tra policy "Users can insert own submissions" đã được tạo chưa
2. Kiểm tra user đã đăng nhập chưa
3. Kiểm tra `user_id` trong insert có khớp với `auth.uid()` không

### Lỗi "function does not exist" khi admin xem submissions

**Nguyên nhân:** Function `get_submissions_with_users()` chưa được tạo

**Giải pháp:**
1. Chạy lại script SQL trong SQL Editor
2. Kiểm tra function đã được tạo trong Database → Functions

### Admin không thấy submissions

**Nguyên nhân:** Policy admin chưa hoạt động đúng

**Giải pháp:**
1. Kiểm tra user có role = 'admin' trong metadata không
2. Kiểm tra policy "Admins can view all submissions" đã được tạo chưa
3. Thử sửa policy như hướng dẫn ở Bước 4

### Không hiển thị chi tiết câu trả lời

**Nguyên nhân:** Field `details` chưa có dữ liệu hoặc format sai

**Giải pháp:**
1. Kiểm tra trong Supabase Table Editor xem field `details` có dữ liệu không
2. Kiểm tra format JSON có đúng không
3. Xem console (F12) để xem lỗi chi tiết

## ✅ Checklist

- [ ] Đã chạy script SQL để tạo bảng và policies
- [ ] Đã kiểm tra bảng `submissions` tồn tại
- [ ] Đã kiểm tra RLS policies đã được tạo
- [ ] Đã test lưu submission (học sinh làm bài)
- [ ] Đã test xem submissions (admin)
- [ ] Đã test xem chi tiết câu trả lời

## 📝 Lưu ý

- Submissions chỉ được lưu khi user đã đăng nhập
- Admin có thể xem tất cả submissions của tất cả học sinh
- Học sinh chỉ có thể xem submissions của chính mình (nếu có tính năng này)
- Dữ liệu được lưu trong Supabase, không cần backend server riêng

