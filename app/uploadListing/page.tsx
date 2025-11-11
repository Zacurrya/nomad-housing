"use client";
import { useState, useRef, useEffect } from "react";
import { useAuthUI } from "@/components/context/AuthUIContext";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function UploadListingPage() {
	const { userId, isAuthenticated, openLogin } = useAuthUI();
	const router = useRouter();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const addressInputRef = useRef<HTMLInputElement>(null);
	const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
	
	const [formData, setFormData] = useState({
		title: "",
		bedrooms: "",
		bathrooms: "",
		size: "",
		monthlyRent: "",
		propertyType: "",
		description: "",
		address: "",
		district: "",
		city: "",
		country: "",
	});

	const [images, setImages] = useState<string[]>([]);
	const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
	const [isDragging, setIsDragging] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>({
		lat: 51.5050,
		lng: -0.0900,
	});
	const [isMapLoaded, setIsMapLoaded] = useState(false);

	const availableAmenities = [
		"Shared gym",
		"Shared pool",
		"Furnished",
		"Washer/Dryer",
		"Air conditioning",
		"Parking",
		"Wifi",
		"Kitchen",
		"Balcony",
		"Pet friendly",
	];

	// Load Google Maps script
	useEffect(() => {
		const loadGoogleMapsScript = () => {
			if (typeof window !== "undefined" && !window.google) {
				const script = document.createElement("script");
				script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
				script.async = true;
				script.defer = true;
				script.onload = () => setIsMapLoaded(true);
				document.head.appendChild(script);
			} else if (window.google) {
				setIsMapLoaded(true);
			}
		};

		loadGoogleMapsScript();
	}, []);

	// Initialize autocomplete when Google Maps is loaded
	useEffect(() => {
		if (!isMapLoaded || !addressInputRef.current) return;

		const autocomplete = new google.maps.places.Autocomplete(
			addressInputRef.current,
			{
				types: ["address"],
				fields: ["address_components", "geometry", "formatted_address"],
			}
		);

		autocomplete.addListener("place_changed", () => {
			const place = autocomplete.getPlace();

			if (!place.geometry || !place.geometry.location) {
				return;
			}

			// Update coordinates
			const lat = place.geometry.location.lat();
			const lng = place.geometry.location.lng();
			setCoordinates({ lat, lng });

			// Parse address components
			let city = "";
			let district = "";
			let country = "";
			let postalCode = "";
			let borough = "";
			const fullAddress = place.formatted_address || "";

			place.address_components?.forEach((component: google.maps.GeocoderAddressComponent) => {
				const types = component.types;

				if (types.includes("locality")) {
					city = component.long_name;
				} else if (types.includes("postal_town") && !city) {
					// UK postal towns
					city = component.long_name;
				} else if (types.includes("sublocality") || types.includes("sublocality_level_1") || types.includes("neighborhood")) {
					district = component.long_name;
				} else if (types.includes("administrative_area_level_3") && !district) {
					// Fallback for district
					district = component.long_name;
				} else if (types.includes("administrative_area_level_2")) {
					// Borough/County level (e.g., Tower Hamlets in London)
					if (!city) {
						city = component.long_name;
					} else {
						borough = component.long_name;
					}
				} else if (types.includes("postal_code")) {
					postalCode = component.long_name;
				} else if (types.includes("country")) {
					country = component.long_name;
				}
			});

			// If no district found, use borough, then postal code as fallback
			if (!district && borough) {
				district = borough;
			} else if (!district && postalCode) {
				district = postalCode;
			}

			// Update form data - always set the values from autocomplete
			setFormData((prev) => ({
				...prev,
				address: fullAddress,
				city: city,
				district: district,
				country: country,
			}));
		});

		autocompleteRef.current = autocomplete;
	}, [isMapLoaded]);

	// Geocode address when manually edited
	useEffect(() => {
		if (!isMapLoaded || !window.google) return;

		const geocodeAddress = async () => {
			const geocoder = new google.maps.Geocoder();
			const addressString = [
				formData.address,
				formData.city,
				formData.district,
				formData.country
			].filter(Boolean).join(', ');

			if (!addressString.trim()) return;

			try {
				const result = await geocoder.geocode({ address: addressString });
				if (result.results[0]?.geometry?.location) {
					const lat = result.results[0].geometry.location.lat();
					const lng = result.results[0].geometry.location.lng();
					setCoordinates({ lat, lng });

					// Parse address components to update city and district
					const addressComponents = result.results[0].address_components;
					let city = "";
					let district = "";
					let country = "";
					let postalCode = "";
					let borough = "";

					addressComponents?.forEach((component: google.maps.GeocoderAddressComponent) => {
						const types = component.types;

						if (types.includes("locality")) {
							city = component.long_name;
						} else if (types.includes("postal_town") && !city) {
							// UK postal towns
							city = component.long_name;
						} else if (types.includes("sublocality") || types.includes("sublocality_level_1") || types.includes("neighborhood")) {
							district = component.long_name;
						} else if (types.includes("administrative_area_level_3") && !district) {
							district = component.long_name;
						} else if (types.includes("administrative_area_level_2")) {
							// Borough/County level (e.g., Tower Hamlets in London)
							if (!city) {
								city = component.long_name;
							} else {
								borough = component.long_name;
							}
						} else if (types.includes("postal_code")) {
							postalCode = component.long_name;
						} else if (types.includes("country")) {
							country = component.long_name;
						}
					});

					// Use borough if no district, then postal code as fallback
					if (!district && borough) {
						district = borough;
					} else if (!district && postalCode) {
						district = postalCode;
					}

					// Update form data with parsed components
					setFormData((prev) => ({
						...prev,
						city: city || prev.city,
						district: district || prev.district,
						country: country || prev.country,
					}));
				}
			} catch (error) {
				console.error("Geocoding error:", error);
			}
		};

		// Debounce the geocoding request
		const timeoutId = setTimeout(geocodeAddress, 1000);
		return () => clearTimeout(timeoutId);
	}, [formData.address, formData.city, formData.district, formData.country, isMapLoaded]);

	const handleInputChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleAmenityToggle = (amenity: string) => {
		setSelectedAmenities((prev) =>
			prev.includes(amenity)
				? prev.filter((a) => a !== amenity)
				: [...prev, amenity]
		);
	};

	const handleFileSelect = async (files: FileList | null) => {
		if (!files) return;

		const fileArray = Array.from(files);
		const imageFiles = fileArray.filter((file) =>
			file.type.startsWith("image/")
		);

		// Convert files to base64 data URLs for preview
		const imagePromises = imageFiles.map((file) => {
			return new Promise<string>((resolve) => {
				const reader = new FileReader();
				reader.onloadend = () => resolve(reader.result as string);
				reader.readAsDataURL(file);
			});
		});

		const imageDataUrls = await Promise.all(imagePromises);
		setImages((prev) => [...prev, ...imageDataUrls]);
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = () => {
		setIsDragging(false);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
		handleFileSelect(e.dataTransfer.files);
	};

	const handleRemoveImage = (index: number) => {
		setImages((prev) => prev.filter((_, i) => i !== index));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!isAuthenticated || !userId) {
			openLogin("upload");
			return;
		}

		if (images.length === 0) {
			alert("Please add at least one image");
			return;
		}

		setIsSubmitting(true);

		try {
			const response = await fetch("/api/upload-listing", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					userId,
					title: formData.title,
					description: formData.description,
					beds: parseInt(formData.bedrooms),
					baths: parseFloat(formData.bathrooms),
					area: formData.size ? parseInt(formData.size) : null,
					rentalPrice: parseInt(formData.monthlyRent),
					address: formData.address,
					district: formData.district,
					city: formData.city,
					country: formData.country,
					images,
					amenities: selectedAmenities,
				}),
			});

			const data = await response.json();

			if (response.ok) {
				alert("Listing created successfully!");
				router.push(`/listing/${data.listingId}`);
			} else {
				alert(`Error: ${data.error}`);
			}
		} catch (error) {
			console.error("Error submitting listing:", error);
			alert("Failed to create listing. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
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

				<form 
					onSubmit={handleSubmit} 
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							e.preventDefault();
						}
					}}
					className="space-y-6"
				>
					{/* Photos & Videos Section */}
					<div className="bg-white rounded-lg p-6 shadow-sm">
						<h2 className="text-lg font-medium text-gray-900 mb-4">
							Photos & Videos
						</h2>
						<div 
							className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer ${
								isDragging 
									? 'border-blue-500 bg-blue-50' 
									: 'border-gray-300 hover:border-blue-400'
							}`}
							onDragOver={handleDragOver}
							onDragLeave={handleDragLeave}
							onDrop={handleDrop}
							onClick={() => fileInputRef.current?.click()}
						>
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
						<input
							ref={fileInputRef}
							type="file"
							multiple
							accept="image/*"
							onChange={(e) => handleFileSelect(e.target.files)}
							className="hidden"
						/>

						{/* Image Preview Grid */}
						{images.length > 0 && (
							<div className="mt-4 grid grid-cols-3 gap-4">
								{images.map((imgSrc, index) => (
									<div key={index} className="relative group">
										<Image
											src={imgSrc}
											alt={`Upload preview ${index + 1}`}
											width={200}
											height={150}
											className="w-full h-32 object-cover rounded-lg"
										/>
										<button
											type="button"
											onClick={() => handleRemoveImage(index)}
											className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
										>
											×
										</button>
									</div>
								))}
							</div>
						)}
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
										<option value="2">2</option>
										<option value="3">3</option>
										<option value="4">4</option>
										<option value="5">5+</option>
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
										type="number"
										id="monthlyRent"
										name="monthlyRent"
										value={formData.monthlyRent}
										onChange={handleInputChange}
										placeholder="e.g., 2500"
										min="0"
										step="1"
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
										ref={addressInputRef}
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

							{/* City, District and Country */}
							<div className="grid grid-cols-3 gap-4">
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
										htmlFor="district"
										className="block text-sm font-medium text-gray-700 mb-1"
									>
										District
									</label>
									<input
										type="text"
										id="district"
										name="district"
										value={formData.district}
										onChange={handleInputChange}
										placeholder="e.g., Shoreditch"
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

							{/* Map */}
							<div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden">
								{formData.address ? (
									<iframe
										width="100%"
										height="100%"
										style={{ border: 0 }}
										loading="lazy"
										allowFullScreen
										referrerPolicy="no-referrer-when-downgrade"
										src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY'}&q=${coordinates.lat},${coordinates.lng}&zoom=15`}
									/>
								) : (
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
											<p className="text-sm text-gray-500">Enter an address to see map preview</p>
										</div>
									</div>
								)}
								{/* Coordinates display */}
								<div className="absolute bottom-4 right-4 bg-white px-3 py-2 rounded-md shadow-sm text-xs text-gray-600">
									<div>Lat: {coordinates.lat.toFixed(4)}</div>
									<div>Lng: {coordinates.lng.toFixed(4)}</div>
								</div>
							</div>
						</div>
					</div>

					{/* Amenities Section */}
					<div className="bg-white rounded-lg p-6 shadow-sm">
						<h2 className="text-lg font-medium text-gray-900 mb-4">
							Amenities
						</h2>
						<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
							{availableAmenities.map((amenity) => (
								<button
									key={amenity}
									type="button"
									onClick={() => handleAmenityToggle(amenity)}
									className={`px-4 py-2 rounded-md border transition-colors text-sm font-medium ${
										selectedAmenities.includes(amenity)
											? "bg-blue-50 border-blue-500 text-blue-700"
											: "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
									}`}
								>
									{amenity}
								</button>
							))}
						</div>
					</div>

					{/* Submit Button */}
					<div className="flex justify-end">
						<button
							type="submit"
							disabled={isSubmitting}
							className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
						>
							{isSubmitting ? "Uploading..." : "List Property"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
