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
  }))
}

