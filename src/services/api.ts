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
  image: File | null // Allow null for update operations to keep existing image
}

// Helper function to convert API house response to our internal House type
// Note: This function is kept for potential future use
// Currently used inline where needed for clarity

// generic request function
export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // Ensure endpoint is properly formatted - remove trailing slash for consistency
  const normalizedEndpoint = endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint

  // Set up headers
  const headers: Record<string, string> = {
    'X-Api-Key': apiKey,
  }

  // Only add Content-Type for requests that have a body, but not for DELETE
  if (options.method !== 'DELETE' && options.body) {
    headers['Content-Type'] = 'application/json'
  }

  // Make the request
  const res = await fetch(`${apiUrl}${normalizedEndpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers || {}), // Allow caller to override headers
    },
  })

  // Handle errors
  if (!res.ok) {
    console.error(`API error for ${normalizedEndpoint}:`, res.status)
    // Try to get more detailed error information if available
    try {
      const errorText = await res.text()
      console.error('Error response:', errorText)
      throw new Error(`API error: ${res.status} - ${errorText || 'No error details'}`)
    } catch (error) {
      console.error('Error parsing error response:', error)
      throw new Error(`API error: ${res.status}`)
    }
  }

  // For DELETE requests or empty responses, we might not have a response body
  if (options.method === 'DELETE') {
    // Try to parse JSON, but if it fails or returns nothing, return an empty object
    try {
      const contentType = res.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        const text = await res.text()
        return text ? (JSON.parse(text) as T) : ({} as T)
      }
      return {} as T
    } catch {
      // ...existing code...
      return {} as T
    }
  }

  // Return JSON data for other request types
  try {
    return (await res.json()) as T
  } catch (error) {
    console.error('Error parsing JSON response:', error)
    throw new Error('Failed to parse API response')
  }
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
  // ...existing code...
  const apiHouses = await apiRequest<HouseApiResponse[]>(`/houses/${id}`)

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
  return createOrUpdateHouse(houseData)
}

export async function createOrUpdateHouse(
  houseData: CreateHouseRequest,
  houseId?: number,
): Promise<House> {
  // Create FormData for the request
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

  // Create or update the house - API requires POST for both operations
  const endpoint = houseId ? `/houses/${houseId}` : `/houses`
  const url = `${apiUrl}${endpoint}`
  const method = 'POST' // Use POST for both create and update operations per API docs

  // Send the request
  const response = await fetch(url, {
    method,
    headers: {
      'X-Api-Key': apiKey,
    },
    body: houseFormData,
  })

  // Handle unsuccessful responses
  if (!response.ok) {
    const errorText = await response.text()
    console.error(
      `API error ${houseId ? 'updating' : 'creating'} house:`,
      response.status,
      errorText,
    )
    throw new Error(
      `API error ${houseId ? 'updating' : 'creating'} house: ${response.status} ${errorText || ''}`,
    )
  }

  // Create house response or basic update response
  let house: House

  try {
    // Read the response text
    const responseText = await response.text()

    // Handle empty response (common for update operations)
    if (!responseText.trim()) {

      if (!houseId) {
        throw new Error('Empty response when creating house')
      }

      // For update operations with empty response, create a house object from input data
      house = {
        id: houseId,
        image: '', // This will be filled in later if there's an image upload
        price: houseData.price,
        bedrooms: houseData.bedrooms,
        bathrooms: houseData.bathrooms,
        size: houseData.size,
        streetName: houseData.streetName,
        houseNumber: houseData.houseNumber,
        numberAddition: houseData.numberAddition || '',
        zip: houseData.zip,
        city: houseData.city,
        constructionYear: houseData.constructionYear,
        hasGarage: houseData.hasGarage,
        description: houseData.description,
        madeByMe: true,
      }
    } else {
      // We have a non-empty response, try to parse it as JSON
      try {
        const responseData = JSON.parse(responseText)
        house = {
          id: responseData.id,
          image: responseData.image || '',
          price: responseData.price,
          bedrooms: responseData.rooms?.bedrooms || houseData.bedrooms,
          bathrooms: responseData.rooms?.bathrooms || houseData.bathrooms,
          size: responseData.size || houseData.size,
          description: responseData.description || houseData.description,
          streetName: responseData.location?.street || houseData.streetName,
          houseNumber: responseData.location?.houseNumber || houseData.houseNumber,
          numberAddition:
            responseData.location?.houseNumberAddition || houseData.numberAddition || '',
          city: responseData.location?.city || houseData.city,
          zip: responseData.location?.zip || houseData.zip,
          constructionYear: responseData.constructionYear || houseData.constructionYear,
          hasGarage: responseData.hasGarage ?? houseData.hasGarage,
          madeByMe: responseData.madeByMe ?? true,
        }
      } catch (parseError) {
        console.error('Failed to parse response JSON:', parseError)

        // If JSON parsing fails and this is an update operation, use the input data
        if (houseId) {
          house = {
            id: houseId,
            image: '',
            price: houseData.price,
            bedrooms: houseData.bedrooms,
            bathrooms: houseData.bathrooms,
            size: houseData.size,
            streetName: houseData.streetName,
            houseNumber: houseData.houseNumber,
            numberAddition: houseData.numberAddition || '',
            zip: houseData.zip,
            city: houseData.city,
            constructionYear: houseData.constructionYear,
            hasGarage: houseData.hasGarage,
            description: houseData.description,
            madeByMe: true,
          }
        } else {
          // For create operations, we need a valid response
          throw new Error(
            `Failed to parse API response: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`,
          )
        }
      }
    }
  } catch (error) {
    if (houseId) {
      // For update operations with errors, fall back to returning basic data
      console.error('Error processing response:', error)
      house = {
        id: houseId,
        image: '',
        price: houseData.price,
        bedrooms: houseData.bedrooms,
        bathrooms: houseData.bathrooms,
        size: houseData.size,
        streetName: houseData.streetName,
        houseNumber: houseData.houseNumber,
        numberAddition: houseData.numberAddition || '',
        zip: houseData.zip,
        city: houseData.city,
        constructionYear: houseData.constructionYear,
        hasGarage: houseData.hasGarage,
        description: houseData.description,
        madeByMe: true,
      }
    } else {
      // For create operations, propagate the error
      throw error
    }
  }

  // Upload the image to the house if image is provided
  // In edit mode, image might be null/undefined to keep the existing image
  if (houseData.image) {
    try {
      // ...existing code...

      // Create a new FormData just for the image
      const imageFormData = new FormData()
      // We've already checked that houseData.image exists
      imageFormData.append('image', houseData.image)

      // Upload image using the specific endpoint
      const uploadEndpoint = `/houses/${house.id}/upload`
      const uploadRes = await fetch(`${apiUrl}${uploadEndpoint}`, {
        method: 'POST',
        headers: {
          'X-Api-Key': apiKey,
        },
        body: imageFormData,
      })

      if (!uploadRes.ok) {
        console.error('Failed to upload image:', await uploadRes.text())
        // Continue with the house object we have
      } else {
        // After successful image upload, get the updated house with image URL
        try {
          const updatedHouse = await getHouseById(house.id)
          return updatedHouse
        } catch (getError) {
          console.error('Failed to get updated house:', getError)
          // Continue with the house object we have
        }
      }
    } catch (uploadError) {
      console.error('Failed to upload image:', uploadError)
    }
  }

  return house
}
