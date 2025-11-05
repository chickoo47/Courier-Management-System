const express = require('express');
const router = express.Router();
const { pool } = require('../database');

// ============================================================
// HELPER ENDPOINTS: Create Users and Admins
// ============================================================

// Create new user
router.post('/users', async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required'
      });
    }

    const [result] = await pool.query(
      'INSERT INTO Users (name, email, phone, address) VALUES (?, ?, ?, ?)',
      [name, email, phone || null, address || null]
    );

    const [newUser] = await pool.query(
      'SELECT * FROM Users WHERE user_id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: newUser[0]
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create user',
      error: error.message
    });
  }
});

// Create new admin
router.post('/admins', async (req, res) => {
  try {
    const { name, email, phone, role } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required'
      });
    }

    const [result] = await pool.query(
      'INSERT INTO Admins (name, email, phone, role) VALUES (?, ?, ?, ?)',
      [name, email, phone || null, role || 'Manager']
    );

    const [newAdmin] = await pool.query(
      'SELECT * FROM Admins WHERE admin_id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      data: newAdmin[0]
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create admin',
      error: error.message
    });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const [users] = await pool.query('SELECT * FROM Users ORDER BY created_at DESC');
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
});

// Get all admins
router.get('/admins', async (req, res) => {
  try {
    const [admins] = await pool.query('SELECT * FROM Admins ORDER BY created_at DESC');
    res.json({
      success: true,
      count: admins.length,
      data: admins
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admins',
      error: error.message
    });
  }
});

// ============================================================
// COMPLEX QUERY 1: JOIN
// GET /api/reports/join
// Demonstrates JOIN operation across multiple tables
// ============================================================
router.get('/join', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
        T1.courier_id,
        T1.bill_number,
        T1.status,
        T1.pickup_address,
        T1.delivery_address,
        T1.created_at,
        T2.name AS customer_name,
        T2.email AS customer_email,
        T3.name AS admin_name,
        T3.email AS admin_email
      FROM Couriers T1
      JOIN Users T2 ON T1.customer_id = T2.user_id
      LEFT JOIN Admins T3 ON T1.managed_by_admin_id = T3.admin_id
      ORDER BY T1.created_at DESC`
    );

    res.json({
      success: true,
      message: 'JOIN Query executed successfully',
      query_type: 'JOIN (Couriers + Users + Admins)',
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.error('Error executing JOIN query:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to execute JOIN query',
      error: error.message
    });
  }
});

// ============================================================
// COMPLEX QUERY 2: NESTED (Subquery)
// GET /api/reports/nested
// Demonstrates nested SELECT with IN clause
// ============================================================
router.get('/nested', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
        user_id,
        name,
        email,
        phone
      FROM Users
      WHERE user_id IN (
        SELECT customer_id 
        FROM Couriers 
        WHERE status = 'Delivered'
      )
      ORDER BY name`
    );

    res.json({
      success: true,
      message: 'NESTED Query executed successfully',
      query_type: 'NESTED (Users with Delivered couriers)',
      description: 'Finds all customers who have at least one delivered courier',
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.error('Error executing NESTED query:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to execute NESTED query',
      error: error.message
    });
  }
});

// ============================================================
// COMPLEX QUERY 3: AGGREGATE
// GET /api/reports/aggregate
// Demonstrates GROUP BY with aggregate functions
// ============================================================
router.get('/aggregate', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
        status,
        COUNT(*) as count,
        COUNT(DISTINCT customer_id) as unique_customers,
        MIN(created_at) as earliest_order,
        MAX(created_at) as latest_order
      FROM Couriers
      GROUP BY status
      ORDER BY count DESC`
    );

    res.json({
      success: true,
      message: 'AGGREGATE Query executed successfully',
      query_type: 'AGGREGATE (GROUP BY status with COUNT)',
      description: 'Groups couriers by status and counts orders',
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.error('Error executing AGGREGATE query:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to execute AGGREGATE query',
      error: error.message
    });
  }
});

// ============================================================
// BONUS REPORTS: Additional complex queries for demonstration
// ============================================================

// Admin Performance Report
router.get('/admin-performance', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
        a.admin_id,
        a.name AS admin_name,
        a.email AS admin_email,
        COUNT(c.courier_id) AS total_couriers_managed,
        SUM(CASE WHEN c.status = 'Delivered' THEN 1 ELSE 0 END) AS delivered_count,
        SUM(CASE WHEN c.status = 'In Transit' THEN 1 ELSE 0 END) AS in_transit_count,
        SUM(CASE WHEN c.status = 'Pending' THEN 1 ELSE 0 END) AS pending_count
      FROM Admins a
      LEFT JOIN Couriers c ON a.admin_id = c.managed_by_admin_id
      GROUP BY a.admin_id, a.name, a.email
      ORDER BY total_couriers_managed DESC`
    );

    res.json({
      success: true,
      message: 'Admin Performance Report',
      data: rows
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Customer Activity Report
router.get('/customer-activity', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
        u.user_id,
        u.name AS customer_name,
        u.email,
        COUNT(c.courier_id) AS total_orders,
        GROUP_CONCAT(DISTINCT c.status) AS order_statuses
      FROM Users u
      LEFT JOIN Couriers c ON u.user_id = c.customer_id
      GROUP BY u.user_id, u.name, u.email
      HAVING total_orders > 0
      ORDER BY total_orders DESC`
    );

    res.json({
      success: true,
      message: 'Customer Activity Report',
      data: rows
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
