#!/bin/bash

# Update PROJECT_REPORT.md with styled text placeholders instead of images

# Use perl for in-place editing with better regex support
perl -i -pe '
# Screenshot 1 - Create Form
s|!\[Add New Courier Form\]\(screenshots/crud_operations/01_create_form\.png\)|```diff\n+ SCREENSHOT PLACEHOLDER: Add New Courier Order Form\n! • Form with fields: Customer ID, Admin ID, Bill Number, Pickup Address, Delivery Address\n! • Blue "Submit" button that calls AddCourierOrder() stored procedure\n! • Expected: New courier created with status "Pending"\n```|g;

# Screenshot 2 - Create Success
s|!\[Create Success\]\(screenshots/crud_operations/02_create_success\.png\)|```diff\n+ SCREENSHOT PLACEHOLDER: CREATE Success Response\n! • Green success message: "Courier created successfully!"\n! • Displays: Courier ID, Customer Details, Admin Details\n! • Confirms stored procedure execution\n```|g;

# Screenshot 3 - Read All
s|!\[View All Couriers\]\(screenshots/crud_operations/03_read_all_couriers\.png\)|```diff\n+ SCREENSHOT PLACEHOLDER: View All Couriers (JOIN Query)\n! • Table columns: Courier ID | Bill Number | Status | Customer Name | Admin Name\n! • Data from 3-table JOIN: Couriers + Users + Admins\n! • Shows multiple courier orders in table format\n```|g;

# Screenshot 4 - Get Status Function
s|!\[Get Status Function\]\(screenshots/crud_operations/04_get_status_function\.png\)|```diff\n+ SCREENSHOT PLACEHOLDER: Get Status Using MySQL Function\n! • Input field: "Enter Courier ID"\n! • Button: "Get Status"\n! • Result: Displays current status from GetCourierStatus() function\n```|g;

# Screenshot 5 - Single Courier
s|!\[Single Courier Details\]\(screenshots/crud_operations/05_read_single_courier\.png\)|```diff\n+ SCREENSHOT PLACEHOLDER: Single Courier Details View\n! • Complete courier information display\n! • Shows: Bill Number, Status, Pickup/Delivery Addresses\n! • Customer and Admin contact information included\n```|g;

# Screenshot 6 - Update Form
s|!\[Update Status Form\]\(screenshots/crud_operations/06_update_form\.png\)|```diff\n+ SCREENSHOT PLACEHOLDER: Update Courier Status Form\n! • Courier ID input field\n! • Status dropdown: Pending | In Transit | Delivered | Cancelled\n! • Admin Email input • Calls UpdateCourierStatus() procedure\n```|g;

# Screenshot 7 - Update Success with Trigger
s|!\[Update Success with Trigger\]\(screenshots/crud_operations/07_update_success_trigger\.png\)|```diff\n+ SCREENSHOT PLACEHOLDER: UPDATE Success with Trigger Execution\n! • Success message: "Status updated successfully!"\n! • Note: "Trigger automatically logged this change to Courier_Audit"\n! • Both Delivery_History and Courier_Audit tables populated\n```|g;

# Screenshot 8 - Audit Trail
s|!\[Audit Trail\]\(screenshots/crud_operations/08_audit_trail\.png\)|```diff\n+ SCREENSHOT PLACEHOLDER: Audit Trail Verification\n! • Two tables side-by-side:\n!   - Delivery_History (manual logs via stored procedure)\n!   - Courier_Audit (automatic logs via trigger)\n! • Matching timestamps prove trigger execution\n```|g;

# Screenshot 9 - Delete Confirmation
s|!\[Delete Confirmation\]\(screenshots/crud_operations/09_delete_confirmation\.png\)|```diff\n- SCREENSHOT PLACEHOLDER: Delete Courier Confirmation Dialog\n! • Modal: "Are you sure you want to delete this courier?"\n! • Warning: "This will CASCADE DELETE all related records"\n! • Buttons: Cancel (gray) | Delete (red)\n```|g;

# Screenshot 10 - Delete Success
s|!\[Delete Success\]\(screenshots/crud_operations/10_delete_success\.png\)|```diff\n+ SCREENSHOT PLACEHOLDER: DELETE Success Response\n! • Success message: "Courier deleted successfully!"\n! • Confirmation: Related Delivery_History, Courier_Audit, Comments removed\n! • CASCADE DELETE verification shown\n```|g;

# Screenshot 11 - Cascade Verification
s|!\[Cascade Delete Verification\]\(screenshots/crud_operations/11_cascade_verification\.png\)|```diff\n+ SCREENSHOT PLACEHOLDER: Cascade Delete Verification\n! • Database query results showing:\n!   - Delivery_History: 0 records for deleted courier_id\n!   - Courier_Audit: 0 records for deleted courier_id\n!   - Comments: 0 records for deleted courier_id\n```|g;

# Screenshot 12 - Homepage
s|!\[Application Homepage\]\(screenshots/frontend_features/12_homepage\.png\)|```diff\n+ SCREENSHOT PLACEHOLDER: Application Homepage\n! • Navigation: Add Courier | View Couriers | Update Status | Analytics\n! • Modern UI with blue header and sidebar navigation\n! • Main content area with dashboard widgets\n```|g;

# Screenshot 13 - Add Courier Form
s|!\[Add Courier Form\]\(screenshots/frontend_features/13_add_courier_form\.png\)|```diff\n+ SCREENSHOT PLACEHOLDER: Add Courier Form Interface\n! • Customer dropdown (populated from Users table)\n! • Admin dropdown (populated from Admins table)\n! • Bill Number, Pickup Address, Delivery Address fields\n! • Blue "Create Courier" button\n```|g;

# Screenshot 14 - Update Status Form
s|!\[Update Status Form\]\(screenshots/frontend_features/14_update_status_form\.png\)|```diff\n+ SCREENSHOT PLACEHOLDER: Update Status Form Interface\n! • Courier ID input\n! • Status dropdown: Pending | In Transit | Delivered | Cancelled\n! • Admin Email field\n! • Update button triggers procedure AND trigger\n```|g;

# Screenshot 15 - Get Status Function
s|!\[Get Status Function\]\(screenshots/frontend_features/15_get_status_function\.png\)|```diff\n+ SCREENSHOT PLACEHOLDER: Get Status Function Test\n! • Input: Courier ID\n! • Button: "Get Status"\n! • Color-coded result: Green (Delivered), Blue (In Transit),\n!   Yellow (Pending), Red (Cancelled)\n```|g;

# Screenshot 16 - Trigger Validation
s|!\[Trigger Validation\]\(screenshots/frontend_features/16_trigger_validation\.png\)|```diff\n+ SCREENSHOT PLACEHOLDER: Trigger Validation Display\n! • Split screen layout:\n!   LEFT: Delivery_History table\n!   RIGHT: Courier_Audit table\n! • Highlighted matching records with same timestamp\n```|g;

# Screenshot 17 - JOIN Query
s|!\[JOIN Query Results\]\(screenshots/frontend_features/17_join_query_results\.png\)|```diff\n+ SCREENSHOT PLACEHOLDER: JOIN Query Results\n! • Combined data from Couriers + Users + Admins\n! • Columns: Courier ID, Bill Number, Status, Customer Name,\n!   Customer Email, Admin Name, Admin Email\n! • INNER JOIN and LEFT JOIN demonstration\n```|g;

# Screenshot 18 - Nested Query
s|!\[NESTED Query Results\]\(screenshots/frontend_features/18_nested_query_results\.png\)|```diff\n+ SCREENSHOT PLACEHOLDER: NESTED Query Results\n! • List of customers with delivered orders\n! • Subquery: WHERE user_id IN (SELECT customer_id FROM Couriers\n!   WHERE status="Delivered")\n! • Shows: User ID, Name, Email, Phone\n```|g;

# Screenshot 19 - Aggregate Query
s|!\[AGGREGATE Query Results\]\(screenshots/frontend_features/19_aggregate_query_results\.png\)|```diff\n+ SCREENSHOT PLACEHOLDER: AGGREGATE Query Statistics\n! • Table: Status | Total Orders | Unique Customers |\n!   Earliest Order | Latest Order\n! • Functions: COUNT(*), COUNT(DISTINCT), MIN(), MAX()\n! • GROUP BY status demonstration\n```|g;

# Screenshot 20 - Modal
s|!\[Modal Dialog\]\(screenshots/frontend_features/20_modal_dialog\.png\)|```diff\n+ SCREENSHOT PLACEHOLDER: Modal Dialog - Courier Details\n! • Overlay modal with semi-transparent backdrop\n! • Complete courier details and full audit trail timeline\n! • Customer and Admin contact information\n! • Close button (X) in top-right corner\n```|g;

# Screenshot 21 - Notifications
s|!\[Notifications\]\(screenshots/frontend_features/21_notifications\.png\)|```diff\n+ SCREENSHOT PLACEHOLDER: Success/Error Toast Notifications\n! • Green toast (top-right): "Success! Courier created"\n! • Red toast: "Error: Bill number already exists"\n! • Auto-dismiss after 3 seconds\n```|g;

# Screenshot 22 - Mobile View
s|!\[Mobile View\]\(screenshots/frontend_features/22_mobile_view\.png\)|```diff\n+ SCREENSHOT PLACEHOLDER: Responsive Mobile View\n! • Mobile browser (375x667px)\n! • Hamburger menu, stacked fields, touch-optimized buttons\n! • Collapsible sections, responsive grid layout\n```|g;
' PROJECT_REPORT.md

echo "✅ Updated PROJECT_REPORT.md with styled text placeholders!"
echo ""
echo "The placeholders now use:"
echo "  • diff syntax for colored backgrounds"
echo "  • + prefix for green highlights"
echo "  • ! prefix for yellow/orange highlights"
echo "  • - prefix for red highlights"
echo ""
echo "Open PROJECT_REPORT.md to see the styled placeholders!"
