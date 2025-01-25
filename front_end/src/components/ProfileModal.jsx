import React, { useState } from "react";
import { updateProfileApi } from "../services/api";

const ProfileModal = ({ visible, onClose, userData, loading }) => {
    const [formData, setFormData] = useState({
        username: userData?.username || "",
        email: userData?.email || "",
    });
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    if (!visible) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        const token = localStorage.getItem("token");
        if (!token) {
            setError("Authenticatin token not found");
            return;
        }

        try {
            const response = await updateProfileApi(token, formData);
            setSuccessMessage(response.data.message)
            onClose();
        } catch (error) {
            setError(
                error.response?.data?.message || "Failed to update profile"
            );
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                    onClick={onClose}
                >
                    ✖
                </button>
                <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">
                    Profile Details
                </h3>
                {loading ? (
                    <p className="text-center text-gray-500">Loading...</p>
                ) : (
                    <form onSubmit={handleFormSubmit}>
                        <div className="mb-4">
                            <label
                                className="block text-gray-700 font-semibold mb-2"
                                htmlFor="username"
                            >
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div className="mb-4">
                            <label
                                className="block text-gray-700 font-semibold mb-2"
                                htmlFor="email"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                        >
                            Update Profile
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ProfileModal;
