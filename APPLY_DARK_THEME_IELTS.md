# 🎨 Hướng dẫn áp dụng Dark Theme cho IELTS Components

## Các thay đổi cần thực hiện

### 1. IELTSQuiz.jsx
```
Tìm và thay thế:
- `min-h-screen bg-gray-50` → `min-h-screen bg-gray-50 dark:bg-slate-900`
- `bg-white border-b border-gray-200` → `bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700`
- `text-gray-900` → `text-gray-900 dark:text-gray-100`
- `text-gray-600` → `text-gray-600 dark:text-gray-400`
- `text-gray-700` → `text-gray-700 dark:text-gray-300`
- `bg-white rounded-lg border border-gray-200` → `bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700`
- `bg-gray-50` (trong tables/forms) → `bg-gray-50 dark:bg-slate-700`
- `border-gray-300` → `border-gray-300 dark:border-slate-600`
- Input fields: Thêm `dark:bg-slate-700 dark:text-gray-100`
```

### 2. IELTSListening.jsx
```
Tương tự IELTSQuiz.jsx
```

### 3. IELTSResult.jsx
```
- Tất cả cards: Thêm dark variants
- Success/Error indicators: Thêm dark colors
- Text: Đảm bảo contrast tốt
```

### 4. AIGradingResult.jsx
```
- Gradient headers: Giữ nguyên (đã đẹp)
- Cards: Thêm dark variants
- Progress bars: Thêm dark colors
```

### 5. EssayQuestion.jsx
```
- Textarea: Thêm dark variants
- Tips box: Thêm dark colors
- Progress bar: Thêm dark colors
```

## Script tự động (chạy trong terminal)

```bash
# Backup trước
cp src/components/IELTSQuiz.jsx src/components/IELTSQuiz.jsx.backup
cp src/components/IELTSListening.jsx src/components/IELTSListening.jsx.backup
cp src/components/IELTSResult.jsx src/components/IELTSResult.jsx.backup

# Áp dụng dark theme
sed -i '' 's/min-h-screen bg-gray-50/min-h-screen bg-gray-50 dark:bg-slate-900/g' src/components/IELTS*.jsx
sed -i '' 's/bg-white border-b border-gray-200/bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700/g' src/components/IELTS*.jsx
sed -i '' 's/text-xl font-bold text-gray-900/text-xl font-bold text-gray-900 dark:text-gray-100/g' src/components/IELTS*.jsx
```

## Kiểm tra sau khi áp dụng

1. Mở app ở dark mode
2. Kiểm tra tất cả trang IELTS
3. Đảm bảo:
   - Chữ dễ đọc (contrast >= 4.5:1)
   - Không có chữ trắng trên nền trắng
   - Không có chữ đen trên nền đen
   - Inputs có nền tối và chữ sáng
   - Buttons có màu rõ ràng

## Rollback nếu cần

```bash
mv src/components/IELTSQuiz.jsx.backup src/components/IELTSQuiz.jsx
mv src/components/IELTSListening.jsx.backup src/components/IELTSListening.jsx
mv src/components/IELTSResult.jsx.backup src/components/IELTSResult.jsx
```
