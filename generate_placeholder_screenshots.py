#!/usr/bin/env python3
"""
Generate placeholder screenshot images with text descriptions
"""

from PIL import Image, ImageDraw, ImageFont
import os

# Create directories
os.makedirs('screenshots/crud_operations', exist_ok=True)
os.makedirs('screenshots/frontend_features', exist_ok=True)

def create_placeholder(filename, title, description, bg_color, text_color):
    """Create a placeholder image with text"""
    # Image dimensions
    width, height = 1200, 700
    
    # Create image
    img = Image.new('RGB', (width, height), bg_color)
    draw = ImageDraw.Draw(img)
    
    # Try to use a nice font, fallback to default
    try:
        title_font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 48)
        desc_font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 24)
        label_font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 18)
    except:
        title_font = ImageFont.load_default()
        desc_font = ImageFont.load_default()
        label_font = ImageFont.load_default()
    
    # Draw title
    title_bbox = draw.textbbox((0, 0), title, font=title_font)
    title_width = title_bbox[2] - title_bbox[0]
    title_x = (width - title_width) // 2
    draw.text((title_x, 100), title, fill=text_color, font=title_font)
    
    # Draw description (word wrap)
    words = description.split()
    lines = []
    current_line = []
    
    for word in words:
        current_line.append(word)
        line_text = ' '.join(current_line)
        bbox = draw.textbbox((0, 0), line_text, font=desc_font)
        if bbox[2] - bbox[0] > width - 200:
            current_line.pop()
            lines.append(' '.join(current_line))
            current_line = [word]
    
    if current_line:
        lines.append(' '.join(current_line))
    
    y = 250
    for line in lines:
        bbox = draw.textbbox((0, 0), line, font=desc_font)
        line_width = bbox[2] - bbox[0]
        x = (width - line_width) // 2
        draw.text((x, y), line, fill=text_color, font=desc_font)
        y += 40
    
    # Draw "Placeholder Screenshot" label at bottom
    label = "[ Placeholder Screenshot - Replace with Actual Screenshot ]"
    label_bbox = draw.textbbox((0, 0), label, font=label_font)
    label_width = label_bbox[2] - label_bbox[0]
    label_x = (width - label_width) // 2
    draw.text((label_x, height - 60), label, fill='#888888', font=label_font)
    
    # Save image
    img.save(filename)
    print(f"✓ Created {filename}")

# CRUD Operations Screenshots
screenshots_crud = [
    ("screenshots/crud_operations/01_create_form.png", 
     "Add New Courier Order Form",
     "Form with fields: Customer ID, Admin ID, Bill Number, Pickup Address, Delivery Address. Submit button to call AddCourierOrder stored procedure.",
     "#E3F2FD", "#1565C0"),  # Light blue background, dark blue text
    
    ("screenshots/crud_operations/02_create_success.png",
     "CREATE Success Response",
     "Success message: 'Courier created successfully!' Displays new courier ID, customer name, admin name, and order details from stored procedure.",
     "#E8F5E9", "#2E7D32"),  # Light green background, dark green text
    
    ("screenshots/crud_operations/03_read_all_couriers.png",
     "View All Couriers - JOIN Query",
     "Table displaying: Courier ID | Bill Number | Status | Customer Name | Customer Email | Admin Name | Admin Email. Data from 3-table JOIN query.",
     "#F3E5F5", "#6A1B9A"),  # Light purple background, dark purple text
    
    ("screenshots/crud_operations/04_get_status_function.png",
     "Get Status Using MySQL Function",
     "Input field for Courier ID. Button: 'Get Status'. Result displays current status returned by GetCourierStatus() MySQL function.",
     "#FFF3E0", "#E65100"),  # Light orange background, dark orange text
    
    ("screenshots/crud_operations/05_read_single_courier.png",
     "Single Courier Details View",
     "Complete courier information: Bill Number, Status, Pickup Address, Delivery Address, Customer Details, Admin Details, Timestamps.",
     "#E0F2F1", "#00695C"),  # Light teal background, dark teal text
    
    ("screenshots/crud_operations/06_update_form.png",
     "Update Courier Status Form",
     "Fields: Courier ID input, Status dropdown (Pending/In Transit/Delivered/Cancelled), Admin Email. Update button calls UpdateCourierStatus procedure.",
     "#FFF9C4", "#F57F17"),  # Light yellow background, dark yellow text
    
    ("screenshots/crud_operations/07_update_success_trigger.png",
     "UPDATE Success with Trigger",
     "Success message: 'Status updated successfully!' Note: 'Trigger automatically logged this change to Courier_Audit table' shown below.",
     "#E8F5E9", "#2E7D32"),  # Light green background, dark green text
    
    ("screenshots/crud_operations/08_audit_trail.png",
     "Audit Trail Verification",
     "Two tables side-by-side: Delivery_History (manual logs) and Courier_Audit (trigger logs). Matching timestamps highlight trigger execution.",
     "#FCE4EC", "#C2185B"),  # Light pink background, dark pink text
    
    ("screenshots/crud_operations/09_delete_confirmation.png",
     "Delete Courier Confirmation",
     "Modal dialog: 'Are you sure you want to delete this courier?' Warning: 'This will cascade delete all related records.' Cancel and Delete buttons.",
     "#FFEBEE", "#C62828"),  # Light red background, dark red text
    
    ("screenshots/crud_operations/10_delete_success.png",
     "DELETE Success Response",
     "Success message: 'Courier deleted successfully!' Confirmation: 'Related Delivery History, Audit logs, and Comments have been removed (CASCADE DELETE)'",
     "#E8F5E9", "#2E7D32"),  # Light green background, dark green text
    
    ("screenshots/crud_operations/11_cascade_verification.png",
     "Cascade Delete Verification",
     "Database query results showing: Delivery_History: 0 records, Courier_Audit: 0 records, Comments: 0 records for deleted courier_id.",
     "#F5F5F5", "#424242"),  # Light gray background, dark gray text
]

# Frontend Features Screenshots
screenshots_frontend = [
    ("screenshots/frontend_features/12_homepage.png",
     "Application Homepage",
     "Navigation menu: Add Courier | View Couriers | Update Status | Analytics. Modern UI with blue header, sidebar navigation, main content area.",
     "#E3F2FD", "#1565C0"),  # Light blue background, dark blue text
    
    ("screenshots/frontend_features/13_add_courier_form.png",
     "Add Courier Form Interface",
     "Professional form layout: Customer dropdown, Admin dropdown, Bill Number input, Pickup Address textarea, Delivery Address textarea. Blue submit button.",
     "#E8F5E9", "#2E7D32"),  # Light green background, dark green text
    
    ("screenshots/frontend_features/14_update_status_form.png",
     "Update Status Form Interface",
     "Courier ID input, Status dropdown with 4 options, Admin Email input field. Update button triggers stored procedure and after_courier_status_update trigger.",
     "#FFF3E0", "#E65100"),  # Light orange background, dark orange text
    
    ("screenshots/frontend_features/15_get_status_function.png",
     "Get Status Function Test",
     "Input: Courier ID. Button: 'Get Status'. Result display with color coding: Green (Delivered), Blue (In Transit), Yellow (Pending), Red (Cancelled).",
     "#F3E5F5", "#6A1B9A"),  # Light purple background, dark purple text
    
    ("screenshots/frontend_features/16_trigger_validation.png",
     "Trigger Validation Display",
     "Split screen: Left shows Delivery_History table, Right shows Courier_Audit table. Highlighted rows show matching courier_id with same timestamp proving trigger fired.",
     "#FCE4EC", "#C2185B"),  # Light pink background, dark pink text
    
    ("screenshots/frontend_features/17_join_query_results.png",
     "JOIN Query Results Display",
     "Table with combined data from Couriers + Users + Admins. Columns show complete order info with customer and admin details in single view.",
     "#E0F2F1", "#00695C"),  # Light teal background, dark teal text
    
    ("screenshots/frontend_features/18_nested_query_results.png",
     "NESTED Query Results",
     "List of customers who have delivered orders. User ID | Name | Email | Phone. Subquery: WHERE user_id IN (SELECT customer_id FROM Couriers WHERE status='Delivered')",
     "#FFF9C4", "#F57F17"),  # Light yellow background, dark yellow text
    
    ("screenshots/frontend_features/19_aggregate_query_results.png",
     "AGGREGATE Query Statistics",
     "Table: Status | Total Orders | Unique Customers | Earliest Order | Latest Order. GROUP BY status with COUNT, COUNT DISTINCT, MIN, MAX functions.",
     "#E3F2FD", "#1565C0"),  # Light blue background, dark blue text
    
    ("screenshots/frontend_features/20_modal_dialog.png",
     "Modal Dialog - Courier Details",
     "Overlay modal showing: Complete courier details, Full audit trail timeline, Customer contact info, Admin contact info. Semi-transparent backdrop.",
     "#F5F5F5", "#424242"),  # Light gray background, dark gray text
    
    ("screenshots/frontend_features/21_notifications.png",
     "Success/Error Notifications",
     "Toast notifications: Green toast (top-right): 'Success! Courier created', Red toast: 'Error: Bill number already exists'. Auto-dismiss after 3 seconds.",
     "#E8F5E9", "#2E7D32"),  # Light green background, dark green text
    
    ("screenshots/frontend_features/22_mobile_view.png",
     "Responsive Mobile View",
     "Mobile browser view (375x667px): Hamburger menu, Stacked form fields, Touch-optimized buttons, Collapsible sections. Responsive grid layout.",
     "#F3E5F5", "#6A1B9A"),  # Light purple background, dark purple text
]

# Generate all screenshots
print("\n🎨 Generating CRUD Operations Screenshots...")
for screenshot in screenshots_crud:
    create_placeholder(*screenshot)

print("\n🎨 Generating Frontend Features Screenshots...")
for screenshot in screenshots_frontend:
    create_placeholder(*screenshot)

print("\n✅ All 22 placeholder screenshots generated!")
print("\n📁 Location: screenshots/crud_operations/ and screenshots/frontend_features/")
print("\n🔧 Next step: Run ./add_screenshots.sh to update your report")
