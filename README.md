# 🚚 Courier Management System

A comprehensive full-stack web application demonstrating **Stored Procedures**, **Functions**, and **Triggers** in MySQL with a React frontend and Node.js/Express backend.

![MySQL](https://img.shields.io/badge/MySQL-8.0+-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-14+-green.svg)
![React](https://img.shields.io/badge/React-18.2-blue.svg)
![Express](https://img.shields.io/badge/Express-4.18-lightgrey.svg)

## 📋 Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Database Requirements](#database-requirements)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Testing the Application](#testing-the-application)

---

## ✨ Features

### 🔧 Database Operations (CRITICAL REQUIREMENTS)

1. **Stored Procedure 1 (CREATE):** `AddCourierOrder`
   - Adds new courier orders to the system
   - Endpoint: `POST /api/couriers/add`

2. **Stored Procedure 2 (UPDATE):** `UpdateCourierStatus`
   - Updates courier status with audit logging
   - Endpoint: `PUT /api/couriers/update-status/:id`

3. **Function 1 (READ):** `GetCourierStatus`
   - Retrieves courier status using database function
   - Endpoint: `GET /api/couriers/status/:id`

4. **Trigger 1 (AUTOMATIC):** `after_courier_status_update`
   - Automatically logs changes to `Delivery_History` and `Courier_Audit` tables
   - Validation: `GET /api/couriers/:id/logs`

### 📊 Complex SQL Queries

1. **JOIN Query:** Combines Couriers + Users + Admins tables
2. **NESTED Query:** Finds customers with delivered orders using subquery
3. **AGGREGATE Query:** Groups couriers by status with COUNT

### 🎨 React Frontend

- **Section A:** Procedure Demo (Create & Update forms)
- **Section B:** Trigger & Function Validation (with visual proof)
- **Section C:** Complex Queries Display (JOIN, NESTED, AGGREGATE)
- Responsive design with modal dialogs
- Real-time data updates

---

## 🛠 Technology Stack

### Backend
- **Node.js** (v14+)
- **Express.js** (v4.18+)
- **MySQL2** (v3.6+) - Promise-based MySQL client
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Frontend
- **React** (v18.2+)
- **Axios** - HTTP client
- **CSS3** - Custom styling with gradients and animations

### Database
- **MySQL** (v8.0+)

---

## 📁 Project Structure

```
courier-management-system/
├── server/                      # Backend (Node.js/Express)
│   ├── routes/
│   │   ├── couriers.js         # Courier CRUD & procedure endpoints
│   │   └── reports.js          # Complex query endpoints
│   ├── database.js             # MySQL connection pool
│   ├── server.js               # Express server configuration
│   ├── package.json
│   └── .env                    # Database credentials
├── client/                      # Frontend (React)
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js              # Main React component
│   │   ├── App.css             # Styling
│   │   ├── api.js              # API service layer
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── database_setup.sql           # Complete database setup script
└── README.md                    # This file
```

---

## 🗄️ Database Requirements

### Prerequisites
- MySQL Server 8.0 or higher
- MySQL Workbench (recommended) or command-line client

### Database Schema Overview

**Tables:**
- `Users` - Customer information
- `Admins` - Administrator information
- `Couriers` - Main courier orders table
- `Delivery_History` - Status change history (populated by trigger)
- `Courier_Audit` - Audit trail (populated by trigger)
- `Comments` - Optional comments on couriers

**Stored Procedures:**
- `AddCourierOrder(p_customer_id, p_admin_id, p_bill_number, p_pickup_address, p_delivery_address)`
- `UpdateCourierStatus(p_courier_id, p_new_status, p_changed_by_admin_email)`

**Functions:**
- `GetCourierStatus(p_courier_id)` - Returns courier status

**Triggers:**
- `after_courier_status_update` - Logs changes to audit tables

---

## 🚀 Installation & Setup

### Step 1: Clone/Download the Project

If you have this project in a directory:
```bash
cd courier-management-system
```

### Step 2: Database Setup

1. **Start MySQL Server**
   ```bash
   # macOS with Homebrew
   brew services start mysql
   
   # Or check if running
   mysql --version
   ```

2. **Create the Database**
   ```bash
   # Login to MySQL
   mysql -u root -p
   
   # Run the setup script
   source /path/to/courier-management-system/database_setup.sql
   
   # Or from command line
   mysql -u root -p < database_setup.sql
   ```

3. **Verify Database Creation**
   ```sql
   USE courier_management;
   SHOW TABLES;
   SHOW PROCEDURE STATUS WHERE Db = 'courier_management';
   SHOW FUNCTION STATUS WHERE Db = 'courier_management';
   SHOW TRIGGERS;
   ```

### Step 3: Backend Setup

1. **Navigate to server directory**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Edit the `.env` file:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=courier_management
   ```
   
   **⚠️ IMPORTANT:** Replace `your_mysql_password` with your actual MySQL root password!

4. **Test the connection**
   ```bash
   npm start
   ```
   
   You should see:
   ```
   ✅ MySQL Database connected successfully!
   🚀 COURIER MANAGEMENT SYSTEM - SERVER STARTED
   📡 Server running on: http://localhost:5000
   ```

### Step 4: Frontend Setup

1. **Open a new terminal** and navigate to client directory
   ```bash
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the React development server**
   ```bash
   npm start
   ```
   
   The browser will automatically open to `http://localhost:3000`

---

## 🎯 Running the Application

### Complete Startup Sequence

1. **Terminal 1 - Backend Server**
   ```bash
   cd server
   npm start
   ```
   Server runs on: http://localhost:5000

2. **Terminal 2 - Frontend React App**
   ```bash
   cd client
   npm start
   ```
   App opens on: http://localhost:3000

### Verify Everything is Working

1. Backend health check: http://localhost:5000/health
2. Frontend UI: http://localhost:3000
3. Check browser console for any errors

---

## 📡 API Endpoints

### Courier Operations (Procedures & Functions)

| Method | Endpoint | Description | SQL Executed |
|--------|----------|-------------|--------------|
| POST | `/api/couriers/add` | Add courier (Procedure 1) | `CALL AddCourierOrder(?, ?, ?, ?, ?)` |
| PUT | `/api/couriers/update-status/:id` | Update status (Procedure 2) | `CALL UpdateCourierStatus(?, ?, ?)` |
| GET | `/api/couriers/status/:id` | Get status (Function) | `SELECT GetCourierStatus(?) AS status` |
| GET | `/api/couriers/:id/logs` | Trigger validation | `SELECT FROM Delivery_History/Courier_Audit` |
| GET | `/api/couriers` | List all couriers | Standard SELECT with JOINs |

### Reports (Complex Queries)

| Method | Endpoint | Description | Query Type |
|--------|----------|-------------|------------|
| GET | `/api/reports/join` | Couriers + Users + Admins | JOIN |
| GET | `/api/reports/nested` | Customers with delivered orders | NESTED (IN subquery) |
| GET | `/api/reports/aggregate` | Count by status | AGGREGATE (GROUP BY) |

---

## 🧪 Testing the Application

### Test Scenario 1: Add Courier (Procedure)

1. Go to **Section A** in the UI
2. Fill in the "Add New Courier" form:
   - Select a customer
   - Select an admin
   - Enter bill number (e.g., "BILL-2001")
   - Enter pickup and delivery addresses
3. Click "Add Courier (Execute Procedure)"
4. ✅ **Expected:** Success message, courier appears in table below

### Test Scenario 2: Update Status (Procedure + Trigger)

1. Find a courier in the table
2. Click "🔄 Update Status" button
3. In the modal:
   - Select new status (e.g., "In Transit")
   - Select admin email
4. Click "Update Status (Call Procedure)"
5. ✅ **Expected:** Status updated, trigger fired automatically

### Test Scenario 3: Validate Trigger

1. Click "📋 View Logs" for the courier you just updated
2. Check the modal showing:
   - **Delivery History** records (inserted by procedure)
   - **Courier Audit** records (inserted by trigger)
3. ✅ **Expected:** You should see new entries in both tables proving the trigger fired

### Test Scenario 4: Test Function

1. Go to **Section B** - "Test Database Function"
2. Enter a courier ID (e.g., 1)
3. Click "🔍 Execute Function"
4. ✅ **Expected:** Status displayed from `GetCourierStatus()` function

### Test Scenario 5: Complex Queries

1. Scroll to **Section C**
2. Verify three report cards showing:
   - **JOIN Query:** Combined data from multiple tables
   - **NESTED Query:** Customers with delivered orders
   - **AGGREGATE Query:** Status counts with statistics
3. ✅ **Expected:** All reports display data correctly

---

## 🐛 Troubleshooting

### Backend won't start

**Problem:** "Database connection failed"

**Solution:**
1. Check MySQL is running: `mysql --version`
2. Verify credentials in `server/.env`
3. Test connection: `mysql -u root -p`
4. Ensure database exists: `SHOW DATABASES;`

### Frontend won't connect to backend

**Problem:** CORS errors or "Network Error"

**Solution:**
1. Ensure backend is running on port 5000
2. Check `client/src/api.js` has correct URL: `http://localhost:5000/api`
3. Clear browser cache and reload

### Trigger not working

**Problem:** No entries in Delivery_History or Courier_Audit

**Solution:**
1. Verify trigger exists:
   ```sql
   SHOW TRIGGERS LIKE 'Couriers';
   ```
2. Check trigger syntax:
   ```sql
   SHOW CREATE TRIGGER after_courier_status_update;
   ```
3. Manually test:
   ```sql
   UPDATE Couriers SET status = 'In Transit' WHERE courier_id = 1;
   SELECT * FROM Courier_Audit WHERE courier_id = 1;
   ```

### Procedure errors

**Problem:** "Procedure does not exist"

**Solution:**
```sql
-- Re-run the database setup script
source database_setup.sql

-- Verify procedures
SHOW PROCEDURE STATUS WHERE Db = 'courier_management';
```

---

## 📚 Additional Features

### Bonus Reports Available

- **Admin Performance:** `GET /api/reports/admin-performance`
- **Customer Activity:** `GET /api/reports/customer-activity`

### Future Enhancements

- User authentication & authorization
- Real-time notifications using WebSockets
- PDF report generation
- Email notifications for status changes
- Mobile responsive improvements
- Dashboard analytics with charts

---

## 📝 Database Credentials Note

**For Examiners/Reviewers:**

Default `.env` configuration assumes:
- MySQL User: `root`
- MySQL Password: `your_mysql_password` (CHANGE THIS!)
- MySQL Host: `localhost`
- Database Name: `courier_management`

Please update the `server/.env` file with your actual MySQL credentials before running.

---

## 🎓 Academic Compliance

This project demonstrates:

✅ **CRUD Operations** via Stored Procedures (not standard INSERT/UPDATE)  
✅ **Stored Procedures:** CREATE (AddCourierOrder) and UPDATE (UpdateCourierStatus)  
✅ **Functions:** READ operation (GetCourierStatus)  
✅ **Triggers:** Automatic audit logging (after_courier_status_update)  
✅ **Complex Queries:** JOIN, NESTED (subquery), AGGREGATE (GROUP BY)  
✅ **Full Stack Integration:** React + Node.js + MySQL  
✅ **Professional UI:** Demonstrating all features with clear labeling  

---

## 👨‍💻 Developer Information

**Project:** Courier Management System  
**Type:** Full Stack Web Application  
**Database:** MySQL 8.0+  
**Backend:** Node.js + Express + mysql2  
**Frontend:** React 18  

**Created:** October 2025

---

## 📄 License

This project is created for educational purposes.

---

## 🆘 Support

If you encounter any issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Verify all prerequisites are installed
3. Ensure MySQL server is running
4. Check both terminal outputs for error messages
5. Verify database setup completed successfully

---

**🎉 Enjoy using the Courier Management System!**
