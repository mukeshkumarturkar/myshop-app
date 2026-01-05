#!/bin/bash

# MyShop App - Quick Commands Script
# Usage: ./dev-commands.sh [command]

set -e

echo "🚀 MyShop App Developer Commands"
echo "=================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
show_menu() {
    echo -e "${BLUE}Available Commands:${NC}"
    echo "1. setup      - Install dependencies"
    echo "2. web        - Run on web"
    echo "3. android    - Run on Android"
    echo "4. ios        - Run on iOS"
    echo "5. clean      - Clean cache and node_modules"
    echo "6. build-eas  - Build with EAS (Android)"
    echo "7. submit     - Submit to Play Store"
    echo "8. logs       - View EAS build logs"
    echo "9. env        - Show environment setup"
    echo "10. help      - Show this menu"
    echo ""
}

setup() {
    echo -e "${GREEN}Installing dependencies...${NC}"
    npm install --legacy-peer-deps
    echo -e "${GREEN}✅ Setup complete!${NC}"
}

run_web() {
    echo -e "${GREEN}Starting web server...${NC}"
    npm start
}

run_android() {
    echo -e "${GREEN}Starting Android emulator...${NC}"
    npm run android
}

run_ios() {
    echo -e "${GREEN}Starting iOS simulator...${NC}"
    npm run ios
}

clean() {
    echo -e "${YELLOW}Cleaning cache and node_modules...${NC}"
    rm -rf node_modules .expo-shared
    npm cache clean --force
    echo -e "${GREEN}✅ Clean complete!${NC}"
}

build_eas() {
    echo -e "${GREEN}Building with EAS...${NC}"
    echo -e "${YELLOW}Select build type:${NC}"
    echo "1. Development (internal)"
    echo "2. Preview (internal)"
    echo "3. Production (Play Store)"
    read -p "Enter choice (1-3): " choice

    case $choice in
        1) eas build --platform android --profile development ;;
        2) eas build --platform android --profile preview ;;
        3) eas build --platform android --profile production ;;
        *) echo "Invalid choice" ;;
    esac
}

submit() {
    echo -e "${GREEN}Submitting to Play Store...${NC}"
    eas submit --platform android
}

view_logs() {
    echo -e "${GREEN}Recent builds:${NC}"
    eas build:list --limit 10
}

show_env() {
    echo -e "${BLUE}Environment Setup Required:${NC}"
    echo ""
    echo "1. Create .env.local file:"
    echo "   cp .env.example .env.local"
    echo ""
    echo "2. Add Firebase credentials:"
    echo "   EXPO_PUBLIC_FIREBASE_API_KEY=..."
    echo "   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=..."
    echo "   (see .env.example for all fields)"
    echo ""
    echo "3. Add API URL:"
    echo "   EXPO_PUBLIC_API_URL=http://localhost:8080/api"
    echo ""
    echo "See FIREBASE_SETUP.md for detailed instructions"
}

# Parse command
case "${1:-help}" in
    setup)
        setup
        ;;
    web)
        run_web
        ;;
    android)
        run_android
        ;;
    ios)
        run_ios
        ;;
    clean)
        clean
        ;;
    build-eas)
        build_eas
        ;;
    submit)
        submit
        ;;
    logs)
        view_logs
        ;;
    env)
        show_env
        ;;
    help|*)
        show_menu
        ;;
esac

