// Script để clear cache - chạy trong browser console
console.log('Clearing IELTS cache...')
localStorage.removeItem('ielts_cache')
localStorage.removeItem('quizzes_cache')
console.log('Cache cleared! Please refresh the page.')
