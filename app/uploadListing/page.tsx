"use client";
import { useState } from "react";

export default function UploadListingPage() {
	const [formData, setFormData] = useState({
		title: "",
		bedrooms: "",
		bathrooms: "",
		size: "",
		monthlyRent: "",
		propertyType: "",
		description: "",
		address: "",
		city: "",
		country: "",
		lat: "",
		lng: "",
	});

	const handleInputChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Handle form submission
		console.log(formData);
	};

	return (
		<div className="min-h-screen bg-gray-50 py-8 px-4">
			<div className="max-w-4xl mx-auto">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-semibold text-gray-900 mb-2">
						List Your Property
					</h1>
					<p className="text-gray-600">
						Fill out the details below to list your property on Nomad
					</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Photos & Videos Section */}
					<div className="bg-white rounded-lg p-6 shadow-sm">
						<h2 className="text-lg font-medium text-gray-900 mb-4">
							Photos & Videos
						</h2>
						<div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-400 transition-colors cursor-pointer">
							<div className="flex flex-col items-center">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className="w-12 h-12 text-gray-400 mb-4"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
									/>
								</svg>
								<p className="text-gray-600 mb-1">
									<span className="text-blue-600 hover:underline">
										Click to upload
									</span>{" "}
									or drag and drop
								</p>
								<p className="text-sm text-gray-500">
									PNG, JPG, MP4 up to 50MB
								</p>
							</div>
						</div>
					</div>

					{/* Property Details Section */}
					<div className="bg-white rounded-lg p-6 shadow-sm">
						<h2 className="text-lg font-medium text-gray-900 mb-4">
							Property Details
						</h2>

						<div className="space-y-4">
							{/* Property Title */}
							<div>
								<label
									htmlFor="title"
									className="block text-sm font-medium text-gray-700 mb-1"
								>
									Property Title
								</label>
								<input
									type="text"
									id="title"
									name="title"
									value={formData.title}
									onChange={handleInputChange}
									placeholder="e.g., Modern Downtown Loft"
									className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
								/>
							</div>

							{/* Bedrooms, Bathrooms, Size */}
							<div className="grid grid-cols-3 gap-4">
								<div>
									<label
										htmlFor="bedrooms"
										className="block text-sm font-medium text-gray-700 mb-1"
									>
										Bedrooms
									</label>
									<select
										id="bedrooms"
										name="bedrooms"
										value={formData.bedrooms}
										onChange={handleInputChange}
										className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white"
									>
										<option value="">Select</option>
										<option value="1">1</option>
										<option value="2">2</option>
										<option value="3">3</option>
										<option value="4">4</option>
										<option value="5">5+</option>
									</select>
								</div>

								<div>
									<label
										htmlFor="bathrooms"
										className="block text-sm font-medium text-gray-700 mb-1"
									>
										Bathrooms
									</label>
									<select
										id="bathrooms"
										name="bathrooms"
										value={formData.bathrooms}
										onChange={handleInputChange}
										className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white"
									>
										<option value="">Select</option>
										<option value="1">1</option>
										<option value="1.5">1.5</option>
										<option value="2">2</option>
										<option value="2.5">2.5</option>
										<option value="3">3+</option>
									</select>
								</div>

								<div>
									<label
										htmlFor="size"
										className="block text-sm font-medium text-gray-700 mb-1"
									>
										Size (m²)
									</label>
									<input
										type="text"
										id="size"
										name="size"
										value={formData.size}
										onChange={handleInputChange}
										placeholder="e.g., 85"
										className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
									/>
								</div>
							</div>

							{/* Monthly Rent and Property Type */}
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label
										htmlFor="monthlyRent"
										className="block text-sm font-medium text-gray-700 mb-1"
									>
										Monthly Rent ($)
									</label>
									<input
										type="text"
										id="monthlyRent"
										name="monthlyRent"
										value={formData.monthlyRent}
										onChange={handleInputChange}
										placeholder="e.g., 2500"
										className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
									/>
								</div>

								<div>
									<label
										htmlFor="propertyType"
										className="block text-sm font-medium text-gray-700 mb-1"
									>
										Property Type
									</label>
									<select
										id="propertyType"
										name="propertyType"
										value={formData.propertyType}
										onChange={handleInputChange}
										className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white"
									>
										<option value="">Select type</option>
										<option value="apartment">Apartment</option>
										<option value="house">House</option>
										<option value="condo">Condo</option>
										<option value="studio">Studio</option>
										<option value="loft">Loft</option>
									</select>
								</div>
							</div>

							{/* Description */}
							<div>
								<label
									htmlFor="description"
									className="block text-sm font-medium text-gray-700 mb-1"
								>
									Description
								</label>
								<textarea
									id="description"
									name="description"
									value={formData.description}
									onChange={handleInputChange}
									placeholder="Describe your property, amenities, nearby attractions, etc."
									rows={4}
									className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
								/>
							</div>
						</div>
					</div>

					{/* Location Section */}
					<div className="bg-white rounded-lg p-6 shadow-sm">
						<h2 className="text-lg font-medium text-gray-900 mb-4">
							Location
						</h2>

						<div className="space-y-4">
							{/* Address */}
							<div>
								<label
									htmlFor="address"
									className="block text-sm font-medium text-gray-700 mb-1"
								>
									Address
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 20 20"
											fill="currentColor"
											className="w-5 h-5 text-gray-400"
										>
											<path
												fillRule="evenodd"
												d="m9.69 18.933.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 1 0 3 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 0 0 2.273 1.765 11.842 11.842 0 0 0 .976.544l.062.029.018.008.006.003ZM10 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z"
												clipRule="evenodd"
											/>
										</svg>
									</div>
									<input
										type="text"
										id="address"
										name="address"
										value={formData.address}
										onChange={handleInputChange}
										placeholder="Enter street address, city, country"
										className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
									/>
								</div>
							</div>

							{/* City and Country */}
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label
										htmlFor="city"
										className="block text-sm font-medium text-gray-700 mb-1"
									>
										City
									</label>
									<input
										type="text"
										id="city"
										name="city"
										value={formData.city}
										onChange={handleInputChange}
										placeholder="e.g., London"
										className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
									/>
								</div>

								<div>
									<label
										htmlFor="country"
										className="block text-sm font-medium text-gray-700 mb-1"
									>
										Country
									</label>
									<input
										type="text"
										id="country"
										name="country"
										value={formData.country}
										onChange={handleInputChange}
										placeholder="e.g., United Kingdom"
										className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
									/>
								</div>
							</div>

							{/* Map placeholder */}
							<div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden">
								<div className="absolute inset-0 flex items-center justify-center">
									<div className="text-center">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 20 20"
											fill="currentColor"
											className="w-8 h-8 text-gray-400 mx-auto mb-2"
										>
											<path
												fillRule="evenodd"
												d="m9.69 18.933.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 1 0 3 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 0 0 2.273 1.765 11.842 11.842 0 0 0 .976.544l.062.029.018.008.006.003ZM10 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z"
												clipRule="evenodd"
											/>
										</svg>
										<p className="text-sm text-gray-500">Map preview</p>
									</div>
								</div>
								{/* Coordinates display */}
								<div className="absolute bottom-4 right-4 bg-white px-3 py-2 rounded-md shadow-sm text-xs text-gray-600">
									<div>Lat: 51.5050</div>
									<div>Lng: -0.0900</div>
								</div>
							</div>
						</div>
					</div>

					{/* Submit Button */}
					<div className="flex justify-end">
						<button
							type="submit"
							className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
						>
							List Property
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
