// Script để clear tất cả cache trong localStorage
console.log('🧹 Clearing all cache...')

// Clear cache keys
const cacheKeys = ['quizzes_cache', 'ielts_cache', 'ielts_listening_cache']

cacheKeys.forEach(key => {
  if (localStorage.getItem(key)) {
    localStorage.removeItem(key)
    console.log(`✅ Cleared: ${key}`)
  } else {
    console.log(`⚠️  Not found: ${key}`)
  }
})

// Clear all ielts_listening_result_* keys
Object.keys(localStorage).forEach(key => {
  if (key.startsWith('ielts_listening_result_')) {
    localStorage.removeItem(key)
    console.log(`✅ Cleared: ${key}`)
  }
})

console.log('✨ Cache cleared! Please refresh the page.')
