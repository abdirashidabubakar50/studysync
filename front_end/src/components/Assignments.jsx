import React, { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import { addAssignmentApi, getAssignmentsApi, deleteAssignmentApi, markAssignmentCompleteApi } from '../services/api';
import { PencilIcon } from 'lucide-react';

const Assignments = () => {
    const [assignments, setAssignments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [newAssignment, setNewAssignment] = useState({
        title: '',
        due_date: '',
        status: 'pending',
    });

    const token = localStorage.getItem('token');
    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const response = await getAssignmentsApi(token);
                setAssignments(response.data.assignments);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching assignments:', error);
                setLoading(false);
            }
        };
        fetchAssignments();
    }, [token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewAssignment({
            ...newAssignment,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await addAssignmentApi(token, newAssignment);
            setAssignments([...assignments, response.data.assignment]);
            setShowModal(false);
            setNewAssignment({ title: '', due_date: '', status: 'pending' });
        } catch (error) {
            console.error('Error adding assignment:', error);
            alert('Failed to create assignment. Please try again.');
        }
    };

    const handleDelete = async (assignmentId) => {
        try {
             await deleteAssignmentApi(token, assignmentId)
            const response = await getAssignmentsApi(token);
            setAssignments(response.data.assignments);
            setLoading(false);
        } catch (error) {
            console.error("error deleting assignment", error)
            alert("failed to delete assignment please try again later")
        }

    }
    const handleMarkComplete = async (assignmentId) => {
        const token = localStorage.getItem('token');

        try {
            // Call the API to mark the assignment as complete
            const response = await markAssignmentCompleteApi(token, assignmentId);
            console.log(response)
            // Update the assignment status in the state
            setAssignments((prevAssignments) =>
                prevAssignments.map((assignment) =>
                    assignment.id === assignmentId
                        ? { ...assignment, status: 'completed' } // Update the status to completed
                        : assignment
                )
            );

        } catch (error) {
            console.error("Error marking assignment as complete:", error);
            alert("Failed to mark assignment as complete. Please try again later.");
        }
    };


    if (loading) {
        return (
            <MainLayout>
                <div className="flex justify-center items-center min-h-screen">
                    <div className="loader"></div>
                    <p className="ml-4 text-gray-600 text-lg">Loading Assignments...</p>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="ml-0 md:ml-64 mt-16 p-6 max-w-full">
                <h1 className="text-2xl font-bold mb-4">Assignments</h1>

                <button
                    onClick={() => setShowModal(true)}
                    className="mb-4 bg-background text-black px-4 py-2 rounded-xl shadow-md hover:bg-primary transition-all"
                >
                   + Add Assignment
                </button>

                {assignments.length === 0 ? (
                    <p className="text-gray-600">You are all caught up.</p>
                ) : (
                    <div className="space-y-4">
                        {assignments.map((assignment) => (
                            <div
                                key={assignment.id}
                                className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white cursor-pointer rounded-lg p-4  transition-all"
                            >
                                <div className="flex-1">
                                    <h3 className="text-lg font-normal text-gray-800">{assignment.title}</h3>
                                    <p className="text-sm text-gray-500">
                                        Due: {assignment.due_date}
                                    </p>
                                </div>
                                <div className="flex items-center mt-2 sm:mt-0 space-x-4">
                                    <span
                                        className={`text-sm font-medium px-3 py-1 rounded ${
                                            assignment.status === 'completed'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                        }`}
                                    >
                                        {assignment.status}
                                    </span>
                                    <button className="text-sm px-3 py-1 rounded hover:bg-blue-600 transition-all">
                                        <PencilIcon className="h-4 w-4"/>
                                    </button>
                                    {assignment.status !== 'completed' && (
                                        <button
                                            className="text-sm bg-blue-500 text-white px-3 py-1 rounded-xl hover:bg-blue-600 transition-all"
                                            onClick={() => handleMarkComplete(assignment.id)}
                                        >
                                            Mark as Complete
                                        </button>
                                    )}
                                    <button
                                        className="text-sm bg-red-500 text-white px-3 py-1 rounded-xl hover:bg-red-600 transition-all"
                                        onClick={() => handleDelete(assignment.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg max-w-sm w-full">
                        <h2 className="text-xl font-bold mb-4">Add Assignment</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={newAssignment.title}
                                    onChange={handleChange}
                                    className="mt-1 p-2 border w-full rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Due Date</label>
                                <input
                                    type="date"
                                    name="due_date"
                                    value={newAssignment.due_date}
                                    onChange={handleChange}
                                    className="mt-1 p-2 border w-full rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Status</label>
                                <select
                                    name="status"
                                    value={newAssignment.status}
                                    onChange={handleChange}
                                    className="mt-1 p-2 border w-full rounded"
                                    required
                                >
                                    <option value="pending">Pending</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                            <div className="flex justify-between">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded shadow-md hover:bg-gray-600 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600 transition-all"
                                >
                                    Add Assignment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </MainLayout>
    );
};

export default Assignments;
