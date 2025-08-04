import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

// ✅ Connect to backend socket
const socket = io('http://localhost:5000');

function Notification() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Backend se booking notification listen karein
    socket.on('bookingNotification', (data) => {
      console.log("📩 New Notification:", data);
      setNotifications((prev) => [data, ...prev]);
    });

    // Cleanup
    return () => socket.off('bookingNotification');
  }, []);

  return (
    <div className="mt-4">
      <h5>Live Notifications</h5>
      {notifications.length > 0 ? (
        <ul className="list-group">
          {notifications.map((notif, index) => (
            <li key={index} className="list-group-item">
              <strong>{notif.type}:</strong> {notif.message}
            </li>
          ))}
        </ul>
      ) : (
        <p>No new notifications yet.</p>
      )}
    </div>
  );
}

export default Notification;
