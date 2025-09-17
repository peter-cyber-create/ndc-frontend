#!/bin/bash

echo "🚀 Pushing NDC Frontend to GitHub..."
echo "Repository: https://github.com/peter-cyber-create/ndc-frontend.git"
echo "Username: peter-cyber-create"
echo "Email: peterpaulwagidoso1@gmail.com"
echo ""

# Check if we have changes to push
git log --oneline -1
echo ""

echo "When prompted for password, use your GitHub Personal Access Token (not your password)"
echo "If you don't have a token, create one at: https://github.com/settings/tokens"
echo ""

# Push to GitHub
git push https://peter-cyber-create@github.com/peter-cyber-create/ndc-frontend.git main

echo ""
echo "✅ Push completed! Check your repository at:"
echo "https://github.com/peter-cyber-create/ndc-frontend"
