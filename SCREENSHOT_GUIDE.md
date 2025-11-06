# Screenshot Guide for CRUD Operations

## 📸 Screenshots Needed

You need to take **22 screenshots total** and save them in the `screenshots/` folder.

---

## 🗂️ Folder Structure

```
screenshots/
├── crud_operations/
│   ├── 01_create_form.png
│   ├── 02_create_success.png
│   ├── 03_read_all_couriers.png
│   ├── 04_get_status_function.png
│   ├── 05_read_single_courier.png
│   ├── 06_update_form.png
│   ├── 07_update_success_trigger.png
│   ├── 08_audit_trail.png
│   ├── 09_delete_confirmation.png
│   ├── 10_delete_success.png
│   └── 11_cascade_verification.png
└── frontend_features/
    ├── 12_homepage.png
    ├── 13_add_courier_form.png
    ├── 14_update_status_form.png
    ├── 15_get_status_function.png
    ├── 16_trigger_validation.png
    ├── 17_join_query_results.png
    ├── 18_nested_query_results.png
    ├── 19_aggregate_query_results.png
    ├── 20_modal_dialog.png
    ├── 21_notifications.png
    └── 22_mobile_view.png
```

---

## 📋 CRUD Operations Screenshots (Section 8)

### CREATE Operations

#### **Screenshot 1: `01_create_form.png`**
**What to capture:**
1. Start your React frontend (`npm start` in client folder)
2. Navigate to "Add Courier" form
3. Fill in the form with:
   - Customer ID: 1
   - Admin ID: 1
   - Bill Number: BILL001
   - Pickup Address: 123 Main St
   - Delivery Address: 456 Oak Ave
4. **Take screenshot BEFORE clicking submit**

#### **Screenshot 2: `02_create_success.png`**
**What to capture:**
1. Click the "Create Courier" button
2. Capture the success message and response
3. Should show: "Courier created successfully" + courier details

---

### READ Operations

#### **Screenshot 3: `03_read_all_couriers.png`**
**What to capture:**
1. Navigate to "View All Couriers" page
2. Should display table with columns:
   - Courier ID, Bill Number, Status, Customer Name, Admin Name
3. Capture the full table with multiple courier records

#### **Screenshot 4: `04_get_status_function.png`**
**What to capture:**
1. Go to "Get Status" section
2. Enter a Courier ID (e.g., 1)
3. Click "Get Status" button
4. Capture the form + result showing status (uses MySQL function)

#### **Screenshot 5: `05_read_single_courier.png`**
**What to capture:**
1. Click on a specific courier from the list
2. Capture the detailed view showing:
   - All courier information
   - Customer details
   - Admin details
   - Addresses

---

### UPDATE Operations

#### **Screenshot 6: `06_update_form.png`**
**What to capture:**
1. Go to "Update Status" form
2. Fill in:
   - Courier ID: 1
   - New Status: In Transit
   - Admin Email: admin@example.com
3. **Capture BEFORE clicking update**

#### **Screenshot 7: `07_update_success_trigger.png`**
**What to capture:**
1. Click "Update Status"
2. Capture success message
3. Should mention: "Trigger automatically logged this change"

#### **Screenshot 8: `08_audit_trail.png`**
**What to capture:**
1. Navigate to audit logs view
2. Show both:
   - Delivery_History records
   - Courier_Audit records (created by trigger)
3. Highlight records with same timestamp

---

### DELETE Operations

#### **Screenshot 9: `09_delete_confirmation.png`**
**What to capture:**
1. Click delete button on a courier
2. Capture the confirmation dialog
3. Should warn about cascade delete

#### **Screenshot 10: `10_delete_success.png`**
**What to capture:**
1. Confirm the delete
2. Capture success message
3. Should show: "Courier deleted successfully"

#### **Screenshot 11: `11_cascade_verification.png`**
**What to capture:**
1. Check the database or show empty related records
2. Verify Delivery_History, Courier_Audit, Comments are all deleted
3. Can use MySQL Workbench or frontend query results

---

## 🎨 Frontend Features Screenshots (Section 9)

#### **Screenshot 12: `12_homepage.png`**
- Main application page
- Show navigation menu
- All sections visible

#### **Screenshot 13: `13_add_courier_form.png`**
- Full "Add Courier" form interface
- All fields visible
- Professional layout

#### **Screenshot 14: `14_update_status_form.png`**
- Status update form
- Dropdown showing all status options
- Admin email field

#### **Screenshot 15: `15_get_status_function.png`**
- MySQL function test interface
- Input field + result display
- Color-coded status

#### **Screenshot 16: `16_trigger_validation.png`**
- Side-by-side view of:
  - Delivery_History table
  - Courier_Audit table
- Show matching records proving trigger fired

#### **Screenshot 17: `17_join_query_results.png`**
- Results from 3-table JOIN
- Display courier + user + admin info together

#### **Screenshot 18: `18_nested_query_results.png`**
- Results showing customers with delivered orders
- Subquery results

#### **Screenshot 19: `19_aggregate_query_results.png`**
- Statistics grouped by status
- COUNT, MIN, MAX values shown

#### **Screenshot 20: `20_modal_dialog.png`**
- Modal showing detailed courier info
- Overlay effect visible

#### **Screenshot 21: `21_notifications.png`**
- Toast notifications (success/error)
- Green for success, red for error

#### **Screenshot 22: `22_mobile_view.png`**
- Open app in mobile browser or use responsive mode
- Chrome DevTools → Toggle device toolbar (Cmd+Shift+M)

---

## 🚀 How to Take Screenshots

### On macOS:
- **Full screen**: `Cmd + Shift + 3`
- **Selection**: `Cmd + Shift + 4`
- **Window**: `Cmd + Shift + 4`, then press `Space`, click window

### After Taking Screenshots:
1. Save with exact names above
2. Place in correct folder (`crud_operations/` or `frontend_features/`)
3. Keep format as PNG for best quality

---

## ✅ Checklist

Use this to track your progress:

**CRUD Operations (11 screenshots):**
- [ ] 01_create_form.png
- [ ] 02_create_success.png
- [ ] 03_read_all_couriers.png
- [ ] 04_get_status_function.png
- [ ] 05_read_single_courier.png
- [ ] 06_update_form.png
- [ ] 07_update_success_trigger.png
- [ ] 08_audit_trail.png
- [ ] 09_delete_confirmation.png
- [ ] 10_delete_success.png
- [ ] 11_cascade_verification.png

**Frontend Features (11 screenshots):**
- [ ] 12_homepage.png
- [ ] 13_add_courier_form.png
- [ ] 14_update_status_form.png
- [ ] 15_get_status_function.png
- [ ] 16_trigger_validation.png
- [ ] 17_join_query_results.png
- [ ] 18_nested_query_results.png
- [ ] 19_aggregate_query_results.png
- [ ] 20_modal_dialog.png
- [ ] 21_notifications.png
- [ ] 22_mobile_view.png

---

## 📝 After Taking Screenshots

Run this command to add them to your report:

```bash
cd ~/Desktop/"DB lab project"/courier-management-system
# I'll provide a script to update the report automatically
```
