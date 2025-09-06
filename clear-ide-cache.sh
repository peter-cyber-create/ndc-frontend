#!/bin/bash

echo "🧹 Clearing IDE TypeScript cache..."

# Kill any existing TypeScript processes
pkill -f "typescript" 2>/dev/null || true

# Clear Next.js cache
rm -rf .next

# Clear node_modules cache
rm -rf node_modules/.cache

# Reinstall dependencies to ensure clean state
echo "📦 Reinstalling dependencies..."
npm install

# Run TypeScript check to verify no errors
echo "🔍 Running TypeScript check..."
npx tsc --noEmit

if [ $? -eq 0 ]; then
    echo "✅ TypeScript compilation successful - no errors found!"
    echo "💡 The IDE errors you're seeing are stale. Try:"
    echo "   1. Restart TypeScript Language Server (Ctrl+Shift+P -> 'TypeScript: Restart TS Server')"
    echo "   2. Or reload the window (Ctrl+Shift+P -> 'Developer: Reload Window')"
    echo "   3. Or close and reopen your IDE"
else
    echo "❌ TypeScript errors found"
fi

echo "🚀 Starting development server..."
npm run dev > /dev/null 2>&1 &
echo "✅ Development server started in background"

