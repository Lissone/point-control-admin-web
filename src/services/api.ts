import axios from 'axios'
import { parseCookies } from 'nookies'

export const api = setupAPIClient()

export function setupAPIClient(ctx = undefined) {
  const cookies = parseCookies(ctx)
  const token = cookies['@PointControlAdmin.token']

  const apiInstance = axios.create({
    baseURL: process.env.BASE_URL_API || 'http://localhost:5000/api/v1',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return apiInstance
}
