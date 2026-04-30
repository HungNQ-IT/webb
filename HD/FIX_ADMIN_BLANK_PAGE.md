# 🔧 Khắc phục trang Admin trống

## Vấn đề: Trang /admin/quizzes hiển thị trống

### Bước 1: Kiểm tra Console (QUAN TRỌNG!)

1. **Mở Console:** Nhấn `F12` hoặc `Ctrl + Shift + I`
2. **Chuyển sang tab Console**
3. **Tìm lỗi màu đỏ**

#### Các lỗi thường gặp:

**Lỗi 1: "relation quizzes does not exist"**
```
Error loading quizzes: relation "public.quizzes" does not exist
```

**Giải pháp:**
- Bảng `quizzes` chưa được tạo trong Supabase
- Vào Supabase Dashboard → SQL Editor
- Chạy script trong file `supabase_setup.sql`

**Lỗi 2: "Failed to fetch" hoặc "Network error"**
```
Error loading quizzes: Failed to fetch
```

**Giải pháp:**
- Kiểm tra kết nối internet
- Kiểm tra Supabase URL và Key trong `.env`
- Kiểm tra CORS trong Supabase Dashboard

**Lỗi 3: "Cannot read properties of undefined"**
```
TypeError: Cannot read properties of undefined (reading 'map')
```

**Giải pháp:**
- Component đang cố render dữ liệu chưa load xong
- Đã được fix trong code mới

### Bước 2: Kiểm tra Network

1. **Mở tab Network** trong DevTools (F12)
2. **Reload trang**
3. **Tìm request đến Supabase**
4. **Kiểm tra status code:**
   - ✅ 200: OK
   - ❌ 401: Unauthorized (sai key)
   - ❌ 404: Not found (sai URL)
   - ❌ 500: Server error

### Bước 3: Test với component đơn giản

Thay component AdminQuizManager bằng version test:

**File: `src/App.jsx`**

Tìm dòng:
```javascript
const AdminQuizManager = lazy(() => import('./components/AdminQuizManager'))
```

Thay bằng:
```javascript
const AdminQuizManager = lazy(() => import('./components/AdminQuizManagerSimple'))
```

Reload trang. Nếu thấy nội dung, nghĩa là component gốc bị lỗi.

### Bước 4: Kiểm tra Supabase Setup

Chạy script này trong Console:

```javascript
// Test Supabase connection
import { supabase } from './src/utils/supabase'

async function testSupabase() {
  console.log('Testing Supabase...')
  
  try {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('❌ Lỗi:', error.message)
      if (error.message.includes('does not exist')) {
        console.log('💡 Giải pháp: Tạo bảng quizzes trong Supabase')
      }
    } else {
      console.log('✅ Kết nối OK, số bài tập:', data.length)
    }
  } catch (e) {
    console.error('❌ Lỗi kết nối:', e.message)
  }
}

testSupabase()
```

### Bước 5: Tạo bảng quizzes (nếu chưa có)

1. **Vào Supabase Dashboard:** https://supabase.com/dashboard
2. **Chọn project của bạn**
3. **Vào SQL Editor** (icon database bên trái)
4. **Chạy script sau:**

```sql
-- Tạo bảng quizzes
CREATE TABLE IF NOT EXISTS quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject TEXT NOT NULL,
  grade INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT DEFAULT 'tracnghiem',
  time_limit INTEGER DEFAULT 30,
  difficulty TEXT DEFAULT 'medium',
  questions JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;

-- Policy: Ai cũng đọc được
CREATE POLICY "Anyone can read quizzes" 
ON quizzes FOR SELECT 
USING (true);

-- Policy: Chỉ admin mới sửa/xóa
CREATE POLICY "Admin can manage quizzes" 
ON quizzes FOR ALL 
USING (
  auth.jwt() ->> 'email' IN ('hungquocnguyen252@gmail.com', 'duchoang305007@gmail.com')
  OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);
```

5. **Nhấn Run** (hoặc Ctrl + Enter)
6. **Kiểm tra:** Vào tab **Table Editor** → Tìm bảng `quizzes`

### Bước 6: Kiểm tra CSS

Có thể nội dung bị ẩn do CSS. Thử chạy trong Console:

```javascript
// Kiểm tra xem có element nào bị ẩn không
const elements = document.querySelectorAll('*')
elements.forEach(el => {
  const style = window.getComputedStyle(el)
  if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
    console.log('Element bị ẩn:', el)
  }
})
```

### Bước 7: Force reload và clear cache

1. **Hard reload:** `Ctrl + Shift + R` (Windows) hoặc `Cmd + Shift + R` (Mac)
2. **Clear cache:**
   - Mở DevTools (F12)
   - Right-click vào nút Reload
   - Chọn "Empty Cache and Hard Reload"

### Bước 8: Kiểm tra ErrorBoundary

Component có thể bị crash và ErrorBoundary catch nhưng không hiển thị gì.

Thêm log vào ErrorBoundary:

**File: `src/components/ErrorBoundary.jsx`**

Trong method `componentDidCatch`, thêm:
```javascript
componentDidCatch(error, errorInfo) {
  console.error('ErrorBoundary caught:', error, errorInfo)
  // ... rest of code
}
```

## Giải pháp nhanh nhất

Nếu bạn muốn test nhanh, làm theo thứ tự:

### 1. Mở Console (F12) → Xem lỗi gì
### 2. Nếu thấy "relation quizzes does not exist":
   - Vào Supabase Dashboard
   - Chạy SQL script tạo bảng
   - Reload trang

### 3. Nếu không có lỗi nhưng vẫn trống:
   - Thử component Simple (xem Bước 3)
   - Kiểm tra CSS (xem Bước 6)

### 4. Nếu vẫn không được:
   - Chụp màn hình Console
   - Chụp màn hình Network tab
   - Gửi cho tôi để debug

## Test nhanh bằng HTML

Tạo file `test-admin-quiz.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Test Admin Quiz</title>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
</head>
<body>
    <h1>Test Supabase Connection</h1>
    <div id="result"></div>

    <script>
        const SUPABASE_URL = 'https://cocnanimvgcwzwgteaax.supabase.co'
        const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNvY25hbmltdmdjd3p3Z3RlYWF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMTQ2MjIsImV4cCI6MjA3ODc5MDYyMn0.OmCsE28nsSvheES7tt1bgYWA0veI5N8wm_9GfItNhe8'

        const { createClient } = supabase
        const client = createClient(SUPABASE_URL, SUPABASE_KEY)

        async function test() {
            const result = document.getElementById('result')
            result.innerHTML = 'Testing...'

            try {
                const { data, error } = await client
                    .from('quizzes')
                    .select('*')
                
                if (error) {
                    result.innerHTML = `<p style="color: red;">❌ Lỗi: ${error.message}</p>`
                    if (error.message.includes('does not exist')) {
                        result.innerHTML += '<p>💡 Bảng quizzes chưa được tạo. Chạy SQL script trong Supabase.</p>'
                    }
                } else {
                    result.innerHTML = `<p style="color: green;">✅ Kết nối OK!</p>`
                    result.innerHTML += `<p>Số bài tập: ${data.length}</p>`
                    result.innerHTML += `<pre>${JSON.stringify(data, null, 2)}</pre>`
                }
            } catch (e) {
                result.innerHTML = `<p style="color: red;">❌ Lỗi: ${e.message}</p>`
            }
        }

        test()
    </script>
</body>
</html>
```

Mở file này trong trình duyệt để test kết nối Supabase.

## Liên hệ

Nếu vẫn không được, gửi cho tôi:
1. Screenshot Console (F12)
2. Screenshot Network tab
3. Kết quả của test HTML ở trên
