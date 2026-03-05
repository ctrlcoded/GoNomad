import React, { useState, useRef } from 'react'
import Title from '../../components/owner/Title'
import { assets, cityList } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const MAX_DESCRIPTION_LENGTH = 500
const MIN_PRICE = 100
const MAX_PRICE = 50000

const AddCar = () => {

  const { axios, currency } = useAppContext()

  const [image, setImage] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [errors, setErrors] = useState({})
  const fileInputRef = useRef(null)

  const initialCarState = {
    brand: '',
    model: '',
    year: '',
    pricePerDay: '',
    category: '',
    transmission: '',
    fuel_type: '',
    seating_capacity: '',
    location: '',
    description: '',
  }

  const [car, setCar] = useState(initialCarState)

  const [isLoading, setIsLoading] = useState(false)

  // --- Validation ---
  const validate = () => {
    const newErrors = {}

    if (!car.brand.trim()) newErrors.brand = 'Brand is required'
    if (!car.model.trim()) newErrors.model = 'Model is required'
    if (!car.year) newErrors.year = 'Please select a year'
    if (!car.category) newErrors.category = 'Please select a category'
    if (!car.transmission) newErrors.transmission = 'Please select a transmission'
    if (!car.fuel_type) newErrors.fuel_type = 'Please select a fuel type'
    if (!car.seating_capacity) newErrors.seating_capacity = 'Please select seating capacity'
    if (!car.location) newErrors.location = 'Please select a location'
    if (!car.description.trim()) newErrors.description = 'Description is required'
    if (car.description.length > MAX_DESCRIPTION_LENGTH) newErrors.description = `Description must be under ${MAX_DESCRIPTION_LENGTH} characters`
    if (!image) newErrors.image = 'Please upload a car image'

    const price = Number(car.pricePerDay)
    if (!car.pricePerDay || isNaN(price)) {
      newErrors.pricePerDay = 'Price is required'
    } else if (price < MIN_PRICE) {
      newErrors.pricePerDay = `Minimum price is ${currency}${MIN_PRICE}`
    } else if (price > MAX_PRICE) {
      newErrors.pricePerDay = `Maximum price is ${currency}${MAX_PRICE}`
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // --- Drag & Drop ---
  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      setImage(file)
      setErrors(prev => ({ ...prev, image: undefined }))
    } else {
      toast.error('Please upload a valid image file')
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setErrors(prev => ({ ...prev, image: undefined }))
    }
  }

  // --- Field change with error clearing ---
  const updateCar = (field, value) => {
    setCar(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  // --- Submit ---
  const onSubmitHandler = async (e) => {
    e.preventDefault()
    if (isLoading) return null

    if (!validate()) {
      toast.error('Please fix the errors in the form')
      return
    }

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('image', image)
      formData.append('carData', JSON.stringify(car))

      const { data } = await axios.post('/api/owner/add-car', formData)

      if (data.success) {
        toast.success(data.message)
        setImage(null)
        setCar(initialCarState)
        setErrors({})
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // --- Error label component ---
  const ErrorText = ({ field }) => errors[field] ? (
    <p className='text-red-500 text-xs mt-1'>{errors[field]}</p>
  ) : null

  return (
    <div className='px-4 py-10 md:px-10 flex-1'>

      <Title title="Add New Car" subTitle="Fill in details to list a new car for booking, including pricing, availability, and car specifications." />

      <form onSubmit={onSubmitHandler} className='flex flex-col gap-5 text-gray-500 text-sm mt-6 max-w-xl' noValidate>

        {/* Car Image — Drag & Drop Zone */}
        <div>
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 min-h-[180px] ${isDragging
              ? 'border-primary bg-primary/5'
              : errors.image
                ? 'border-red-400 bg-red-50'
                : 'border-gray-300 hover:border-primary/60 hover:bg-gray-50'
              }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
            {image ? (
              <div className='relative w-full flex justify-center'>
                <img
                  src={URL.createObjectURL(image)}
                  alt="Car preview"
                  className='max-h-40 rounded-lg object-contain'
                />
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setImage(null) }}
                  className='absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors'
                >
                  ✕
                </button>
              </div>
            ) : (
              <>
                <img src={assets.upload_icon} alt="" className='h-10 mb-2 opacity-50' />
                <p className='text-gray-500 font-medium'>Drag & drop your car image here</p>
                <p className='text-gray-400 text-xs mt-1'>or click to browse files</p>
              </>
            )}
          </div>
          <ErrorText field="image" />
        </div>

        {/* Car Brand & Model */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='flex flex-col w-full'>
            <label>Brand</label>
            <input type="text" placeholder="e.g. BMW, Mercedes, Audi..." className={`px-3 py-2 mt-1 border rounded-md outline-none ${errors.brand ? 'border-red-400' : 'border-borderColor'}`} value={car.brand} onChange={e => updateCar('brand', e.target.value)} />
            <ErrorText field="brand" />
          </div>
          <div className='flex flex-col w-full'>
            <label>Model</label>
            <input type="text" placeholder="e.g. X5, E-Class, M4..." className={`px-3 py-2 mt-1 border rounded-md outline-none ${errors.model ? 'border-red-400' : 'border-borderColor'}`} value={car.model} onChange={e => updateCar('model', e.target.value)} />
            <ErrorText field="model" />
          </div>
        </div>

        {/* Car Year, Price, Category */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
          <div className='flex flex-col w-full'>
            <label>Year</label>
            <select onChange={e => updateCar('year', e.target.value)} value={car.year} className={`px-3 py-2 mt-1 border rounded-md outline-none ${errors.year ? 'border-red-400' : 'border-borderColor'}`}>
              <option value="">Select year</option>
              {Array.from({ length: 27 }, (_, i) => 2026 - i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <ErrorText field="year" />
          </div>
          <div className='flex flex-col w-full'>
            <label>Daily Price ({currency})</label>
            <input type="number" placeholder="e.g. 1500" min={MIN_PRICE} max={MAX_PRICE} className={`px-3 py-2 mt-1 border rounded-md outline-none ${errors.pricePerDay ? 'border-red-400' : 'border-borderColor'}`} value={car.pricePerDay} onChange={e => updateCar('pricePerDay', e.target.value)} />
            <p className='text-gray-400 text-xs mt-1'>Min: {currency}{MIN_PRICE} · Max: {currency}{MAX_PRICE}</p>
            <ErrorText field="pricePerDay" />
          </div>
          <div className='flex flex-col w-full'>
            <label>Category</label>
            <select onChange={e => updateCar('category', e.target.value)} value={car.category} className={`px-3 py-2 mt-1 border rounded-md outline-none ${errors.category ? 'border-red-400' : 'border-borderColor'}`}>
              <option value="">Select a category</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Coupe">Coupe</option>
              <option value="Convertible">Convertible</option>
              <option value="Van">Van</option>
              <option value="Minivan">Minivan</option>
              <option value="Pickup Truck">Pickup Truck</option>
              <option value="Crossover">Crossover</option>
              <option value="MPV">MPV (Multi Purpose Van)</option>
            </select>
            <ErrorText field="category" />
          </div>
        </div>

        {/* Car Transmission, Fuel Type, Seating Capacity */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
          <div className='flex flex-col w-full'>
            <label>Transmission</label>
            <select onChange={e => updateCar('transmission', e.target.value)} value={car.transmission} className={`px-3 py-2 mt-1 border rounded-md outline-none ${errors.transmission ? 'border-red-400' : 'border-borderColor'}`}>
              <option value="">Select a transmission</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
              <option value="Semi-Automatic">Semi-Automatic</option>
            </select>
            <ErrorText field="transmission" />
          </div>
          <div className='flex flex-col w-full'>
            <label>Fuel Type</label>
            <select onChange={e => updateCar('fuel_type', e.target.value)} value={car.fuel_type} className={`px-3 py-2 mt-1 border rounded-md outline-none ${errors.fuel_type ? 'border-red-400' : 'border-borderColor'}`}>
              <option value="">Select a fuel type</option>
              <option value="Gas">Gas</option>
              <option value="Diesel">Diesel</option>
              <option value="Petrol">Petrol</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </select>
            <ErrorText field="fuel_type" />
          </div>
          <div className='flex flex-col w-full'>
            <label>Seating Capacity</label>
            <select onChange={e => updateCar('seating_capacity', e.target.value)} value={car.seating_capacity} className={`px-3 py-2 mt-1 border rounded-md outline-none ${errors.seating_capacity ? 'border-red-400' : 'border-borderColor'}`}>
              <option value="">Select seats</option>
              <option value="2">2 Seater</option>
              <option value="4">4 Seater</option>
              <option value="5">5 Seater</option>
              <option value="6">6 Seater</option>
              <option value="7">7 Seater</option>
              <option value="8">8+ Seater</option>
            </select>
            <ErrorText field="seating_capacity" />
          </div>
        </div>

        {/* Car Location */}
        <div className='flex flex-col w-full'>
          <label>Location</label>
          <select onChange={e => updateCar('location', e.target.value)} value={car.location} className={`px-3 py-2 mt-1 border rounded-md outline-none ${errors.location ? 'border-red-400' : 'border-borderColor'}`}>
            <option value="">Select a location</option>
            {cityList.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          <ErrorText field="location" />
        </div>

        {/* Car Description */}
        <div className='flex flex-col w-full'>
          <label>Description</label>
          <textarea
            rows={5}
            maxLength={MAX_DESCRIPTION_LENGTH}
            placeholder="e.g. A luxurious SUV with a spacious interior and a powerful engine."
            className={`px-3 py-2 mt-1 border rounded-md outline-none resize-none ${errors.description ? 'border-red-400' : 'border-borderColor'}`}
            value={car.description}
            onChange={e => updateCar('description', e.target.value)}
          ></textarea>
          <div className='flex justify-between mt-1'>
            <ErrorText field="description" />
            <p className={`text-xs ml-auto ${car.description.length > MAX_DESCRIPTION_LENGTH * 0.9 ? 'text-red-500' : 'text-gray-400'}`}>
              {car.description.length}/{MAX_DESCRIPTION_LENGTH}
            </p>
          </div>
        </div>

        <button className='flex items-center gap-2 px-4 py-2.5 mt-4 bg-primary text-white rounded-md font-medium w-max cursor-white-dot'>
          <img src={assets.tick_icon} alt="" />
          {isLoading ? 'Listing...' : 'List Your Car'}
        </button>


      </form>

    </div>
  )
}

export default AddCar
