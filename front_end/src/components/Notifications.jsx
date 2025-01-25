import { useEffect, useState } from "react";
import { markNotificationsReadApi, UnreadNotificationsApi } from "../services/api";

const Notifications = ({ visible, onClose }) => {
    const [notifications, setNotifications] = useState([]);

    const fetchUnreadNotifications = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token not found in local storage");
            return;
        }

        try {
            const response = await UnreadNotificationsApi(token);
            setNotifications(response.data);
        } catch (error) {
            console.error("Failed to fetch unread notifications:", error);
        }
    };

    const markNotificationAsRead = async (notificationId) => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token not found");
            return;
        }

        try {
            await markNotificationsReadApi(token, notificationId);
            setNotifications((prev) =>
                prev.filter((notification) => notification.id !== notificationId)
            );
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    };

    useEffect(() => {
        if (visible) fetchUnreadNotifications();
    }, [visible]);

    if (!visible) return null;

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            onClick={onClose} // Close modal on overlay click
        >
            <div
                className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 relative"
                onClick={(e) => e.stopPropagation()} // Prevent overlay click from closing the modal
            >
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                >
                    ✖
                </button>
                <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">
                    Notifications
                </h3>
                {notifications.length === 0 ? (
                    <p className="text-center text-gray-500">No unread notifications</p>
                ) : (
                    <ul className="space-y-4">
                        {notifications.map((notification) => (
                            <li
                                key={notification.id}
                                className={`p-4 rounded-lg shadow-md cursor-pointer transition-transform transform hover:scale-105 ${
                                    notification.type === "info"
                                        ? "bg-blue-50 border-l-4 border-blue-400"
                                        : "bg-yellow-50 border-l-4 border-yellow-400"
                                }`}
                                onClick={() => markNotificationAsRead(notification.id)}
                            >
                                <p className="font-semibold text-gray-800">{notification.message}</p>
                                <p className="text-sm text-gray-500">
                                    {new Date(notification.created_at).toLocaleString()}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Notifications;
