#!/bin/bash

echo "🔍 Testing MySQL Connection Methods..."
echo ""

# Test 1: No user, no password
echo "Test 1: mysql (no credentials)"
if mysql -e "SELECT 1;" 2>/dev/null; then
    echo "✅ SUCCESS: Connection works without credentials"
    echo "Update .env to:"
    echo "DB_USER="
    echo "DB_PASSWORD="
    exit 0
fi

# Test 2: Root without password
echo "❌ Failed"
echo ""
echo "Test 2: mysql -u root (root without password)"
if mysql -u root -e "SELECT 1;" 2>/dev/null; then
    echo "✅ SUCCESS: Root works without password"
    echo "Update .env to:"
    echo "DB_USER=root"
    echo "DB_PASSWORD="
    exit 0
fi

# Test 3: Current user without password
CURRENT_USER=$(whoami)
echo "❌ Failed"
echo ""
echo "Test 3: mysql -u $CURRENT_USER (current user without password)"
if mysql -u "$CURRENT_USER" -e "SELECT 1;" 2>/dev/null; then
    echo "✅ SUCCESS: User '$CURRENT_USER' works without password"
    echo "Update .env to:"
    echo "DB_USER=$CURRENT_USER"
    echo "DB_PASSWORD="
    exit 0
fi

echo "❌ Failed"
echo ""
echo "========================================"
echo "❌ None of the passwordless methods worked"
echo "========================================"
echo ""
echo "Your MySQL requires a password."
echo ""
echo "Please try to login manually to find your password:"
echo ""
echo "  mysql -u root -p"
echo ""
echo "Common passwords to try:"
echo "  - root"
echo "  - password  "
echo "  - (empty - just press Enter)"
echo ""
echo "Once you can login, run this to check:"
echo "  SHOW DATABASES;"
echo ""
echo "Then update /tmp/courier-management-system/server/.env with:"
echo "  DB_USER=root"
echo "  DB_PASSWORD=your_actual_password"
echo ""
