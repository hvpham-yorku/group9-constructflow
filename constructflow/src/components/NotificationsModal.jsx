/**
 * NotificationsModal.jsx
 *
 * Modal component for displaying system notifications. Shows a list of recent notifications
 * including project updates, task assignments, and status changes. Displays "No notifications"
 * message when the notification list is empty. Accessible via the notification bell icon in the header.
 */

import "../styles/NotificationsModal.css";

function NotificationsModal({ isOpen, onClose, notifications = [] }) {
  if (!isOpen) return null;

  return (
    <div className="notifications-overlay" onClick={onClose}>
      <div
        className="notifications-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="notifications-header">
          <h3>Notifications</h3>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="notifications-body">
          {notifications.length === 0 ? (
            <div className="no-notifications">
              <span className="no-notif-icon">🔔</span>
              <p>No notifications</p>
            </div>
          ) : (
            <div className="notifications-list">
              {notifications.map((notification) => (
                <div key={notification.id} className="notification-item">
                  <div className="notification-icon">{notification.icon}</div>
                  <div className="notification-content">
                    <h4>{notification.title}</h4>
                    <p>{notification.message}</p>
                    <span className="notification-time">
                      {notification.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationsModal;
