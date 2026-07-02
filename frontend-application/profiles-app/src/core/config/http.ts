import axios from 'axios'

// Fall back to the local backend origin when VITE_API_BASE_URL is unset (e.g. no
// .env file). Without this, an undefined baseURL sends every request to the Vite
// dev server origin, which 404s writes and returns index.html for reads.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

const http = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default http
