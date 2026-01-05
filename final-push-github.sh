#!/bin/bash

# ============================================================================
# MyShop - GitHub Repository Creation & Push to Remote
# This script creates a GitHub repository and pushes your local code
# ============================================================================

set -e

PROJECT_DIR="/Users/mukeshkumar/Work/IdeaProjects/MyShop"
REPO_NAME="myshop-app"

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║    MyShop - GitHub Repository Creation & Code Push            ║"
echo "║    Interactive Setup Using Git CLI                             ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Navigate to project
cd "$PROJECT_DIR"

echo "✅ Current directory: $PROJECT_DIR"
echo ""

# Check git status
echo "📊 Git Status:"
echo "  Commits: $(git rev-list --count HEAD)"
echo "  Branch: $(git rev-parse --abbrev-ref HEAD)"
echo "  Remote: $(git remote -v | wc -l) configured"
echo ""

# Get GitHub credentials
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔐 GitHub Authentication"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "You need a GitHub Personal Access Token with 'repo' scope."
echo "Get it here: https://github.com/settings/tokens/new"
echo ""
echo "Steps:"
echo "  1. Go to https://github.com/settings/tokens/new"
echo "  2. Token name: myshop-deploy"
echo "  3. Check scope: repo (full control of private repositories)"
echo "  4. Click: Generate token"
echo "  5. Copy the token immediately (you won't see it again)"
echo ""

read -p "👤 Enter your GitHub username: " GITHUB_USER
echo ""

read -sp "🔑 Paste your GitHub Personal Access Token: " GITHUB_TOKEN
echo ""
echo ""

# Validate input
if [ -z "$GITHUB_USER" ] || [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ Error: GitHub username and token are required"
    exit 1
fi

# Validate token format (basic check)
if [ ${#GITHUB_TOKEN} -lt 20 ]; then
    echo "⚠️  Warning: Token seems too short. Continue? (y/n)"
    read -p "" CONTINUE
    if [ "$CONTINUE" != "y" ]; then
        exit 1
    fi
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 STEP 1: Create Repository on GitHub"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Repository details:"
echo "  Name: $REPO_NAME"
echo "  Description: React Native shop management app"
echo "  Visibility: Public"
echo "  Owner: $GITHUB_USER"
echo ""
echo "Creating repository..."
echo ""

# Create repository using GitHub API
RESPONSE=$(curl -s -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/user/repos \
  -d "{
    \"name\": \"$REPO_NAME\",
    \"description\": \"React Native shop management app with cross-platform support (Android, iOS, Web)\",
    \"private\": false,
    \"auto_init\": false
  }")

# Check if successful
if echo "$RESPONSE" | grep -q '"id"'; then
    echo "✅ Repository created successfully on GitHub!"
    REPO_URL="https://github.com/${GITHUB_USER}/${REPO_NAME}.git"
    REPO_HTTPS="https://${GITHUB_USER}:${GITHUB_TOKEN}@github.com/${GITHUB_USER}/${REPO_NAME}.git"

    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📋 STEP 2: Configure Git Remote and Push Code"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""

    # Remove existing remote if present
    if git remote get-url origin &>/dev/null; then
        echo "Removing existing remote..."
        git remote remove origin
    fi

    # Add new remote
    echo "Adding remote repository..."
    git remote add origin "$REPO_HTTPS"
    echo "✅ Remote added"
    echo ""

    # Ensure on main branch
    echo "Checking branch..."
    CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
    if [ "$CURRENT_BRANCH" != "main" ]; then
        echo "Renaming branch to 'main'..."
        git branch -M main
        echo "✅ Branch renamed to main"
    else
        echo "✅ Already on main branch"
    fi
    echo ""

    # Push to GitHub
    echo "Pushing code to GitHub..."
    echo ""

    if git push -u origin main; then
        echo ""
        echo ""
        echo "╔════════════════════════════════════════════════════════════════╗"
        echo "║                                                                ║"
        echo "║                   ✅ SUCCESS! 🎉                               ║"
        echo "║                                                                ║"
        echo "║         Remote Repository Created & Code Pushed!              ║"
        echo "║                                                                ║"
        echo "╚════════════════════════════════════════════════════════════════╝"
        echo ""

        echo "📊 Repository Information:"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        echo "✅ GitHub Repository Created:"
        echo "   URL: https://github.com/${GITHUB_USER}/${REPO_NAME}"
        echo ""
        echo "✅ Code Pushed to Remote:"
        echo "   Branch: main"
        echo "   Status: All commits pushed"
        echo ""
        echo "📈 Repository Statistics:"
        echo "   Total commits: $(git rev-list --count HEAD)"
        echo "   Total files: $(git ls-files | wc -l)"
        echo ""

        echo "📋 Next Steps:"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        echo "1️⃣  Verify on GitHub"
        echo "   Visit: https://github.com/${GITHUB_USER}/${REPO_NAME}"
        echo "   Check that all files are visible"
        echo ""
        echo "2️⃣  Deploy to Vercel (Web Testing)"
        echo "   Read: $PROJECT_DIR/QUICK_DEPLOYMENT.md"
        echo "   Deploy web version for testing"
        echo ""
        echo "3️⃣  Deploy to Play Store (Mobile App)"
        echo "   Read: $PROJECT_DIR/MyShopApp/DEPLOYMENT.md"
        echo "   Build and submit to Google Play Store"
        echo ""
        echo "✨ Your code is now:"
        echo "   ✅ Backed up on GitHub"
        echo "   ✅ Ready for Vercel deployment"
        echo "   ✅ Ready for team collaboration"
        echo "   ✅ Ready for Play Store build"
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""

        # Cleanup token from history (best effort)
        history -d $(history 1) 2>/dev/null || true

    else
        echo ""
        echo "❌ Error pushing code to GitHub"
        echo ""
        echo "Possible reasons:"
        echo "  1. Network connection issue"
        echo "  2. Token invalid or doesn't have 'repo' scope"
        echo "  3. GitHub API temporarily unavailable"
        echo ""
        echo "Try again:"
        echo "  cd $PROJECT_DIR"
        echo "  git push -u origin main -v"
        exit 1
    fi
else
    # Extract error message
    ERROR_MSG=$(echo "$RESPONSE" | grep -o '"message":"[^"]*' | cut -d'"' -f4 || echo "Unknown error")

    echo "❌ Failed to create repository on GitHub"
    echo ""
    echo "Error: $ERROR_MSG"
    echo ""
    echo "Possible causes:"
    echo "  1. Repository '$REPO_NAME' already exists"
    echo "  2. Invalid Personal Access Token"
    echo "  3. Token doesn't have 'repo' scope"
    echo "  4. GitHub API issue"
    echo ""
    echo "Solution:"
    echo "  • Create new token: https://github.com/settings/tokens/new"
    echo "  • Make sure 'repo' scope is selected"
    echo "  • Try again with new token"
    echo ""

    exit 1
fi

echo ""

