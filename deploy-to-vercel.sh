#!/bin/bash

# MyShop Vercel Deployment Script
# Deploys the app to Vercel

set -e

PROJECT_DIR="/Users/mukeshkumar/Work/IdeaProjects/MyShop"
APP_DIR="$PROJECT_DIR/MyShopApp"

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║     MyShop - Vercel Deployment                                 ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Check if we're in the right directory
cd "$APP_DIR"

echo "📁 Project Directory: $APP_DIR"
echo ""

echo "📋 Step 1: Verify Project Files"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ -f "package.json" ]; then
    echo "✅ package.json found"
else
    echo "❌ package.json not found"
    exit 1
fi

if [ -f "vercel.json" ]; then
    echo "✅ vercel.json found"
else
    echo "❌ vercel.json not found"
    exit 1
fi

echo ""
echo "📋 Step 2: Install Dependencies"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install --legacy-peer-deps
    echo "✅ Dependencies installed"
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "📋 Step 3: Deploy to Vercel"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "Starting Vercel deployment..."
echo ""
echo "Instructions:"
echo "1. When prompted, select your Vercel account"
echo "2. Choose 'myshop-app' for project name"
echo "3. Select root directory: ./"
echo "4. Select build command: npm run vercel-build"
echo "5. Set output directory: public"
echo ""

# Deploy to Vercel
if vercel --prod; then
    echo ""
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║                   ✅ DEPLOYMENT SUCCESSFUL! 🎉                 ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo ""
    echo "Your app is now live!"
    echo ""
    echo "Next steps:"
    echo "1. Visit your Vercel dashboard: https://vercel.com/dashboard"
    echo "2. Find your myshop-app project"
    echo "3. Click on the deployment to view your live app"
    echo ""
else
    echo ""
    echo "❌ Deployment failed"
    echo "Please check:"
    echo "1. Vercel account is logged in"
    echo "2. GitHub repository exists and is public"
    echo "3. Environment variables are configured"
    echo ""
    exit 1
fi

echo ""

