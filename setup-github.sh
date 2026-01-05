#!/bin/bash

# MyShop - GitHub Remote Setup Script
# This script helps you push your project to a GitHub repository

set -e

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║     MyShop - GitHub Remote Repository Setup                   ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "❌ Error: This is not a git repository"
    echo "Run: git init"
    exit 1
fi

echo "📋 STEP 1: Create GitHub Repository"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Go to: https://github.com/new"
echo ""
echo "Create a new repository with these settings:"
echo "  • Repository name: myshop-app"
echo "  • Description: React Native shop management app"
echo "  • Visibility: Public"
echo "  • DO NOT initialize with README, .gitignore, or license"
echo ""
read -p "Press ENTER after creating the repository on GitHub..."
echo ""

# Get GitHub username
read -p "Enter your GitHub username: " GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ Error: GitHub username is required"
    exit 1
fi

REPO_URL="https://github.com/$GITHUB_USERNAME/myshop-app.git"

echo ""
echo "🔗 STEP 2: Add Remote Repository"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Repository URL: $REPO_URL"
echo ""

# Check if remote already exists
if git remote get-url origin &> /dev/null; then
    echo "⚠️  Remote 'origin' already exists:"
    git remote get-url origin
    read -p "Remove existing remote and continue? (y/n): " REMOVE_REMOTE
    if [ "$REMOVE_REMOTE" = "y" ]; then
        git remote remove origin
        echo "✅ Removed existing remote"
    else
        echo "❌ Aborting..."
        exit 1
    fi
fi

# Add remote
git remote add origin "$REPO_URL"
echo "✅ Remote added successfully"
echo ""

echo "📤 STEP 3: Push Code to GitHub"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Pushing code to GitHub..."
echo ""

# Ensure main branch
git branch -M main 2>/dev/null || true

# Push to GitHub
if git push -u origin main; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "🎉 Your repository is now available at:"
    echo "   $REPO_URL"
    echo ""
    echo "📊 Next Steps:"
    echo "   1. Go to: $REPO_URL"
    echo "   2. Verify all files are there"
    echo "   3. Deploy to Vercel using: QUICK_DEPLOYMENT.md"
    echo ""
else
    echo ""
    echo "❌ Push failed. Common reasons:"
    echo "   • Repository doesn't exist on GitHub"
    echo "   • Authentication failed"
    echo "   • Network issue"
    echo ""
    echo "Try again or check your credentials"
    exit 1
fi

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                   ✅ SETUP COMPLETE!                          ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

