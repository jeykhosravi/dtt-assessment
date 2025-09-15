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
