const express = require('express');
const router = express.Router();
const { pool } = require('../database');

// ============================================================
// PROCEDURE 1 (CREATE): Add Courier Order
// POST /api/couriers/add
// MUST execute: CALL AddCourierOrder(?, ?, ?, ?, ?)
// ============================================================
router.post('/add', async (req, res) => {
  try {
    const { customer_id, admin_id, bill_number, pickup_address, delivery_address } = req.body;

    // Validate required fields
    if (!customer_id || !admin_id || !bill_number || !pickup_address || !delivery_address) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    // Execute stored procedure to add courier order
    const [result] = await pool.query(
      'CALL AddCourierOrder(?, ?, ?, ?, ?)',
      [customer_id, admin_id, bill_number, pickup_address, delivery_address]
    );

    res.status(201).json({
      success: true,
      message: 'Courier order added successfully using stored procedure',
      data: result[0]
    });
  } catch (error) {
    console.error('Error adding courier:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add courier order',
      error: error.message
    });
  }
});

// ============================================================
// PROCEDURE 2 (UPDATE): Update Courier Status
// PUT /api/couriers/update-status/:id
// MUST execute: CALL UpdateCourierStatus(?, ?, ?)
// ============================================================
router.put('/update-status/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { new_status, changed_by_admin_email } = req.body;

    // Validate required fields
    if (!new_status || !changed_by_admin_email) {
      return res.status(400).json({
        success: false,
        message: 'Status and admin email are required'
      });
    }

    // Execute stored procedure to update courier status
    // This will automatically trigger the 'after_courier_status_update' trigger
    await pool.query(
      'CALL UpdateCourierStatus(?, ?, ?)',
      [id, new_status, changed_by_admin_email]
    );

    res.json({
      success: true,
      message: 'Courier status updated successfully using stored procedure (Trigger fired automatically)',
      courier_id: id,
      new_status: new_status
    });
  } catch (error) {
    console.error('Error updating courier status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update courier status',
      error: error.message
    });
  }
});

// ============================================================
// FUNCTION 1 (READ): Get Courier Status
// GET /api/couriers/status/:id
// MUST execute: SELECT GetCourierStatus(?) AS status
// ============================================================
router.get('/status/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Execute function to get courier status
    const [rows] = await pool.query(
      'SELECT GetCourierStatus(?) AS status',
      [id]
    );

    if (rows.length === 0 || rows[0].status === null) {
      return res.status(404).json({
        success: false,
        message: 'Courier not found'
      });
    }

    res.json({
      success: true,
      message: 'Status retrieved using database function',
      courier_id: id,
      status: rows[0].status
    });
  } catch (error) {
    console.error('Error getting courier status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get courier status',
      error: error.message
    });
  }
});

// ============================================================
// TRIGGER VALIDATION: Get Delivery History & Audit Logs
// GET /api/couriers/:id/logs
// This endpoint fetches data from Delivery_History AND Courier_Audit
// to PROVE that the trigger 'after_courier_status_update' fired
// ============================================================
router.get('/:id/logs', async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch delivery history records for this courier
    const [deliveryHistory] = await pool.query(
      `SELECT 
        history_id,
        courier_id,
        old_status,
        new_status,
        changed_at,
        changed_by_admin_email
      FROM Delivery_History
      WHERE courier_id = ?
      ORDER BY changed_at DESC`,
      [id]
    );

    // Fetch audit records for this courier
    const [auditLogs] = await pool.query(
      `SELECT 
        audit_id,
        courier_id,
        action_type,
        old_status,
        new_status,
        changed_at,
        admin_email
      FROM Courier_Audit
      WHERE courier_id = ?
      ORDER BY changed_at DESC`,
      [id]
    );

    res.json({
      success: true,
      message: 'Logs retrieved successfully (Proof of Trigger execution)',
      courier_id: id,
      delivery_history: deliveryHistory,
      audit_logs: auditLogs,
      trigger_info: 'These records were automatically created by the after_courier_status_update trigger'
    });
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch logs',
      error: error.message
    });
  }
});

// ============================================================
// HELPER ENDPOINT: Get all couriers (for UI display)
// ============================================================
router.get('/', async (req, res) => {
  try {
    const [couriers] = await pool.query(
      `SELECT 
        c.courier_id,
        c.customer_id,
        c.managed_by_admin_id,
        c.bill_number,
        c.pickup_address,
        c.delivery_address,
        c.status,
        c.created_at,
        u.name AS customer_name,
        u.email AS customer_email,
        a.name AS admin_name,
        a.email AS admin_email
      FROM Couriers c
      LEFT JOIN Users u ON c.customer_id = u.user_id
      LEFT JOIN Admins a ON c.managed_by_admin_id = a.admin_id
      ORDER BY c.created_at DESC`
    );

    res.json({
      success: true,
      count: couriers.length,
      data: couriers
    });
  } catch (error) {
    console.error('Error fetching couriers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch couriers',
      error: error.message
    });
  }
});

// ============================================================
// HELPER ENDPOINTS: Get Users and Admins (for dropdown lists)
// ============================================================
router.get('/data/users', async (req, res) => {
  try {
    const [users] = await pool.query('SELECT user_id, name, email FROM Users ORDER BY name');
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/data/admins', async (req, res) => {
  try {
    const [admins] = await pool.query('SELECT admin_id, name, email FROM Admins ORDER BY name');
    res.json({ success: true, data: admins });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================================
// DELETE OPERATION: Delete Courier
// DELETE /api/couriers/:id
// ============================================================
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if courier exists
    const [courier] = await pool.query(
      'SELECT courier_id, bill_number FROM Couriers WHERE courier_id = ?',
      [id]
    );

    if (courier.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Courier not found'
      });
    }

    // Delete courier (CASCADE will handle related records)
    await pool.query('DELETE FROM Couriers WHERE courier_id = ?', [id]);

    res.json({
      success: true,
      message: `Courier #${id} (${courier[0].bill_number}) deleted successfully`,
      deleted_courier: courier[0]
    });
  } catch (error) {
    console.error('Error deleting courier:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete courier',
      error: error.message
    });
  }
});

module.exports = router;
