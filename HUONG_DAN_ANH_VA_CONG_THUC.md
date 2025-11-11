# 🖼️ + ∑ Hướng dẫn chèn Ảnh và Công thức (LaTeX) vào bài

Đã hỗ trợ hiển thị ảnh và công thức Toán (KaTeX) trong câu hỏi, đáp án và lời giải.

## 1) Cách dùng trong questions.json

Bạn có thể thêm các trường tùy chọn vào mỗi câu hỏi/đáp án:
- image: đường dẫn ảnh (tương đối trong thư mục public hoặc URL tuyệt đối)
- eq: công thức LaTeX (ví dụ: "x = \\frac{-b \\pm \\sqrt{\\Delta}}{2a}")
- explainImage: ảnh trong phần giải thích
- explainEq: công thức LaTeX trong phần giải thích

### Ví dụ 1: Câu hỏi có ảnh và công thức
```json
{
  "q": "Tính nghiệm phương trình (xem hình minh họa)",
  "eq": "x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}",
  "image": "images/ptb2.png",
  "choices": [
    { "text": "2", "eq": "x=2" },
    { "text": "3", "eq": "x=3" },
    { "text": "2 hoặc 3", "eq": "x=2,3" },
    { "text": "Không có nghiệm" }
  ],
  "answer": 2,
  "explain": "Áp dụng công thức nghiệm tổng quát",
  "explainEq": "x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}",
  "explainImage": "images/giai-thich.png"
}
```

### Ví dụ 2: Chỉ dùng ảnh (không cần eq)
```json
{
  "q": "Quan sát hình và trả lời",
  "image": "images/vatly11/hinh1.png",
  "choices": [
    "A",
    "B",
    { "text": "C", "image": "images/vatly11/hinh-dap-an-c.png" },
    "D"
  ],
  "answer": 1
}
```

## 2) Lưu ảnh ở đâu?

- Đặt ảnh vào thư mục `public/images` (ví dụ: `public/images/ptb2.png`)
- Trong JSON chỉ cần ghi `"image": "images/ptb2.png"` (KHÔNG cần base path)
- Cũng có thể dùng URL tuyệt đối (https://...)

## 3) Viết công thức LaTeX như thế nào?

Một số mẫu hay dùng:
- `\\Delta = b^2 - 4ac`
- `x = \\frac{-b \\pm \\sqrt{\\Delta}}{2a}`
- `S = \\pi r^2`
- `F = ma`

Lưu ý escape trong JSON: mỗi dấu gạch chéo ngược `\` cần viết thành `\\`.

Ví dụ trong JSON:
```json
"eq": "x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}"
```

## 4) Áp dụng cho chỗ nào?

- Câu hỏi: `q`, `eq`, `image`
- Đáp án: mỗi phần tử trong `choices` có thể là chuỗi (cũ) hoặc object `{ text, eq, image }`
- Lời giải: `explain`, `explainEq`, `explainImage`

Bạn có thể kết hợp tự do: chỉ text, chỉ ảnh, chỉ eq, hoặc cả 2.

## 5) Kiểm tra nhanh

- Thêm ảnh vào `public/images/...`
- Sửa `public/questions.json` thêm các trường như trên
- Chạy `npm run dev` và kiểm tra trên trình duyệt
- Deploy lên GitHub: `git add . && git commit -m "Add images/LaTeX" && git push`

Chúc bạn soạn bài nhanh và đẹp! 🎉
