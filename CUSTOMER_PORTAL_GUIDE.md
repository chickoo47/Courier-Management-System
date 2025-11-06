# Customer Portal Guide 👤

## Overview
The Customer Portal allows end-users to track their courier shipments without needing admin access. Customers can view order status, tracking history, and leave comments/feedback.

## Features

### 1. **Order Tracking** 📦
- Track orders using:
  - Customer Name (e.g., "John Doe")
  - Bill Number (e.g., "BILL-1001")
- View real-time courier status
- See estimated delivery date

### 2. **Order Details** 📋
Customers can see:
- Current status with color-coded badges
- Package weight
- Source and destination locations
- Total cost
- Order date
- Expected delivery date

### 3. **Tracking History** 📍
- Visual timeline of package journey
- All status updates with timestamps
- Location information for each update
- Easy-to-follow progress tracking

### 4. **Comments & Feedback** 💬
- Leave comments about the service
- Ask questions about delivery
- View auto-generated thank you messages (from trigger)
- All comments timestamped

## How to Access

### Admin View → Customer View
1. Open the application at `http://localhost:3000`
2. Click **"👤 Switch to Customer View"** button at the top
3. You're now in the customer portal!

### Customer View → Admin View
1. Click **"🔐 Switch to Admin View"** button at the top
2. You're back in the admin panel

## How to Use (Customer Side)

### Step 1: Enter Your Details
```
Name: John Doe
Bill Number: BILL-1001
```

### Step 2: Click "Track Order"
The system will search for your order

### Step 3: View Your Order
You'll see:
- ✅ Current status badge
- 📦 Package details
- 📍 Tracking timeline
- 💬 Comments section

### Step 4: Leave Comments (Optional)
- Type your message in the comment box
- Click "Send Comment"
- Your feedback is saved!

## Testing the Portal

### Test with Existing Data
Use these sample orders to test:

**Order 1:**
- Name: `John Doe`
- Bill Number: `BILL-1001`

**Order 2:**
- Name: `Jane Smith`
- Bill Number: `BILL-1002`

### Test the Trigger Feature
1. Track an order with status "In Transit"
2. Ask admin to update status to "Delivered"
3. Refresh and check comments
4. You'll see an auto-generated thank you message! ✨

## API Endpoints Used

### Track Order
```
GET /api/couriers/track?billNumber=BILL-1001&name=John Doe
```

### Get Delivery History
```
GET /api/couriers/:id/history
```

### Get Comments
```
GET /api/couriers/:id/comments
```

### Add Comment
```
POST /api/couriers/comment
Body: { courier_id, user_id, comment_text }
```

## Design Features

### Visual Elements
- 🎨 Modern gradient background (purple theme)
- 📱 Fully responsive design
- 🎯 Color-coded status badges:
  - 🟠 Orange: Pending
  - 🔵 Blue: In Transit
  - 🟣 Purple: Out for Delivery
  - 🟢 Green: Delivered
  - 🔴 Red: Cancelled

### User Experience
- Clean, intuitive interface
- Real-time data updates
- Clear error messages
- Loading states for better feedback
- Timeline visualization for tracking

## Presentation Tips

### What to Demonstrate:
1. **Toggle Feature**: Show how easy it is to switch between admin and customer views
2. **Order Tracking**: Enter a bill number and show instant results
3. **Status Colors**: Point out the color-coded status system
4. **Timeline View**: Highlight the visual tracking history
5. **Trigger Demo**: Show the automatic thank you comment when status changes to "Delivered"
6. **Comments Feature**: Add a comment to show two-way communication

### Key Talking Points:
- ✅ Separation of concerns (Admin vs Customer interface)
- ✅ Real-time tracking capability
- ✅ Automated customer engagement (trigger-generated comments)
- ✅ User-friendly design
- ✅ Mobile-responsive layout
- ✅ RESTful API integration

## Technical Implementation

### Frontend
- **Component**: `CustomerPortal.js`
- **Styling**: `CustomerPortal.css`
- **State Management**: React Hooks (useState)
- **API Calls**: Fetch API

### Backend
- **Routes**: Added to `server/routes/couriers.js`
- **Endpoints**: Track, Comments, History
- **Database**: Joins Users and Couriers tables

### Database Integration
- Uses existing tables (Users, Couriers, Comments, Delivery_History)
- Leverages the `after_courier_delivered` trigger
- No schema changes required!

## Future Enhancements (Optional Ideas)
- SMS/Email notifications
- Real-time updates using WebSockets
- Customer registration/login
- Order rating system
- Package photos
- Delivery signature capture

---

**Built for:** Database Lab Project  
**Features:** Full CRUD operations, Stored Procedures, Functions, Triggers  
**Tech Stack:** React + Node.js + Express + MySQL
