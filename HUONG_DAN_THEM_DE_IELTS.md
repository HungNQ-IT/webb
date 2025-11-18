# HƯỚNG DẪN THÊM ĐỀ IELTS READING

## Bạn CHỈ CẦN chỉnh file `public/ielts.json` - KHÔNG CẦN code!

---

## CÁC DẠNG CÂU HỎI ĐÃ HỖ TRỢ

1. **note-completion** - Điền từ vào notes
2. **table-completion** - Điền từ vào bảng
3. **true-false-not-given** - True/False/Not Given
4. **matching-headings** - Nối tiêu đề với đoạn văn
5. **matching-information** - Tìm thông tin trong đoạn văn nào
6. **multiple-choice-two** - Chọn 2 đáp án đúng
7. **summary-completion** - Điền từ vào tóm tắt

---

## CÁCH THÊM MỘT ĐỀ MỚI

### Bước 1: Mở file `public/ielts.json`

### Bước 2: Thêm object mới vào cuối mảng (trước dấu `]` cuối cùng)

```json
{
  "id": 105,  // Tăng ID lên (101, 102, 103, 104, 105...)
  "subject": "IELTS",
  "category": "Reading",  // Hoặc "Listening", "Writing", "Speaking"
  "title": "IELTS Practice Set 3 Reading test 2",  // Tên đề
  "difficulty": "medium",  // "easy", "medium", hoặc "hard"
  "type": "ielts-reading",
  "description": "Practice test for IELTS Reading section",
  "timeLimit": 60,  // Thời gian làm bài (phút)
  "sections": 3,  // Số passage
  "passages": [
    // Thêm các passage ở đây (xem bên dưới)
  ]
}
```

### Bước 3: Thêm Passage

Mỗi passage có cấu trúc:

```json
{
  "id": 1,  // 1, 2, 3
  "title": "Passage 1",
  "text": "Đoạn văn đầy đủ ở đây...\n\nDùng \\n\\n để xuống dòng giữa các đoạn.",
  "questions": [
    // Thêm câu hỏi ở đây (xem các mẫu bên dưới)
  ]
}
```

---

## MẪU CÁC DẠNG CÂU HỎI

### 1. NOTE COMPLETION (Điền từ vào notes)

```json
{
  "type": "note-completion",
  "instruction": "Complete the notes below. Choose ONE WORD ONLY from the passage for each answer.",
  "notes": {
    "title": "Tiêu đề notes",
    "sections": [
      {
        "heading": "Tiêu đề phần 1",
        "items": [
          "building a 'magical kingdom' may help develop 1______",
          "board games involve 2______ and turn-taking"
        ]
      },
      {
        "heading": "Tiêu đề phần 2",
        "items": [
          "populations of 3______ have grown",
          "- fear of 4______"
        ]
      }
    ]
  },
  "answers": [
    "creativity",
    "rules",
    "cities",
    "traffic"
  ]
}
```

**Lưu ý:** Số trong `1______`, `2______` phải liên tục từ 1, 2, 3...

---

### 2. TABLE COMPLETION (Điền từ vào bảng)

```json
{
  "type": "table-completion",
  "instruction": "Complete the table below. Choose NO MORE THAN TWO WORDS from the text for each answer.",
  "table": {
    "headers": ["Time", "Person/s", "Position", "Action"],
    "rows": [
      ["11:39 p.m.", "1______", "2______", "Reported sighting"],
      ["3______", "Andrews", "Ship's designer", "Reported damage"]
    ]
  },
  "answers": [
    "Fleet and Lee",
    "Lookouts",
    "Midnight"
  ]
}
```

**Lưu ý:** Đáp án theo thứ tự xuất hiện của `______` trong bảng.

---

### 3. TRUE/FALSE/NOT GIVEN

```json
{
  "type": "true-false-not-given",
  "instruction": "Do the following statements agree with the information given in Reading Passage 1?",
  "items": [
    {
      "question": "Children with good self-control are known to be likely to do well at school later on.",
      "answer": "TRUE"
    },
    {
      "question": "Playing with dolls was found to benefit girls' writing more than boys' writing.",
      "answer": "NOT GIVEN"
    },
    {
      "question": "Children had problems thinking up ideas when they first created the story with Lego.",
      "answer": "FALSE"
    }
  ]
}
```

**Đáp án:** `"TRUE"`, `"FALSE"`, hoặc `"NOT GIVEN"`

---

### 4. MATCHING HEADINGS (Nối tiêu đề với đoạn văn)

```json
{
  "type": "matching-headings",
  "instruction": "Choose the correct heading for each paragraph from the list of headings below.",
  "headings": [
    "The limitations of early urban planning",
    "Modern approaches to sustainable cities",
    "The origins of urban planning"
  ],
  "paragraphs": [
    {
      "paragraph": "A",
      "correctHeading": 2
    },
    {
      "paragraph": "B",
      "correctHeading": 0
    },
    {
      "paragraph": "C",
      "correctHeading": 1
    }
  ]
}
```

**Lưu ý:** `correctHeading` là **index** (bắt đầu từ 0) của heading trong mảng `headings`.

---

### 5. MATCHING INFORMATION (Tìm thông tin trong đoạn văn nào)

```json
{
  "type": "matching-information",
  "instruction": "Reading Passage 2 has seven paragraphs, A-G. Which paragraph contains the following information?",
  "items": [
    {
      "question": "a description of how people misused a bike-sharing scheme",
      "answer": "E"
    },
    {
      "question": "an explanation of why a proposed bike-sharing scheme was turned down",
      "answer": "C"
    }
  ]
}
```

**Đáp án:** Chữ cái đoạn văn `"A"`, `"B"`, `"C"`, etc.

---

### 6. MULTIPLE CHOICE - CHOOSE TWO (Chọn 2 đáp án)

```json
{
  "type": "multiple-choice-two",
  "instruction": "Choose TWO letters, A-E. Which TWO of the following statements are made in the text?",
  "options": [
    "It was initially opposed by a government department.",
    "It failed when a partner in the scheme withdrew support.",
    "It aimed to be more successful than the Copenhagen scheme.",
    "It was made possible by a change in people's attitudes.",
    "It attracted interest from a range of bike designers."
  ],
  "correctAnswers": [1, 3]
}
```

**Lưu ý:** `correctAnswers` là **index** (bắt đầu từ 0) của các đáp án đúng.

---

### 7. SUMMARY COMPLETION (Điền từ vào tóm tắt)

```json
{
  "type": "summary-completion",
  "instruction": "Complete the summary below. Choose ONE WORD ONLY from the passage for each answer.",
  "summary": {
    "title": "The first urban bike-sharing scheme",
    "text": "The first bike-sharing scheme was the idea of the Dutch group Provo. The people who belonged to this group were 23______. They were concerned about damage to the environment and about 24______, and believed that the bike-sharing scheme would draw attention to these issues."
  },
  "answers": [
    "activists",
    "consumerism"
  ]
}
```

**Lưu ý:** Số trong `23______`, `24______` không quan trọng, chỉ cần theo thứ tự.

---

## VÍ DỤ ĐẦY ĐỦ MỘT ĐỀ

Xem file `public/ielts.json` - đề có ID 101 để tham khảo cấu trúc đầy đủ!

---

## LƯU Ý QUAN TRỌNG

1. **Dấu phẩy:** Nhớ thêm dấu phẩy `,` giữa các object, KHÔNG có dấu phẩy sau object cuối cùng
2. **Dấu ngoặc kép:** Tất cả text phải trong dấu `"..."`
3. **Xuống dòng:** Dùng `\n\n` để xuống dòng trong text
4. **ID:** Mỗi đề phải có ID khác nhau (101, 102, 103...)
5. **Passage ID:** Trong mỗi đề, passage có id 1, 2, 3

---

## KIỂM TRA JSON HỢP LỆ

Sau khi chỉnh xong, kiểm tra JSON có hợp lệ không tại: https://jsonlint.com/

---

## CẦN GIÚP?

Nếu gặp lỗi, mở Console (F12) trong trình duyệt để xem lỗi gì!
