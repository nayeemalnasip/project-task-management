import React, { useEffect } from 'react';
import { useNotification } from '../context/NotificationContext';
import '../styles/Notification.css';

export default function Notification() {
  const { notifications, removeNotification } = useNotification();

  useEffect(() => {
    const timers = notifications.map(({ id }) =>
      setTimeout(() => removeNotification(id), 4000)
    );
    return () => timers.forEach(timer => clearTimeout(timer));
  }, [notifications, removeNotification]);

  return (
    <div
      className="notification-wrapper"
      role="region"
      aria-live="polite"
      aria-atomic="true"
    >
      {notifications.map(({ id, message, type = 'info' }) => (
        <div
          key={id}
          className={`notification-item notification-${type}`}
          role="alert"
          tabIndex={0}
        >
          <span className="message">{message}</span>
          <button
            className="close-btn"
            aria-label="Dismiss notification"
            onClick={() => removeNotification(id)}
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
}
