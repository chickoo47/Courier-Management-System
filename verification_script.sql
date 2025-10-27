-- ============================================================
-- VERIFICATION SCRIPT
-- Run this after database_setup.sql to verify everything works
-- ============================================================

USE courier_management;

-- ============================================================
-- 1. VERIFY TABLES EXIST
-- ============================================================
SELECT 'Step 1: Verifying Tables...' AS step;

SELECT 
    table_name,
    table_rows
FROM information_schema.tables
WHERE table_schema = 'courier_management'
ORDER BY table_name;

-- Expected: 6 tables (Users, Admins, Couriers, Delivery_History, Courier_Audit, Comments)

-- ============================================================
-- 2. VERIFY STORED PROCEDURES
-- ============================================================
SELECT 'Step 2: Verifying Stored Procedures...' AS step;

SELECT 
    routine_name,
    routine_type
FROM information_schema.routines
WHERE routine_schema = 'courier_management'
  AND routine_type = 'PROCEDURE';

-- Expected: AddCourierOrder, UpdateCourierStatus

-- ============================================================
-- 3. VERIFY FUNCTIONS
-- ============================================================
SELECT 'Step 3: Verifying Functions...' AS step;

SELECT 
    routine_name,
    routine_type
FROM information_schema.routines
WHERE routine_schema = 'courier_management'
  AND routine_type = 'FUNCTION';

-- Expected: GetCourierStatus

-- ============================================================
-- 4. VERIFY TRIGGERS
-- ============================================================
SELECT 'Step 4: Verifying Triggers...' AS step;

SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_timing
FROM information_schema.triggers
WHERE trigger_schema = 'courier_management';

-- Expected: after_courier_status_update on Couriers table

-- ============================================================
-- 5. TEST FUNCTION (GetCourierStatus)
-- ============================================================
SELECT 'Step 5: Testing GetCourierStatus Function...' AS step;

-- Test the function with existing couriers
SELECT 
    courier_id,
    bill_number,
    status AS actual_status,
    GetCourierStatus(courier_id) AS function_result
FROM Couriers
LIMIT 5;

-- Expected: function_result should match actual_status

-- ============================================================
-- 6. TEST PROCEDURE 1 (AddCourierOrder)
-- ============================================================
SELECT 'Step 6: Testing AddCourierOrder Procedure...' AS step;

-- Add a test courier
CALL AddCourierOrder(
    1,                                  -- customer_id
    1,                                  -- admin_id
    'BILL-VERIFY-001',                  -- bill_number
    'Verification Pickup Address',      -- pickup_address
    'Verification Delivery Address'     -- delivery_address
);

-- Verify it was added
SELECT * FROM Couriers WHERE bill_number = 'BILL-VERIFY-001';

-- Expected: One row with status = 'Pending'

-- ============================================================
-- 7. TEST PROCEDURE 2 & TRIGGER (UpdateCourierStatus)
-- ============================================================
SELECT 'Step 7: Testing UpdateCourierStatus Procedure and Trigger...' AS step;

-- Get the courier_id of the test courier
SET @test_courier_id = (SELECT courier_id FROM Couriers WHERE bill_number = 'BILL-VERIFY-001');

-- Update the status (this should trigger the trigger)
CALL UpdateCourierStatus(
    @test_courier_id,
    'In Transit',
    'verify.admin@courier.com'
);

-- Check Couriers table was updated
SELECT 'Courier after update:' AS info;
SELECT * FROM Couriers WHERE courier_id = @test_courier_id;

-- Check Delivery_History (populated by procedure)
SELECT 'Delivery History (from procedure):' AS info;
SELECT * FROM Delivery_History WHERE courier_id = @test_courier_id;

-- Check Courier_Audit (populated by TRIGGER)
SELECT 'Courier Audit (from TRIGGER):' AS info;
SELECT * FROM Courier_Audit WHERE courier_id = @test_courier_id;

-- Expected: 
--   - Couriers.status = 'In Transit'
--   - At least 1 row in Delivery_History
--   - At least 1 row in Courier_Audit (PROVES TRIGGER WORKED)

-- ============================================================
-- 8. TEST COMPLEX QUERY 1 (JOIN)
-- ============================================================
SELECT 'Step 8: Testing JOIN Query...' AS step;

SELECT 
    C.bill_number,
    C.status,
    U.name AS customer_name,
    A.name AS admin_name
FROM Couriers C
JOIN Users U ON C.customer_id = U.user_id
LEFT JOIN Admins A ON C.managed_by_admin_id = A.admin_id
LIMIT 5;

-- Expected: Combined data from 3 tables

-- ============================================================
-- 9. TEST COMPLEX QUERY 2 (NESTED)
-- ============================================================
SELECT 'Step 9: Testing NESTED Query...' AS step;

SELECT 
    user_id,
    name,
    email
FROM Users
WHERE user_id IN (
    SELECT customer_id 
    FROM Couriers 
    WHERE status = 'Delivered'
);

-- Expected: Only customers who have delivered orders

-- ============================================================
-- 10. TEST COMPLEX QUERY 3 (AGGREGATE)
-- ============================================================
SELECT 'Step 10: Testing AGGREGATE Query...' AS step;

SELECT 
    status,
    COUNT(*) as total_count,
    COUNT(DISTINCT customer_id) as unique_customers
FROM Couriers
GROUP BY status
ORDER BY total_count DESC;

-- Expected: Grouped counts by status

-- ============================================================
-- 11. VERIFY FOREIGN KEYS
-- ============================================================
SELECT 'Step 11: Verifying Foreign Keys...' AS step;

SELECT 
    constraint_name,
    table_name,
    column_name,
    referenced_table_name,
    referenced_column_name
FROM information_schema.key_column_usage
WHERE table_schema = 'courier_management'
  AND referenced_table_name IS NOT NULL;

-- Expected: FKs from Couriers to Users and Admins

-- ============================================================
-- 12. SAMPLE DATA COUNT
-- ============================================================
SELECT 'Step 12: Verifying Sample Data...' AS step;

SELECT 
    'Users' AS table_name,
    COUNT(*) AS row_count
FROM Users
UNION ALL
SELECT 'Admins', COUNT(*) FROM Admins
UNION ALL
SELECT 'Couriers', COUNT(*) FROM Couriers
UNION ALL
SELECT 'Delivery_History', COUNT(*) FROM Delivery_History
UNION ALL
SELECT 'Courier_Audit', COUNT(*) FROM Courier_Audit;

-- Expected:
--   Users: 8+
--   Admins: 4+
--   Couriers: 8+ (including test courier)
--   Delivery_History: 1+ (from test)
--   Courier_Audit: 1+ (from trigger test)

-- ============================================================
-- 13. CLEANUP TEST DATA (Optional)
-- ============================================================
SELECT 'Step 13: Cleanup (Optional)...' AS step;

-- To remove test courier:
-- DELETE FROM Couriers WHERE bill_number = 'BILL-VERIFY-001';

-- ============================================================
-- FINAL SUMMARY
-- ============================================================
SELECT '============================================================' AS '';
SELECT '✅ VERIFICATION COMPLETE!' AS 'RESULT';
SELECT '============================================================' AS '';
SELECT 'If all steps completed successfully, your database is ready!' AS 'STATUS';
SELECT 'You can now start the Node.js backend server.' AS 'NEXT STEP';
SELECT '============================================================' AS '';

-- ============================================================
-- QUICK REFERENCE COMMANDS
-- ============================================================

-- Show all procedures:
-- SHOW PROCEDURE STATUS WHERE Db = 'courier_management';

-- Show all functions:
-- SHOW FUNCTION STATUS WHERE Db = 'courier_management';

-- Show all triggers:
-- SHOW TRIGGERS;

-- Show procedure definition:
-- SHOW CREATE PROCEDURE AddCourierOrder;
-- SHOW CREATE PROCEDURE UpdateCourierStatus;

-- Show function definition:
-- SHOW CREATE FUNCTION GetCourierStatus;

-- Show trigger definition:
-- SHOW CREATE TRIGGER after_courier_status_update;

-- ============================================================
-- TROUBLESHOOTING
-- ============================================================

-- If procedures don't exist:
-- Re-run: source database_setup.sql

-- If trigger doesn't fire:
-- Check trigger exists: SHOW TRIGGERS;
-- Test manually: UPDATE Couriers SET status = 'Delivered' WHERE courier_id = 1;
-- Check audit: SELECT * FROM Courier_Audit WHERE courier_id = 1;

-- If function returns NULL:
-- Check courier exists: SELECT * FROM Couriers WHERE courier_id = 1;
-- Test function: SELECT GetCourierStatus(1);

-- ============================================================
