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
// Also fetches Comments (including trigger-generated comments)
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

    // Fetch comments for this courier (including trigger-generated comments)
    const [comments] = await pool.query(
      `SELECT 
        c.comment_id,
        c.courier_id,
        c.user_id,
        c.comment_text,
        c.created_at,
        u.name as user_name,
        u.email as user_email
      FROM Comments c
      JOIN Users u ON c.user_id = u.user_id
      WHERE c.courier_id = ?
      ORDER BY c.created_at DESC`,
      [id]
    );

    res.json({
      success: true,
      message: 'Logs retrieved successfully (Proof of Trigger execution)',
      courier_id: id,
      delivery_history: deliveryHistory,
      audit_logs: auditLogs,
      comments: comments,
      trigger_info: 'These records were automatically created by the after_courier_status_update trigger. Comments may also include auto-generated thank you messages from after_courier_delivered trigger.'
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
// FUNCTION 2 (NEW): Get Customer Courier Count
// GET /api/couriers/customer/:id/count
// MUST execute: SELECT GetCustomerCourierCount(?) AS count
// ============================================================
router.get('/customer/:id/count', async (req, res) => {
  try {
    const { id } = req.params;

    // Execute function to get customer's total courier count
    const [rows] = await pool.query(
      'SELECT GetCustomerCourierCount(?) AS total_couriers',
      [id]
    );

    res.json({
      success: true,
      message: 'Customer courier count retrieved using database function',
      customer_id: parseInt(id),
      total_couriers: rows[0].total_couriers
    });
  } catch (error) {
    console.error('Error getting customer courier count:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get customer courier count',
      error: error.message
    });
  }
});

// ============================================================
// TRIGGER 2 VALIDATION: Get Comments for Courier
// GET /api/couriers/:id/comments
// This endpoint fetches comments to PROVE the 'after_courier_delivered' trigger fired
// ============================================================
router.get('/:id/comments', async (req, res) => {
  try {
    const { id } = req.params;

    const [comments] = await pool.query(
      `SELECT 
        c.comment_id,
        c.comment_text,
        c.created_at,
        u.name AS user_name,
        u.email AS user_email
      FROM Comments c
      LEFT JOIN Users u ON c.user_id = u.user_id
      WHERE c.courier_id = ?
      ORDER BY c.created_at DESC`,
      [id]
    );

    res.json({
      success: true,
      message: 'Comments retrieved successfully (Proof of Trigger 2 execution)',
      courier_id: parseInt(id),
      comments: comments,
      trigger_info: 'When a courier status is changed to "Delivered", the after_courier_delivered trigger automatically creates a thank you comment'
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch comments',
      error: error.message
    });
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

// ============================================================
// CUSTOMER PORTAL: Track order by bill number and name
// GET /api/couriers/track?billNumber=BILL-1001&name=John Doe
// ============================================================
router.get('/track', async (req, res) => {
  try {
    const { billNumber, name } = req.query;

    if (!billNumber || !name) {
      return res.status(400).json({
        success: false,
        message: 'Bill number and name are required'
      });
    }

    // Find courier by bill number and customer name
    const [couriers] = await pool.query(`
      SELECT c.*, u.name as customer_name, u.email, u.phone, u.address
      FROM Couriers c
      JOIN Users u ON c.customer_id = u.user_id
      WHERE c.bill_number = ? AND u.name LIKE ?
    `, [billNumber, `%${name}%`]);

    if (couriers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No courier found with this bill number and name'
      });
    }

    res.json({
      success: true,
      courier: couriers[0]
    });
  } catch (error) {
    console.error('Error tracking courier:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track courier',
      error: error.message
    });
  }
});

// ============================================================
// CUSTOMER PORTAL: Add comment
// POST /api/couriers/comment
// ============================================================
router.post('/comment', async (req, res) => {
  try {
    const { courier_id, user_id, comment_text } = req.body;

    if (!courier_id || !user_id || !comment_text) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    await pool.query(
      'INSERT INTO Comments (courier_id, user_id, comment_text) VALUES (?, ?, ?)',
      [courier_id, user_id, comment_text]
    );

    res.json({
      success: true,
      message: 'Comment added successfully'
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add comment',
      error: error.message
    });
  }
});

module.exports = router;
