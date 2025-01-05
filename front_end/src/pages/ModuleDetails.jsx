import React, {useEffect, useState} from 'react';
import SideBar from '../components/SideBar';
import RightNavBar from '../components/RightNavBar';
import { useNavigate } from 'react-router-dom';
import { CourseDetailsApi, AddMaterialApi, viewFile, updateMaterialApi, markModuleComplete } from '../services/api';
import { useParams } from 'react-router-dom';
import ReactMarkdown from "react-markdown";
import { PencilIcon } from 'lucide-react';
import { FaCheckDouble } from "react-icons/fa6";
import { formatTextToMarkdown } from '../services/ToMarkDown';
import { handleViewFile } from '../services/ViewFIle';
import MainLayout from '../layouts/MainLayout';


const ModuleDetails = () => {
	const { courseId, moduleId } = useParams();
	const selectedModuleId = moduleId
	const [CourseDetails, setCourseDetails] = useState(null);
	const [selectedModule, setSelectedModule] = useState(null);
	const [newMaterials, setNewMaterials] = useState({type: '', title: '', content: '', file: null });
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [editingMaterial, setEditingMaterial] = useState(null);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [expandedMaterialId, setExpandedMaterialId] = useState(null);
	const navigate = useNavigate();

	const fetchCourseDetails = async () => {
		try {
			const token = localStorage.getItem('token');
			const response = await CourseDetailsApi(token, courseId);
			const { course, modules } = response.data
			console.log("API response:", response.data);
			
			const formattedModules = modules?.map((module) => ({
				...module,
				materials: module.materials || [],
			}));

			const selected = formattedModules.find((module) => module.id === moduleId);


			setCourseDetails({
				...course,
				modules: formattedModules || [],
			});
			setSelectedModule(selected || null)
			console.log()
		} catch (error) {
			console.error("Error fetching course details", error)
		}
	};

	useEffect(() => {
		fetchCourseDetails();
	}, [courseId]);

	const handleAddMaterial = async () => {
		try {
			const token = localStorage.getItem('token')
			const formData = new FormData();
			formData.append('type', newMaterials.type);
			formData.append('title', newMaterials.title);
			if (newMaterials.type === 'note') {
				const formattedContent = formatTextToMarkdown(newMaterials.content);
				formData.append('content', formattedContent);
			} else if (newMaterials.type === 'file') {
				formData.append('file', newMaterials.file);
			}
			for (let pair of formData.entries()) {
				console.log(`${pair[0]}: ${pair[1]}`);
			}

			const response = await AddMaterialApi(token, courseId, selectedModule.id, formData);

			const updatedModules = CourseDetails.modules.map((module) =>
				module.id === selectedModule.id
					? { ...module, materials: [...module.materials, response.data] }
					: module
			);
			const updatedSelected = updatedModules.find(
                (module) => module.id === moduleId
            );

			setCourseDetails((prev) => ({
				...prev,
				modules: updatedModules,
			}));
			setIsFormOpen(false)
			setNewMaterials({ type: '', title: '', content: '', file: null });
		} catch (error) {
			console.error("Error adding material", error.response?.data || error.message);
    		console.log("Error details:", error.config);
		}
	};
	const handleEditMaterial = (material) => {
		setEditingMaterial({
			id: material.id,
			title: material.title,
			type: material.type,
			content: material.content,
			file: material.file
		});
		setIsEditModalOpen(true);
	};

	const handleSaveMaterial = async () => {
		try {
			const token = localStorage.getItem('token');
			const formData = new FormData();
			formData.append('title', editingMaterial.title);
			formData.append('type', editingMaterial.type);

			if (editingMaterial.type === 'note') {
				const formattedContent = formatTextToMarkdown(editingMaterial.content);
				formData.append('content', formattedContent);
			} else if (editingMaterial.type === 'file' && editingMaterial.file) {
				formData.append('file', editingMaterial.file);
			}

			console.log('Saving edited material:', editingMaterial);

			const response = await updateMaterialApi(token, courseId, selectedModule.id, editingMaterial.id, formData);

			// Update the material in the state
			const updatedModules = CourseDetails.modules.map((module) =>
				module.id === selectedModule.id
					? {
						...module,
						materials: module.materials.map((mat) =>
							mat.id === editingMaterial.id ? response.data : mat
						),
					}
					: module
			);

			setCourseDetails((prev) => ({
				...prev,
				modules: updatedModules,
			}));

			setIsEditModalOpen(false);
			setEditingMaterial(null);
		} catch (error) {
			console.error('Error saving material', error.response?.data || error.message);
		}
	};

	const toggleMaterial = (materialId) => {
        setExpandedMaterialId((prev) => (prev === materialId ? null : materialId));
	};
	const handleModuleComplete = async (moduleId) => {
		try {
			console.log('Fetched module Id', moduleId)
			const token = localStorage.getItem('token')
			console.log(token)
			const response = await markModuleComplete(token, courseId, moduleId);

			alert(response.data.message);

		} catch (error) {
			console.error('Error marking module complete:', error);
        	alert(error.response?.data?.error || 'Failed to mark module as completed.');
		}
	}


	return (
		<MainLayout>
			<div className="ml-0 md:ml-64 mt-16 p-6 max-w-full">
                <div className="flex-1 p-6">
                    <div className="mt-6">
                        {selectedModule ? (
                            <div>
                                <h2 className="text-xl font-bold">{selectedModule.title}</h2>
                                <p className="text-gray-600">{selectedModule.description}</p>

                                <h3 className="text-lg font-semibold mt-4">Topics:</h3>
                                <ul className="list-disc list-inside mt-2">
                                    {selectedModule.materials.map((material) => (
                                        <div key={material.id} className="mb-4">
                                            <div
                                                className="cursor-pointer p-4  text-black rounded-xl py-4 flex justify-between items-center"
                                                onClick={() => toggleMaterial(material.id)}
                                            >
                                                <span className='hover:text-blue-600'>
                                                    {material.title} ({material.type})
                                                </span>
                                                <button>
                                                    {expandedMaterialId === material.id ? "Collapse" : "Expand"}
                                                </button>
                                            </div>
                                            {expandedMaterialId === material.id && (
                                                <div className="ml-8 mt-2">
                                                    {material.type === "note" ? (
                                                        <ReactMarkdown className="prose max-w-none">
                                                            {material.content}
                                                        </ReactMarkdown>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleViewFile(material.file_url)}
                                                            className="text-blue-500 underline"
                                                        >
																{material.file_url}
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleEditMaterial(material)}
                                                        className="p-2 mt-2 items-center ml-2"
                                                    >
                                                       <PencilIcon className="h-4 w-4" /> Edit
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
								</ul>
								<div className='flex justify-between'>
									<button
										className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
										onClick={() => setIsFormOpen(true)}
									>
										Add Material
									</button>
									<button
										className="mt-4 ml-4 px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
										onClick={() => navigate(-1)}
									>
										Back to Modules
									</button>
									<button
										className='bg-green-500 rounded-lg py-1 flex items-center'
										onClick={() => handleModuleComplete(selectedModule.id)}
									>
										<FaCheckDouble /> Mark Completed
									</button>
								</div>
                                
                            </div>
                        ) : (
                            <p>No module details available or loading...</p>
                        )}
                    </div>
                </div>

                {isFormOpen && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg w-96">
                            <h2 className="text-xl font-bold mb-4">Add Material</h2>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleAddMaterial();
                                }}
                            >
                                <div className="mb-4">
                                    <label className="block font-bold mb-2">Title</label>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 p-2 rounded"
                                        value={newMaterials.title}
                                        onChange={(e) =>
                                            setNewMaterials({
                                                ...newMaterials,
                                                title: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block font-bold mb-2">Type</label>
                                    <select
                                        className="w-full border border-gray-300 p-2 rounded"
                                        value={newMaterials.type}
                                        onChange={(e) =>
                                            setNewMaterials({
                                                ...newMaterials,
                                                type: e.target.value,
                                            })
                                        }
                                        required
                                    >
                                        <option value="">Select Type</option>
                                        <option value="note">Note</option>
                                        <option value="file">File</option>
                                    </select>
                                </div>

                                {newMaterials.type === "note" && (
                                    <div className="mb-4">
										<label className="block font-bold mb-2">Content</label>
										<p className="text-sm text-gray-600 mb-2">
                                            Your text will be automatically formatted. We recommend typing/pasting markdown content,
                                            lists (1. or - ), and emphasis (*bold* or _italic_).
                                        </p>
                                        <textarea
                                            className="w-full border border-gray-300 p-2 rounded"
                                            rows="4"
                                            value={newMaterials.content}
                                            onChange={(e) =>
                                                setNewMaterials({
                                                    ...newMaterials,
                                                    content: e.target.value,
                                                })
                                            }
                                            required
                                        ></textarea>
                                    </div>
                                )}

                                {newMaterials.type === "file" && (
                                    <div className="mb-4">
                                        <label className="block font-bold mb-2">File</label>
                                        <input
                                            type="file"
                                            className="w-full border border-gray-300 p-2 rounded"
                                            onChange={(e) =>
                                                setNewMaterials({
                                                    ...newMaterials,
                                                    file: e.target.files[0],
                                                })
                                            }
                                            required
                                        />
                                    </div>
                                )}

                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        className="mr-4 px-4 py-2 bg-gray-300 rounded"
                                        onClick={() => setIsFormOpen(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-500 text-white rounded"
                                    >
                                        Add
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
				)}
				{isEditModalOpen && (
					<div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
						<div className="bg-white p-6 rounded-lg w-96">
							<h2 className="text-xl font-bold mb-4">Edit Material</h2>
							<form
								onSubmit={(e) => {
									e.preventDefault();
									handleSaveMaterial();
								}}
							>
								<div className="mb-4">
									<label className="block font-bold mb-2">Title</label>
									<input
										type="text"
										className="w-full border border-gray-300 p-2 rounded"
										value={editingMaterial.title}
										onChange={(e) =>
											setEditingMaterial({ ...editingMaterial, title: e.target.value })
										}
										required
									/>
								</div>

								<div className="mb-4">
									<label className="block font-bold mb-2">Type</label>
									<select
										className="w-full border border-gray-300 p-2 rounded"
										value={editingMaterial.type}
										onChange={(e) =>
											setEditingMaterial({ ...editingMaterial, type: e.target.value })
										}
										required
									>
										<option value="note">Note</option>
										<option value="file">File</option>
									</select>
								</div>

								{editingMaterial.type === 'note' && (
									<div className="mb-4">
										<label className="block font-bold mb-2">Content</label>
										<textarea
											className="w-full border border-gray-300 p-2 rounded"
											rows="4"
											value={editingMaterial.content}
											onChange={(e) =>
												setEditingMaterial({ ...editingMaterial, content: e.target.value })
											}
										></textarea>
									</div>
								)}

								{editingMaterial.type === 'file' && (
									<div className="mb-4">
										<label className="block font-bold mb-2">File</label>
										<input
											type="file"
											className="w-full border border-gray-300 p-2 rounded"
											onChange={(e) =>
												setEditingMaterial({
													...editingMaterial,
													file: e.target.files[0],
												})
											}
										/>
									</div>
								)}

								<div className="flex justify-end">
									<button
										type="button"
										className="mr-4 px-4 py-2 bg-gray-300 rounded"
										onClick={() => setIsEditModalOpen(false)}
									>
										Cancel
									</button>
									<button
										type="submit"
										className="px-4 py-2 bg-blue-500 text-white rounded"
									>
										Save
									</button>
								</div>
							</form>
						</div>
					</div>
				)}

            </div>
		</MainLayout>
  )
}

export default ModuleDetails
