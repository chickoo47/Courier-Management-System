# 🚀 QUICK START GUIDE

## ⚡ 5-Minute Setup

### 1️⃣ Database Setup (2 minutes)

```bash
# Start MySQL
mysql -u root -p

# In MySQL console, run:
source /path/to/database_setup.sql

# Verify
USE courier_management;
SHOW TABLES;
```

### 2️⃣ Backend Setup (1 minute)

```bash
cd server

# Install dependencies
npm install

# Edit .env file - SET YOUR MYSQL PASSWORD!
# Change: DB_PASSWORD=your_mysql_password

# Start server
npm start
```

**Expected output:**
```
✅ MySQL Database connected successfully!
🚀 Server running on: http://localhost:5000
```

### 3️⃣ Frontend Setup (2 minutes)

```bash
# Open NEW terminal
cd client

# Install dependencies
npm install

# Start React app
npm start
```

**Browser opens automatically to:** http://localhost:3000

---

## ✅ Verify Installation

1. **Backend Health Check:**
   - Visit: http://localhost:5000/health
   - Should see: `{"status":"OK",...}`

2. **Frontend Loading:**
   - Visit: http://localhost:3000
   - Should see: Courier Management System dashboard

3. **Database Connection:**
   - Try adding a courier in the UI
   - If successful, everything is working! 🎉

---

## 🧪 Quick Test

### Test the Complete Flow:

1. **Add Courier** (Tests Procedure 1)
   - Fill form in Section A
   - Click "Add Courier"
   - ✅ Courier appears in table

2. **Update Status** (Tests Procedure 2 + Trigger)
   - Click "Update Status" on any courier
   - Change status to "In Transit"
   - Select an admin
   - Click "Update Status"
   - ✅ Status changes

3. **View Logs** (Tests Trigger)
   - Click "View Logs" on the updated courier
   - ✅ See Delivery_History and Courier_Audit entries

4. **Test Function** (Tests Function)
   - In Section B, enter courier ID: 1
   - Click "Execute Function"
   - ✅ Status displays

5. **View Reports** (Tests Complex Queries)
   - Scroll to Section C
   - ✅ See JOIN, NESTED, and AGGREGATE query results

---

## 🐛 Common Issues

### "Database connection failed"
```bash
# Solution:
1. Check MySQL is running: mysql --version
2. Edit server/.env with correct password
3. Test: mysql -u root -p
```

### "Cannot find module 'express'"
```bash
# Solution:
cd server
npm install
```

### "Port 3000 already in use"
```bash
# Solution:
# Kill the process or change port in client/package.json
lsof -ti:3000 | xargs kill -9
```

---

## 📋 Pre-Flight Checklist

Before running, ensure you have:

- [ ] MySQL Server 8.0+ installed and running
- [ ] Node.js 14+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Ran `database_setup.sql` script
- [ ] Updated `server/.env` with MySQL password
- [ ] Installed server dependencies (`cd server && npm install`)
- [ ] Installed client dependencies (`cd client && npm install`)

---

## 🎯 What to Demonstrate

For project review/presentation, show these features:

### 1. Stored Procedures (Section A)
- ✅ CREATE: Add new courier
- ✅ UPDATE: Change courier status

### 2. Function (Section B)
- ✅ READ: Get courier status using function

### 3. Trigger (Section B)
- ✅ View audit logs showing automatic entries

### 4. Complex Queries (Section C)
- ✅ JOIN: Combined table data
- ✅ NESTED: Subquery results
- ✅ AGGREGATE: Grouped statistics

---

## 💡 Tips

- **Keep both terminals open** (server and client)
- **Check browser console** for any errors (F12)
- **Check server terminal** for API request logs
- **Refresh the page** after adding data to see updates

---

## 📞 Still Having Issues?

1. Read the full README.md
2. Check the Troubleshooting section
3. Verify MySQL is running: `brew services list` (macOS)
4. Check error messages in both terminals
5. Ensure ports 3000 and 5000 are not in use

---

**You're all set! 🎉**

Open http://localhost:3000 and start testing!
