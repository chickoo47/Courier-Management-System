# 🔧 MySQL Connection Fix Guide

## Problem
`Access denied for user 'root'@'localhost'`

## Quick Solutions

### Solution 1: Find Your MySQL Password (Try These Common Ones)

Edit `/tmp/courier-management-system/server/.env` and try these passwords:

1. **Empty password** (most common on macOS Homebrew):
   ```
   DB_PASSWORD=
   ```

2. **"root"**:
   ```
   DB_PASSWORD=root
   ```

3. **"password"**:
   ```
   DB_PASSWORD=password
   ```

4. **Check macOS Keychain**:
   - Open "Keychain Access" app
   - Search for "mysql"
   - Check stored password

### Solution 2: Reset MySQL Root Password

```bash
# Stop MySQL
brew services stop mysql

# Start MySQL in safe mode (skip grant tables)
mysqld_safe --skip-grant-tables &

# In a new terminal
mysql -u root

# In MySQL console:
FLUSH PRIVILEGES;
ALTER USER 'root'@'localhost' IDENTIFIED BY 'newpassword';
FLUSH PRIVILEGES;
exit;

# Kill safe mode MySQL and restart normally
killall mysqld
brew services start mysql

# Update .env
# DB_PASSWORD=newpassword
```

### Solution 3: Create New User (RECOMMENDED)

```bash
# Login to MySQL (you need to know current root password)
mysql -u root -p

# Create new user
CREATE USER 'courier_user'@'localhost' IDENTIFIED BY 'courier123';
GRANT ALL PRIVILEGES ON *.* TO 'courier_user'@'localhost';
FLUSH PRIVILEGES;
exit;
```

Then update `/tmp/courier-management-system/server/.env`:
```
DB_USER=courier_user
DB_PASSWORD=courier123
```

### Solution 4: Use Socket Authentication (macOS)

Update `/tmp/courier-management-system/server/.env`:
```
DB_HOST=/tmp/mysql.sock
DB_USER=root
DB_PASSWORD=
```

Or update `database.js` to use socket:
```javascript
socketPath: '/tmp/mysql.sock'
```

## Run This Command

I've created an interactive setup script:

```bash
/tmp/courier-management-system/setup-mysql.sh
```

It will:
1. Check MySQL status
2. Test connection
3. Update .env automatically
4. Create database if needed

## Manual Testing

Test your connection manually:

```bash
# Try without password
mysql -u root

# Try with password
mysql -u root -p
```

Once you can login, check if database exists:

```sql
SHOW DATABASES LIKE 'courier_management';
```

If it doesn't exist, create it:

```bash
mysql -u root -p < /tmp/courier-management-system/database_setup.sql
```

## After Fixing

Once `.env` is correctly configured:

```bash
cd /tmp/courier-management-system/server
npm start
```

You should see:
```
✅ MySQL Database connected successfully!
🚀 Server running on: http://localhost:5000
```
