# 🤖 HƯỚNG DẪN TÍCH HỢP AI CHẤM ĐIỂM TỰ LUẬN

## Tổng quan

Hệ thống AI chấm điểm tự động cho câu trả lời tự luận với:
- ✅ Chấm điểm tự động (0-10)
- ✅ Nhận xét chi tiết
- ✅ Điểm mạnh / Cần cải thiện
- ✅ Dùng Google Gemini API (miễn phí)

---

## BƯỚC 1: Lấy API Key

### Cách 1: Google Gemini (MIỄN PHÍ - Khuyên dùng)

1. Vào https://makersuite.google.com/app/apikey
2. Đăng nhập Google
3. Click **"Create API Key"**
4. Copy API key

### Cách 2: OpenAI (Trả phí)

1. Vào https://platform.openai.com/api-keys
2. Đăng nhập
3. Click **"Create new secret key"**
4. Copy API key

---

## BƯỚC 2: Cấu hình API Key

### Thêm vào file `.env`

```bash
# Google Gemini (miễn phí)
VITE_GEMINI_API_KEY=AIzaSy...your_key_here

# Hoặc OpenAI (trả phí)
# VITE_OPENAI_API_KEY=sk-...your_key_here
```

**Lưu ý:** File `.env` không được commit lên Git (đã có trong `.gitignore`)

---

## BƯỚC 3: Sử dụng trong Component

### Ví dụ 1: Chấm 1 câu

```jsx
import AIGradingResult from './components/AIGradingResult'

function MyComponent() {
  return (
    <AIGradingResult
      question="Giải thích định luật Newton thứ 2"
      studentAnswer="Lực bằng khối lượng nhân gia tốc..."
      correctAnswer="Định luật Newton thứ 2 phát biểu..."
      maxScore={10}
    />
  )
}
```

### Ví dụ 2: Chấm nhiều câu

```jsx
import { gradeMultipleEssays } from '../utils/aiGrading'

async function gradeAllEssays() {
  const essays = [
    {
      question: "Câu hỏi 1",
      studentAnswer: "Trả lời 1",
      correctAnswer: "Đáp án 1",
      maxScore: 10
    },
    {
      question: "Câu hỏi 2",
      studentAnswer: "Trả lời 2",
      correctAnswer: "Đáp án 2",
      maxScore: 10
    }
  ]
  
  const results = await gradeMultipleEssays(essays)
  console.log(results)
}
```

---

## BƯỚC 4: Tích hợp vào Result Page

Sửa file `src/components/Result.jsx` hoặc `IELTSResult.jsx`:

```jsx
import AIGradingResult from './AIGradingResult'

// Trong phần render kết quả
{question.type === 'essay' && (
  <AIGradingResult
    question={question.q}
    studentAnswer={userAnswer}
    correctAnswer={question.answer}
    maxScore={question.points || 10}
  />
)}
```

---

## CẤU TRÚC FILE

```
src/
  utils/
    aiGrading.js          ← Service chấm điểm AI
  components/
    AIGradingResult.jsx   ← UI hiển thị kết quả
```

---

## TÍNH NĂNG

### 1. Chấm điểm tự động
- Phân tích nội dung, logic, ngữ pháp
- Cho điểm từ 0-10 (hoặc tùy chỉnh)
- So sánh với đáp án mẫu

### 2. Nhận xét chi tiết
- Feedback tổng quan
- Điểm mạnh (Strengths)
- Cần cải thiện (Improvements)

### 3. Fallback thông minh
- Nếu không có API key → Chấm điểm đơn giản
- Nếu API lỗi → Fallback tự động
- Luôn có kết quả

---

## CHI PHÍ

### Google Gemini
- ✅ **MIỄN PHÍ** 60 requests/phút
- ✅ Đủ dùng cho hầu hết trường hợp
- ✅ Không cần thẻ tín dụng

### OpenAI
- 💰 Trả phí theo usage
- GPT-3.5: ~$0.002/1K tokens
- GPT-4: ~$0.03/1K tokens

---

## TÙYCHỈNH

### Thay đổi prompt

Sửa file `src/utils/aiGrading.js`, function `buildGradingPrompt()`:

```javascript
function buildGradingPrompt(question, studentAnswer, correctAnswer, maxScore) {
  return `Bạn là giáo viên chấm bài...
  
  // Thêm yêu cầu của bạn ở đây
  - Chấm điểm nghiêm khắc hơn
  - Tập trung vào ngữ pháp
  - v.v.
  `
}
```

### Thay đổi UI

Sửa file `src/components/AIGradingResult.jsx` để thay đổi giao diện.

---

## TROUBLESHOOTING

### Lỗi: API key invalid
→ Kiểm tra API key đã đúng chưa
→ Kiểm tra file `.env` đã load chưa

### Lỗi: Rate limit
→ Google Gemini: 60 requests/phút
→ Đợi 1 phút rồi thử lại

### Không có kết quả
→ Check Console (F12) xem lỗi gì
→ Kiểm tra network request

### Kết quả không chính xác
→ Cải thiện prompt
→ Thêm đáp án mẫu chi tiết hơn

---

## VÍ DỤ KẾT QUẢ

```json
{
  "score": 8.5,
  "feedback": "Câu trả lời tốt, nội dung đầy đủ và logic rõ ràng. Ngữ pháp chính xác.",
  "strengths": [
    "Giải thích khái niệm rõ ràng",
    "Có ví dụ minh họa",
    "Cấu trúc bài viết tốt"
  ],
  "improvements": [
    "Có thể thêm ví dụ thực tế",
    "Nên phát triển phần kết luận"
  ]
}
```

---

## DEMO

Xem file `test-ai-grading.html` để test AI chấm điểm độc lập.

---

## BẢO MẬT

⚠️ **Quan trọng:**
- Không commit API key lên Git
- Dùng biến môi trường (`.env`)
- File `.env` đã có trong `.gitignore`

---

## HỖ TRỢ

Nếu cần hỗ trợ:
1. Check Console (F12) xem lỗi
2. Đọc docs: https://ai.google.dev/docs
3. Test với `test-ai-grading.html`

---

**Tạo bởi**: Kiro AI Assistant
**Ngày**: 2025-11-19
