#!/bin/bash
echo "🎨 Final dark theme fix for ALL components..."

# Fix tất cả components
for file in src/components/*.jsx; do
  if [ -f "$file" ]; then
    echo "Checking $file..."
    
    # Fix các pattern còn thiếu
    sed -i '' 's/className="text-lg font-bold text-gray-900/className="text-lg font-bold text-gray-900 dark:text-gray-100/g' "$file"
    sed -i '' 's/className="font-semibold text-gray-900/className="font-semibold text-gray-900 dark:text-gray-100/g' "$file"
    sed -i '' 's/className="font-bold text-gray-900/className="font-bold text-gray-900 dark:text-gray-100/g' "$file"
    sed -i '' 's/className="font-medium text-gray-900/className="font-medium text-gray-900 dark:text-gray-100/g' "$file"
    
    # Fix borders trong các context khác nhau
    sed -i '' 's/border-2 border-gray-200/border-2 border-gray-200 dark:border-slate-700/g' "$file"
    sed -i '' 's/border-2 border-gray-300/border-2 border-gray-300 dark:border-slate-600/g' "$file"
    
    # Fix hover borders
    sed -i '' 's/hover:border-blue-300/hover:border-blue-300 dark:hover:border-blue-500/g' "$file"
    sed -i '' 's/hover:border-gray-300/hover:border-gray-300 dark:hover:border-slate-600/g' "$file"
    
    # Fix select elements
    sed -i '' 's/className="flex-1 px-3 py-2 border/className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100/g' "$file"
    
    # Fix checkboxes and radios labels
    sed -i '' 's/className="flex items-center gap-3 p-3 border-2 rounded-lg/className="flex items-center gap-3 p-3 border-2 border-gray-200 dark:border-slate-700 rounded-lg/g' "$file"
    sed -i '' 's/className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg hover:border-blue-300/className="flex items-center gap-3 p-3 border-2 border-gray-200 dark:border-slate-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-500/g' "$file"
    
    # Fix table headers
    sed -i '' 's/className="border border-gray-300 px-3 py-2/className="border border-gray-300 dark:border-slate-600 px-3 py-2/g' "$file"
    
  fi
done

echo "✅ All components updated!"
