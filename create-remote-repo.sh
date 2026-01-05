#!/bin/bash

# MyShop - Complete GitHub Repository Setup Using Git Commands
# This script creates a GitHub repository and pushes code

set -e

PROJECT_DIR="/Users/mukeshkumar/Work/IdeaProjects/MyShop"
REPO_NAME="myshop-app"

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║    MyShop - GitHub Repository Creation Using Git CLI           ║"
echo "║    Interactive Setup with GitHub Authentication               ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

cd "$PROJECT_DIR"

echo "✅ Project Directory: $PROJECT_DIR"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔐 GitHub Authentication"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if already authenticated
echo "Checking GitHub authentication..."
echo ""

# Get GitHub credentials
read -p "👤 Enter your GitHub username: " GITHUB_USER

if [ -z "$GITHUB_USER" ]; then
    echo "❌ Username required"
    exit 1
fi

read -sp "🔑 Enter your GitHub password or Personal Access Token: " GITHUB_TOKEN
echo ""
echo ""

if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ Password/Token required"
    exit 1
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Creating GitHub Repository"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Create repository using GitHub API
echo "Creating repository on GitHub..."
RESPONSE=$(curl -s -X POST \
  -u "$GITHUB_USER:$GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/user/repos \
  -d "{
    \"name\": \"$REPO_NAME\",
    \"description\": \"React Native shop management app\",
    \"private\": false,
    \"auto_init\": false
  }")

# Check if successful
if echo "$RESPONSE" | grep -q '"id"'; then
    echo "✅ Repository created successfully!"
    echo ""

    REPO_URL="https://github.com/${GITHUB_USER}/${REPO_NAME}.git"

    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📋 Configuring Git and Pushing Code"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""

    # Configure git
    echo "Configuring git remote..."

    # Remove existing remote if present
    git remote remove origin 2>/dev/null || true

    # Add remote with HTTPS
    git remote add origin "$REPO_URL"
    echo "✅ Remote configured: $REPO_URL"
    echo ""

    # Ensure main branch
    git branch -M main 2>/dev/null || true

    # Configure git to use credential helper for authentication
    echo "Pushing code to GitHub..."
    echo ""

    # Push with explicit authentication
    if GIT_ASKPASS=/bin/echo GIT_ASKPASS_ECHO=on git -c "http.extraheader=Authorization: Basic $(echo -n "$GITHUB_USER:$GITHUB_TOKEN" | base64)" push -u origin main; then
        echo ""
        echo "╔════════════════════════════════════════════════════════════════╗"
        echo "║                   ✅ SUCCESS! 🎉                               ║"
        echo "║    Remote Repository Created & Code Pushed to GitHub!         ║"
        echo "╚════════════════════════════════════════════════════════════════╝"
        echo ""
        echo "📊 Repository Information:"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        echo "✅ GitHub Repository:"
        echo "   URL: https://github.com/${GITHUB_USER}/${REPO_NAME}"
        echo "   Name: $REPO_NAME"
        echo "   Owner: $GITHUB_USER"
        echo "   Visibility: Public"
        echo ""
        echo "✅ Code Status:"
        echo "   Branch: main"
        echo "   Commits pushed: $(git rev-list --count HEAD)"
        echo "   Files: $(git ls-files | wc -l)"
        echo ""
        echo "📈 Next Steps:"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        echo "1️⃣  Verify Repository"
        echo "   Visit: https://github.com/${GITHUB_USER}/${REPO_NAME}"
        echo ""
        echo "2️⃣  Deploy to Vercel"
        echo "   Read: QUICK_DEPLOYMENT.md"
        echo ""
        echo "3️⃣  Deploy to Play Store"
        echo "   Read: MyShopApp/DEPLOYMENT.md"
        echo ""

    else
        echo "❌ Error pushing code"
        echo ""
        echo "Try alternative push method:"
        echo "  cd $PROJECT_DIR"
        echo "  git push -u origin main"
        exit 1
    fi
else
    ERROR=$(echo "$RESPONSE" | grep -o '"message":"[^"]*' | cut -d'"' -f4 || echo "Unknown error")
    echo "❌ Failed to create repository"
    echo "Error: $ERROR"
    echo ""
    echo "Check:"
    echo "  1. GitHub username is correct"
    echo "  2. Password/Token is correct"
    echo "  3. Repository doesn't already exist"
    exit 1
fi

echo ""

