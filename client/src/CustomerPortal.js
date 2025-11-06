import React, { useState, useEffect } from 'react';
import './CustomerPortal.css';

const CustomerPortal = ({ initialData }) => {
  const [trackingData, setTrackingData] = useState({
    name: initialData?.name || '',
    billNumber: initialData?.billNumber || ''
  });
  const [courierInfo, setCourierInfo] = useState(initialData?.courier || null);
  const [deliveryHistory, setDeliveryHistory] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');

  // If initialData provided, load the order details automatically
  useEffect(() => {
    if (initialData && initialData.courier) {
      loadOrderDetails(initialData.courier.courier_id);
    }
  }, [initialData]);

  const loadOrderDetails = async (courierId) => {
    try {
      // Fetch delivery history
      const historyResponse = await fetch(
        `http://localhost:5001/api/couriers/${courierId}/history`
      );
      const historyData = await historyResponse.json();
      if (historyData.success) {
        setDeliveryHistory(historyData.history);
      }

      // Fetch comments
      const commentsResponse = await fetch(
        `http://localhost:5001/api/couriers/${courierId}/comments`
      );
      const commentsData = await commentsResponse.json();
      if (commentsData.success) {
        setComments(commentsData.comments);
      }
    } catch (err) {
      console.error('Error loading order details:', err);
    }
  };

  const handleInputChange = (e) => {
    setTrackingData({
      ...trackingData,
      [e.target.name]: e.target.value
    });
  };

  const trackOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setCourierInfo(null);
    setDeliveryHistory([]);
    setComments([]);

    try {
      // Fetch courier by bill number and customer name
      const response = await fetch(
        `http://localhost:5001/api/couriers/track?billNumber=${trackingData.billNumber}&name=${trackingData.name}`
      );
      
      const data = await response.json();
      
      if (data.success && data.courier) {
        setCourierInfo(data.courier);
        
        // Fetch delivery history
        const historyResponse = await fetch(
          `http://localhost:5001/api/couriers/${data.courier.courier_id}/history`
        );
        const historyData = await historyResponse.json();
        if (historyData.success) {
          setDeliveryHistory(historyData.history);
        }

        // Fetch comments
        const commentsResponse = await fetch(
          `http://localhost:5001/api/couriers/${data.courier.courier_id}/comments`
        );
        const commentsData = await commentsResponse.json();
        if (commentsData.success) {
          setComments(commentsData.comments);
        }
      } else {
        setError('No order found with this bill number and name. Please check your details.');
      }
    } catch (err) {
      setError('Unable to connect to the server. Please try again later.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !courierInfo) return;

    try {
      const response = await fetch('http://localhost:5001/api/couriers/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courier_id: courierInfo.courier_id,
          user_id: courierInfo.customer_id,
          comment_text: newComment
        })
      });

      const data = await response.json();
      if (data.success) {
        setComments([...comments, {
          comment_text: newComment,
          created_at: new Date().toISOString()
        }]);
        setNewComment('');
        alert('Comment submitted successfully!');
      }
    } catch (err) {
      alert('Failed to submit comment');
      console.error('Error:', err);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': '#ffa500',
      'In Transit': '#2196F3',
      'Out for Delivery': '#9C27B0',
      'Delivered': '#4CAF50',
      'Cancelled': '#f44336'
    };
    return colors[status] || '#666';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'Pending': '📦',
      'In Transit': '🚚',
      'Out for Delivery': '🏃',
      'Delivered': '✅',
      'Cancelled': '❌'
    };
    return icons[status] || '📋';
  };

  return (
    <div className="customer-portal">
      <div className="portal-header">
        <h1>📦 Track Your Order</h1>
        <p>Enter your details to track your courier shipment</p>
      </div>

      <div className="tracking-form-container">
        <form onSubmit={trackOrder} className="tracking-form">
          <div className="form-group">
            <label>Your Name</label>
            <input
              type="text"
              name="name"
              value={trackingData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label>Bill Number</label>
            <input
              type="text"
              name="billNumber"
              value={trackingData.billNumber}
              onChange={handleInputChange}
              placeholder="Enter your bill number (e.g., BILL-1001)"
              required
            />
          </div>

          <button type="submit" className="track-btn" disabled={loading}>
            {loading ? 'Searching...' : '🔍 Track Order'}
          </button>
        </form>

        {error && (
          <div className="error-message">
            <span>⚠️</span> {error}
          </div>
        )}
      </div>

      {courierInfo && (
        <div className="tracking-results">
          {/* Current Status Card */}
          <div className="status-card">
            <div className="status-header">
              <h2>Current Status</h2>
              <div 
                className="status-badge"
                style={{ backgroundColor: getStatusColor(courierInfo.status) }}
              >
                {getStatusIcon(courierInfo.status)} {courierInfo.status}
              </div>
            </div>

            <div className="courier-details">
              <div className="detail-row">
                <span className="label">Bill Number:</span>
                <span className="value">{courierInfo.bill_number}</span>
              </div>
              <div className="detail-row">
                <span className="label">Pickup Address:</span>
                <span className="value">{courierInfo.pickup_address}</span>
              </div>
              <div className="detail-row">
                <span className="label">Delivery Address:</span>
                <span className="value">{courierInfo.delivery_address}</span>
              </div>
              <div className="detail-row">
                <span className="label">Order Date:</span>
                <span className="value">
                  {new Date(courierInfo.created_at).toLocaleDateString()}
                </span>
              </div>
              {courierInfo.updated_at && (
                <div className="detail-row">
                  <span className="label">Last Updated:</span>
                  <span className="value">
                    {new Date(courierInfo.updated_at).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Delivery History Timeline */}
          {deliveryHistory.length > 0 && (
            <div className="history-card">
              <h2>📍 Tracking History</h2>
              <div className="timeline">
                {deliveryHistory.map((history, index) => (
                  <div key={index} className="timeline-item">
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <div className="timeline-status" style={{ color: getStatusColor(history.status) }}>
                        {getStatusIcon(history.status)} {history.status}
                      </div>
                      <div className="timeline-location">
                        📍 {history.location}
                      </div>
                      <div className="timeline-date">
                        {new Date(history.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comments Section */}
          <div className="comments-card">
            <h2>💬 Comments & Feedback</h2>
            
            <form onSubmit={submitComment} className="comment-form">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Have questions or feedback? Write here..."
                rows="3"
              />
              <button type="submit" className="submit-comment-btn">
                Send Comment
              </button>
            </form>

            <div className="comments-list">
              {comments.length > 0 ? (
                comments.map((comment, index) => (
                  <div key={index} className="comment-item">
                    <div className="comment-text">{comment.comment_text}</div>
                    <div className="comment-date">
                      {new Date(comment.created_at).toLocaleString()}
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-comments">No comments yet</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerPortal;
