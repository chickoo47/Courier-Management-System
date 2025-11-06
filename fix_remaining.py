#!/usr/bin/env python3
"""Fix the last 2 placeholders"""

import re

with open('PROJECT_REPORT.md', 'r') as f:
    content = f.read()

# Fix Screenshot 13 and 14
final_fixes = {
    r'\+ SCREENSHOT PLACEHOLDER: Get Status Function Test\n.*?```': '''+ SCREENSHOT PLACEHOLDER: Add Courier Form Interface (Procedure 1)
! • Customer dropdown (populated from Users table)
! • Admin dropdown (populated from Admins table)
! • Bill Number, Pickup Address, Delivery Address fields
! • Blue "Create Courier" button - calls AddCourierOrder() stored procedure
```''',

    r'\+ SCREENSHOT PLACEHOLDER: Trigger Validation Display\n.*?```': '''+ SCREENSHOT PLACEHOLDER: Update Status Form (Procedure 2)
! • Courier ID input field
! • Status dropdown: Pending | In Transit | Delivered | Cancelled
! • Admin Email field
! • Update button triggers UpdateCourierStatus() procedure AND after_courier_status_update trigger
```''',
}

for pattern, replacement in final_fixes.items():
    content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open('PROJECT_REPORT.md', 'w') as f:
    f.write(content)

print("✅ Fixed remaining placeholders!")
