#!/bin/bash

# Script để áp dụng dark theme cho tất cả components
echo "🎨 Applying dark theme to all components..."

# List of all component files
FILES=(
  "src/components/AdminDashboard.jsx"
  "src/components/AdminAudioManager.jsx"
  "src/components/GradeList.jsx"
  "src/components/Loading.jsx"
  "src/components/RequireAuth.jsx"
  "src/components/AudioPlayer.jsx"
  "src/components/EssayQuestion.jsx"
  "src/components/AIGradingResult.jsx"
  "src/components/RichContent.jsx"
  "src/components/gradetoan.jsx"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "✓ Updating $file"
    
    # Background colors
    sed -i '' 's/className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100/className="min-h-screen bg-gray-50 dark:bg-slate-900/g' "$file"
    sed -i '' 's/className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100/className="min-h-screen bg-gray-50 dark:bg-slate-900/g' "$file"
    
    # Text colors - more specific patterns
    sed -i '' 's/text-gray-800"/text-gray-800 dark:text-gray-100"/g' "$file"
    sed -i '' 's/text-gray-500"/text-gray-500 dark:text-gray-400"/g' "$file"
    
    # Hover states
    sed -i '' 's/hover:bg-gray-50/hover:bg-gray-50 dark:hover:bg-slate-700/g' "$file"
    sed -i '' 's/hover:bg-gray-100/hover:bg-gray-100 dark:hover:bg-slate-600/g' "$file"
    
    # Focus states
    sed -i '' 's/focus:ring-indigo-500/focus:ring-blue-500 dark:focus:ring-blue-400/g' "$file"
    sed -i '' 's/focus:border-indigo-500/focus:border-blue-500 dark:focus:border-blue-400/g' "$file"
    
    # Disabled states
    sed -i '' 's/disabled:bg-gray-100/disabled:bg-gray-100 dark:disabled:bg-slate-600/g' "$file"
    
  else
    echo "✗ File not found: $file"
  fi
done

echo "✅ Dark theme applied to all components!"
echo "🧪 Please test the app in dark mode"
