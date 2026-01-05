#!/bin/bash

PROJECT_DIR="/Users/mukeshkumar/Work/IdeaProjects/MyShop"

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║     MyShop - GitHub Remote Setup & Push to Main Branch         ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

cd "$PROJECT_DIR"

echo "📋 Step 1: Configure Remote Repository"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Remove existing remote
git remote remove origin 2>/dev/null || true

# Add new remote
git remote add origin https://github.com/mukeshkumarturkar/myshop-app.git

echo "✅ Remote configured: https://github.com/mukeshkumarturkar/myshop-app.git"
echo ""

echo "📋 Step 2: Verify Git Configuration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Show remote
echo "Remote URL:"
git remote -v
echo ""

# Check branch
echo "Current branch:"
git branch -a
echo ""

# Count commits
echo "Total commits: $(git rev-list --count HEAD)"
echo ""

echo "📋 Step 3: Ensure Main Branch"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

git branch -M main
echo "✅ On main branch"
echo ""

echo "📋 Step 4: Push to GitHub"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "Ready to push code to GitHub:"
echo "  Repository: https://github.com/mukeshkumarturkar/myshop-app"
echo "  Branch: main"
echo "  Commits: $(git rev-list --count HEAD)"
echo ""

echo "To push code, run:"
echo "  git push -u origin main"
echo ""

echo "📊 Git Status:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
git status
echo ""

echo "✅ Setup Complete!"
echo ""
echo "Your local repository is now configured to push to:"
echo "  https://github.com/mukeshkumarturkar/myshop-app"
echo ""
echo "Branch: main"
echo "Ready to push!"
echo ""

