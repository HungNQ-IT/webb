# 🗄️ Supabase Database Guide

## 📋 Database Schema

### Tables

#### 1. submissions
Lưu trữ bài làm của học sinh
```sql
- id: uuid (primary key)
- user_id: uuid (foreign key)
- quiz_id: text
- quiz_title: text
- score: integer
- total: integer
- answers: jsonb
- submitted_at: timestamp
```

#### 2. ielts_audio
Lưu trữ audio cho IELTS Listening
```sql
- id: uuid (primary key)
- test_id: integer
- audio_url: text
- created_at: timestamp
```

#### 3. documents (optional)
Lưu trữ tài liệu PDF
```sql
- id: uuid (primary key)
- title: text
- description: text
- file_url: text
- category: text
- subject: text
- grade: text
- uploaded_by: uuid
- created_at: timestamp
```

---

## 🔐 Row Level Security (RLS)

### Submissions Table

**Select Policy:**
- Admin: Xem tất cả submissions
- User: Chỉ xem submissions của mình

**Insert Policy:**
- Authenticated users có thể tạo submissions

**Update/Delete:**
- Chỉ admin mới có quyền

### IELTS Audio Table

**Select Policy:**
- Public: Tất cả có thể xem

**Insert/Update/Delete:**
- Chỉ admin

---

## 🔄 Real-time Subscriptions

### Admin Dashboard
```js
supabase
  .channel('submissions')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'submissions'
  }, (payload) => {
    // Handle new submission
  })
  .subscribe()
```

---

## 📝 Setup Instructions

### 1. Tạo Project
1. Đăng ký tại https://supabase.com
2. Tạo project mới
3. Copy URL và anon key

### 2. Run SQL Scripts
1. Mở SQL Editor trong Supabase Dashboard
2. Copy nội dung từ `database/supabase_setup.sql`
3. Paste và Run
4. Kiểm tra tables đã được tạo

### 3. Cấu hình .env
```
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 4. Cấu hình Admin
Sửa email admin trong SQL script:
```sql
CREATE POLICY "Admin can view all submissions"
ON submissions FOR SELECT
TO authenticated
USING (
  auth.jwt() ->> 'email' = 'your-admin@email.com'
);
```

---

## 🧪 Testing

### Test Connection
```js
import { supabase } from './utils/supabase'

const { data, error } = await supabase
  .from('submissions')
  .select('*')
  .limit(1)

console.log(data, error)
```

### Test RLS
1. Đăng nhập với user thường
2. Thử query submissions → Chỉ thấy của mình
3. Đăng nhập với admin
4. Thử query submissions → Thấy tất cả

---

## 🔧 Common Queries

### Get user submissions
```js
const { data } = await supabase
  .from('submissions')
  .select('*')
  .eq('user_id', userId)
  .order('submitted_at', { ascending: false })
```

### Get all submissions (admin)
```js
const { data } = await supabase
  .from('submissions')
  .select('*')
  .order('submitted_at', { ascending: false })
```

### Insert submission
```js
const { data, error } = await supabase
  .from('submissions')
  .insert({
    user_id: userId,
    quiz_id: quizId,
    quiz_title: title,
    score: score,
    total: total,
    answers: answers
  })
```

---

## 🐛 Troubleshooting

### "relation does not exist"
→ Chưa chạy SQL script

### "permission denied"
→ Kiểm tra RLS policies

### "Invalid API key"
→ Kiểm tra .env file

### Real-time không hoạt động
→ Bật Replication trong Database settings

---

## 📚 Resources

- [Supabase Docs](https://supabase.com/docs)
- [RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Real-time Guide](https://supabase.com/docs/guides/realtime)
