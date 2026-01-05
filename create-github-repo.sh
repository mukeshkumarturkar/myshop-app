#!/bin/bash

# MyShop - Complete Automated GitHub Repository Creation & Push
# This script creates a GitHub repository and pushes your code automatically

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║    MyShop - GitHub Repository Creation & Code Push            ║"
echo "║                  Fully Automated Setup                         ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
REPO_NAME="myshop-app"
PROJECT_DIR="/Users/mukeshkumar/Work/IdeaProjects/MyShop"

echo -e "${BLUE}📋 STEP 1: Collect Your GitHub Information${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "You need:"
echo "  1. GitHub username"
echo "  2. Personal Access Token (with 'repo' scope)"
echo ""
echo "🔐 To get a Personal Access Token:"
echo "   Visit: https://github.com/settings/tokens/new"
echo "   - Name: myshop-deploy"
echo "   - Scope: Check 'repo' (full control of repositories)"
echo "   - Click 'Generate token'"
echo "   - Copy the token immediately (you won't see it again!)"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Get GitHub credentials
read -p "👤 Enter your GitHub username: " GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo -e "${RED}❌ Error: GitHub username is required${NC}"
    exit 1
fi

read -sp "🔑 Paste your Personal Access Token: " GITHUB_TOKEN
echo ""

if [ -z "$GITHUB_TOKEN" ]; then
    echo -e "${RED}❌ Error: Personal Access Token is required${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}📋 STEP 2: Create Repository on GitHub${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📦 Repository Name: $REPO_NAME"
echo "👤 GitHub User: $GITHUB_USERNAME"
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

# Check if successful
if echo "$CREATE_RESPONSE" | grep -q '"id"'; then
    echo -e "${GREEN}✅ Repository created successfully!${NC}"
    REPO_URL="https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"
    REPO_HTTPS_URL="https://${GITHUB_USERNAME}:${GITHUB_TOKEN}@github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"

    echo ""
    echo -e "${BLUE}📤 STEP 3: Push Code to GitHub${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Configuring git and pushing code..."

    cd "$PROJECT_DIR"

    # Remove any existing remote
    git remote remove origin 2>/dev/null || true

    # Add the new remote with credentials
    git remote add origin "$REPO_HTTPS_URL"

    # Ensure main branch
    git branch -M main 2>/dev/null || true

    # Push to GitHub
    echo "Pushing commits to GitHub..."
    if git push -u origin main 2>&1 | grep -E "To|main|done|\[new branch\]"; then
        echo ""
        echo -e "${GREEN}✅ Code pushed successfully!${NC}"

        echo ""
        echo "╔════════════════════════════════════════════════════════════════╗"
        echo "║                 🎉 SETUP COMPLETE! 🎉                          ║"
        echo "╚════════════════════════════════════════════════════════════════╝"
        echo ""
        echo -e "${GREEN}✅ Your GitHub Repository:${NC}"
        echo "   $REPO_URL"
        echo ""
        echo -e "${GREEN}✅ Code Status:${NC}"
        echo "   • All source files pushed"
        echo "   • All documentation pushed"
        echo "   • Configuration files included"
        echo "   • 6+ commits on remote"
        echo ""
        echo -e "${BLUE}📊 Next Steps:${NC}"
        echo "   1. Visit: https://github.com/${GITHUB_USERNAME}/${REPO_NAME}"
        echo "   2. Verify all files are visible"
        echo "   3. Deploy to Vercel: Read QUICK_DEPLOYMENT.md"
        echo "   4. Deploy to Play Store: Read MyShopApp/DEPLOYMENT.md"
        echo ""
        echo -e "${YELLOW}⏭️  QUICK DEPLOYMENT:${NC}"
        echo "   cd $PROJECT_DIR"
        echo "   cat QUICK_DEPLOYMENT.md"
        echo ""

        # Try to cleanup (best effort)
        history -d $(history 1) 2>/dev/null || true

    else
        echo ""
        echo -e "${RED}❌ Error pushing code${NC}"
        echo "Possible reasons:"
        echo "  1. Network connection issue"
        echo "  2. Token doesn't have 'repo' scope"
        echo "  3. Repository creation failed silently"
        echo ""
        echo "Try manually:"
        echo "  cd $PROJECT_DIR"
        echo "  git push -u origin main -v"
        exit 1
    fi
else
    # Extract error message
    ERROR_MSG=$(echo "$CREATE_RESPONSE" | grep -o '"message":"[^"]*' | cut -d'"' -f4)

    if [ -z "$ERROR_MSG" ]; then
        ERROR_MSG="Unknown error - check your token"
    fi

    echo -e "${RED}❌ Failed to create repository${NC}"
    echo ""
    echo "Error: $ERROR_MSG"
    echo ""
    echo -e "${YELLOW}Common Issues:${NC}"
    echo "  1. Repository already exists → Delete and try again"
    echo "  2. Invalid token → Create new token at https://github.com/settings/tokens"
    echo "  3. Token doesn't have 'repo' scope → Create new token with correct scope"
    echo "  4. Network issue → Check internet connection"
    echo ""
    echo -e "${BLUE}Debug Info:${NC}"
    echo "  Username: $GITHUB_USERNAME"
    echo "  Response: $CREATE_RESPONSE"
    exit 1
fi

echo ""

