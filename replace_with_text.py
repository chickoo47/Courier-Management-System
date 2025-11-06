#!/usr/bin/env python3
"""Replace screenshot image references with styled text placeholders"""

import re

# Read the report
with open('PROJECT_REPORT.md', 'r') as f:
    content = f.read()

# Define replacements: (image_markdown, replacement_text)
replacements = [
    (r'!\[Add New Courier Form\]\(screenshots/crud_operations/01_create_form\.png\)',
     '''```diff
+ SCREENSHOT PLACEHOLDER: Add New Courier Order Form
! • Form with fields: Customer ID, Admin ID, Bill Number, Pickup Address, Delivery Address
! • Blue "Submit" button that calls AddCourierOrder() stored procedure
! • Expected: New courier created with status "Pending"
```'''),
    
    (r'!\[Create Success\]\(screenshots/crud_operations/02_create_success\.png\)',
     '''```diff
+ SCREENSHOT PLACEHOLDER: CREATE Success Response
! • Green success message: "Courier created successfully!"
! • Displays: Courier ID, Customer Details, Admin Details
! • Confirms stored procedure execution
```'''),
    
    (r'!\[View All Couriers\]\(screenshots/crud_operations/03_read_all_couriers\.png\)',
     '''```diff
+ SCREENSHOT PLACEHOLDER: View All Couriers (JOIN Query)
! • Table columns: Courier ID | Bill Number | Status | Customer Name | Admin Name
! • Data from 3-table JOIN: Couriers + Users + Admins
! • Shows multiple courier orders in table format
```'''),
    
    (r'!\[Get Status Function\]\(screenshots/crud_operations/04_get_status_function\.png\)',
     '''```diff
+ SCREENSHOT PLACEHOLDER: Get Status Using MySQL Function
! • Input field: "Enter Courier ID"
! • Button: "Get Status"
! • Result: Displays current status from GetCourierStatus() function
```'''),
    
    (r'!\[Single Courier Details\]\(screenshots/crud_operations/05_read_single_courier\.png\)',
     '''```diff
+ SCREENSHOT PLACEHOLDER: Single Courier Details View
! • Complete courier information display
! • Shows: Bill Number, Status, Pickup/Delivery Addresses
! • Customer and Admin contact information included
```'''),
    
    (r'!\[Update Status Form\]\(screenshots/crud_operations/06_update_form\.png\)',
     '''```diff
+ SCREENSHOT PLACEHOLDER: Update Courier Status Form
! • Courier ID input field
! • Status dropdown: Pending | In Transit | Delivered | Cancelled
! • Admin Email input • Calls UpdateCourierStatus() procedure
```'''),
    
    (r'!\[Update Success with Trigger\]\(screenshots/crud_operations/07_update_success_trigger\.png\)',
     '''```diff
+ SCREENSHOT PLACEHOLDER: UPDATE Success with Trigger Execution
! • Success message: "Status updated successfully!"
! • Note: "Trigger automatically logged this change to Courier_Audit"
! • Both Delivery_History and Courier_Audit tables populated
```'''),
    
    (r'!\[Audit Trail\]\(screenshots/crud_operations/08_audit_trail\.png\)',
     '''```diff
+ SCREENSHOT PLACEHOLDER: Audit Trail Verification
! • Two tables side-by-side:
!   - Delivery_History (manual logs via stored procedure)
!   - Courier_Audit (automatic logs via trigger)
! • Matching timestamps prove trigger execution
```'''),
    
    (r'!\[Delete Confirmation\]\(screenshots/crud_operations/09_delete_confirmation\.png\)',
     '''```diff
- SCREENSHOT PLACEHOLDER: Delete Courier Confirmation Dialog
! • Modal: "Are you sure you want to delete this courier?"
! • Warning: "This will CASCADE DELETE all related records"
! • Buttons: Cancel (gray) | Delete (red)
```'''),
    
    (r'!\[Delete Success\]\(screenshots/crud_operations/10_delete_success\.png\)',
     '''```diff
+ SCREENSHOT PLACEHOLDER: DELETE Success Response
! • Success message: "Courier deleted successfully!"
! • Confirmation: Related Delivery_History, Courier_Audit, Comments removed
! • CASCADE DELETE verification shown
```'''),
    
    (r'!\[Cascade Delete Verification\]\(screenshots/crud_operations/11_cascade_verification\.png\)',
     '''```diff
+ SCREENSHOT PLACEHOLDER: Cascade Delete Verification
! • Database query results showing:
!   - Delivery_History: 0 records for deleted courier_id
!   - Courier_Audit: 0 records for deleted courier_id
!   - Comments: 0 records for deleted courier_id
```'''),
    
    (r'!\[Application Homepage\]\(screenshots/frontend_features/12_homepage\.png\)',
     '''```diff
+ SCREENSHOT PLACEHOLDER: Application Homepage
! • Navigation: Add Courier | View Couriers | Update Status | Analytics
! • Modern UI with blue header and sidebar navigation
! • Main content area with dashboard widgets
```'''),
    
    (r'!\[Add Courier Form\]\(screenshots/frontend_features/13_add_courier_form\.png\)',
     '''```diff
+ SCREENSHOT PLACEHOLDER: Add Courier Form Interface
! • Customer dropdown (populated from Users table)
! • Admin dropdown (populated from Admins table)
! • Bill Number, Pickup Address, Delivery Address fields
! • Blue "Create Courier" button
```'''),
    
    (r'!\[Update Status Form\]\(screenshots/frontend_features/14_update_status_form\.png\)',
     '''```diff
+ SCREENSHOT PLACEHOLDER: Update Status Form Interface
! • Courier ID input
! • Status dropdown: Pending | In Transit | Delivered | Cancelled
! • Admin Email field
! • Update button triggers procedure AND trigger
```'''),
    
    (r'!\[Get Status Function\]\(screenshots/frontend_features/15_get_status_function\.png\)',
     '''```diff
+ SCREENSHOT PLACEHOLDER: Get Status Function Test
! • Input: Courier ID
! • Button: "Get Status"
! • Color-coded result: Green (Delivered), Blue (In Transit),
!   Yellow (Pending), Red (Cancelled)
```'''),
    
    (r'!\[Trigger Validation\]\(screenshots/frontend_features/16_trigger_validation\.png\)',
     '''```diff
+ SCREENSHOT PLACEHOLDER: Trigger Validation Display
! • Split screen layout:
!   LEFT: Delivery_History table
!   RIGHT: Courier_Audit table
! • Highlighted matching records with same timestamp
```'''),
    
    (r'!\[JOIN Query Results\]\(screenshots/frontend_features/17_join_query_results\.png\)',
     '''```diff
+ SCREENSHOT PLACEHOLDER: JOIN Query Results
! • Combined data from Couriers + Users + Admins
! • Columns: Courier ID, Bill Number, Status, Customer Name,
!   Customer Email, Admin Name, Admin Email
! • INNER JOIN and LEFT JOIN demonstration
```'''),
    
    (r'!\[NESTED Query Results\]\(screenshots/frontend_features/18_nested_query_results\.png\)',
     '''```diff
+ SCREENSHOT PLACEHOLDER: NESTED Query Results
! • List of customers with delivered orders
! • Subquery: WHERE user_id IN (SELECT customer_id FROM Couriers
!   WHERE status="Delivered")
! • Shows: User ID, Name, Email, Phone
```'''),
    
    (r'!\[AGGREGATE Query Results\]\(screenshots/frontend_features/19_aggregate_query_results\.png\)',
     '''```diff
+ SCREENSHOT PLACEHOLDER: AGGREGATE Query Statistics
! • Table: Status | Total Orders | Unique Customers |
!   Earliest Order | Latest Order
! • Functions: COUNT(*), COUNT(DISTINCT), MIN(), MAX()
! • GROUP BY status demonstration
```'''),
    
    (r'!\[Modal Dialog\]\(screenshots/frontend_features/20_modal_dialog\.png\)',
     '''```diff
+ SCREENSHOT PLACEHOLDER: Modal Dialog - Courier Details
! • Overlay modal with semi-transparent backdrop
! • Complete courier details and full audit trail timeline
! • Customer and Admin contact information
! • Close button (X) in top-right corner
```'''),
    
    (r'!\[Notifications\]\(screenshots/frontend_features/21_notifications\.png\)',
     '''```diff
+ SCREENSHOT PLACEHOLDER: Success/Error Toast Notifications
! • Green toast (top-right): "Success! Courier created"
! • Red toast: "Error: Bill number already exists"
! • Auto-dismiss after 3 seconds
```'''),
    
    (r'!\[Mobile View\]\(screenshots/frontend_features/22_mobile_view\.png\)',
     '''```diff
+ SCREENSHOT PLACEHOLDER: Responsive Mobile View
! • Mobile browser (375x667px)
! • Hamburger menu, stacked fields, touch-optimized buttons
! • Collapsible sections, responsive grid layout
```'''),
]

# Apply replacements
for pattern, replacement in replacements:
    content = re.sub(pattern, replacement, content)

# Write back
with open('PROJECT_REPORT.md', 'w') as f:
    f.write(content)

print("✅ Updated PROJECT_REPORT.md with 22 styled text placeholders!")
print("")
print("📋 Placeholders use diff syntax for colors:")
print("  + Green background (success operations)")
print("  ! Yellow/Orange background (info/warnings)")
print("  - Red background (delete operations)")
print("")
print("🔍 Verification:")
count = content.count('SCREENSHOT PLACEHOLDER')
print(f"  Found {count} placeholders in the report")
print("")
print("📄 Open PROJECT_REPORT.md to see the styled text!")
