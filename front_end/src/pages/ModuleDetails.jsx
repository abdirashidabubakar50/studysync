import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { CourseDetailsApi, AddMaterialApi, updateMaterialApi, markModuleComplete } from '../services/api';
import { useParams } from 'react-router-dom';
import ReactMarkdown from "react-markdown";
import { PencilIcon } from 'lucide-react';
import { FaCheckDouble } from "react-icons/fa6";
import { formatTextToMarkdown } from '../services/ToMarkDown';
import { handleViewFile } from '../services/ViewFile';
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
	const [isCompleting, setIsCompleting] = useState(false);
	const [isCompleted, setIsCompleted] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchCourseDetails = async () => {
			try {
				const token = localStorage.getItem('token');
				const response = await CourseDetailsApi(token, courseId);
				console.log('API Response:', response);

				const { course, modules } = response.data || {};
				console.log('Course:', course);
				console.log('Modules:', modules);

				const formattedModules = modules?.map((module) => ({
					...module,
					materials: module.materials || [],
				}));

				console.log('Formatted Modules:', formattedModules);

				const selected = formattedModules?.find((module) => module.id === moduleId);
				console.log('Selected Module:', selected);

				setCourseDetails({
					...course,
					modules: formattedModules || [],
				});
				setSelectedModule(selected || null);
			} catch (error) {
				console.error('Error fetching course details', error);
			}
		};
		fetchCourseDetails();
	}, [courseId, moduleId]);


	const handleAddMaterial = async () => {
		try {
			const token = localStorage.getItem('token');
			const formData = new FormData();

			formData.append('type', newMaterials.type);
			formData.append('title', newMaterials.title);

			if (newMaterials.type === 'note') {
				const formattedContent = formatTextToMarkdown(newMaterials.content);
				formData.append('content', formattedContent);
			} else if (newMaterials.type === 'file') {
				formData.append('file', newMaterials.file);
			}

			// Log FormData entries for debugging
			console.log('FormData Entries:');
			for (let pair of formData.entries()) {
				console.log(`${pair[0]}: ${pair[1]}`);
			}

			const response = await AddMaterialApi(token, courseId, selectedModule.id, formData);

			// Log the full API response for debugging
			console.log('Full API Response:', response);

			if (response.data && response.data.id) {
				console.log('Material created with ID:', response.data.id);

				setCourseDetails((prev) => {
					const updatedModules = prev.modules.map((module) => {
						if (module.id === selectedModule.id) {
							return {
								...module,
								materials: [...module.materials, response.data], // Append the full material response
							};
						}
						return module;
					});

					return {
						...prev,
						modules: updatedModules,
					};
				});

				// Clear the form and close it
				setNewMaterials({ type: '', title: '', content: '', file: null });
				setIsFormOpen(false);
			} else {
				console.error('API Response does not contain material ID.');
				alert('Failed to add material: No ID returned');
			}

		} catch (error) {
			console.error('Error adding material:', error.response?.data || error.message);
			alert('Failed to add material: ' + error.message);
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
			setIsCompleting(true); // Show the loader
			const token = localStorage.getItem('token');
			const response = await markModuleComplete(token, courseId, moduleId);

			console.log(token)

			setIsCompleted(true); // Mark as completed
			setTimeout(() => setIsCompleted(false), 3000); // Revert after 3 seconds
			alert(response.data.message);
		} catch (error) {
			console.error('Error marking module complete:', error);
			alert(error.response?.data?.error || 'Failed to mark module as completed.');
		} finally {
			setIsCompleting(false); // Hide the loader
		}
	};


	return (
		<MainLayout>
			<div className="ml-0 md:ml-64 mt-16 p-6 min-h-screen">
                <div className="flex-1 p-6">
                    <div className="mt-6">
                        {selectedModule ? (
                            <div>
                                <h2 className="text-xl font-bold">{selectedModule.title}</h2>
                                <p className="text-gray-600">{selectedModule.description}</p>

                                <h3 className="text-lg font-semibold mt-4">Topics:</h3>
                                <ul className="list-disc list-inside mt-2">
									{selectedModule.materials.map((material) => {
										console.log(material.id);
										return (
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
										)
									})}
								</ul>
								<div className="flex justify-between items-center mt-8 space-x-4">
									<button
										className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg shadow hover:bg-blue-600 transition-colors duration-200"
										onClick={() => setIsFormOpen(true)}
									>
										Add Material
									</button>
									<button
										className="px-6 py-3 bg-gray-300 text-black font-medium rounded-lg shadow hover:bg-gray-400 transition-colors duration-200"
										onClick={() => navigate(-1)}
									>
										Back to Modules
									</button>
									<button
										className={`px-6 py-3 rounded-lg font-medium flex items-center shadow transition-colors duration-200 ${
											isCompleted
												? 'bg-green-600 text-white cursor-default'
												: isCompleting
												? 'bg-blue-500 text-white'
												: 'bg-gray-300 text-black hover:bg-gray-400'
										}`}
										onClick={() => {
											if (!isCompleted && !isCompleting) {
												handleModuleComplete(selectedModule.id);
												setIsCompleted(true); // Persist completion state locally
											}
										}}
										disabled={isCompleting}
									>
										{isCompleting ? (
											<div className="flex items-center">
												<svg
													className="animate-spin h-5 w-5 mr-2 text-white"
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
												>
													<circle
														className="opacity-25"
														cx="12"
														cy="12"
														r="10"
														stroke="currentColor"
														strokeWidth="4"
													></circle>
													<path
														className="opacity-75"
														fill="currentColor"
														d="M4 12a8 8 0 018-8v8z"
													></path>
												</svg>
												Processing...
											</div>
										) : isCompleted ? (
											<div className="flex items-center">
												<FaCheckDouble className="mr-2" /> Completed!
											</div>
										) : (
											<div className="flex items-center">
												<FaCheckDouble className="mr-2" /> Mark Complete
											</div>
										)}
									</button>
								</div>
                                
                            </div>
                        ) : (
                            <div className="flex justify-center items-center min-h-screen">
								<div className="loader"></div>
								<p className="ml-4 text-gray-600 text-lg">Loading Module details...</p>
							</div>
                        )}
                    </div>
                </div>

                {isFormOpen && (
					<div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
						<div className="bg-white p-6 rounded-lg w-full max-w-2xl shadow-lg">
							<h2 className="text-2xl font-bold mb-6">Add Material</h2>
							<form
								onSubmit={(e) => {
									e.preventDefault();
									handleAddMaterial();
								}}
							>
								<div className="mb-6">
									<label className="block text-lg font-semibold mb-2">Title</label>
									<input
										type="text"
										className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-blue-200"
										value={newMaterials.title}
										onChange={(e) =>
											setNewMaterials({
												...newMaterials,
												title: e.target.value,
											})
										}
										placeholder="Enter material title"
										required
									/>
								</div>

								<div className="mb-6">
									<label className="block text-lg font-semibold mb-2">Type</label>
									<select
										className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-blue-200"
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
									<div className="mb-6">
										<label className="block text-lg font-semibold mb-2">Content</label>
										<div className="relative border border-gray-300 rounded-lg overflow-hidden focus-within:ring focus-within:ring-blue-200">
											<div className="flex items-center bg-gray-100 p-2">
												<button
													type="button"
													className="p-1 mx-1 text-gray-600 hover:text-black"
													title="Bold"
													onClick={() => {
														setNewMaterials((prev) => ({
															...prev,
															content: `${prev.content}**bold**`,
														}));
													}}
												>
													<strong>B</strong>
												</button>
												<button
													type="button"
													className="p-1 mx-1 text-gray-600 hover:text-black"
													title="Italic"
													onClick={() => {
														setNewMaterials((prev) => ({
															...prev,
															content: `${prev.content}_italic_`,
														}));
													}}
												>
													<em>I</em>
												</button>
												<button
													type="button"
													className="p-1 mx-1 text-gray-600 hover:text-black"
													title="List"
													onClick={() => {
														setNewMaterials((prev) => ({
															...prev,
															content: `${prev.content}- List Item\n`,
														}));
													}}
												>
													• List
												</button>
											</div>
											<textarea
												className="w-full p-3 rounded-lg resize-y focus:outline-none focus:ring"
												rows="6"
												value={newMaterials.content}
												onChange={(e) =>
													setNewMaterials({
														...newMaterials,
														content: e.target.value,
													})
												}
												placeholder="Type your notes here..."
												required
											/>
										</div>
									</div>
								)}

								<div className="flex justify-end space-x-4">
									<button
										type="button"
										className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
										onClick={() => setIsFormOpen(false)}
									>
										Cancel
									</button>
									<button
										type="submit"
										className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
									>
										Save Material
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
