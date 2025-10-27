#!/bin/bash

echo "=================================="
echo "MySQL Connection Setup Helper"
echo "=================================="
echo ""

# Check if MySQL is running
echo "1. Checking if MySQL is running..."
if pgrep -x "mysqld" > /dev/null; then
    echo "   ✅ MySQL is running"
else
    echo "   ⚠️  MySQL is not running. Starting MySQL..."
    brew services start mysql
    sleep 3
fi

echo ""
echo "2. Please enter your MySQL root password"
echo "   (If you don't have one, try pressing Enter for empty password)"
echo "   (Common default passwords: 'root', 'password', or empty)"
echo ""
read -s -p "MySQL root password: " MYSQL_PASSWORD
echo ""

# Test the connection
echo ""
echo "3. Testing MySQL connection..."
if [ -z "$MYSQL_PASSWORD" ]; then
    # Try without password
    mysql -u root -e "SELECT 'Connection successful!' AS status;" 2>/dev/null
else
    # Try with password
    mysql -u root -p"$MYSQL_PASSWORD" -e "SELECT 'Connection successful!' AS status;" 2>/dev/null
fi

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Connection successful!"
    echo ""
    echo "4. Updating .env file..."
    
    # Update .env file
    cd /tmp/courier-management-system/server
    cat > .env << EOF
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=$MYSQL_PASSWORD
DB_NAME=courier_management
EOF
    
    echo "✅ .env file updated!"
    echo ""
    echo "5. Checking if database 'courier_management' exists..."
    
    if [ -z "$MYSQL_PASSWORD" ]; then
        DB_EXISTS=$(mysql -u root -e "SHOW DATABASES LIKE 'courier_management';" 2>/dev/null | grep courier_management)
    else
        DB_EXISTS=$(mysql -u root -p"$MYSQL_PASSWORD" -e "SHOW DATABASES LIKE 'courier_management';" 2>/dev/null | grep courier_management)
    fi
    
    if [ -n "$DB_EXISTS" ]; then
        echo "✅ Database 'courier_management' exists!"
    else
        echo "⚠️  Database 'courier_management' does not exist."
        echo ""
        read -p "Would you like to create it now? (y/n): " CREATE_DB
        
        if [ "$CREATE_DB" = "y" ] || [ "$CREATE_DB" = "Y" ]; then
            echo "Creating database from setup script..."
            cd /tmp/courier-management-system
            
            if [ -z "$MYSQL_PASSWORD" ]; then
                mysql -u root < database_setup.sql
            else
                mysql -u root -p"$MYSQL_PASSWORD" < database_setup.sql
            fi
            
            if [ $? -eq 0 ]; then
                echo "✅ Database created successfully!"
            else
                echo "❌ Failed to create database"
                exit 1
            fi
        fi
    fi
    
    echo ""
    echo "=================================="
    echo "✅ Setup Complete!"
    echo "=================================="
    echo ""
    echo "You can now start the server with:"
    echo "  cd /tmp/courier-management-system/server"
    echo "  npm start"
    echo ""
    
else
    echo ""
    echo "❌ Connection failed!"
    echo ""
    echo "Common solutions:"
    echo "1. Reset MySQL root password:"
    echo "   - Stop MySQL: brew services stop mysql"
    echo "   - Start in safe mode and reset password"
    echo ""
    echo "2. Or create a new MySQL user:"
    echo "   mysql -u root -p"
    echo "   CREATE USER 'courier_user'@'localhost' IDENTIFIED BY 'courier123';"
    echo "   GRANT ALL PRIVILEGES ON courier_management.* TO 'courier_user'@'localhost';"
    echo "   FLUSH PRIVILEGES;"
    echo ""
    echo "   Then update server/.env with:"
    echo "   DB_USER=courier_user"
    echo "   DB_PASSWORD=courier123"
    echo ""
    exit 1
fi
