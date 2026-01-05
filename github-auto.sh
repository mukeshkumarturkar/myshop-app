#!/bin/bash

# MyShop - Fully Automated GitHub Setup (Non-Interactive)
# Usage: GITHUB_USER=<username> GITHUB_TOKEN=<token> bash /path/to/this/script

set -e

PROJECT_DIR="/Users/mukeshkumar/Work/IdeaProjects/MyShop"
REPO_NAME="myshop-app"

# Check if running with environment variables
if [ -z "$GITHUB_USER" ] || [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ Error: Required environment variables not set"
    echo ""
    echo "Usage:"
    echo "  GITHUB_USER=your_username GITHUB_TOKEN=your_token $0"
    echo ""
    echo "OR interactively:"
    echo "  /Users/mukeshkumar/Work/IdeaProjects/MyShop/push-to-github.sh"
    exit 1
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 MyShop - Creating GitHub Repository"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd "$PROJECT_DIR"
echo "✅ Project directory: $PROJECT_DIR"
echo "✅ GitHub User: $GITHUB_USER"
echo "✅ Repository: $REPO_NAME"
echo ""

echo "📋 Creating repository on GitHub..."
echo ""

# Create repository
RESPONSE=$(curl -s -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/user/repos \
  -d "{
    \"name\": \"$REPO_NAME\",
    \"description\": \"React Native shop management app with cross-platform support\",
    \"private\": false,
    \"auto_init\": false
  }")

if echo "$RESPONSE" | grep -q '"id"'; then
    echo "✅ Repository created successfully!"
    echo ""

    echo "📋 Configuring git and pushing code..."
    echo ""

    # Configure git
    git remote remove origin 2>/dev/null || true
    git remote add origin "https://${GITHUB_USER}:${GITHUB_TOKEN}@github.com/${GITHUB_USER}/${REPO_NAME}.git"
    git branch -M main 2>/dev/null || true

    # Push code
    if git push -u origin main 2>&1 | tail -5; then
        echo ""
        echo "╔════════════════════════════════════════════════════════════════╗"
        echo "║                   ✅ SUCCESS! 🎉                               ║"
        echo "╚════════════════════════════════════════════════════════════════╝"
        echo ""
        echo "✅ GitHub Repository Created & Code Pushed!"
        echo ""
        echo "Repository: https://github.com/${GITHUB_USER}/${REPO_NAME}"
        echo ""
    else
        echo "❌ Error pushing code"
        exit 1
    fi
else
    echo "❌ Failed to create repository"
    echo "$RESPONSE"
    exit 1
fi

