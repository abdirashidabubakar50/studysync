import { viewFile } from "./api";

export const handleViewFile = async (fileUrl) => {
    try {
        console.log("Fetched file URL:", fileUrl);
        
        const token = localStorage.getItem('token'); // Get token from local storage

        if (!token) {
            console.error('Token is missing');
            alert('You must be logged in to view files.');
            return;
        }

        // Call the API service function
        await viewFile(fileUrl, token);
    } catch (error) {
        console.error("Error viewing file:", error);
        alert('Failed to view the file. Please try again.');
    }
};