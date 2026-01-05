#!/bin/bash

PROJECT_DIR="/Users/mukeshkumar/Work/IdeaProjects/MyShop"
REMOTE_URL="https://github.com/mukeshkumarturkar/myshop-app.git"

cd "$PROJECT_DIR"

echo "=========================================="
echo "Setting up GitHub Remote Repository"
echo "=========================================="
echo ""

echo "✅ Project Directory: $PROJECT_DIR"
echo "✅ Remote URL: $REMOTE_URL"
echo ""

# Check if origin exists
if git remote get-url origin &>/dev/null; then
    echo "⚠️  Remote 'origin' already exists. Removing..."
    git remote remove origin
fi

# Add remote
echo "Adding remote repository..."
git remote add origin "$REMOTE_URL"
echo "✅ Remote added"
echo ""

# Verify
echo "Verifying remote configuration:"
git remote -v
echo ""

# Ensure main branch
echo "Checking branch..."
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "Current branch: $CURRENT_BRANCH"
echo ""

if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "Renaming branch to 'main'..."
    git branch -M main
    echo "✅ Branch renamed to main"
else
    echo "✅ Already on main branch"
fi
echo ""

# Check git status
echo "Git Status:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
git status
echo ""

echo "✅ Setup Complete!"
echo ""
echo "Next steps:"
echo "1. To push code: git push -u origin main"
echo "2. Provide GitHub credentials when prompted"
echo ""

