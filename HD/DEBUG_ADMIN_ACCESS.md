# 🔍 Debug: Kiểm tra quyền Admin

## Vấn đề: Không vào được trang Admin/Quizzes

### Bước 1: Kiểm tra role của user hiện tại

Mở **Console** trong trình duyệt (F12) và chạy lệnh sau:

```javascript
// Kiểm tra thông tin user hiện tại
const authData = localStorage.getItem('sb-cocnanimvgcwzwgteaax-auth-token')
if (authData) {
  const parsed = JSON.parse(authData)
  console.log('User email:', parsed.user?.email)
  console.log('User metadata:', parsed.user?.user_metadata)
  console.log('User role:', parsed.user?.user_metadata?.role)
} else {
  console.log('Chưa đăng nhập')
}
```

**Kết quả mong đợi:**
- `User email`: Phải là một trong hai email admin
- `User role`: Phải là `"admin"`

### Bước 2: Kiểm tra VITE_ADMIN_EMAILS

Mở Console và chạy:

```javascript
// Kiểm tra biến môi trường
console.log('Admin emails:', import.meta.env.VITE_ADMIN_EMAILS)
```

**Kết quả mong đợi:**
```
Admin emails: hungquocnguyen252@gmail.com,duchoang305007@gmail.com
```

### Bước 3: Kiểm tra lỗi trong Console

1. Mở Console (F12)
2. Nhấn vào nút "Thêm bài tập"
3. Xem có lỗi màu đỏ nào không

**Các lỗi thường gặp:**

#### Lỗi 1: "Không có quyền truy cập"
**Nguyên nhân:** User role không phải admin

**Giải pháp:**
1. Đăng xuất
2. Xóa cache: `localStorage.clear()`
3. Đăng nhập lại bằng email admin

#### Lỗi 2: Trang trắng / không load
**Nguyên nhân:** Component AdminQuizManager bị lỗi

**Giải pháp:**
1. Kiểm tra Console có lỗi gì
2. Kiểm tra Network tab xem có request nào fail không

#### Lỗi 3: "relation quizzes does not exist"
**Nguyên nhân:** Chưa tạo bảng `quizzes` trong Supabase

**Giải pháp:**
1. Vào Supabase Dashboard
2. Chạy SQL trong file `supabase_setup.sql`

### Bước 4: Force set role admin (Tạm thời)

Nếu vẫn không được, thử force set role trong Console:

```javascript
// LƯU Ý: Chỉ dùng để test, không dùng trong production
const authData = localStorage.getItem('sb-cocnanimvgcwzwgteaax-auth-token')
if (authData) {
  const parsed = JSON.parse(authData)
  parsed.user.user_metadata.role = 'admin'
  localStorage.setItem('sb-cocnanimvgcwzwgteaax-auth-token', JSON.stringify(parsed))
  console.log('Đã set role = admin, reload trang')
  location.reload()
}
```

### Bước 5: Kiểm tra routing

Thử truy cập trực tiếp bằng URL:

```
http://localhost:5173/admin/quizzes
```

Hoặc nếu đã deploy:

```
https://your-domain.com/admin/quizzes
```

## Giải pháp chính thức

### Cách 1: Đăng ký lại tài khoản admin

1. Đăng xuất khỏi tài khoản hiện tại
2. Xóa tài khoản cũ trong Supabase Dashboard (nếu cần)
3. Đăng ký lại với email admin
4. Hệ thống sẽ tự động gán role = "admin"

### Cách 2: Update role trong Supabase

1. Vào Supabase Dashboard
2. Vào **Authentication** > **Users**
3. Tìm user với email admin
4. Click vào user
5. Vào tab **User Metadata**
6. Thêm/sửa field:
   ```json
   {
     "role": "admin"
   }
   ```
7. Save
8. Đăng xuất và đăng nhập lại

### Cách 3: Sửa code AuthContext (Khuyến nghị)

Nếu vấn đề vẫn còn, có thể do logic check admin trong `AuthContext.jsx` không hoạt động đúng.

Kiểm tra file `src/context/AuthContext.jsx` dòng này:

```javascript
role: adminEmails.includes(supabaseUser.email?.toLowerCase()) ? 'admin' : (metadata.role || 'student')
```

Đảm bảo:
- `VITE_ADMIN_EMAILS` được load đúng
- Email được so sánh lowercase
- Logic check đúng

## Test nhanh

Chạy script này trong Console để test toàn bộ:

```javascript
// Test script
console.log('=== ADMIN ACCESS DEBUG ===')

// 1. Check auth
const authData = localStorage.getItem('sb-cocnanimvgcwzwgteaax-auth-token')
if (!authData) {
  console.error('❌ Chưa đăng nhập')
} else {
  const parsed = JSON.parse(authData)
  const email = parsed.user?.email
  const role = parsed.user?.user_metadata?.role
  
  console.log('✅ Đã đăng nhập')
  console.log('📧 Email:', email)
  console.log('👤 Role:', role)
  
  // 2. Check admin emails
  const adminEmails = 'hungquocnguyen252@gmail.com,duchoang305007@gmail.com'
  const isAdmin = adminEmails.toLowerCase().includes(email?.toLowerCase())
  
  console.log('🔑 Admin emails:', adminEmails)
  console.log('✓ Is admin email?', isAdmin)
  console.log('✓ Has admin role?', role === 'admin')
  
  // 3. Final verdict
  if (isAdmin && role === 'admin') {
    console.log('✅ BẠN CÓ QUYỀN ADMIN - Có thể vào /admin/quizzes')
  } else if (isAdmin && role !== 'admin') {
    console.log('⚠️ Email đúng nhưng role sai - Cần update role trong Supabase')
  } else {
    console.log('❌ Không có quyền admin')
  }
}

console.log('=== END DEBUG ===')
```

## Liên hệ hỗ trợ

Nếu vẫn không được, gửi kết quả của test script trên để được hỗ trợ.
