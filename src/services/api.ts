// read API URL and key from .env file
const apiUrl = import.meta.env.VITE_API_URL as string
const apiKey = import.meta.env.VITE_API_KEY as string

// raw API response format
export interface HouseApiResponse {
  id: number
  image: string
  price: number
  rooms: {
    bedrooms: number
    bathrooms: number
  }
  size: number
  description: string
  location: {
    street: string
    houseNumber: number
    houseNumberAddition: string | null
    city: string
    zip: string
  }
  createdAt: string
  constructionYear: number
  hasGarage: boolean
  madeByMe: boolean
}

export interface House {
  id: number
  image: string
  price: number
  bedrooms: number
  bathrooms: number
  size: number
  description: string
  streetName: string
  houseNumber: number
  numberAddition?: string | null
  city: string
  zip: string
  constructionYear: number
  hasGarage: boolean
  madeByMe: boolean
}

// interface for creating a new house
export interface CreateHouseRequest {
  price: number
  bedrooms: number
  bathrooms: number
  size: number
  description: string
  streetName: string
  houseNumber: number
  numberAddition?: string
  city: string
  zip: string
  constructionYear: number
  hasGarage: boolean
  image: File
}

// generic request function
export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // make the request
  const res = await fetch(`${apiUrl}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': apiKey,
    },
  })

  // handle errors
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`)
  }

  // return JSON data
  return res.json() as Promise<T>
}

export async function getHouses(): Promise<House[]> {
  const apiHouses = await apiRequest<HouseApiResponse[]>('/houses')

  return apiHouses.map((h) => ({
    id: h.id,
    image: h.image,
    price: h.price,
    bedrooms: h.rooms.bedrooms,
    bathrooms: h.rooms.bathrooms,
    size: h.size,
    description: h.description,
    streetName: h.location.street,
    houseNumber: h.location.houseNumber,
    numberAddition: h.location.houseNumberAddition,
    city: h.location.city,
    zip: h.location.zip,
    constructionYear: h.constructionYear,
    hasGarage: h.hasGarage,
    madeByMe: h.madeByMe,
  }))
}

export async function getHouseById(id: number): Promise<House> {
  console.log('Fetching house with ID:', id) // Debug log
  const apiHouses = await apiRequest<HouseApiResponse[]>(`/houses/${id}`)
  console.log('API response:', apiHouses) // Debug log

  if (!apiHouses.length) {
    throw new Error('House not found')
  }

  const apiHouse = apiHouses[0]

  return {
    id: apiHouse.id,
    image: apiHouse.image,
    price: apiHouse.price,
    bedrooms: apiHouse.rooms.bedrooms,
    bathrooms: apiHouse.rooms.bathrooms,
    size: apiHouse.size,
    description: apiHouse.description,
    streetName: apiHouse.location.street,
    houseNumber: apiHouse.location.houseNumber,
    numberAddition: apiHouse.location.houseNumberAddition,
    city: apiHouse.location.city,
    zip: apiHouse.location.zip,
    constructionYear: apiHouse.constructionYear,
    hasGarage: apiHouse.hasGarage,
    madeByMe: apiHouse.madeByMe,
  }
}

export async function createHouse(houseData: CreateHouseRequest): Promise<House> {
  // Step 1: Create the house without the image first
  const houseFormData = new FormData()

  // Append all house data except the image
  houseFormData.append('price', houseData.price.toString())
  houseFormData.append('bedrooms', houseData.bedrooms.toString())
  houseFormData.append('bathrooms', houseData.bathrooms.toString())
  houseFormData.append('size', houseData.size.toString())
  houseFormData.append('description', houseData.description)
  houseFormData.append('streetName', houseData.streetName)
  houseFormData.append('houseNumber', houseData.houseNumber.toString())
  houseFormData.append('numberAddition', houseData.numberAddition || '')
  houseFormData.append('city', houseData.city)
  houseFormData.append('zip', houseData.zip)
  houseFormData.append('constructionYear', houseData.constructionYear.toString())
  houseFormData.append('hasGarage', houseData.hasGarage.toString())

  console.log('Creating house with data:', {
    price: houseData.price,
    bedrooms: houseData.bedrooms,
    bathrooms: houseData.bathrooms,
    size: houseData.size,
    // Other fields omitted for brevity
  })

  // Create the house
  const createRes = await fetch(`${apiUrl}/houses`, {
    method: 'POST',
    headers: {
      'X-Api-Key': apiKey,
    },
    body: houseFormData,
  })

  if (!createRes.ok) {
    throw new Error(`API error creating house: ${createRes.status}`)
  }

  const apiHouse = (await createRes.json()) as HouseApiResponse
  console.log('House created successfully with ID:', apiHouse.id)

  // Step 2: Upload the image to the new house if image is provided
  if (houseData.image && houseData.image instanceof File) {
    try {
      console.log('Uploading image for house ID:', apiHouse.id)

      // Create a new FormData just for the image
      const imageFormData = new FormData()
      imageFormData.append('image', houseData.image)

      // Upload image using the specific endpoint
      const uploadRes = await fetch(`${apiUrl}/houses/${apiHouse.id}/upload`, {
        method: 'POST',
        headers: {
          'X-Api-Key': apiKey,
        },
        body: imageFormData,
      })

      if (!uploadRes.ok) {
        console.error('Failed to upload image:', await uploadRes.text())
        throw new Error(`API error uploading image: ${uploadRes.status}`)
      }

      console.log('Image uploaded successfully')

      // Get the updated house data with the image URL
      const updatedHouse = await getHouseById(apiHouse.id)
      return updatedHouse
    } catch (error) {
      console.error('Error uploading image:', error)
      // Even if image upload fails, return the house data
    }
  }

  // Return the house data from the initial creation
  return {
    id: apiHouse.id,
    image: apiHouse.image || '',
    price: apiHouse.price,
    bedrooms: apiHouse.rooms.bedrooms,
    bathrooms: apiHouse.rooms.bathrooms,
    size: apiHouse.size,
    description: apiHouse.description,
    streetName: apiHouse.location.street,
    houseNumber: apiHouse.location.houseNumber,
    numberAddition: apiHouse.location.houseNumberAddition,
    city: apiHouse.location.city,
    zip: apiHouse.location.zip,
    constructionYear: apiHouse.constructionYear,
    hasGarage: apiHouse.hasGarage,
    madeByMe: apiHouse.madeByMe,
  }
}
