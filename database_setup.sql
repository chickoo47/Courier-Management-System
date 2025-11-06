-- ============================================================
-- COURIER MANAGEMENT SYSTEM - DATABASE SETUP SCRIPT
-- ============================================================
-- This script creates the complete database structure including:
-- 1. Tables (Users, Admins, Couriers, Delivery_History, Courier_Audit, Comments)
-- 2. Stored Procedures (AddCourierOrder, UpdateCourierStatus)
-- 3. Functions (GetCourierStatus)
-- 4. Triggers (after_courier_status_update)
-- 5. Sample Data for testing
-- ============================================================

-- Drop and recreate database
DROP DATABASE IF EXISTS courier_management;
CREATE DATABASE courier_management;
USE courier_management;

-- ============================================================
-- TABLE 1: Users (Customers)
-- ============================================================
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLE 2: Admins
-- ============================================================
CREATE TABLE Admins (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(50) DEFAULT 'Manager',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLE 3: Couriers (Main courier orders table)
-- ============================================================
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

-- ============================================================
-- TABLE 4: Delivery_History (Populated by Trigger)
-- ============================================================
CREATE TABLE Delivery_History (
    history_id INT AUTO_INCREMENT PRIMARY KEY,
    courier_id INT NOT NULL,
    old_status VARCHAR(50),
    new_status VARCHAR(50),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    changed_by_admin_email VARCHAR(100),
    FOREIGN KEY (courier_id) REFERENCES Couriers(courier_id) ON DELETE CASCADE
);

-- ============================================================
-- TABLE 5: Courier_Audit (Populated by Trigger)
-- ============================================================
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

-- ============================================================
-- TABLE 6: Comments (Optional - for additional features)
-- ============================================================
CREATE TABLE Comments (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    courier_id INT NOT NULL,
    user_id INT,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (courier_id) REFERENCES Couriers(courier_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE SET NULL
);

-- ============================================================
-- STORED PROCEDURE 1: AddCourierOrder (CREATE)
-- Purpose: Adds a new courier order to the system
-- Parameters: customer_id, admin_id, bill_number, pickup_address, delivery_address
-- ============================================================
DELIMITER //

CREATE PROCEDURE AddCourierOrder(
    IN p_customer_id INT,
    IN p_admin_id INT,
    IN p_bill_number VARCHAR(50),
    IN p_pickup_address TEXT,
    IN p_delivery_address TEXT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Error adding courier order';
    END;
    
    START TRANSACTION;
    
    -- Insert new courier order
    INSERT INTO Couriers (
        customer_id,
        managed_by_admin_id,
        bill_number,
        pickup_address,
        delivery_address,
        status
    ) VALUES (
        p_customer_id,
        p_admin_id,
        p_bill_number,
        p_pickup_address,
        p_delivery_address,
        'Pending'
    );
    
    -- Return the newly created courier
    SELECT 
        c.*,
        u.name AS customer_name,
        u.email AS customer_email,
        a.name AS admin_name,
        a.email AS admin_email
    FROM Couriers c
    LEFT JOIN Users u ON c.customer_id = u.user_id
    LEFT JOIN Admins a ON c.managed_by_admin_id = a.admin_id
    WHERE c.courier_id = LAST_INSERT_ID();
    
    COMMIT;
END //

DELIMITER ;

-- ============================================================
-- STORED PROCEDURE 2: UpdateCourierStatus (UPDATE)
-- Purpose: Updates courier status and logs the change
-- Parameters: courier_id, new_status, changed_by_admin_email
-- Note: This procedure will trigger the 'after_courier_status_update' trigger
-- ============================================================
DELIMITER //

CREATE PROCEDURE UpdateCourierStatus(
    IN p_courier_id INT,
    IN p_new_status VARCHAR(50),
    IN p_changed_by_admin_email VARCHAR(100)
)
BEGIN
    DECLARE v_old_status VARCHAR(50);
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Error updating courier status';
    END;
    
    START TRANSACTION;
    
    -- Get current status
    SELECT status INTO v_old_status
    FROM Couriers
    WHERE courier_id = p_courier_id;
    
    -- Check if courier exists
    IF v_old_status IS NULL THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Courier not found';
    END IF;
    
    -- Update courier status
    -- This UPDATE will automatically trigger the 'after_courier_status_update' trigger
    UPDATE Couriers
    SET status = p_new_status
    WHERE courier_id = p_courier_id;
    
    -- Manually insert into Delivery_History (in addition to trigger)
    INSERT INTO Delivery_History (
        courier_id,
        old_status,
        new_status,
        changed_by_admin_email
    ) VALUES (
        p_courier_id,
        v_old_status,
        p_new_status,
        p_changed_by_admin_email
    );
    
    COMMIT;
    
    SELECT 
        'Status updated successfully' AS message,
        p_courier_id AS courier_id,
        v_old_status AS old_status,
        p_new_status AS new_status;
END //

DELIMITER ;

-- ============================================================
-- FUNCTION 1: GetCourierStatus (READ)
-- Purpose: Retrieves the current status of a courier
-- Parameters: courier_id
-- Returns: Status string
-- ============================================================
DELIMITER //

CREATE FUNCTION GetCourierStatus(p_courier_id INT)
RETURNS VARCHAR(50)
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_status VARCHAR(50);
    
    SELECT status INTO v_status
    FROM Couriers
    WHERE courier_id = p_courier_id;
    
    RETURN v_status;
END //

DELIMITER ;

-- ============================================================
-- TRIGGER 1: after_courier_status_update (AUTOMATIC)
-- Purpose: Automatically logs status changes to Courier_Audit table
-- Fires: After UPDATE on Couriers table when status changes
-- ============================================================
DELIMITER //

CREATE TRIGGER after_courier_status_update
AFTER UPDATE ON Couriers
FOR EACH ROW
BEGIN
    -- Only log if status actually changed
    IF OLD.status != NEW.status THEN
        -- Insert audit record
        INSERT INTO Courier_Audit (
            courier_id,
            action_type,
            old_status,
            new_status,
            admin_email
        ) VALUES (
            NEW.courier_id,
            'STATUS_UPDATE',
            OLD.status,
            NEW.status,
            'system@courier.com'  -- Default value, can be customized
        );
    END IF;
END //

DELIMITER ;

-- ============================================================
-- FUNCTION 2: GetCustomerCourierCount (NEW)
-- Purpose: Calculates total number of couriers for a specific customer
-- Parameters: customer_id
-- Returns: Integer count of total couriers
-- ============================================================
DELIMITER //

CREATE FUNCTION GetCustomerCourierCount(p_customer_id INT)
RETURNS INT
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_count INT;
    
    SELECT COUNT(*) INTO v_count
    FROM Couriers
    WHERE customer_id = p_customer_id;
    
    RETURN v_count;
END //

DELIMITER ;

-- ============================================================
-- TRIGGER 2: after_courier_delivered (NEW)
-- Purpose: Automatically creates a thank you comment when courier is delivered
-- Fires: After UPDATE on Couriers table when status changes to 'Delivered'
-- ============================================================
DELIMITER //

CREATE TRIGGER after_courier_delivered
AFTER UPDATE ON Couriers
FOR EACH ROW
BEGIN
    -- Only fire if status changed TO 'Delivered'
    IF OLD.status != 'Delivered' AND NEW.status = 'Delivered' THEN
        -- Insert automatic thank you comment
        INSERT INTO Comments (
            courier_id,
            user_id,
            comment_text
        ) VALUES (
            NEW.courier_id,
            NEW.customer_id,
            CONCAT('Thank you for using our courier service! Your package (', 
                   NEW.bill_number, 
                   ') has been successfully delivered. We hope you are satisfied with our service.')
        );
    END IF;
END //

DELIMITER ;

-- ============================================================
-- SAMPLE DATA - Users (Customers)
-- ============================================================
INSERT INTO Users (name, email, phone, address) VALUES
('John Doe', 'john.doe@email.com', '555-0101', '123 Main St, New York, NY'),
('Jane Smith', 'jane.smith@email.com', '555-0102', '456 Oak Ave, Los Angeles, CA'),
('Robert Johnson', 'robert.j@email.com', '555-0103', '789 Pine Rd, Chicago, IL'),
('Emily Davis', 'emily.davis@email.com', '555-0104', '321 Elm St, Houston, TX'),
('Michael Wilson', 'michael.w@email.com', '555-0105', '654 Maple Dr, Phoenix, AZ'),
('Sarah Brown', 'sarah.brown@email.com', '555-0106', '987 Cedar Ln, Philadelphia, PA'),
('David Martinez', 'david.m@email.com', '555-0107', '147 Birch Ct, San Antonio, TX'),
('Lisa Anderson', 'lisa.a@email.com', '555-0108', '258 Spruce Way, San Diego, CA');

-- ============================================================
-- SAMPLE DATA - Admins
-- ============================================================
INSERT INTO Admins (name, email, phone, role) VALUES
('Admin Alice', 'alice.admin@courier.com', '555-1001', 'Operations Manager'),
('Admin Bob', 'bob.admin@courier.com', '555-1002', 'Logistics Manager'),
('Admin Charlie', 'charlie.admin@courier.com', '555-1003', 'Customer Service Manager'),
('Admin Diana', 'diana.admin@courier.com', '555-1004', 'Warehouse Manager');

-- ============================================================
-- SAMPLE DATA - Couriers (Using Stored Procedure)
-- These will be added via the application, but here are examples
-- ============================================================
-- Example: CALL AddCourierOrder(1, 1, 'BILL-1001', '123 Main St, NY', '456 Oak Ave, LA');

-- You can insert sample couriers directly for testing:
INSERT INTO Couriers (customer_id, managed_by_admin_id, bill_number, pickup_address, delivery_address, status) VALUES
(1, 1, 'BILL-1001', '123 Main St, New York, NY', '456 Oak Ave, Los Angeles, CA', 'Pending'),
(2, 2, 'BILL-1002', '456 Oak Ave, Los Angeles, CA', '789 Pine Rd, Chicago, IL', 'In Transit'),
(3, 1, 'BILL-1003', '789 Pine Rd, Chicago, IL', '321 Elm St, Houston, TX', 'Delivered'),
(4, 3, 'BILL-1004', '321 Elm St, Houston, TX', '654 Maple Dr, Phoenix, AZ', 'Pending'),
(5, 2, 'BILL-1005', '654 Maple Dr, Phoenix, AZ', '987 Cedar Ln, Philadelphia, PA', 'In Transit'),
(6, 4, 'BILL-1006', '987 Cedar Ln, Philadelphia, PA', '147 Birch Ct, San Antonio, TX', 'Delivered'),
(7, 1, 'BILL-1007', '147 Birch Ct, San Antonio, TX', '258 Spruce Way, San Diego, CA', 'Pending'),
(8, 3, 'BILL-1008', '258 Spruce Way, San Diego, CA', '123 Main St, New York, NY', 'Cancelled');

-- ============================================================
-- VERIFICATION QUERIES
-- Run these to verify the database setup
-- ============================================================

-- Verify tables
SELECT 'Tables created successfully' AS status;
SHOW TABLES;

-- Verify stored procedures
SELECT 'Stored Procedures:' AS info;
SHOW PROCEDURE STATUS WHERE Db = 'courier_management';

-- Verify functions
SELECT 'Functions:' AS info;
SHOW FUNCTION STATUS WHERE Db = 'courier_management';

-- Verify triggers
SELECT 'Triggers:' AS info;
SHOW TRIGGERS;

-- Test the function
SELECT 'Testing GetCourierStatus function:' AS info;
SELECT courier_id, bill_number, GetCourierStatus(courier_id) AS status FROM Couriers LIMIT 3;

-- Verify sample data
SELECT 'Sample Data Count:' AS info;
SELECT 
    (SELECT COUNT(*) FROM Users) AS total_users,
    (SELECT COUNT(*) FROM Admins) AS total_admins,
    (SELECT COUNT(*) FROM Couriers) AS total_couriers;

-- ============================================================
-- TEST PROCEDURE CALLS (Optional - for manual testing)
-- ============================================================

-- Test AddCourierOrder procedure
-- CALL AddCourierOrder(1, 1, 'BILL-TEST-001', 'Test Pickup Address', 'Test Delivery Address');

-- Test UpdateCourierStatus procedure (this will trigger the trigger)
-- CALL UpdateCourierStatus(1, 'In Transit', 'alice.admin@courier.com');

-- Verify trigger fired by checking audit tables
-- SELECT * FROM Delivery_History WHERE courier_id = 1;
-- SELECT * FROM Courier_Audit WHERE courier_id = 1;

-- ============================================================
-- SCRIPT COMPLETE
-- ============================================================
SELECT '✅ Database setup completed successfully!' AS message;
SELECT '🚀 You can now start the Node.js backend server' AS next_step;
