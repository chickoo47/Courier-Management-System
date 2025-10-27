#!/bin/bash

echo "=========================================="
echo "Creating New MySQL User for Courier App"
echo "=========================================="
echo ""
echo "This script will create a new MySQL user so you don't need the root password."
echo ""
echo "Please enter your MySQL root password when prompted."
echo "(If you don't know it, press Ctrl+C to cancel)"
echo ""

read -s -p "MySQL root password: " ROOT_PASSWORD
echo ""

# Create new user and grant privileges
mysql -u root -p"$ROOT_PASSWORD" << EOF
-- Create new user
CREATE USER IF NOT EXISTS 'courier_user'@'localhost' IDENTIFIED BY 'courier123';

-- Grant all privileges on courier_management database
GRANT ALL PRIVILEGES ON courier_management.* TO 'courier_user'@'localhost';

-- Also grant privileges to create database if needed
GRANT CREATE ON *.* TO 'courier_user'@'localhost';

FLUSH PRIVILEGES;

-- Show confirmation
SELECT 'User created successfully!' AS Status;
EOF

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ New MySQL user created successfully!"
    echo ""
    echo "Username: courier_user"
    echo "Password: courier123"
    echo ""
    echo "Updating .env file..."
    
    # Update .env file
    cat > /tmp/courier-management-system/server/.env << EOF
PORT=5000
DB_HOST=localhost
DB_USER=courier_user
DB_PASSWORD=courier123
DB_NAME=courier_management
EOF
    
    echo "✅ .env file updated!"
    echo ""
    echo "Now creating/verifying database..."
    
    # Create database
    mysql -u courier_user -pcourier123 << EOF2
CREATE DATABASE IF NOT EXISTS courier_management;
USE courier_management;
SELECT 'Database ready!' AS Status;
EOF2
    
    if [ $? -eq 0 ]; then
        echo "✅ Database verified!"
        echo ""
        echo "Now run the setup script:"
        echo "  mysql -u courier_user -pcourier123 courier_management < /tmp/courier-management-system/database_setup.sql"
        echo ""
        echo "Then start the server:"
        echo "  cd /tmp/courier-management-system/server"
        echo "  npm start"
    fi
else
    echo ""
    echo "❌ Failed to create user. Please check your root password."
    echo ""
    echo "Alternative: Try to find your MySQL password in Keychain Access (macOS)"
    echo "or reset it using: brew services stop mysql && mysqld_safe --skip-grant-tables &"
fi
