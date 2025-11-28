// AI Grading Service - Dùng Google Gemini API (miễn phí)

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'

/**
 * Chấm điểm câu trả lời tự luận bằng AI
 * @param {string} question - Câu hỏi
 * @param {string} studentAnswer - Câu trả lời của học sinh
 * @param {string} correctAnswer - Đáp án mẫu (nếu có)
 * @param {number} maxScore - Điểm tối đa
 * @returns {Promise<{score: number, feedback: string, strengths: string[], improvements: string[]}>}
 */
export async function gradeEssayWithAI(question, studentAnswer, correctAnswer = '', maxScore = 10) {
  // Validate input
  if (!studentAnswer || studentAnswer.trim().length < 10) {
    return {
      score: 0,
      feedback: 'Câu trả lời quá ngắn hoặc chưa có nội dung.',
      strengths: [],
      improvements: ['Viết câu trả lời đầy đủ hơn', 'Phát triển ý tưởng rõ ràng']
    }
  }

  // Nếu không có API key, dùng chấm điểm đơn giản
  if (!GEMINI_API_KEY) {
    return simpleGrading(studentAnswer, correctAnswer, maxScore)
  }

  try {
    const prompt = buildGradingPrompt(question, studentAnswer, correctAnswer, maxScore)
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.4,
          topK: 32,
          topP: 1,
          maxOutputTokens: 1024,
        }
      })
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    const aiResponse = data.candidates[0].content.parts[0].text
    
    return parseAIResponse(aiResponse, maxScore)
    
  } catch (error) {
    console.error('AI grading error:', error)
    // Fallback to simple grading
    return simpleGrading(studentAnswer, correctAnswer, maxScore)
  }
}

/**
 * Xây dựng prompt cho AI
 */
function buildGradingPrompt(question, studentAnswer, correctAnswer, maxScore) {
  return `Bạn là giáo viên chấm bài. Hãy chấm điểm câu trả lời tự luận sau một cách LINH HOẠT:

**Câu hỏi:**
${question}

${correctAnswer ? `**Đáp án mẫu:**
${correctAnswer}
` : ''}

**Câu trả lời của học sinh:**
${studentAnswer}

**NGUYÊN TẮC CHẤM ĐIỂM LINH HOẠT:**

1. **Phân tích yêu cầu đề bài:**
   - Nếu đề hỏi "Tìm x", "Giải phương trình" → Chỉ cần kết quả đúng (x = ...) là được điểm cao
   - Nếu đề hỏi "Giải thích", "Phân tích", "Trình bày" → Cần câu trả lời dài, có lý lẽ
   - Nếu đề hỏi "Tính", "Tìm" → Kết quả đúng quan trọng nhất, trình bày ngắn gọn OK
   - Nếu đề hỏi "Chứng minh", "Giải thích các bước" → Cần trình bày chi tiết từng bước

2. **Chấm điểm dựa trên yêu cầu:**
   - Câu hỏi ngắn (tìm x, tính toán) → Đáp án đúng = điểm cao, không cần dài dòng
   - Câu hỏi dài (giải thích, phân tích) → Cần nội dung đầy đủ, logic rõ ràng
   - Không bắt buộc học sinh viết dài nếu đề không yêu cầu

3. **Tiêu chí đánh giá:**
   - Độ chính xác của kết quả (quan trọng nhất)
   - Phù hợp với yêu cầu đề bài
   - Logic và mạch lạc (nếu cần trình bày)
   - Ngữ pháp, trình bày (chỉ trừ điểm nhẹ nếu sai)

**Yêu cầu:**
- Điểm tối đa: ${maxScore}
- Cho điểm công bằng, linh hoạt theo yêu cầu đề
- Không bắt buộc viết dài nếu đề không yêu cầu

**Trả lời theo format JSON:**
{
  "score": <số điểm từ 0 đến ${maxScore}>,
  "feedback": "<nhận xét ngắn gọn 1-2 câu>",
  "strengths": ["<điểm mạnh 1>", "<điểm mạnh 2>"],
  "improvements": ["<cần cải thiện 1>", "<cần cải thiện 2>"]
}

Chỉ trả về JSON, không thêm text khác.`
}

/**
 * Parse response từ AI
 */
function parseAIResponse(aiResponse, maxScore) {
  try {
    // Remove markdown code blocks if present
    let jsonStr = aiResponse.trim()
    if (jsonStr.startsWith('```json')) {
      jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '')
    } else if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/```\n?/g, '')
    }
    
    const result = JSON.parse(jsonStr)
    
    // Validate and normalize
    return {
      score: Math.min(Math.max(0, result.score || 0), maxScore),
      feedback: result.feedback || 'Đã chấm điểm.',
      strengths: Array.isArray(result.strengths) ? result.strengths : [],
      improvements: Array.isArray(result.improvements) ? result.improvements : []
    }
  } catch (error) {
    console.error('Parse AI response error:', error)
    // Fallback: extract score from text
    const scoreMatch = aiResponse.match(/score["\s:]+(\d+\.?\d*)/i)
    const score = scoreMatch ? parseFloat(scoreMatch[1]) : maxScore * 0.5
    
    return {
      score: Math.min(Math.max(0, score), maxScore),
      feedback: 'Đã chấm điểm tự động.',
      strengths: ['Đã hoàn thành bài làm'],
      improvements: ['Cần phát triển thêm']
    }
  }
}

/**
 * Chấm điểm đơn giản (fallback khi không có AI)
 */
function simpleGrading(studentAnswer, correctAnswer, maxScore) {
  const answerLength = studentAnswer.trim().length
  const answerLower = studentAnswer.toLowerCase()
  
  let score = 0
  let feedback = ''
  let strengths = []
  let improvements = []
  
  // Nếu có đáp án mẫu, so sánh
  if (correctAnswer) {
    const similarity = calculateSimilarity(answerLower, correctAnswer.toLowerCase())
    
    // Chấm điểm linh hoạt
    if (similarity >= 0.7) {
      // Đáp án rất giống → Điểm cao
      score = maxScore * (0.8 + similarity * 0.2)
      feedback = 'Câu trả lời đúng và phù hợp với đáp án.'
      strengths.push('Nội dung chính xác')
    } else if (similarity >= 0.4) {
      // Đáp án tương đối giống → Điểm trung bình
      score = maxScore * (0.5 + similarity * 0.3)
      feedback = 'Câu trả lời có một số điểm đúng nhưng chưa đầy đủ.'
      strengths.push('Có nắm được ý chính')
      improvements.push('Cần bổ sung thêm chi tiết')
    } else {
      // Đáp án khác nhiều → Điểm thấp
      score = maxScore * 0.3
      feedback = 'Câu trả lời chưa chính xác, cần xem lại đáp án mẫu.'
      improvements.push('Xem lại đáp án mẫu', 'Cần hiểu rõ hơn về vấn đề')
    }
    
    // Điều chỉnh theo độ dài (nếu quá ngắn)
    if (answerLength < 20 && correctAnswer.length > 50) {
      score *= 0.7
      improvements.push('Câu trả lời quá ngắn so với yêu cầu')
    }
  } else {
    // Không có đáp án mẫu → Chấm theo độ dài và cấu trúc
    if (answerLength >= 100) {
      score = maxScore * 0.7
      feedback = 'Câu trả lời đầy đủ.'
      strengths.push('Trả lời đầy đủ')
    } else if (answerLength >= 50) {
      score = maxScore * 0.5
      feedback = 'Câu trả lời tương đối đầy đủ.'
      strengths.push('Có trả lời')
      improvements.push('Nên phát triển thêm')
    } else {
      score = maxScore * 0.3
      feedback = 'Câu trả lời quá ngắn.'
      improvements.push('Cần viết đầy đủ hơn')
    }
  }
  
  return {
    score: Math.round(score * 10) / 10,
    feedback,
    strengths,
    improvements
  }
}

/**
 * Tính độ tương đồng giữa 2 chuỗi (đơn giản)
 */
function calculateSimilarity(str1, str2) {
  const words1 = str1.split(/\s+/)
  const words2 = str2.split(/\s+/)
  
  let matchCount = 0
  words1.forEach(word => {
    if (words2.includes(word) && word.length > 3) {
      matchCount++
    }
  })
  
  return matchCount / Math.max(words1.length, words2.length)
}

/**
 * Chấm điểm nhiều câu cùng lúc
 */
export async function gradeMultipleEssays(essays) {
  const results = await Promise.all(
    essays.map(essay => 
      gradeEssayWithAI(
        essay.question,
        essay.studentAnswer,
        essay.correctAnswer,
        essay.maxScore
      )
    )
  )
  
  return results
}

export default {
  gradeEssayWithAI,
  gradeMultipleEssays
}
