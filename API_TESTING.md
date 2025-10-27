# API Testing Guide - Postman/cURL Examples

This file contains example API requests for testing the Courier Management System backend directly.

## Base URL
```
http://localhost:5000/api
```

---

## 🔧 1. Add Courier (Stored Procedure - CREATE)

### Endpoint
```
POST /api/couriers/add
```

### cURL Example
```bash
curl -X POST http://localhost:5000/api/couriers/add \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": 1,
    "admin_id": 1,
    "bill_number": "BILL-3001",
    "pickup_address": "100 Test St, New York, NY",
    "delivery_address": "200 Demo Ave, Los Angeles, CA"
  }'
```

### Expected Response
```json
{
  "success": true,
  "message": "Courier order added successfully using stored procedure",
  "data": {
    "courier_id": 9,
    "customer_id": 1,
    "managed_by_admin_id": 1,
    "bill_number": "BILL-3001",
    "status": "Pending",
    ...
  }
}
```

---

## 🔄 2. Update Courier Status (Stored Procedure - UPDATE)

### Endpoint
```
PUT /api/couriers/update-status/:id
```

### cURL Example
```bash
curl -X PUT http://localhost:5000/api/couriers/update-status/1 \
  -H "Content-Type: application/json" \
  -d '{
    "new_status": "In Transit",
    "changed_by_admin_email": "alice.admin@courier.com"
  }'
```

### Expected Response
```json
{
  "success": true,
  "message": "Courier status updated successfully using stored procedure (Trigger fired automatically)",
  "courier_id": "1",
  "new_status": "In Transit"
}
```

---

## 🔍 3. Get Courier Status (Function - READ)

### Endpoint
```
GET /api/couriers/status/:id
```

### cURL Example
```bash
curl http://localhost:5000/api/couriers/status/1
```

### Expected Response
```json
{
  "success": true,
  "message": "Status retrieved using database function",
  "courier_id": "1",
  "status": "In Transit"
}
```

---

## 📋 4. Get Courier Logs (Trigger Validation)

### Endpoint
```
GET /api/couriers/:id/logs
```

### cURL Example
```bash
curl http://localhost:5000/api/couriers/1/logs
```

### Expected Response
```json
{
  "success": true,
  "message": "Logs retrieved successfully (Proof of Trigger execution)",
  "courier_id": "1",
  "delivery_history": [
    {
      "history_id": 1,
      "courier_id": 1,
      "old_status": "Pending",
      "new_status": "In Transit",
      "changed_at": "2025-10-27T10:30:00.000Z",
      "changed_by_admin_email": "alice.admin@courier.com"
    }
  ],
  "audit_logs": [
    {
      "audit_id": 1,
      "courier_id": 1,
      "action_type": "STATUS_UPDATE",
      "old_status": "Pending",
      "new_status": "In Transit",
      "changed_at": "2025-10-27T10:30:00.000Z",
      "admin_email": "system@courier.com"
    }
  ]
}
```

---

## 📊 5. Complex Queries

### JOIN Query
```bash
curl http://localhost:5000/api/reports/join
```

### NESTED Query
```bash
curl http://localhost:5000/api/reports/nested
```

### AGGREGATE Query
```bash
curl http://localhost:5000/api/reports/aggregate
```

---

## 📝 Helper Endpoints

### Get All Couriers
```bash
curl http://localhost:5000/api/couriers
```

### Get All Users
```bash
curl http://localhost:5000/api/couriers/data/users
```

### Get All Admins
```bash
curl http://localhost:5000/api/couriers/data/admins
```

---

## 🧪 Testing Sequence

### Complete Test Flow:

1. **Add a new courier** (Tests Procedure 1)
```bash
curl -X POST http://localhost:5000/api/couriers/add \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": 1,
    "admin_id": 1,
    "bill_number": "BILL-TEST-001",
    "pickup_address": "Test Pickup",
    "delivery_address": "Test Delivery"
  }'
```

2. **Get the courier ID from response**, then update status (Tests Procedure 2 + Trigger)
```bash
curl -X PUT http://localhost:5000/api/couriers/update-status/9 \
  -H "Content-Type: application/json" \
  -d '{
    "new_status": "Delivered",
    "changed_by_admin_email": "bob.admin@courier.com"
  }'
```

3. **Verify trigger fired** by checking logs
```bash
curl http://localhost:5000/api/couriers/9/logs
```

4. **Test the function**
```bash
curl http://localhost:5000/api/couriers/status/9
```

5. **Check complex queries**
```bash
curl http://localhost:5000/api/reports/join
curl http://localhost:5000/api/reports/nested
curl http://localhost:5000/api/reports/aggregate
```

---

## Postman Collection

You can import these endpoints into Postman:

1. Create a new collection: "Courier Management System"
2. Add requests for each endpoint above
3. Set base URL as environment variable: `{{baseUrl}}` = `http://localhost:5000/api`
4. Save and test!

---

## Expected SQL Execution

When you call these endpoints, verify in MySQL logs that the correct SQL is executed:

- `POST /add` → `CALL AddCourierOrder(?, ?, ?, ?, ?)`
- `PUT /update-status/:id` → `CALL UpdateCourierStatus(?, ?, ?)`
- `GET /status/:id` → `SELECT GetCourierStatus(?) AS status`
- `GET /:id/logs` → `SELECT * FROM Delivery_History/Courier_Audit WHERE courier_id = ?`

You can enable MySQL query logging to verify:
```sql
SET GLOBAL general_log = 'ON';
SHOW VARIABLES LIKE 'general_log%';
```
