#!/bin/bash

# MyShop - Automated GitHub Repository Setup and Push
# This script creates a GitHub repository and pushes your code

set -e

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║         MyShop - GitHub Repository Setup & Push               ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Get GitHub username
read -p "📧 Enter your GitHub username: " GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ Error: GitHub username is required"
    exit 1
fi

# Get Personal Access Token
echo ""
echo "🔐 You need a Personal Access Token to proceed"
echo "   1. Go to: https://github.com/settings/tokens/new"
echo "   2. Name: myshop-deploy"
echo "   3. Check 'repo' scope"
echo "   4. Click 'Generate token'"
echo "   5. Copy the token (you won't see it again)"
echo ""
read -sp "🔑 Paste your Personal Access Token: " GITHUB_TOKEN

if [ -z "$GITHUB_TOKEN" ]; then
    echo ""
    echo "❌ Error: Token is required"
    exit 1
fi

echo ""
echo ""

# Repository details
REPO_NAME="myshop-app"
REPO_URL="https://${GITHUB_USERNAME}:${GITHUB_TOKEN}@github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"
REPO_DISPLAY_URL="https://github.com/${GITHUB_USERNAME}/${REPO_NAME}"

echo "📋 Creating GitHub Repository"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📦 Repository Name: $REPO_NAME"
echo "👤 Username: $GITHUB_USERNAME"
echo "🌐 URL: $REPO_DISPLAY_URL"
echo ""

# Create repository using GitHub API
echo "Creating repository on GitHub..."
CREATE_RESPONSE=$(curl -s -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/user/repos \
  -d "{
    \"name\": \"$REPO_NAME\",
    \"description\": \"React Native shop management app with cross-platform support (Android, iOS, Web)\",
    \"private\": false,
    \"auto_init\": false
  }")

# Check if repository was created
if echo "$CREATE_RESPONSE" | grep -q '"id"'; then
    echo "✅ Repository created successfully on GitHub!"
    echo ""
    echo "📤 Pushing code to GitHub..."
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""

    # Navigate to project directory
    cd /Users/mukeshkumar/Work/IdeaProjects/MyShop

    # Remove existing remote if it exists
    git remote remove origin 2>/dev/null || true

    # Add remote
    git remote add origin "$REPO_URL"

    # Ensure main branch
    git branch -M main 2>/dev/null || true

    # Push to GitHub
    if git push -u origin main 2>&1; then
        echo ""
        echo "✅ Code pushed successfully!"
        echo ""
        echo "╔════════════════════════════════════════════════════════════════╗"
        echo "║                    🎉 SUCCESS!                                 ║"
        echo "╚════════════════════════════════════════════════════════════════╝"
        echo ""
        echo "✅ Your repository is ready at:"
        echo "   $REPO_DISPLAY_URL"
        echo ""
        echo "📊 Repository Details:"
        echo "   • Name: myshop-app"
        echo "   • Visibility: Public"
        echo "   • Files: All source code and documentation"
        echo "   • Commits: Ready to deploy"
        echo ""
        echo "🚀 Next Steps:"
        echo "   1. Visit: $REPO_DISPLAY_URL"
        echo "   2. Verify all files are there"
        echo "   3. Deploy to Vercel: Read QUICK_DEPLOYMENT.md"
        echo ""

        # Clean up token from history (best effort)
        history -d $(history 1)

    else
        echo ""
        echo "❌ Error pushing code to GitHub"
        echo "Please check:"
        echo "   1. Internet connection"
        echo "   2. Token has correct scopes (repo)"
        echo "   3. Try manual push: git push -u origin main"
        exit 1
    fi
else
    ERROR_MSG=$(echo "$CREATE_RESPONSE" | grep -o '"message":"[^"]*' | cut -d'"' -f4)
    echo "❌ Failed to create repository on GitHub"
    echo ""
    echo "Error: $ERROR_MSG"
    echo ""
    echo "Common reasons:"
    echo "   1. Repository already exists"
    echo "   2. Invalid token"
    echo "   3. Token doesn't have 'repo' scope"
    echo "   4. Network issue"
    echo ""
    echo "Solution: Check your token at https://github.com/settings/tokens"
    exit 1
fi

echo ""

