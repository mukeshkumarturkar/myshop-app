#!/bin/bash

# MyShop - GitHub Repository Creation via Git CLI & API
# This script creates a remote repository and pushes your code

set -e

PROJECT_DIR="/Users/mukeshkumar/Work/IdeaProjects/MyShop"
REPO_NAME="myshop-app"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 MyShop - GitHub Repository Setup Using Git CLI"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Navigate to project
cd "$PROJECT_DIR"
echo "✅ Working directory: $PROJECT_DIR"
echo ""

# Get credentials
echo "📋 GitHub Authentication Required"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "You need:"
echo "  1. GitHub username"
echo "  2. GitHub Personal Access Token"
echo ""
echo "Get token at: https://github.com/settings/tokens/new"
echo "  - Name: myshop-deploy"
echo "  - Scope: Check 'repo'"
echo "  - Generate and COPY the token"
echo ""

read -p "👤 Enter GitHub username: " GITHUB_USER
read -sp "🔑 Paste Personal Access Token: " GITHUB_TOKEN
echo ""
echo ""

if [ -z "$GITHUB_USER" ] || [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ Error: Username and token are required"
    exit 1
fi

echo "📋 STEP 1: Create Repository Using GitHub API"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Creating repository: $REPO_NAME"
echo ""

# Create repository using GitHub API
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

# Check response
if echo "$RESPONSE" | grep -q '"id"'; then
    echo "✅ Repository created on GitHub"
    REPO_URL="https://github.com/${GITHUB_USER}/${REPO_NAME}.git"

    echo ""
    echo "📋 STEP 2: Configure Git Remote"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""

    # Check git status
    echo "Current git status:"
    git log --oneline | head -3
    echo ""

    # Remove existing remote if any
    git remote remove origin 2>/dev/null || echo "No existing remote"

    # Add remote
    git remote add origin "https://${GITHUB_USER}:${GITHUB_TOKEN}@github.com/${GITHUB_USER}/${REPO_NAME}.git"
    echo "✅ Remote added: $REPO_URL"
    echo ""

    # Ensure main branch
    echo "📋 STEP 3: Push Code to GitHub"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""

    git branch -M main 2>/dev/null || true
    echo "Pushing code to GitHub..."
    echo ""

    # Push to GitHub
    if git push -u origin main; then
        echo ""
        echo "╔════════════════════════════════════════════════════════════════╗"
        echo "║                   ✅ SUCCESS! 🎉                               ║"
        echo "║         Remote Repository Created & Code Pushed!              ║"
        echo "╚════════════════════════════════════════════════════════════════╝"
        echo ""
        echo "✅ Repository: https://github.com/${GITHUB_USER}/${REPO_NAME}"
        echo ""
        echo "📊 Status:"
        echo "   • Repository created on GitHub"
        echo "   • All code pushed to remote"
        echo "   • Ready for deployment"
        echo ""
        echo "🔗 Repository URL:"
        echo "   https://github.com/${GITHUB_USER}/${REPO_NAME}"
        echo ""
        echo "📈 Next Steps:"
        echo "   1. Visit your repository on GitHub"
        echo "   2. Verify all files are there"
        echo "   3. Deploy to Vercel: Read QUICK_DEPLOYMENT.md"
        echo "   4. Deploy to Play Store: Read MyShopApp/DEPLOYMENT.md"
        echo ""
    else
        echo "❌ Error pushing code to GitHub"
        echo "Try:"
        echo "  cd $PROJECT_DIR"
        echo "  git push -u origin main -v"
        exit 1
    fi
else
    ERROR_MSG=$(echo "$RESPONSE" | grep -o '"message":"[^"]*' | cut -d'"' -f4 || echo "Unknown error")
    echo "❌ Failed to create repository"
    echo "Error: $ERROR_MSG"
    echo ""
    echo "Possible causes:"
    echo "  1. Repository already exists"
    echo "  2. Invalid token (must have 'repo' scope)"
    echo "  3. Invalid username"
    echo ""
    echo "Debug response:"
    echo "$RESPONSE"
    exit 1
fi

echo ""

