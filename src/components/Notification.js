import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Info, AlertTriangle } from "lucide-react";
import { useNotification } from "../context/NotificationContext";
import "../styles/Notification.css";

export default function Notification() {
  const { notifications, removeNotification } = useNotification();

  useEffect(() => {
    const timers = notifications.map(({ id }) =>
      setTimeout(() => removeNotification(id), 3500)
    );
    return () => timers.forEach(timer => clearTimeout(timer));
  }, [notifications, removeNotification]);

  const icons = {
    success: <CheckCircle className="icon" />,
    error: <XCircle className="icon" />,
    info: <Info className="icon" />,
    warning: <AlertTriangle className="icon" />,
  };

  return (
    <div className="notification-wrapper top-right" role="region" aria-live="polite" aria-atomic="true">
      <AnimatePresence>
        {notifications.map(({ id, message, type = "info" }) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
            className={`notification-item notification-${type}`}
            role="alert"
            tabIndex={0}
          >
            {icons[type]}
            <span className="message">{message}</span>
            <div className="progress-bar" />
            <button className="close-btn" onClick={() => removeNotification(id)}>
              &times;
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
