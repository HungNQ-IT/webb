# ❓ FAQ - Câu hỏi thường gặp về Upload PDF

## 🎯 Câu hỏi chung

### 1. Tôi cần upload tài liệu PDF lên web, bắt đầu từ đâu?
**Trả lời:** Đọc file **`BAT_DAU_UPLOAD_PDF.md`** - chỉ mất 4 phút để setup và upload file đầu tiên.

### 2. Tôi có cần biết code không?
**Trả lời:** Không! Chỉ cần:
- Copy/paste SQL script vào Supabase
- Upload file lên Google Drive
- Điền form trong Admin Panel
- Không cần viết code gì cả!

### 3. Mất bao lâu để setup?
**Trả lời:**
- Setup lần đầu: 4 phút
- Mỗi lần upload PDF mới: 2 phút

### 4. Có tốn tiền không?
**Trả lời:** Không! Hoàn toàn miễn phí với:
- Supabase Free tier: 1GB storage
- Google Drive Free: 15GB storage

---

## 📤 Câu hỏi về Upload

### 5. Nên dùng Google Drive hay Supabase Storage?
**Trả lời:**
- **Google Drive**: Đơn giản, phù hợp người mới, 15GB free
- **Supabase Storage**: Nhanh hơn, quản lý tốt hơn, 1GB free

**Khuyên dùng:** Bắt đầu với Google Drive, sau đó chuyển sang Supabase nếu cần.

### 6. Làm sao để lấy link Google Drive?
**Trả lời:**
```
1. Upload file lên Drive
2. Click chuột phải → Get link
3. Chọn "Anyone with the link can view"
4. Copy link
5. Đổi /view thành /preview
   Từ: https://drive.google.com/file/d/1ABC/view
   Thành: https://drive.google.com/file/d/1ABC/preview
```

### 7. Tại sao phải đổi /view thành /preview?
**Trả lời:** 
- `/view` → Mở trang Google Drive (có header, sidebar)
- `/preview` → Chỉ hiển thị PDF, không có giao diện Drive
- Học sinh xem PDF sạch sẽ hơn với `/preview`

### 8. File PDF có kích thước tối đa bao nhiêu?
**Trả lời:**
- Google Drive: Không giới hạn (trong 15GB)
- Supabase Storage: 50MB/file (có thể tăng)
- **Khuyên dùng:** Nén PDF xuống dưới 10MB để tải nhanh

### 9. Có thể upload file Word, Excel không?
**Trả lời:** Hiện tại chỉ hỗ trợ PDF. Nếu cần:
- Chuyển Word/Excel sang PDF trước
- Hoặc sửa code để hỗ trợ thêm (dễ)

---

## 🔧 Câu hỏi về Setup

### 10. Tôi chưa có Supabase, phải làm gì?
**Trả lời:**
```
1. Vào: https://supabase.com
2. Sign up (miễn phí)
3. Create new project
4. Đợi 2 phút project khởi tạo
5. Vào SQL Editor
6. Chạy script trong setup_documents_simple.sql
```

### 11. Làm sao biết đã setup thành công?
**Trả lời:** Kiểm tra:
- ✅ Vào Supabase → Table Editor → Thấy bảng `documents`
- ✅ Vào `/admin/documents` → Thấy trang quản lý
- ✅ Upload 1 file test → Thấy trong danh sách

### 12. Tôi đã có bảng documents rồi, có cần tạo lại không?
**Trả lời:** Không! Nếu đã có:
- Kiểm tra cấu trúc bảng có đúng không
- Kiểm tra RLS policies đã enable chưa
- Nếu thiếu cột, chạy ALTER TABLE để thêm

### 13. Làm sao để tạo bucket trong Supabase Storage?
**Trả lời:**
```
1. Vào Supabase Dashboard
2. Click Storage (menu bên trái)
3. Click "Create bucket"
4. Điền:
   - Name: documents
   - Public bucket: ✅ Yes
5. Click "Create"
6. Chạy SQL policies (xem file setup_documents_simple.sql)
```

---

## 🐛 Câu hỏi về Lỗi

### 14. Lỗi "Cannot read documents" - Làm sao fix?
**Trả lời:**
```
Nguyên nhân: Chưa tạo bảng hoặc chưa enable RLS

Giải pháp:
1. Vào Supabase → SQL Editor
2. Chạy lại script trong setup_documents_simple.sql
3. Kiểm tra: Table Editor → Thấy bảng documents
4. Refresh trang web
```

### 15. Lỗi "Upload failed" - Làm sao fix?
**Trả lời:**
```
Nguyên nhân: Chưa tạo bucket hoặc chưa cấu hình policies

Giải pháp:
1. Nếu dùng Google Drive: Bỏ qua lỗi này, paste link trực tiếp
2. Nếu muốn upload trực tiếp:
   - Tạo bucket "documents" trong Storage
   - Chạy SQL policies
   - Thử upload lại
```

### 16. File PDF không xem được - Làm sao fix?
**Trả lời:**
```
Nguyên nhân: Link sai format hoặc file không public

Giải pháp:
1. Kiểm tra link có dạng /preview không
2. Kiểm tra file đã share "Anyone with the link"
3. Thử mở link trong incognito mode
4. Nếu vẫn lỗi, upload lại file
```

### 17. Không thấy tài liệu trong trang môn học - Làm sao fix?
**Trả lời:**
```
Nguyên nhân: Chưa tích hợp component DocumentList

Giải pháp:
1. Mở file src/components/QuizList.jsx
2. Import: import DocumentList from './DocumentList'
3. Thêm: <DocumentList subject={subject} grade={grade} />
4. Xem file HD/TICH_HOP_TAI_LIEU_VAO_TRANG.md
```

### 18. Lỗi "Permission denied" - Làm sao fix?
**Trả lời:**
```
Nguyên nhân: Không phải admin hoặc RLS policies sai

Giải pháp:
1. Kiểm tra đã login với tài khoản admin chưa
2. Kiểm tra email trong SQL policies có đúng không
3. Chạy lại SQL policies
4. Logout và login lại
```

---

## 🎨 Câu hỏi về Giao diện

### 19. Làm sao để hiển thị tài liệu cho học sinh?
**Trả lời:** Có 3 cách:
1. **Hiển thị cùng bài tập** - Đơn giản nhất
2. **Tạo tab riêng** - Khuyên dùng
3. **Trang riêng** - Nếu có nhiều tài liệu

Xem chi tiết: **`HD/TICH_HOP_TAI_LIEU_VAO_TRANG.md`**

### 20. Có thể tùy chỉnh giao diện không?
**Trả lời:** Có! Sửa file:
- `src/components/AdminDocumentManager.jsx` - Admin
- `src/components/DocumentList.jsx` - Student
- Dùng Tailwind CSS để style

### 21. Dark mode có hoạt động không?
**Trả lời:** Có! Cả 2 component đều hỗ trợ dark mode với Tailwind CSS.

---

## 📊 Câu hỏi về Quản lý

### 22. Làm sao để sửa thông tin tài liệu?
**Trả lời:**
```
1. Vào /admin/documents
2. Tìm tài liệu cần sửa
3. Click nút "Sửa" (icon bút)
4. Sửa thông tin
5. Click "Cập nhật"
```

### 23. Làm sao để xóa tài liệu?
**Trả lời:**
```
1. Vào /admin/documents
2. Tìm tài liệu cần xóa
3. Click nút "Xóa" (icon thùng rác)
4. Confirm xóa
5. Tài liệu sẽ bị xóa khỏi database
```

### 24. Xóa tài liệu có xóa file PDF không?
**Trả lời:**
- **Google Drive**: Không, file vẫn còn trên Drive
- **Supabase Storage**: Có, file sẽ bị xóa khỏi Storage

### 25. Làm sao để lọc tài liệu theo môn/lớp?
**Trả lời:** Component `DocumentList` tự động lọc theo props:
```jsx
<DocumentList subject="Toán" grade={10} />
```
Chỉ hiển thị tài liệu Toán lớp 10.

---

## 🔐 Câu hỏi về Bảo mật

### 26. Ai có thể upload tài liệu?
**Trả lời:** Chỉ admin mới upload được. RLS policies đảm bảo:
- Mọi người đọc được
- Chỉ admin mới thêm/sửa/xóa

### 27. Học sinh có thể xóa tài liệu không?
**Trả lời:** Không! Học sinh chỉ xem và tải về. Không thể sửa/xóa.

### 28. File PDF có bị lộ link không?
**Trả lời:** 
- **Google Drive**: Link public, ai có link đều xem được
- **Supabase Storage**: Link public, nhưng có thể cấu hình private

### 29. Làm sao để thêm admin mới?
**Trả lời:** Sửa SQL policy:
```sql
CREATE POLICY "Admin can manage documents" 
ON documents FOR ALL USING (
  (auth.jwt() ->> 'email') IN (
    'admin1@gmail.com',
    'admin2@gmail.com'
  )
  OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);
```

---

## 📈 Câu hỏi về Tối ưu

### 30. Làm sao để tải PDF nhanh hơn?
**Trả lời:**
- Nén PDF xuống dưới 10MB
- Dùng Supabase Storage thay vì Google Drive
- Enable CDN trong Supabase

### 31. Có thể cache danh sách tài liệu không?
**Trả lời:** Có! Thêm vào `DocumentList.jsx`:
```jsx
useEffect(() => {
  const cached = localStorage.getItem('documents_cache')
  if (cached) {
    const { data, timestamp } = JSON.parse(cached)
    if (Date.now() - timestamp < 5 * 60 * 1000) {
      setDocuments(data)
      return
    }
  }
  loadDocuments()
}, [])
```

### 32. Làm sao để search tài liệu?
**Trả lời:** Thêm search box trong `DocumentList.jsx`:
```jsx
const [search, setSearch] = useState('')
const filtered = documents.filter(doc => 
  doc.title.toLowerCase().includes(search.toLowerCase())
)
```

---

## 🚀 Câu hỏi về Nâng cao

### 33. Có thể thêm rating cho tài liệu không?
**Trả lời:** Có! Cần:
1. Thêm cột `rating` vào bảng documents
2. Tạo bảng `document_ratings` để lưu đánh giá
3. Thêm UI rating trong DocumentList

### 34. Có thể thống kê lượt xem không?
**Trả lời:** Có! Cần:
1. Thêm cột `view_count` vào bảng documents
2. Tăng count mỗi khi click "Xem"
3. Hiển thị số lượt xem

### 35. Có thể preview PDF trong modal không?
**Trả lời:** Có! Dùng thư viện:
- `react-pdf` - Render PDF trong React
- `pdf.js` - PDF viewer của Mozilla

### 36. Có thể hỗ trợ nhiều ngôn ngữ không?
**Trả lời:** Có! Dùng:
- `react-i18next` - i18n cho React
- Thêm file translation
- Wrap text trong `t('key')`

---

## 💡 Câu hỏi về Best Practices

### 37. Nên đặt tên file PDF như thế nào?
**Trả lời:**
- Dùng tiếng Việt không dấu: `cong-thuc-toan-10.pdf`
- Hoặc tiếng Anh: `math-formulas-grade-10.pdf`
- Tránh ký tự đặc biệt: `@#$%^&*()`

### 38. Nên viết mô tả tài liệu như thế nào?
**Trả lời:**
- Ngắn gọn, súc tích (1-2 câu)
- Nêu rõ nội dung chính
- VD: "Tổng hợp công thức toán học quan trọng lớp 10"

### 39. Nên tổ chức tài liệu theo môn hay theo lớp?
**Trả lời:** Cả hai! Hệ thống hỗ trợ lọc theo:
- Môn học (subject)
- Lớp (grade)
- Học sinh có thể lọc theo cả 2

### 40. Có nên backup tài liệu không?
**Trả lời:** Có! Nên:
- Backup database định kỳ
- Lưu file PDF ở nhiều nơi (Drive + Supabase)
- Export danh sách tài liệu ra CSV

---

## 📞 Câu hỏi về Hỗ trợ

### 41. Tôi gặp lỗi không có trong FAQ, làm sao?
**Trả lời:**
1. Check console log trong browser (F12)
2. Check Supabase logs
3. Đọc file troubleshooting trong HD/
4. Tạo issue trên GitHub

### 42. Tôi muốn thêm tính năng mới, làm sao?
**Trả lời:**
1. Xem code trong `src/components/`
2. Đọc docs của Supabase
3. Tham khảo các file hướng dẫn
4. Sửa code và test

### 43. Có video hướng dẫn không?
**Trả lời:** Chưa có. Nhưng các file markdown đã rất chi tiết với:
- Screenshots (sẽ thêm)
- Code examples
- Step-by-step guide

---

## 🎯 Câu hỏi về Roadmap

### 44. Tính năng nào sẽ được thêm trong tương lai?
**Trả lời:**
- [ ] Search và filter nâng cao
- [ ] Rating và review
- [ ] Thống kê lượt xem/tải
- [ ] Preview PDF trong modal
- [ ] Hỗ trợ nhiều loại file
- [ ] OCR để search trong PDF

### 45. Có thể đóng góp code không?
**Trả lời:** Có! Welcome contributions:
- Fork repo
- Tạo branch mới
- Commit changes
- Create pull request

---

**Không tìm thấy câu trả lời? Đọc thêm:**
- **`BAT_DAU_UPLOAD_PDF.md`** - Bắt đầu nhanh
- **`HD/README_TAI_LIEU.md`** - Mục lục chính
- **`CHECKLIST_UPLOAD_PDF.md`** - Checklist chi tiết

**Chúc bạn thành công! 🚀**
