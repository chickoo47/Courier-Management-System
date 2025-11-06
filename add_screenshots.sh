#!/bin/bash

# Script to add screenshot references to PROJECT_REPORT.md
# Run this after you've taken all screenshots

echo "🔄 Updating PROJECT_REPORT.md with screenshot references..."

# Backup the original file
cp PROJECT_REPORT.md PROJECT_REPORT_BACKUP.md
echo "✅ Backup created: PROJECT_REPORT_BACKUP.md"

# Replace placeholders with actual screenshot references
sed -i.bak '
# Screenshot 1
/### Screenshot 1: Add New Courier Order/,/\*\*\[SPACE FOR SCREENSHOT\]\*\*/ {
    s|\*\*\[SPACE FOR SCREENSHOT\]\*\*|![Add New Courier Form](screenshots/crud_operations/01_create_form.png)|
}

# Screenshot 2
/### Screenshot 2: CREATE Success Response/,/\*\*\[SPACE FOR SCREENSHOT\]\*\*/ {
    s|\*\*\[SPACE FOR SCREENSHOT\]\*\*|![Create Success](screenshots/crud_operations/02_create_success.png)|
}

# Screenshot 3
/### Screenshot 3: View All Couriers/,/\*\*\[SPACE FOR SCREENSHOT\]\*\*/ {
    s|\*\*\[SPACE FOR SCREENSHOT\]\*\*|![View All Couriers](screenshots/crud_operations/03_read_all_couriers.png)|
}

# Screenshot 4
/### Screenshot 4: Get Status Using Function/,/\*\*\[SPACE FOR SCREENSHOT\]\*\*/ {
    s|\*\*\[SPACE FOR SCREENSHOT\]\*\*|![Get Status Function](screenshots/crud_operations/04_get_status_function.png)|
}

# Screenshot 5
/### Screenshot 5: View Single Courier Details/,/\*\*\[SPACE FOR SCREENSHOT\]\*\*/ {
    s|\*\*\[SPACE FOR SCREENSHOT\]\*\*|![Single Courier Details](screenshots/crud_operations/05_read_single_courier.png)|
}

# Screenshot 6
/### Screenshot 6: Update Courier Status Form/,/\*\*\[SPACE FOR SCREENSHOT\]\*\*/ {
    s|\*\*\[SPACE FOR SCREENSHOT\]\*\*|![Update Status Form](screenshots/crud_operations/06_update_form.png)|
}

# Screenshot 7
/### Screenshot 7: UPDATE Success with Trigger Execution/,/\*\*\[SPACE FOR SCREENSHOT\]\*\*/ {
    s|\*\*\[SPACE FOR SCREENSHOT\]\*\*|![Update Success with Trigger](screenshots/crud_operations/07_update_success_trigger.png)|
}

# Screenshot 8
/### Screenshot 8: Audit Trail Verification/,/\*\*\[SPACE FOR SCREENSHOT\]\*\*/ {
    s|\*\*\[SPACE FOR SCREENSHOT\]\*\*|![Audit Trail](screenshots/crud_operations/08_audit_trail.png)|
}

# Screenshot 9
/### Screenshot 9: Delete Courier Confirmation/,/\*\*\[SPACE FOR SCREENSHOT\]\*\*/ {
    s|\*\*\[SPACE FOR SCREENSHOT\]\*\*|![Delete Confirmation](screenshots/crud_operations/09_delete_confirmation.png)|
}

# Screenshot 10
/### Screenshot 10: DELETE Success Response/,/\*\*\[SPACE FOR SCREENSHOT\]\*\*/ {
    s|\*\*\[SPACE FOR SCREENSHOT\]\*\*|![Delete Success](screenshots/crud_operations/10_delete_success.png)|
}

# Screenshot 11
/### Screenshot 11: Cascade Delete Verification/,/\*\*\[SPACE FOR SCREENSHOT\]\*\*/ {
    s|\*\*\[SPACE FOR SCREENSHOT\]\*\*|![Cascade Delete Verification](screenshots/crud_operations/11_cascade_verification.png)|
}

# Screenshot 12
/### Screenshot 12: Application Homepage/,/\*\*\[SPACE FOR SCREENSHOT\]\*\*/ {
    s|\*\*\[SPACE FOR SCREENSHOT\]\*\*|![Application Homepage](screenshots/frontend_features/12_homepage.png)|
}

# Screenshot 13
/### Screenshot 13: Add Courier Form \(Procedure 1\)/,/\*\*\[SPACE FOR SCREENSHOT\]\*\*/ {
    s|\*\*\[SPACE FOR SCREENSHOT\]\*\*|![Add Courier Form](screenshots/frontend_features/13_add_courier_form.png)|
}

# Screenshot 14
/### Screenshot 14: Update Status Form \(Procedure 2\)/,/\*\*\[SPACE FOR SCREENSHOT\]\*\*/ {
    s|\*\*\[SPACE FOR SCREENSHOT\]\*\*|![Update Status Form](screenshots/frontend_features/14_update_status_form.png)|
}

# Screenshot 15
/### Screenshot 15: Get Status Using Function/,/\*\*\[SPACE FOR SCREENSHOT\]\*\*/ {
    s|\*\*\[SPACE FOR SCREENSHOT\]\*\*|![Get Status Function](screenshots/frontend_features/15_get_status_function.png)|
}

# Screenshot 16
/### Screenshot 16: Trigger Validation Display/,/\*\*\[SPACE FOR SCREENSHOT\]\*\*/ {
    s|\*\*\[SPACE FOR SCREENSHOT\]\*\*|![Trigger Validation](screenshots/frontend_features/16_trigger_validation.png)|
}

# Screenshot 17
/### Screenshot 17: JOIN Query Results/,/\*\*\[SPACE FOR SCREENSHOT\]\*\*/ {
    s|\*\*\[SPACE FOR SCREENSHOT\]\*\*|![JOIN Query Results](screenshots/frontend_features/17_join_query_results.png)|
}

# Screenshot 18
/### Screenshot 18: NESTED Query Results/,/\*\*\[SPACE FOR SCREENSHOT\]\*\*/ {
    s|\*\*\[SPACE FOR SCREENSHOT\]\*\*|![NESTED Query Results](screenshots/frontend_features/18_nested_query_results.png)|
}

# Screenshot 19
/### Screenshot 19: AGGREGATE Query Results/,/\*\*\[SPACE FOR SCREENSHOT\]\*\*/ {
    s|\*\*\[SPACE FOR SCREENSHOT\]\*\*|![AGGREGATE Query Results](screenshots/frontend_features/19_aggregate_query_results.png)|
}

# Screenshot 20
/### Screenshot 20: Modal Dialog/,/\*\*\[SPACE FOR SCREENSHOT\]\*\*/ {
    s|\*\*\[SPACE FOR SCREENSHOT\]\*\*|![Modal Dialog](screenshots/frontend_features/20_modal_dialog.png)|
}

# Screenshot 21
/### Screenshot 21: Success\/Error Notifications/,/\*\*\[SPACE FOR SCREENSHOT\]\*\*/ {
    s|\*\*\[SPACE FOR SCREENSHOT\]\*\*|![Notifications](screenshots/frontend_features/21_notifications.png)|
}

# Screenshot 22
/### Screenshot 22: Responsive Mobile View/,/\*\*\[SPACE FOR SCREENSHOT\]\*\*/ {
    s|\*\*\[SPACE FOR SCREENSHOT\]\*\*|![Mobile View](screenshots/frontend_features/22_mobile_view.png)|
}
' PROJECT_REPORT.md

# Remove backup file
rm PROJECT_REPORT.md.bak

echo "✅ Screenshots added to PROJECT_REPORT.md!"
echo ""
echo "📊 Summary:"
echo "  - 11 CRUD operation screenshots"
echo "  - 11 Frontend feature screenshots"
echo ""
echo "🔍 Verify the changes:"
echo "  grep '!\[' PROJECT_REPORT.md | wc -l"
echo ""
echo "📝 Next steps:"
echo "  1. Take all 22 screenshots (see SCREENSHOT_GUIDE.md)"
echo "  2. Save them in screenshots/ folder with exact names"
echo "  3. View your report to confirm images display correctly"
