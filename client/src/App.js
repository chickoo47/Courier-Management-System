import React, { useState, useEffect } from 'react';
import './App.css';
import { courierAPI, reportsAPI } from './api';
import CustomerPortal from './CustomerPortal';
import Login from './Login';

function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null); // 'admin' or 'customer'
  const [userData, setUserData] = useState(null);

  // View mode toggle (only for admin)
  const [viewMode, setViewMode] = useState('admin'); // 'admin' or 'customer'

  // State for couriers
  const [couriers, setCouriers] = useState([]);
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  // State for forms
  const [newCourier, setNewCourier] = useState({
    customer_id: '',
    admin_id: '',
    bill_number: '',
    pickup_address: '',
    delivery_address: ''
  });

  // State for modals
  const [updateModal, setUpdateModal] = useState({ show: false, courier: null });
  const [logsModal, setLogsModal] = useState({ show: false, data: null });
  const [updateStatus, setUpdateStatus] = useState({ new_status: '', changed_by_admin_email: '' });

  // State for function test
  const [testCourierId, setTestCourierId] = useState('');
  const [functionResult, setFunctionResult] = useState(null);

  // State for reports
  const [reports, setReports] = useState({
    join: [],
    nested: [],
    aggregate: []
  });

  // State for creating new users/admins
  const [createUserMode, setCreateUserMode] = useState(false);
  const [createAdminMode, setCreateAdminMode] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', phone: '', address: '' });
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', phone: '', role: 'Manager' });

  // Handle login
  const handleLogin = (type, data) => {
    setIsAuthenticated(true);
    setUserType(type);
    setUserData(data);
    if (type === 'admin') {
      setViewMode('admin');
    } else {
      setViewMode('customer');
    }
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserType(null);
    setUserData(null);
    setViewMode('admin');
  };

  // Load initial data
  useEffect(() => {
    if (isAuthenticated && userType === 'admin') {
      loadData();
    }
  }, [isAuthenticated, userType]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [couriersRes, usersRes, adminsRes, joinRes, nestedRes, aggregateRes] = await Promise.all([
        courierAPI.getAllCouriers(),
        courierAPI.getUsers(),
        courierAPI.getAdmins(),
        reportsAPI.getJoinReport(),
        reportsAPI.getNestedReport(),
        reportsAPI.getAggregateReport()
      ]);

      setCouriers(couriersRes.data.data || []);
      setUsers(usersRes.data.data || []);
      setAdmins(adminsRes.data.data || []);
      setReports({
        join: joinRes.data.data || [],
        nested: nestedRes.data.data || [],
        aggregate: aggregateRes.data.data || []
      });
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setMessage({ type: 'error', text: 'Failed to load data. Make sure the backend server is running.' });
      setLoading(false);
    }
  };

  // ============================================================
  // SECTION A: PROCEDURE DEMO (CREATE & UPDATE)
  // ============================================================

  const handleAddCourier = async (e) => {
    e.preventDefault();
    try {
      const response = await courierAPI.addCourier(newCourier);
      setMessage({ type: 'success', text: response.data.message });
      setNewCourier({
        customer_id: '',
        admin_id: '',
        bill_number: '',
        pickup_address: '',
        delivery_address: ''
      });
      loadData(); // Refresh data
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to add courier' });
    }
  };

  const openUpdateModal = (courier) => {
    setUpdateModal({ show: true, courier });
    setUpdateStatus({
      new_status: courier.status,
      changed_by_admin_email: courier.admin_email || ''
    });
  };

  const handleUpdateStatus = async () => {
    try {
      const response = await courierAPI.updateCourierStatus(
        updateModal.courier.courier_id,
        updateStatus
      );
      setMessage({ type: 'success', text: response.data.message });
      setUpdateModal({ show: false, courier: null });
      loadData(); // Refresh data
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update status' });
    }
  };

  // Create new user
  const handleCreateUser = async () => {
    try {
      if (!newUser.name || !newUser.email) {
        setMessage({ type: 'error', text: 'Name and email are required' });
        return;
      }
      const response = await courierAPI.createUser(newUser);
      setMessage({ type: 'success', text: 'User created successfully!' });
      setNewUser({ name: '', email: '', phone: '', address: '' });
      setCreateUserMode(false);
      loadData(); // Refresh to get new user in dropdown
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to create user' });
    }
  };

  // Create new admin
  const handleCreateAdmin = async () => {
    try {
      if (!newAdmin.name || !newAdmin.email) {
        setMessage({ type: 'error', text: 'Name and email are required' });
        return;
      }
      const response = await courierAPI.createAdmin(newAdmin);
      setMessage({ type: 'success', text: 'Admin created successfully!' });
      setNewAdmin({ name: '', email: '', phone: '', role: 'Manager' });
      setCreateAdminMode(false);
      loadData(); // Refresh to get new admin in dropdown
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to create admin' });
    }
  };

  // ============================================================
  // SECTION B: TRIGGER & FUNCTION VALIDATION
  // ============================================================

  const testFunction = async () => {
    try {
      const response = await courierAPI.getCourierStatus(testCourierId);
      setFunctionResult(response.data);
      setMessage({ type: 'success', text: 'Function executed successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to get status' });
      setFunctionResult(null);
    }
  };

  const viewLogs = async (courierId) => {
    try {
      const response = await courierAPI.getCourierLogs(courierId);
      setLogsModal({ show: true, data: response.data });
      setMessage({ type: 'info', text: 'Viewing audit logs (Trigger validation)' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to load logs' });
    }
  };

  const handleDeleteCourier = async (courier) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete courier #${courier.courier_id} (${courier.bill_number})?\n\nThis will also delete all related:\n- Delivery History\n- Audit Logs\n- Comments\n\nThis action cannot be undone!`
    );

    if (!confirmDelete) return;

    try {
      const response = await courierAPI.deleteCourier(courier.courier_id);
      setMessage({ type: 'success', text: response.data.message });
      loadData(); // Refresh data
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to delete courier' });
    }
  };

  // ============================================================
  // HELPERS
  // ============================================================

  const getStatusClass = (status) => {
    const statusMap = {
      'Pending': 'status-pending',
      'In Transit': 'status-in-transit',
      'Delivered': 'status-delivered',
      'Cancelled': 'status-cancelled'
    };
    return statusMap[status] || 'status-pending';
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  if (loading && viewMode === 'admin' && userType === 'admin') {
    return (
      <div className="App">
        <div className="loading">Loading Courier Management System</div>
      </div>
    );
  }

  // If customer view, show customer portal
  if (viewMode === 'customer') {
    return (
      <div className="App">
        <div className="view-toggle">
          {userType === 'admin' && (
            <button 
              className="toggle-view-btn"
              onClick={() => setViewMode('admin')}
            >
              🔐 Switch to Admin View
            </button>
          )}
          <button 
            className="logout-btn"
            onClick={handleLogout}
          >
            🚪 Logout
          </button>
        </div>
        <CustomerPortal initialData={userType === 'customer' ? userData : null} />
      </div>
    );
  }

  return (
    <div className="App">
      <div className="app-container">
        {/* Header with Logout */}
        <div className="top-bar">
          <div className="user-info">
            👤 Logged in as: <strong>{userData?.username || 'Admin'}</strong>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>

        {/* View Toggle */}
        <div className="view-toggle">
          <button 
            className="toggle-view-btn customer"
            onClick={() => setViewMode('customer')}
          >
            👤 Switch to Customer View
          </button>
        </div>

        {/* Header */}
        <div className="app-header">
          <h1>🚚 Courier Management System - Admin Panel</h1>
          <p>Full-Stack Application demonstrating Stored Procedures, Functions, and Triggers</p>
          <div className="subtitle">
            <strong>📋 Project Review Dashboard:</strong> This interface demonstrates all required database operations 
            including CREATE/UPDATE procedures, READ functions, automatic triggers, and complex SQL queries.
          </div>
        </div>

        {/* Messages */}
        {message.text && (
          <div className={`message message-${message.type}`}>
            {message.text}
          </div>
        )}

        {/* ============================================================ */}
        {/* SECTION A: PROCEDURE DEMO (CREATE & UPDATE) */}
        {/* ============================================================ */}
        <div className="demo-section">
          <div className="section-header">
            <span className="section-badge">SECTION A</span>
            <h2>Stored Procedures Demo (CREATE & UPDATE)</h2>
          </div>
          
          <div className="section-description">
            ✅ <strong>Procedure 1 (CREATE):</strong> AddCourierOrder - Adds new courier using stored procedure<br/>
            ✅ <strong>Procedure 2 (UPDATE):</strong> UpdateCourierStatus - Updates status and triggers audit logging
          </div>

          {/* Add Courier Form */}
          <div style={{ background: '#f0f9ff', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
            <h3 style={{ marginTop: 0, color: '#1e40af' }}>➕ Add New Courier (Calls AddCourierOrder Procedure)</h3>
            <form onSubmit={handleAddCourier}>
              <div className="form-grid">
                {/* Customer Section */}
                <div className="form-group">
                  <label>
                    Customer * 
                    <button
                      type="button"
                      className="toggle-btn"
                      onClick={() => setCreateUserMode(!createUserMode)}
                      style={{ marginLeft: '10px', fontSize: '0.85em' }}
                    >
                      {createUserMode ? '📋 Select Existing' : '➕ Create New'}
                    </button>
                  </label>
                  
                  {!createUserMode ? (
                    <select
                      required
                      value={newCourier.customer_id}
                      onChange={(e) => setNewCourier({ ...newCourier, customer_id: e.target.value })}
                    >
                      <option value="">Select Customer</option>
                      {users.map(user => (
                        <option key={user.user_id} value={user.user_id}>
                          {user.name} ({user.email})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div style={{ border: '2px dashed #3b82f6', padding: '15px', borderRadius: '8px', background: 'white' }}>
                      <input
                        type="text"
                        placeholder="Customer Name *"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        style={{ marginBottom: '10px' }}
                      />
                      <input
                        type="email"
                        placeholder="Customer Email *"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        style={{ marginBottom: '10px' }}
                      />
                      <input
                        type="tel"
                        placeholder="Phone (optional)"
                        value={newUser.phone}
                        onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                        style={{ marginBottom: '10px' }}
                      />
                      <input
                        type="text"
                        placeholder="Address (optional)"
                        value={newUser.address}
                        onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                      />
                      <button
                        type="button"
                        className="btn btn-success"
                        onClick={handleCreateUser}
                        style={{ marginTop: '10px', fontSize: '0.9em', padding: '8px 15px' }}
                      >
                        ✅ Create Customer
                      </button>
                    </div>
                  )}
                </div>

                {/* Admin Section */}
                <div className="form-group">
                  <label>
                    Admin * 
                    <button
                      type="button"
                      className="toggle-btn"
                      onClick={() => setCreateAdminMode(!createAdminMode)}
                      style={{ marginLeft: '10px', fontSize: '0.85em' }}
                    >
                      {createAdminMode ? '📋 Select Existing' : '➕ Create New'}
                    </button>
                  </label>
                  
                  {!createAdminMode ? (
                    <select
                      required
                      value={newCourier.admin_id}
                      onChange={(e) => setNewCourier({ ...newCourier, admin_id: e.target.value })}
                    >
                      <option value="">Select Admin</option>
                      {admins.map(admin => (
                        <option key={admin.admin_id} value={admin.admin_id}>
                          {admin.name} ({admin.email})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div style={{ border: '2px dashed #f59e0b', padding: '15px', borderRadius: '8px', background: 'white' }}>
                      <input
                        type="text"
                        placeholder="Admin Name *"
                        value={newAdmin.name}
                        onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                        style={{ marginBottom: '10px' }}
                      />
                      <input
                        type="email"
                        placeholder="Admin Email *"
                        value={newAdmin.email}
                        onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                        style={{ marginBottom: '10px' }}
                      />
                      <input
                        type="tel"
                        placeholder="Phone (optional)"
                        value={newAdmin.phone}
                        onChange={(e) => setNewAdmin({ ...newAdmin, phone: e.target.value })}
                        style={{ marginBottom: '10px' }}
                      />
                      <select
                        value={newAdmin.role}
                        onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
                      >
                        <option value="Manager">Manager</option>
                        <option value="Supervisor">Supervisor</option>
                        <option value="Operator">Operator</option>
                      </select>
                      <button
                        type="button"
                        className="btn btn-warning"
                        onClick={handleCreateAdmin}
                        style={{ marginTop: '10px', fontSize: '0.9em', padding: '8px 15px' }}
                      >
                        ✅ Create Admin
                      </button>
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label>Bill Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., BILL-1001"
                    value={newCourier.bill_number}
                    onChange={(e) => setNewCourier({ ...newCourier, bill_number: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Pickup Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter pickup address"
                    value={newCourier.pickup_address}
                    onChange={(e) => setNewCourier({ ...newCourier, pickup_address: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Delivery Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter delivery address"
                    value={newCourier.delivery_address}
                    onChange={(e) => setNewCourier({ ...newCourier, delivery_address: e.target.value })}
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary">
                ➕ Add Courier (Execute Procedure)
              </button>
            </form>
          </div>

          {/* Couriers Table with Update */}
          <h3>📦 All Courier Orders (Click Update to Execute UpdateCourierStatus Procedure)</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Bill Number</th>
                  <th>Customer</th>
                  <th>Admin</th>
                  <th>Status</th>
                  <th>Pickup Address</th>
                  <th>Delivery Address</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {couriers.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>
                      <div className="empty-state">
                        <div className="empty-state-icon">📭</div>
                        <h3>No Couriers Found</h3>
                        <p>Add your first courier using the form above</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  couriers.map(courier => (
                    <tr key={courier.courier_id}>
                      <td>{courier.courier_id}</td>
                      <td><strong>{courier.bill_number}</strong></td>
                      <td>{courier.customer_name}</td>
                      <td>{courier.admin_name}</td>
                      <td>
                        <span className={`status-badge ${getStatusClass(courier.status)}`}>
                          {courier.status}
                        </span>
                      </td>
                      <td>{courier.pickup_address}</td>
                      <td>{courier.delivery_address}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn btn-warning"
                            onClick={() => openUpdateModal(courier)}
                            title="Update Status"
                          >
                            🔄 Update
                          </button>
                          <button
                            className="btn btn-info"
                            onClick={() => viewLogs(courier.courier_id)}
                            title="View Logs"
                          >
                            📋 Logs
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDeleteCourier(courier)}
                            title="Delete Courier"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ============================================================ */}
        {/* SECTION B: TRIGGER & FUNCTION VALIDATION */}
        {/* ============================================================ */}
        <div className="demo-section">
          <div className="section-header">
            <span className="section-badge">SECTION B</span>
            <h2>Function & Trigger Validation</h2>
          </div>

          <div className="section-description">
            ✅ <strong>Function (READ):</strong> GetCourierStatus - Retrieves status using database function<br/>
            ✅ <strong>Trigger (AUTOMATIC):</strong> after_courier_status_update - Auto-populates Delivery_History & Courier_Audit
          </div>

          {/* Function Test */}
          <div className="function-test">
            <h3 style={{ marginTop: 0, color: '#1e40af' }}>🧪 Test Database Function: GetCourierStatus</h3>
            <div className="test-input-group">
              <input
                type="number"
                placeholder="Enter Courier ID to test function"
                value={testCourierId}
                onChange={(e) => setTestCourierId(e.target.value)}
              />
              <button
                className="btn btn-info"
                onClick={testFunction}
                disabled={!testCourierId}
              >
                🔍 Execute Function
              </button>
            </div>
            {functionResult && (
              <div className="test-result">
                <p><strong>Function Result:</strong></p>
                <p>Courier ID: {functionResult.courier_id}</p>
                <p>Status: <span className={`status-badge ${getStatusClass(functionResult.status)}`}>
                  {functionResult.status}
                </span></p>
                <p style={{ fontSize: '0.9em', color: '#6b7280', marginTop: '10px' }}>
                  ✅ {functionResult.message}
                </p>
              </div>
            )}
          </div>

          <div style={{ background: '#fef3c7', padding: '15px', borderRadius: '8px', border: '2px solid #f59e0b' }}>
            <strong>💡 Trigger Validation:</strong> Click "View Logs" button next to any courier in the table above. 
            The logs modal will show records from <code>Delivery_History</code> and <code>Courier_Audit</code> tables 
            that were automatically created by the <code>after_courier_status_update</code> trigger.
          </div>
        </div>

        {/* ============================================================ */}
        {/* SECTION C: COMPLEX QUERIES (RUBRIC REQUIREMENTS) */}
        {/* ============================================================ */}
        <div className="demo-section">
          <div className="section-header">
            <span className="section-badge">SECTION C</span>
            <h2>Complex SQL Queries Demo</h2>
          </div>

          <div className="section-description">
            ✅ <strong>JOIN Query:</strong> Combines Couriers + Users + Admins tables<br/>
            ✅ <strong>NESTED Query:</strong> Subquery to find customers with delivered orders<br/>
            ✅ <strong>AGGREGATE Query:</strong> Groups couriers by status with COUNT
          </div>

          {/* Query 1: JOIN */}
          <div className="report-card">
            <h4>📊 Query 1: JOIN (Couriers + Users + Admins)</h4>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Bill Number</th>
                    <th>Status</th>
                    <th>Customer Name</th>
                    <th>Customer Email</th>
                    <th>Admin Name</th>
                    <th>Admin Email</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.join.length === 0 ? (
                    <tr><td colSpan="6" style={{ textAlign: 'center' }}>No data available</td></tr>
                  ) : (
                    reports.join.map((row, idx) => (
                      <tr key={idx}>
                        <td><strong>{row.bill_number}</strong></td>
                        <td><span className={`status-badge ${getStatusClass(row.status)}`}>{row.status}</span></td>
                        <td>{row.customer_name}</td>
                        <td>{row.customer_email}</td>
                        <td>{row.admin_name}</td>
                        <td>{row.admin_email}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Query 2: NESTED */}
          <div className="report-card">
            <h4>📊 Query 2: NESTED (Customers with Delivered Orders)</h4>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.nested.length === 0 ? (
                    <tr><td colSpan="4" style={{ textAlign: 'center' }}>No customers with delivered orders yet</td></tr>
                  ) : (
                    reports.nested.map((row) => (
                      <tr key={row.user_id}>
                        <td>{row.user_id}</td>
                        <td><strong>{row.name}</strong></td>
                        <td>{row.email}</td>
                        <td>{row.phone}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Query 3: AGGREGATE */}
          <div className="report-card">
            <h4>📊 Query 3: AGGREGATE (Courier Count by Status)</h4>
            <div className="stat-grid">
              {reports.aggregate.map((row, idx) => (
                <div className="stat-card" key={idx}>
                  <h3>{row.count}</h3>
                  <p>{row.status}</p>
                </div>
              ))}
            </div>
            <div className="table-container" style={{ marginTop: '15px' }}>
              <table>
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Count</th>
                    <th>Unique Customers</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.aggregate.map((row, idx) => (
                    <tr key={idx}>
                      <td><span className={`status-badge ${getStatusClass(row.status)}`}>{row.status}</span></td>
                      <td><strong>{row.count}</strong></td>
                      <td>{row.unique_customers}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* MODALS */}
        {/* ============================================================ */}

        {/* Update Status Modal */}
        {updateModal.show && (
          <div className="modal-overlay" onClick={() => setUpdateModal({ show: false, courier: null })}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>🔄 Update Courier Status (Executes Procedure)</h3>
                <button className="modal-close" onClick={() => setUpdateModal({ show: false, courier: null })}>×</button>
              </div>
              <div>
                <p><strong>Bill Number:</strong> {updateModal.courier.bill_number}</p>
                <p><strong>Current Status:</strong> <span className={`status-badge ${getStatusClass(updateModal.courier.status)}`}>
                  {updateModal.courier.status}
                </span></p>
                <div className="form-group" style={{ marginTop: '20px' }}>
                  <label>New Status *</label>
                  <select
                    value={updateStatus.new_status}
                    onChange={(e) => setUpdateStatus({ ...updateStatus, new_status: e.target.value })}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Admin Email *</label>
                  <select
                    value={updateStatus.changed_by_admin_email}
                    onChange={(e) => setUpdateStatus({ ...updateStatus, changed_by_admin_email: e.target.value })}
                  >
                    <option value="">Select Admin</option>
                    {admins.map(admin => (
                      <option key={admin.admin_id} value={admin.email}>
                        {admin.name} ({admin.email})
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ background: '#fef3c7', padding: '12px', borderRadius: '6px', marginTop: '15px', fontSize: '0.9em' }}>
                  <strong>⚡ Note:</strong> This will execute the <code>UpdateCourierStatus</code> stored procedure,
                  which will automatically trigger the <code>after_courier_status_update</code> trigger to log changes.
                </div>
              </div>
              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={() => setUpdateModal({ show: false, courier: null })}>
                  Cancel
                </button>
                <button
                  className="btn btn-success"
                  onClick={handleUpdateStatus}
                  disabled={!updateStatus.new_status || !updateStatus.changed_by_admin_email}
                >
                  ✅ Update Status (Call Procedure)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Logs Modal (Trigger Validation) */}
        {logsModal.show && (
          <div className="modal-overlay" onClick={() => setLogsModal({ show: false, data: null })}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>📋 Audit Logs (Trigger Validation)</h3>
                <button className="modal-close" onClick={() => setLogsModal({ show: false, data: null })}>×</button>
              </div>
              <div>
                <div style={{ background: '#d1fae5', padding: '12px', borderRadius: '6px', marginBottom: '20px', border: '2px solid #10b981' }}>
                  <strong>✅ Trigger Proof:</strong> {logsModal.data?.trigger_info}
                </div>

                {/* Delivery History */}
                <div className="logs-section">
                  <h4>📦 Delivery History ({logsModal.data?.delivery_history?.length || 0} records)</h4>
                  {logsModal.data?.delivery_history?.length === 0 ? (
                    <p style={{ color: '#9ca3af' }}>No delivery history yet</p>
                  ) : (
                    logsModal.data?.delivery_history?.map((log) => (
                      <div className="log-item" key={log.history_id}>
                        <p><strong>History ID:</strong> {log.history_id}</p>
                        <p><strong>Changed From:</strong> {log.old_status} → <strong>To:</strong> {log.new_status}</p>
                        <p><strong>Changed By:</strong> {log.changed_by_admin_email}</p>
                        <p><strong>Changed At:</strong> {new Date(log.changed_at).toLocaleString()}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Courier Audit */}
                <div className="logs-section">
                  <h4>🔍 Courier Audit ({logsModal.data?.audit_logs?.length || 0} records)</h4>
                  {logsModal.data?.audit_logs?.length === 0 ? (
                    <p style={{ color: '#9ca3af' }}>No audit logs yet</p>
                  ) : (
                    logsModal.data?.audit_logs?.map((log) => (
                      <div className="log-item" key={log.audit_id}>
                        <p><strong>Audit ID:</strong> {log.audit_id}</p>
                        <p><strong>Action:</strong> {log.action_type}</p>
                        <p><strong>Changed From:</strong> {log.old_status} → <strong>To:</strong> {log.new_status}</p>
                        <p><strong>Admin:</strong> {log.admin_email}</p>
                        <p><strong>Timestamp:</strong> {new Date(log.changed_at).toLocaleString()}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Comments Section */}
                <div className="logs-section">
                  <h4>💬 Comments & Feedback ({logsModal.data?.comments?.length || 0} comments)</h4>
                  {logsModal.data?.comments?.length === 0 ? (
                    <p style={{ color: '#9ca3af' }}>No comments yet</p>
                  ) : (
                    logsModal.data?.comments?.map((comment) => (
                      <div className="log-item" key={comment.comment_id} style={{ 
                        background: comment.comment_text.includes('Thank you for using our courier service') 
                          ? '#fef3c7' 
                          : '#f3f4f6',
                        borderLeft: comment.comment_text.includes('Thank you for using our courier service')
                          ? '4px solid #f59e0b'
                          : '4px solid #6366f1'
                      }}>
                        {comment.comment_text.includes('Thank you for using our courier service') && (
                          <p style={{ color: '#d97706', fontWeight: 'bold', marginBottom: '8px' }}>
                            ⚡ Auto-generated by Trigger
                          </p>
                        )}
                        <p><strong>Comment ID:</strong> {comment.comment_id}</p>
                        <p><strong>From:</strong> {comment.user_name} ({comment.user_email})</p>
                        <p><strong>Message:</strong></p>
                        <p style={{ 
                          background: 'white', 
                          padding: '10px', 
                          borderRadius: '6px', 
                          marginTop: '8px',
                          fontStyle: 'italic'
                        }}>
                          "{comment.comment_text}"
                        </p>
                        <p><strong>Posted At:</strong> {new Date(comment.created_at).toLocaleString()}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={() => setLogsModal({ show: false, data: null })}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
