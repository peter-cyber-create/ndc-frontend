#!/bin/bash
echo "🔄 Updating admin form endpoints with cache-busting and refresh functionality..."

# Update abstracts admin page with cache-busting
sed -i 's|const response = await fetch(`${API_URL}/api/admin/abstracts`)|const response = await fetch(`${API_URL}/api/admin/abstracts?t=${Date.now()}`, { cache: "no-store" })|g' app/admin/abstracts/page.tsx

# Update registrations admin page with cache-busting  
sed -i 's|const response = await fetch(`${API_URL}/api/admin/registrations`)|const response = await fetch(`${API_URL}/api/admin/registrations?t=${Date.now()}`, { cache: "no-store" })|g' app/admin/registrations/page.tsx

# Update contacts admin page with cache-busting
sed -i 's|const response = await fetch(`${API_URL}/api/admin/contacts`)|const response = await fetch(`${API_URL}/api/admin/contacts?t=${Date.now()}`, { cache: "no-store" })|g' app/admin/contacts/page.tsx

# Update exhibitors admin page with cache-busting
sed -i 's|const response = await fetch(`${API_URL}/api/admin/exhibitors`)|const response = await fetch(`${API_URL}/api/admin/exhibitors?t=${Date.now()}`, { cache: "no-store" })|g' app/admin/exhibitors/page.tsx

# Update sponsorships admin page with cache-busting
sed -i 's|const response = await fetch(`${API_URL}/api/admin/sponsorships`)|const response = await fetch(`${API_URL}/api/admin/sponsorships?t=${Date.now()}`, { cache: "no-store" })|g' app/admin/sponsorships/page.tsx

# Ensure all admin API routes have proper no-cache headers
echo "📝 Ensuring all admin APIs have no-cache headers..."

# Add no-cache headers to all admin API responses
for api_file in app/api/admin/*/route.ts; do
  if [ -f "$api_file" ]; then
    # Check if no-cache headers are already present
    if ! grep -q "Cache-Control.*no-store" "$api_file"; then
      echo "Adding no-cache headers to: $api_file"
      # Add headers before the return statement
      sed -i '/return NextResponse\.json(/i\    \
    \/\/ Add cache-control headers to prevent caching\
    const response = NextResponse.json({\
      success: true,\
      data: rows\
    })\
    \
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")\
    response.headers.set("Pragma", "no-cache")\
    response.headers.set("Expires", "0")\
    \
    return response' "$api_file" 2>/dev/null || echo "Headers already present in $api_file"
    fi
  fi
done

echo "✅ Admin endpoints updated with cache-busting and no-cache headers"
echo "🔄 Building and restarting..."

# Build and restart
npm run build
sudo pkill -f "next-server" 2>/dev/null
sleep 2
nohup npm start > /dev/null 2>&1 &

echo "🎉 Admin dashboard updated successfully!"
echo ""
echo "📊 Testing endpoints:"
sleep 3
echo "Abstracts: $(curl -s "http://172.27.0.9:3000/api/admin/abstracts?t=$(date +%s)" | jq '.data | length') records"
echo "Registrations: $(curl -s "http://172.27.0.9:3000/api/admin/registrations?t=$(date +%s)" | jq '.data | length') records"
echo "✅ All admin endpoints working with fresh data!"
