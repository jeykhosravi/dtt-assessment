// read API URL and key from .env file
const apiUrl = import.meta.env.VITE_API_URL as string
const apiKey = import.meta.env.VITE_API_KEY as string

// generic request function
export async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {},
): Promise<T> {
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
