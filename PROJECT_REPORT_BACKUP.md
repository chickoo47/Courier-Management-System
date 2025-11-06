# COURIER MANAGEMENT SYSTEM
## DATABASE MANAGEMENT SYSTEMS LAB PROJECT REPORT

---

# 1. TITLE OF THE PROBLEM STATEMENT WITH TEAM DETAILS

## Problem Statement

**Design and Implementation of a Courier Management System with Advanced Database Features**

Develop a comprehensive database-driven courier management application that demonstrates the implementation of stored procedures, functions, triggers, and complex SQL queries. The system should handle courier order management from creation to delivery while maintaining complete audit trails and providing analytical reporting capabilities.

## Team Details

| **Field** | **Details** |
|-----------|-------------|
| **Project Title** | Courier Management System |
| **Student Name** | Ary |
| **GitHub Username** | chickoo47 |
| **Institution** | Database Management Systems Lab |
| **Academic Year** | 2025 |
| **Submission Date** | October 27, 2025 |
| **Course** | Database Management Systems |
| **Project Type** | Full-Stack Web Application |

## Project Scope

The Courier Management System is designed to:
- Manage customer and administrator information
- Process courier orders with unique identifiers
- Track courier status through multiple stages
- Maintain comprehensive audit trails using database triggers
- Provide analytical reports using complex SQL queries
- Demonstrate CRUD operations through a web interface
- Implement transaction management and data integrity

---

# 2. DESCRIPTION ABOUT THE STATEMENT (SHORT ABSTRACT)

## Problem Domain

In the logistics and courier industry, efficient management of shipments, real-time status tracking, and comprehensive audit trails are essential for operational success. Traditional systems often lack robust database features such as automated logging, transaction management, and complex analytical capabilities.

## Proposed Solution

This project implements a full-stack Courier Management System that addresses these challenges through:

**Database Layer:**
- MySQL 8.0+ with stored procedures for transactional operations
- User-defined functions for status retrieval
- Automated triggers for audit trail generation
- Complex queries (JOIN, NESTED, AGGREGATE) for reporting

**Application Layer:**
- Node.js/Express backend providing RESTful API
- React frontend for interactive user interface
- Complete CRUD operations with real-time updates
- Transaction management ensuring data consistency

**Key Features:**
- **Stored Procedure 1 (CREATE):** `AddCourierOrder` - Creates new courier orders with automatic status initialization
- **Stored Procedure 2 (UPDATE):** `UpdateCourierStatus` - Updates order status with dual logging mechanism
- **Function (READ):** `GetCourierStatus` - Retrieves current status using database function
- **Trigger (AUDIT):** `after_courier_status_update` - Automatically logs all status changes to audit table

**Business Value:**
- Complete traceability of all courier operations
- Automated compliance and audit reporting
- Real-time status visibility for customers and administrators
- Data integrity through foreign key constraints and transactions
- Scalable architecture supporting future enhancements

---

# 3. USER REQUIREMENT SPECIFICATION IN DETAIL

## 3.1 Functional Requirements

### FR-1: User Management
**Priority:** High  
**Description:** System shall manage customer and administrator information

**Sub-requirements:**
- FR-1.1: Store customer details (name, email, phone, address)
- FR-1.2: Store administrator details with role assignments
- FR-1.3: Enforce unique email addresses for all users
- FR-1.4: Automatically timestamp user creation
- FR-1.5: Support user information updates
- FR-1.6: Prevent duplicate email registrations

**Acceptance Criteria:**
- Users can be created with all required fields
- Email uniqueness is enforced at database level
- Timestamp is automatically generated on creation

---

### FR-2: Courier Order Management
**Priority:** High  
**Description:** System shall create and manage courier orders using stored procedures

**Sub-requirements:**
- FR-2.1: Create new courier orders via `AddCourierOrder` stored procedure
- FR-2.2: Generate unique bill numbers for each order
- FR-2.3: Capture pickup and delivery addresses
- FR-2.4: Assign orders to specific administrators
- FR-2.5: Initialize orders with 'Pending' status
- FR-2.6: Link orders to customers via foreign key relationship

**Acceptance Criteria:**
- Stored procedure successfully creates orders with all required fields
- Bill numbers are unique across the system
- Orders are properly linked to customers and admins
- Transaction rollback occurs on any error

---

### FR-3: Status Management
**Priority:** High  
**Description:** System shall update and retrieve courier status

**Sub-requirements:**
- FR-3.1: Update status via `UpdateCourierStatus` stored procedure
- FR-3.2: Support status values: Pending, In Transit, Delivered, Cancelled
- FR-3.3: Retrieve status using `GetCourierStatus` function
- FR-3.4: Log all status changes with administrator email
- FR-3.5: Maintain status history for audit purposes

**Acceptance Criteria:**
- Status updates trigger automatic audit logging
- Function returns current status for given courier ID
- Status history is maintained in chronological order
- Invalid status values are rejected

---

### FR-4: Automated Audit Trail
**Priority:** High  
**Description:** System shall automatically log all courier modifications

**Sub-requirements:**
- FR-4.1: Trigger `after_courier_status_update` on every status change
- FR-4.2: Populate `Courier_Audit` table automatically
- FR-4.3: Record old status, new status, and timestamp
- FR-4.4: Ensure audit records are immutable

**Acceptance Criteria:**
- Trigger fires automatically on UPDATE operations
- Audit table contains complete change history
- No manual intervention required for audit logging
- Audit records cannot be modified or deleted by application

---

### FR-5: Reporting and Analytics
**Priority:** Medium  
**Description:** System shall provide complex analytical queries

**Sub-requirements:**
- FR-5.1: JOIN query combining Couriers, Users, and Admins tables
- FR-5.2: NESTED query to find customers with specific order status
- FR-5.3: AGGREGATE query for statistics by status
- FR-5.4: Display results through API endpoints

**Acceptance Criteria:**
- JOIN query returns complete order information with customer and admin details
- NESTED query correctly identifies customers meeting criteria
- AGGREGATE query provides accurate counts and statistics
- All queries execute within acceptable time limits

---

### FR-6: CRUD Operations
**Priority:** High  
**Description:** System shall support complete Create, Read, Update, Delete operations

**Sub-requirements:**
- FR-6.1: CREATE - Add new couriers, users, admins
- FR-6.2: READ - Retrieve individual and all records
- FR-6.3: UPDATE - Modify courier status and other fields
- FR-6.4: DELETE - Remove records with proper cascade handling

**Acceptance Criteria:**
- All CRUD operations accessible via API endpoints
- Foreign key constraints properly enforced
- Cascade deletes work as expected
- Transaction management prevents data inconsistency

---

## 3.2 Non-Functional Requirements

### NFR-1: Performance
**Priority:** High

- NFR-1.1: Database queries execute within 2 seconds for datasets up to 10,000 records
- NFR-1.2: API response time under 500ms for standard operations
- NFR-1.3: Frontend page load time under 3 seconds on standard broadband
- NFR-1.4: Concurrent user support for at least 50 simultaneous connections

---

### NFR-2: Security
**Priority:** High

- NFR-2.1: Database credentials stored in environment variables
- NFR-2.2: SQL injection prevention through parameterized queries
- NFR-2.3: CORS configuration to restrict unauthorized API access
- NFR-2.4: Sensitive data not exposed in API responses

---

### NFR-3: Reliability
**Priority:** High

- NFR-3.1: Transaction rollback on stored procedure failures
- NFR-3.2: Foreign key constraints maintain referential integrity
- NFR-3.3: Error handling with appropriate HTTP status codes
- NFR-3.4: Database connection pool prevents connection exhaustion

---

### NFR-4: Usability
**Priority:** Medium

- NFR-4.1: Intuitive React-based user interface
- NFR-4.2: Real-time feedback on all operations
- NFR-4.3: Responsive design for desktop and mobile devices
- NFR-4.4: Clear error messages for user actions

---

### NFR-5: Maintainability
**Priority:** Medium

- NFR-5.1: Modular code structure with separation of concerns
- NFR-5.2: Comprehensive inline code documentation
- NFR-5.3: Version control using Git
- NFR-5.4: Consistent coding standards throughout project

---

## 3.3 System Constraints

| **Constraint** | **Description** |
|----------------|-----------------|
| **SC-1** | MySQL 8.0 or higher required for stored procedures/triggers syntax |
| **SC-2** | Node.js version 14+ required for backend compatibility |
| **SC-3** | Modern web browser with JavaScript enabled |
| **SC-4** | Minimum 512MB RAM for development environment |
| **SC-5** | Network connectivity required for remote database access |

---

## 3.4 Database Requirements

| **Requirement** | **Description** |
|-----------------|-----------------|
| **DR-1** | Support for stored procedures with transaction management |
| **DR-2** | Support for user-defined functions returning scalar values |
| **DR-3** | Support for AFTER UPDATE triggers |
| **DR-4** | Foreign key constraints with CASCADE and SET NULL |
| **DR-5** | ENUM data type support |
| **DR-6** | AUTO_INCREMENT for primary keys |
| **DR-7** | TIMESTAMP fields with automatic updates |

---

# 4. LIST OF SOFTWARES/TOOLS/PROGRAMMING LANGUAGES USED

## 4.1 Database Management System

| **Software** | **Version** | **Purpose** |
|--------------|-------------|-------------|
| MySQL Server | 8.0+ | Primary database management system |
| MySQL Workbench | 8.0+ | Database design and administration tool |

## 4.2 Backend Technologies

| **Technology** | **Version** | **Purpose** |
|----------------|-------------|-------------|
| Node.js | 23.11.0 | JavaScript runtime environment |
| Express.js | 4.18.0 | Web application framework |
| mysql2 | 3.6.5 | MySQL client library with Promise support |
| cors | 2.8.5 | Cross-Origin Resource Sharing middleware |
| dotenv | 16.3.1 | Environment variable management |
| body-parser | 1.20.2 | HTTP request body parsing |

## 4.3 Frontend Technologies

| **Technology** | **Version** | **Purpose** |
|----------------|-------------|-------------|
| React | 18.2.0 | User interface library |
| React DOM | 18.2.0 | React rendering engine for web |
| Axios | 1.6.2 | HTTP client for API communication |
| Create React App | 5.0.1 | React application scaffolding |
| CSS3 | - | Styling and responsive design |

## 4.4 Development Tools

| **Tool** | **Purpose** |
|----------|-------------|
| Visual Studio Code | Primary code editor and IDE |
| Git | Version control system |
| GitHub | Remote repository hosting |
| npm | Node.js package manager |
| Postman | API testing and debugging |
| Terminal (zsh) | Command-line interface |
| Homebrew | Package manager for macOS |

## 4.5 Programming Languages

| **Language** | **Usage** | **Percentage** |
|--------------|-----------|----------------|
| JavaScript | Frontend (React) + Backend (Node.js/Express) | 60% |
| SQL | Database schema, procedures, functions, triggers, queries | 30% |
| CSS | User interface styling and responsive layouts | 5% |
| HTML | React component templates and markup | 5% |

## 4.6 Development Environment

- **Operating System:** macOS (Darwin)
- **Shell:** zsh
- **Node Package Manager:** npm 10.x
- **Version Control:** Git 2.x
- **Port Configuration:**
  - Backend API Server: 5001
  - Frontend Development Server: 3000
  - MySQL Database: 3306 (default) or Unix socket `/tmp/mysql.sock`

---

# 5. ER DIAGRAM

## 5.1 Entity-Relationship Diagram

**[SPACE FOR ER DIAGRAM]**

*Note: Insert hand-drawn or digital ER diagram here showing all entities, attributes, and relationships*

---

## 5.2 Entity Descriptions

### Entity 1: Users (Customers)
- **Primary Key:** user_id (INT, AUTO_INCREMENT)
- **Attributes:**
  - name (VARCHAR(100), NOT NULL)
  - email (VARCHAR(100), UNIQUE, NOT NULL)
  - phone (VARCHAR(20))
  - address (TEXT)
  - created_at (TIMESTAMP)

### Entity 2: Admins (Administrators)
- **Primary Key:** admin_id (INT, AUTO_INCREMENT)
- **Attributes:**
  - name (VARCHAR(100), NOT NULL)
  - email (VARCHAR(100), UNIQUE, NOT NULL)
  - phone (VARCHAR(20))
  - role (VARCHAR(50), DEFAULT 'Manager')
  - created_at (TIMESTAMP)

### Entity 3: Couriers (Main Entity)
- **Primary Key:** courier_id (INT, AUTO_INCREMENT)
- **Foreign Keys:**
  - customer_id → Users(user_id)
  - managed_by_admin_id → Admins(admin_id)
- **Attributes:**
  - bill_number (VARCHAR(50), UNIQUE, NOT NULL)
  - pickup_address (TEXT, NOT NULL)
  - delivery_address (TEXT, NOT NULL)
  - status (ENUM, DEFAULT 'Pending')
  - created_at (TIMESTAMP)
  - updated_at (TIMESTAMP)

### Entity 4: Delivery_History
- **Primary Key:** history_id (INT, AUTO_INCREMENT)
- **Foreign Key:** courier_id → Couriers(courier_id)
- **Attributes:**
  - old_status (VARCHAR(50))
  - new_status (VARCHAR(50))
  - changed_at (TIMESTAMP)
  - changed_by_admin_email (VARCHAR(100))

### Entity 5: Courier_Audit
- **Primary Key:** audit_id (INT, AUTO_INCREMENT)
- **Foreign Key:** courier_id → Couriers(courier_id)
- **Attributes:**
  - action_type (VARCHAR(50), NOT NULL)
  - old_status (VARCHAR(50))
  - new_status (VARCHAR(50))
  - changed_at (TIMESTAMP)
  - admin_email (VARCHAR(100))

### Entity 6: Comments
- **Primary Key:** comment_id (INT, AUTO_INCREMENT)
- **Foreign Keys:**
  - courier_id → Couriers(courier_id)
  - user_id → Users(user_id)
- **Attributes:**
  - comment_text (TEXT, NOT NULL)
  - created_at (TIMESTAMP)

## 5.3 Relationship Summary

| **Relationship** | **Cardinality** | **Description** |
|------------------|-----------------|-----------------|
| Users → Couriers | 1:N | One user can place multiple courier orders |
| Admins → Couriers | 1:N | One admin can manage multiple courier orders |
| Couriers → Delivery_History | 1:N | One courier has multiple status change records |
| Couriers → Courier_Audit | 1:N | One courier has multiple audit trail entries |
| Couriers → Comments | 1:N | One courier can have multiple comments |
| Users → Comments | 1:N | One user can write multiple comments |

---

# 6. RELATIONAL SCHEMA

## 6.1 Table: Users

```
Users(
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

**Constraints:**
- PRIMARY KEY (user_id)
- UNIQUE (email)

---

## 6.2 Table: Admins

```
Admins(
    admin_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(50) DEFAULT 'Manager',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

**Constraints:**
- PRIMARY KEY (admin_id)
- UNIQUE (email)

---

## 6.3 Table: Couriers

```
Couriers(
    courier_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    managed_by_admin_id INT,
    bill_number VARCHAR(50) UNIQUE NOT NULL,
    pickup_address TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    status ENUM('Pending', 'In Transit', 'Delivered', 'Cancelled') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (managed_by_admin_id) REFERENCES Admins(admin_id) ON DELETE SET NULL
)
```

**Constraints:**
- PRIMARY KEY (courier_id)
- UNIQUE (bill_number)
- FOREIGN KEY (customer_id) → Users(user_id) CASCADE
- FOREIGN KEY (managed_by_admin_id) → Admins(admin_id) SET NULL

---

## 6.4 Table: Delivery_History

```
Delivery_History(
    history_id INT PRIMARY KEY AUTO_INCREMENT,
    courier_id INT NOT NULL,
    old_status VARCHAR(50),
    new_status VARCHAR(50),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    changed_by_admin_email VARCHAR(100),
    FOREIGN KEY (courier_id) REFERENCES Couriers(courier_id) ON DELETE CASCADE
)
```

**Constraints:**
- PRIMARY KEY (history_id)
- FOREIGN KEY (courier_id) → Couriers(courier_id) CASCADE

---

## 6.5 Table: Courier_Audit

```
Courier_Audit(
    audit_id INT PRIMARY KEY AUTO_INCREMENT,
    courier_id INT NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    old_status VARCHAR(50),
    new_status VARCHAR(50),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    admin_email VARCHAR(100),
    FOREIGN KEY (courier_id) REFERENCES Couriers(courier_id) ON DELETE CASCADE
)
```

**Constraints:**
- PRIMARY KEY (audit_id)
- FOREIGN KEY (courier_id) → Couriers(courier_id) CASCADE

---

## 6.6 Table: Comments

```
Comments(
    comment_id INT PRIMARY KEY AUTO_INCREMENT,
    courier_id INT NOT NULL,
    user_id INT,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (courier_id) REFERENCES Couriers(courier_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE SET NULL
)
```

**Constraints:**
- PRIMARY KEY (comment_id)
- FOREIGN KEY (courier_id) → Couriers(courier_id) CASCADE
- FOREIGN KEY (user_id) → Users(user_id) SET NULL

---

## 6.7 Normalization Analysis

**All tables are in Third Normal Form (3NF):**

- **1NF (First Normal Form):** All attributes contain atomic values
- **2NF (Second Normal Form):** No partial dependencies on composite keys
- **3NF (Third Normal Form):** No transitive dependencies between non-key attributes


---

# 7. DDL COMMANDS

## 7.1 Database Creation

```sql
DROP DATABASE IF EXISTS courier_management;
CREATE DATABASE courier_management;
USE courier_management;
```

## 7.2 CREATE TABLE Statements

### Table 1: Users

```sql
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Table 2: Admins

```sql
CREATE TABLE Admins (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(50) DEFAULT 'Manager',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Table 3: Couriers

```sql
CREATE TABLE Couriers (
    courier_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    managed_by_admin_id INT,
    bill_number VARCHAR(50) UNIQUE NOT NULL,
    pickup_address TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    status ENUM('Pending', 'In Transit', 'Delivered', 'Cancelled') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (managed_by_admin_id) REFERENCES Admins(admin_id) ON DELETE SET NULL
);
```

### Table 4: Delivery_History

```sql
CREATE TABLE Delivery_History (
    history_id INT AUTO_INCREMENT PRIMARY KEY,
    courier_id INT NOT NULL,
    old_status VARCHAR(50),
    new_status VARCHAR(50),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    changed_by_admin_email VARCHAR(100),
    FOREIGN KEY (courier_id) REFERENCES Couriers(courier_id) ON DELETE CASCADE
);
```

### Table 5: Courier_Audit

```sql
CREATE TABLE Courier_Audit (
    audit_id INT AUTO_INCREMENT PRIMARY KEY,
    courier_id INT NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    old_status VARCHAR(50),
    new_status VARCHAR(50),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    admin_email VARCHAR(100),
    FOREIGN KEY (courier_id) REFERENCES Couriers(courier_id) ON DELETE CASCADE
);
```

### Table 6: Comments

```sql
CREATE TABLE Comments (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    courier_id INT NOT NULL,
    user_id INT,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (courier_id) REFERENCES Couriers(courier_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE SET NULL
);
```

---

# 8. CRUD OPERATION SCREENSHOTS

## 8.1 CREATE Operation

### Screenshot 1: Add New Courier Order

**[SPACE FOR SCREENSHOT]**

**Description:**
- Frontend form for creating new courier order
- Calls `AddCourierOrder` stored procedure
- Fields: Customer ID, Admin ID, Bill Number, Pickup Address, Delivery Address

**Expected Result:**
- New courier created with status 'Pending'
- Success message displayed
- Courier ID returned in response

---

### Screenshot 2: CREATE Success Response

**[SPACE FOR SCREENSHOT]**

**Description:**
- API response showing successful courier creation
- Displays courier ID, customer details, admin details
- Confirmation of stored procedure execution

---

## 8.2 READ Operations

### Screenshot 3: View All Couriers

**[SPACE FOR SCREENSHOT]**

**Description:**
- Display all courier orders in table format
- Shows: Courier ID, Bill Number, Status, Customer Name, Admin Name
- Data retrieved via JOIN query

---

### Screenshot 4: Get Status Using Function

**[SPACE FOR SCREENSHOT]**

**Description:**
- Form to retrieve courier status
- Calls `GetCourierStatus` MySQL function
- Displays current status for given courier ID

---

### Screenshot 5: View Single Courier Details

**[SPACE FOR SCREENSHOT]**

**Description:**
- Detailed view of individual courier order
- Shows complete information including addresses
- Customer and admin information displayed

---

## 8.3 UPDATE Operation

### Screenshot 6: Update Courier Status Form

**[SPACE FOR SCREENSHOT]**

**Description:**
- Form for updating courier status
- Fields: Courier ID, New Status, Admin Email
- Calls `UpdateCourierStatus` stored procedure

---

### Screenshot 7: UPDATE Success with Trigger Execution

**[SPACE FOR SCREENSHOT]**

**Description:**
- Success message after status update
- Indication that trigger fired automatically
- Both Delivery_History and Courier_Audit tables populated

---

### Screenshot 8: Audit Trail Verification

**[SPACE FOR SCREENSHOT]**

**Description:**
- Display of audit logs
- Shows records from both manual logging and trigger
- Timestamps and admin emails visible

---

## 8.4 DELETE Operation

### Screenshot 9: Delete Courier Confirmation

**[SPACE FOR SCREENSHOT]**

**Description:**
- Confirmation dialog before deleting courier
- Warning about cascade delete
- Delete button and cancel option

---

### Screenshot 10: DELETE Success Response

**[SPACE FOR SCREENSHOT]**

**Description:**
- Success message after deletion
- Confirmation of cascade delete
- Related records removed from child tables

---

### Screenshot 11: Cascade Delete Verification

**[SPACE FOR SCREENSHOT]**

**Description:**
- Verification that related records were deleted
- Delivery_History records removed
- Courier_Audit records removed
- Comments removed

---

# 9. LIST OF FUNCTIONALITIES/FEATURES OF THE APPLICATION

## 9.1 Frontend Application Overview

### Screenshot 12: Application Homepage

**[SPACE FOR SCREENSHOT]**

**Description:**
- Main application interface
- Navigation to different sections
- Clean, modern UI design

---

## 9.2 Section A: Stored Procedures Demonstration

### Screenshot 13: Add Courier Form (Procedure 1)

**[SPACE FOR SCREENSHOT]**

**Description:**
- Interactive form calling `AddCourierOrder` stored procedure
- Customer selection dropdown
- Admin selection dropdown
- Bill number input
- Pickup and delivery address fields
- Submit button to execute procedure

---

### Screenshot 14: Update Status Form (Procedure 2)

**[SPACE FOR SCREENSHOT]**

**Description:**
- Form for status update via `UpdateCourierStatus` procedure
- Courier ID input
- Status dropdown (Pending, In Transit, Delivered, Cancelled)
- Admin email input
- Update button triggers procedure and trigger

---

## 9.3 Section B: Functions and Triggers Validation

### Screenshot 15: Get Status Using Function

**[SPACE FOR SCREENSHOT]**

**Description:**
- Form to test `GetCourierStatus` function
- Courier ID input field
- Get Status button
- Status display with color coding

---

### Screenshot 16: Trigger Validation Display

**[SPACE FOR SCREENSHOT]**

**Description:**
- Side-by-side comparison of Delivery_History and Courier_Audit
- Visual proof of trigger execution
- Timeline of status changes
- Highlighted trigger-created records

---

## 9.4 Section C: Complex SQL Queries

### Screenshot 17: JOIN Query Results

**[SPACE FOR SCREENSHOT]**

**Description:**
- Results from JOIN query combining 3 tables
- Columns: Courier ID, Bill Number, Status, Customer Name, Customer Email, Admin Name, Admin Email
- Complete order information displayed
- Data from Couriers + Users + Admins tables

---

### Screenshot 18: NESTED Query Results

**[SPACE FOR SCREENSHOT]**

**Description:**
- Results from nested subquery
- Customers who have delivered orders
- User ID, Name, Email, Phone displayed
- Subquery with IN clause demonstration

---

### Screenshot 19: AGGREGATE Query Results

**[SPACE FOR SCREENSHOT]**

**Description:**
- Statistics grouped by status
- Columns: Status, Count, Unique Customers, Earliest Order, Latest Order
- GROUP BY with COUNT, MIN, MAX functions
- Visual representation of data distribution

---

## 9.5 Additional Features

### Screenshot 20: Modal Dialog

**[SPACE FOR SCREENSHOT]**

**Description:**
- Modal showing detailed courier information
- Complete audit trail
- Status history timeline
- Customer and admin contact details

---

### Screenshot 21: Success/Error Notifications

**[SPACE FOR SCREENSHOT]**

**Description:**
- Toast notifications for user feedback
- Green success messages
- Red error messages
- Auto-dismiss functionality

---

### Screenshot 22: Responsive Mobile View

**[SPACE FOR SCREENSHOT]**

**Description:**
- Application on mobile device
- Responsive layout
- Touch-optimized interface
- Collapsible sections

---


# 10. TRIGGERS, PROCEDURES/FUNCTIONS, NESTED QUERY, JOIN, AGGREGATE QUERIES

## 10.1 Stored Procedure 1: AddCourierOrder

**Purpose:** Creates a new courier order with validation and automatic audit trail.

```sql
DELIMITER $$

CREATE PROCEDURE AddCourierOrder(
    IN p_customer_id INT,
    IN p_admin_id INT,
    IN p_bill_number VARCHAR(50),
    IN p_pickup_address TEXT,
    IN p_delivery_address TEXT
)
BEGIN
    DECLARE courier_exists INT DEFAULT 0;
    
    -- Check if bill number already exists
    SELECT COUNT(*) INTO courier_exists 
    FROM Couriers 
    WHERE bill_number = p_bill_number;
    
    IF courier_exists > 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Bill number already exists';
    ELSE
        -- Insert new courier order
        INSERT INTO Couriers (
            customer_id, 
            managed_by_admin_id, 
            bill_number, 
            pickup_address, 
            delivery_address, 
            status
        )
        VALUES (
            p_customer_id, 
            p_admin_id, 
            p_bill_number, 
            p_pickup_address, 
            p_delivery_address, 
            'Pending'
        );
        
        -- Add initial audit entry
        INSERT INTO Courier_Audit (
            courier_id, 
            action_type, 
            old_status, 
            new_status, 
            admin_email
        )
        SELECT 
            LAST_INSERT_ID(), 
            'CREATE', 
            NULL, 
            'Pending', 
            email 
        FROM Admins 
        WHERE admin_id = p_admin_id;
    END IF;
END$$

DELIMITER ;
```

---

## 10.2 Stored Procedure 2: UpdateCourierStatus

**Purpose:** Updates courier status and logs the change in delivery history.

```sql
DELIMITER $$

CREATE PROCEDURE UpdateCourierStatus(
    IN p_courier_id INT,
    IN p_new_status VARCHAR(50),
    IN p_admin_email VARCHAR(100)
)
BEGIN
    DECLARE current_status VARCHAR(50);
    
    -- Get current status
    SELECT status INTO current_status 
    FROM Couriers 
    WHERE courier_id = p_courier_id;
    
    -- Update status
    UPDATE Couriers 
    SET status = p_new_status, 
        updated_at = CURRENT_TIMESTAMP 
    WHERE courier_id = p_courier_id;
    
    -- Log in delivery history
    INSERT INTO Delivery_History (
        courier_id, 
        old_status, 
        new_status, 
        changed_by_admin_email
    )
    VALUES (
        p_courier_id, 
        current_status, 
        p_new_status, 
        p_admin_email
    );
END$$

DELIMITER ;
```

---

## 10.3 Function: GetCourierStatus

**Purpose:** Retrieves the current status of a courier order.

```sql
DELIMITER $$

CREATE FUNCTION GetCourierStatus(p_courier_id INT)
RETURNS VARCHAR(50)
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE courier_status VARCHAR(50);
    
    SELECT status INTO courier_status 
    FROM Couriers 
    WHERE courier_id = p_courier_id;
    
    RETURN IFNULL(courier_status, 'Not Found');
END$$

DELIMITER ;
```

---

## 10.4 Trigger: after_courier_status_update

**Purpose:** Automatically logs status changes to the audit table.

```sql
DELIMITER $$

CREATE TRIGGER after_courier_status_update
AFTER UPDATE ON Couriers
FOR EACH ROW
BEGIN
    IF OLD.status != NEW.status THEN
        INSERT INTO Courier_Audit (
            courier_id, 
            action_type, 
            old_status, 
            new_status, 
            admin_email
        )
        SELECT 
            NEW.courier_id, 
            'UPDATE_STATUS', 
            OLD.status, 
            NEW.status, 
            email 
        FROM Admins 
        WHERE admin_id = NEW.managed_by_admin_id;
    END IF;
END$$

DELIMITER ;
```

---

## 10.5 JOIN Query

**Purpose:** Retrieve complete courier information with customer and admin details.

```sql
-- JOIN Query: Combine Couriers, Users, and Admins tables
SELECT 
    c.courier_id,
    c.bill_number,
    c.status,
    c.pickup_address,
    c.delivery_address,
    u.name AS customer_name,
    u.email AS customer_email,
    u.phone AS customer_phone,
    a.name AS admin_name,
    a.email AS admin_email,
    c.created_at,
    c.updated_at
FROM Couriers c
INNER JOIN Users u ON c.customer_id = u.user_id
LEFT JOIN Admins a ON c.managed_by_admin_id = a.admin_id
ORDER BY c.created_at DESC;
```

**Output Columns:**
- Courier ID, Bill Number, Status
- Pickup and Delivery Addresses
- Customer Details (Name, Email, Phone)
- Admin Details (Name, Email)
- Timestamps

---

## 10.6 NESTED Query (Subquery)

**Purpose:** Find all customers who have at least one delivered courier.

```sql
-- Nested Query: Customers with delivered orders
SELECT 
    user_id,
    name,
    email,
    phone
FROM Users
WHERE user_id IN (
    SELECT DISTINCT customer_id 
    FROM Couriers 
    WHERE status = 'Delivered'
)
ORDER BY name;
```

**Logic:**
- Inner query selects customer IDs from Couriers where status is 'Delivered'
- Outer query retrieves full user details for those customer IDs

---

## 10.7 AGGREGATE Queries

### Query 1: Count Couriers by Status

```sql
-- Aggregate Query: Statistics grouped by status
SELECT 
    status,
    COUNT(*) AS total_orders,
    COUNT(DISTINCT customer_id) AS unique_customers,
    MIN(created_at) AS earliest_order,
    MAX(created_at) AS latest_order
FROM Couriers
GROUP BY status
ORDER BY total_orders DESC;
```

**Functions Used:**
- `COUNT(*)` - Total orders per status
- `COUNT(DISTINCT)` - Unique customers per status
- `MIN()` - Earliest order date
- `MAX()` - Latest order date
- `GROUP BY` - Group results by status

---

### Query 2: Admin Performance Metrics

```sql
-- Aggregate Query: Admin performance statistics
SELECT 
    a.name AS admin_name,
    a.email,
    COUNT(c.courier_id) AS managed_couriers,
    SUM(CASE WHEN c.status = 'Delivered' THEN 1 ELSE 0 END) AS delivered_count,
    ROUND(
        (SUM(CASE WHEN c.status = 'Delivered' THEN 1 ELSE 0 END) * 100.0) / 
        COUNT(c.courier_id), 
        2
    ) AS delivery_percentage
FROM Admins a
LEFT JOIN Couriers c ON a.admin_id = c.managed_by_admin_id
GROUP BY a.admin_id, a.name, a.email
HAVING COUNT(c.courier_id) > 0
ORDER BY delivered_count DESC;
```

**Functions Used:**
- `COUNT()` - Total managed couriers
- `SUM(CASE WHEN ... END)` - Conditional counting
- `ROUND()` - Calculate delivery success rate
- `GROUP BY` - Group by admin
- `HAVING` - Filter admins with at least one courier

---

### Query 3: Monthly Order Trends

```sql
-- Aggregate Query: Monthly order trends
SELECT 
    DATE_FORMAT(created_at, '%Y-%m') AS order_month,
    COUNT(*) AS total_orders,
    COUNT(DISTINCT customer_id) AS unique_customers,
    SUM(CASE WHEN status = 'Delivered' THEN 1 ELSE 0 END) AS delivered,
    SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) AS pending,
    SUM(CASE WHEN status = 'In Transit' THEN 1 ELSE 0 END) AS in_transit,
    SUM(CASE WHEN status = 'Cancelled' THEN 1 ELSE 0 END) AS cancelled
FROM Couriers
GROUP BY DATE_FORMAT(created_at, '%Y-%m')
ORDER BY order_month DESC;
```

**Functions Used:**
- `DATE_FORMAT()` - Extract year-month
- `COUNT()` - Total orders per month
- `SUM(CASE WHEN ... END)` - Count by status
- `GROUP BY` - Group by month

---


# 11. CODE SNIPPETS FOR INVOKING PROCEDURES/FUNCTIONS/TRIGGER

## 11.1 Backend (Node.js/Express) Code

### 11.1.1 Database Connection Setup

```javascript
// server/db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'courier_management',
  socketPath: process.env.DB_SOCKET || '/tmp/mysql.sock',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
```

---

### 11.1.2 Invoking AddCourierOrder Stored Procedure

```javascript
// server/routes/couriers.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// POST /api/couriers - Add new courier using stored procedure
router.post('/', async (req, res) => {
  try {
    const { customer_id, admin_id, bill_number, pickup_address, delivery_address } = req.body;
    
    // Validate inputs
    if (!customer_id || !admin_id || !bill_number || !pickup_address || !delivery_address) {
      return res.status(400).json({ 
        error: 'All fields are required' 
      });
    }
    
    // Call stored procedure
    const [result] = await pool.query(
      'CALL AddCourierOrder(?, ?, ?, ?, ?)',
      [customer_id, admin_id, bill_number, pickup_address, delivery_address]
    );
    
    res.status(201).json({ 
      message: 'Courier order created successfully',
      data: result[0]
    });
    
  } catch (error) {
    console.error('Error creating courier:', error);
    
    if (error.sqlState === '45000') {
      return res.status(400).json({ 
        error: error.sqlMessage 
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to create courier order' 
    });
  }
});

module.exports = router;
```

---

### 11.1.3 Invoking UpdateCourierStatus Stored Procedure

```javascript
// PUT /api/couriers/:id/status - Update courier status
router.put('/:id/status', async (req, res) => {
  try {
    const courierId = req.params.id;
    const { new_status, admin_email } = req.body;
    
    // Validate status
    const validStatuses = ['Pending', 'In Transit', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(new_status)) {
      return res.status(400).json({ 
        error: 'Invalid status value' 
      });
    }
    
    // Call stored procedure (also triggers after_courier_status_update)
    await pool.query(
      'CALL UpdateCourierStatus(?, ?, ?)',
      [courierId, new_status, admin_email]
    );
    
    res.json({ 
      message: 'Status updated successfully',
      courier_id: courierId,
      new_status: new_status,
      note: 'Trigger automatically logged this change to Courier_Audit'
    });
    
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ 
      error: 'Failed to update courier status' 
    });
  }
});
```

---

### 11.1.4 Invoking GetCourierStatus Function

```javascript
// GET /api/couriers/:id/status - Get courier status using function
router.get('/:id/status', async (req, res) => {
  try {
    const courierId = req.params.id;
    
    // Call MySQL function
    const [rows] = await pool.query(
      'SELECT GetCourierStatus(?) AS status',
      [courierId]
    );
    
    const status = rows[0].status;
    
    if (status === 'Not Found') {
      return res.status(404).json({ 
        error: 'Courier not found' 
      });
    }
    
    res.json({ 
      courier_id: courierId,
      status: status
    });
    
  } catch (error) {
    console.error('Error fetching status:', error);
    res.status(500).json({ 
      error: 'Failed to fetch courier status' 
    });
  }
});
```

---

### 11.1.5 Verifying Trigger Execution

```javascript
// GET /api/couriers/:id/audit - Get audit trail (verifies trigger)
router.get('/:id/audit', async (req, res) => {
  try {
    const courierId = req.params.id;
    
    // Fetch audit records created by trigger
    const [auditRecords] = await pool.query(
      `SELECT 
        audit_id,
        action_type,
        old_status,
        new_status,
        changed_at,
        admin_email
      FROM Courier_Audit
      WHERE courier_id = ?
      ORDER BY changed_at DESC`,
      [courierId]
    );
    
    res.json({ 
      courier_id: courierId,
      audit_trail: auditRecords,
      note: 'Records with action_type = "UPDATE_STATUS" were created by trigger'
    });
    
  } catch (error) {
    console.error('Error fetching audit trail:', error);
    res.status(500).json({ 
      error: 'Failed to fetch audit trail' 
    });
  }
});
```

---

### 11.1.6 JOIN Query Implementation

```javascript
// GET /api/couriers - Get all couriers with JOIN
router.get('/', async (req, res) => {
  try {
    const [couriers] = await pool.query(
      `SELECT 
        c.courier_id,
        c.bill_number,
        c.status,
        c.pickup_address,
        c.delivery_address,
        u.name AS customer_name,
        u.email AS customer_email,
        u.phone AS customer_phone,
        a.name AS admin_name,
        a.email AS admin_email,
        c.created_at,
        c.updated_at
      FROM Couriers c
      INNER JOIN Users u ON c.customer_id = u.user_id
      LEFT JOIN Admins a ON c.managed_by_admin_id = a.admin_id
      ORDER BY c.created_at DESC`
    );
    
    res.json(couriers);
    
  } catch (error) {
    console.error('Error fetching couriers:', error);
    res.status(500).json({ 
      error: 'Failed to fetch couriers' 
    });
  }
});
```

---

### 11.1.7 Nested Query Implementation

```javascript
// GET /api/users/with-delivered-orders - Nested query
router.get('/with-delivered-orders', async (req, res) => {
  try {
    const [users] = await pool.query(
      `SELECT 
        user_id,
        name,
        email,
        phone
      FROM Users
      WHERE user_id IN (
        SELECT DISTINCT customer_id 
        FROM Couriers 
        WHERE status = 'Delivered'
      )
      ORDER BY name`
    );
    
    res.json(users);
    
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ 
      error: 'Failed to fetch users' 
    });
  }
});
```

---

### 11.1.8 Aggregate Query Implementation

```javascript
// GET /api/analytics/status-summary - Aggregate query
router.get('/status-summary', async (req, res) => {
  try {
    const [statistics] = await pool.query(
      `SELECT 
        status,
        COUNT(*) AS total_orders,
        COUNT(DISTINCT customer_id) AS unique_customers,
        MIN(created_at) AS earliest_order,
        MAX(created_at) AS latest_order
      FROM Couriers
      GROUP BY status
      ORDER BY total_orders DESC`
    );
    
    res.json(statistics);
    
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ 
      error: 'Failed to fetch statistics' 
    });
  }
});
```

---

## 11.2 Frontend (React) Code

### 11.2.1 Calling AddCourierOrder from React

```javascript
// client/src/components/AddCourierForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

function AddCourierForm() {
  const [formData, setFormData] = useState({
    customer_id: '',
    admin_id: '',
    bill_number: '',
    pickup_address: '',
    delivery_address: ''
  });
  
  const [message, setMessage] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(
        'http://localhost:5001/api/couriers',
        formData
      );
      
      setMessage('Courier created successfully!');
      console.log('Stored procedure executed:', response.data);
      
      // Reset form
      setFormData({
        customer_id: '',
        admin_id: '',
        bill_number: '',
        pickup_address: '',
        delivery_address: ''
      });
      
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to create courier');
      console.error('Error calling procedure:', error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Courier Order (Stored Procedure)</h2>
      
      <input
        type="number"
        placeholder="Customer ID"
        value={formData.customer_id}
        onChange={(e) => setFormData({...formData, customer_id: e.target.value})}
        required
      />
      
      <input
        type="number"
        placeholder="Admin ID"
        value={formData.admin_id}
        onChange={(e) => setFormData({...formData, admin_id: e.target.value})}
        required
      />
      
      <input
        type="text"
        placeholder="Bill Number"
        value={formData.bill_number}
        onChange={(e) => setFormData({...formData, bill_number: e.target.value})}
        required
      />
      
      <textarea
        placeholder="Pickup Address"
        value={formData.pickup_address}
        onChange={(e) => setFormData({...formData, pickup_address: e.target.value})}
        required
      />
      
      <textarea
        placeholder="Delivery Address"
        value={formData.delivery_address}
        onChange={(e) => setFormData({...formData, delivery_address: e.target.value})}
        required
      />
      
      <button type="submit">Create Courier</button>
      
      {message && <p className="message">{message}</p>}
    </form>
  );
}

export default AddCourierForm;
```

---

### 11.2.2 Calling UpdateCourierStatus from React

```javascript
// client/src/components/UpdateStatusForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

function UpdateStatusForm() {
  const [courierId, setCourierId] = useState('');
  const [newStatus, setNewStatus] = useState('Pending');
  const [adminEmail, setAdminEmail] = useState('');
  const [message, setMessage] = useState('');
  
  const handleUpdate = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.put(
        `http://localhost:5001/api/couriers/${courierId}/status`,
        {
          new_status: newStatus,
          admin_email: adminEmail
        }
      );
      
      setMessage(`Status updated! ${response.data.note}`);
      console.log('Procedure + Trigger executed:', response.data);
      
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to update status');
      console.error('Error calling procedure:', error);
    }
  };
  
  return (
    <form onSubmit={handleUpdate}>
      <h2>Update Status (Procedure + Trigger)</h2>
      
      <input
        type="number"
        placeholder="Courier ID"
        value={courierId}
        onChange={(e) => setCourierId(e.target.value)}
        required
      />
      
      <select 
        value={newStatus}
        onChange={(e) => setNewStatus(e.target.value)}
      >
        <option value="Pending">Pending</option>
        <option value="In Transit">In Transit</option>
        <option value="Delivered">Delivered</option>
        <option value="Cancelled">Cancelled</option>
      </select>
      
      <input
        type="email"
        placeholder="Admin Email"
        value={adminEmail}
        onChange={(e) => setAdminEmail(e.target.value)}
        required
      />
      
      <button type="submit">Update Status</button>
      
      {message && <p className="message">{message}</p>}
    </form>
  );
}

export default UpdateStatusForm;
```

---

### 11.2.3 Calling GetCourierStatus Function from React

```javascript
// client/src/components/GetStatusForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

function GetStatusForm() {
  const [courierId, setCourierId] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  
  const fetchStatus = async (e) => {
    e.preventDefault();
    setError('');
    setStatus('');
    
    try {
      const response = await axios.get(
        `http://localhost:5001/api/couriers/${courierId}/status`
      );
      
      setStatus(response.data.status);
      console.log('Function called successfully:', response.data);
      
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to fetch status');
      console.error('Error calling function:', error);
    }
  };
  
  return (
    <div>
      <h2>Get Courier Status (MySQL Function)</h2>
      
      <form onSubmit={fetchStatus}>
        <input
          type="number"
          placeholder="Enter Courier ID"
          value={courierId}
          onChange={(e) => setCourierId(e.target.value)}
          required
        />
        <button type="submit">Get Status</button>
      </form>
      
      {status && (
        <div className={`status-display status-${status.toLowerCase()}`}>
          <strong>Current Status:</strong> {status}
        </div>
      )}
      
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default GetStatusForm;
```

---


# 12. SQL FILE REFERENCE

## 12.1 Complete SQL File

**File Name:** `database_setup.sql`

**Location:** Root directory of the project

**Total Lines:** 368 lines

**Description:** This file contains the complete SQL code for the Courier Management System database, including all DDL commands, stored procedures, functions, triggers, and sample data insertion queries.

---

## 12.2 File Structure

The SQL file is organized into the following sections:

### Section 1: Database Initialization
- DROP DATABASE IF EXISTS
- CREATE DATABASE
- USE DATABASE

### Section 2: Table Creation (DDL)
- CREATE TABLE Users
- CREATE TABLE Admins
- CREATE TABLE Couriers
- CREATE TABLE Delivery_History
- CREATE TABLE Courier_Audit
- CREATE TABLE Comments

### Section 3: Stored Procedures
- AddCourierOrder (Creates new courier with validation)
- UpdateCourierStatus (Updates status and logs to Delivery_History)

### Section 4: MySQL Function
- GetCourierStatus (Returns status for a given courier ID)

### Section 5: Trigger
- after_courier_status_update (Auto-logs status changes to Courier_Audit)

### Section 6: Sample Data (INSERT Statements)
- INSERT INTO Users
- INSERT INTO Admins
- INSERT INTO Couriers
- INSERT INTO Comments

### Section 7: Complex Queries
- JOIN query (3-table join)
- NESTED query (Subquery with IN clause)
- AGGREGATE queries (GROUP BY with COUNT, MIN, MAX)

---

## 12.3 Execution Instructions

### Step 1: Open MySQL Command Line or Workbench

```bash
mysql -u root -p
```

### Step 2: Execute the SQL File

**Option A: From Command Line**
```bash
mysql -u root -p < database_setup.sql
```

**Option B: From MySQL Command Line**
```sql
SOURCE /path/to/database_setup.sql;
```

**Option C: From MySQL Workbench**
1. Open MySQL Workbench
2. Click File → Open SQL Script
3. Select `database_setup.sql`
4. Click Execute (lightning bolt icon)

---

## 12.4 File Statistics

| Component | Count |
|-----------|-------|
| Tables Created | 6 |
| Stored Procedures | 2 |
| Functions | 1 |
| Triggers | 1 |
| Sample Users | 5 |
| Sample Admins | 3 |
| Sample Couriers | 8 |
| Sample Comments | 5 |

---

## 12.5 Dependencies

**Required MySQL Version:** 8.0 or higher

**Reason:** Uses DELIMITER for stored procedures, functions, and triggers.

---

## 12.6 Verification Queries

After executing `database_setup.sql`, verify the setup:

```sql
-- Check all tables
SHOW TABLES;

-- Check stored procedures
SHOW PROCEDURE STATUS WHERE Db = 'courier_management';

-- Check functions
SHOW FUNCTION STATUS WHERE Db = 'courier_management';

-- Check triggers
SHOW TRIGGERS FROM courier_management;

-- Verify data
SELECT COUNT(*) AS total_users FROM Users;
SELECT COUNT(*) AS total_admins FROM Admins;
SELECT COUNT(*) AS total_couriers FROM Couriers;
```

---

# 13. GITHUB REPOSITORY LINK

## 13.1 Repository Information

**GitHub Repository:** [https://github.com/chickoo47/Courier-Management-System](https://github.com/chickoo47/Courier-Management-System)

**Repository Owner:** chickoo47 (Ary)

**Project Type:** Full-stack web application with MySQL database

**License:** MIT License

---

## 13.2 Repository Structure

```
Courier-Management-System/
├── client/                    # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
│
├── server/                    # Node.js backend
│   ├── routes/
│   │   ├── couriers.js       # Courier routes
│   │   ├── users.js          # User routes
│   │   ├── admins.js         # Admin routes
│   │   └── analytics.js      # Analytics routes
│   ├── db.js                 # Database connection
│   ├── server.js             # Express server
│   └── package.json
│
├── database_setup.sql         # Complete SQL file (368 lines)
├── README.md                  # Project documentation
├── .gitignore
└── .env.example              # Environment variables template
```

---

## 13.3 Clone Instructions

### Step 1: Clone the Repository

```bash
git clone https://github.com/chickoo47/Courier-Management-System.git
cd Courier-Management-System
```

### Step 2: Install Backend Dependencies

```bash
cd server
npm install
```

**Dependencies Installed:**
- express: ^4.18.0
- mysql2: ^3.6.5
- cors: ^2.8.5
- dotenv: ^16.3.1
- body-parser: ^1.20.2

### Step 3: Install Frontend Dependencies

```bash
cd ../client
npm install
```

**Dependencies Installed:**
- react: ^18.2.0
- react-dom: ^18.2.0
- axios: ^1.6.2

### Step 4: Configure Environment Variables

```bash
cd ../server
cp .env.example .env
```

Edit `.env` file:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=courier_management
DB_SOCKET=/tmp/mysql.sock
PORT=5001
```

### Step 5: Setup Database

```bash
mysql -u root -p < ../database_setup.sql
```

### Step 6: Start Backend Server

```bash
cd server
npm start
```

Server runs on: `http://localhost:5001`

### Step 7: Start Frontend (New Terminal)

```bash
cd client
npm start
```

Frontend runs on: `http://localhost:3000`

---

## 13.4 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/couriers` | Create courier (AddCourierOrder) |
| GET | `/api/couriers` | Get all couriers (JOIN query) |
| GET | `/api/couriers/:id` | Get single courier details |
| GET | `/api/couriers/:id/status` | Get status (GetCourierStatus function) |
| PUT | `/api/couriers/:id/status` | Update status (UpdateCourierStatus + Trigger) |
| DELETE | `/api/couriers/:id` | Delete courier |
| GET | `/api/couriers/:id/audit` | Get audit trail |
| GET | `/api/users` | Get all users |
| GET | `/api/users/with-delivered-orders` | Nested query |
| GET | `/api/admins` | Get all admins |
| GET | `/api/analytics/status-summary` | Aggregate statistics |

---

## 13.5 Key Features in Repository

1. **Database Layer**
   - 2 Stored Procedures (AddCourierOrder, UpdateCourierStatus)
   - 1 MySQL Function (GetCourierStatus)
   - 1 Trigger (after_courier_status_update)
   - 6 Normalized Tables (3NF)

2. **Backend (Node.js/Express)**
   - RESTful API design
   - mysql2 Promise-based connection pooling
   - Error handling and validation
   - CORS enabled

3. **Frontend (React)**
   - Component-based architecture
   - Axios for HTTP requests
   - Forms for CRUD operations
   - Dynamic status display

4. **Advanced SQL**
   - JOIN queries (INNER, LEFT)
   - NESTED queries (Subqueries with IN)
   - AGGREGATE queries (COUNT, MIN, MAX, GROUP BY)

---

## 13.6 Contact Information

**Developer:** Ary (chickoo47)

**GitHub:** [https://github.com/chickoo47](https://github.com/chickoo47)

**Repository Issues:** [https://github.com/chickoo47/Courier-Management-System/issues](https://github.com/chickoo47/Courier-Management-System/issues)

---

**END OF REPORT**

---

**Submitted By:** Ary (chickoo47)  
**Project:** Courier Management System  
**Course:** Database Management Systems Lab  
**Academic Year:** 2025  
**Submission Date:** October 27, 2025

