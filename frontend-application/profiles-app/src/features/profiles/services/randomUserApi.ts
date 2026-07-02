// Client for the external randomuser.me API. Fetches random users and maps the
// response onto our unified `Profile` type so the rest of the app never sees the
// raw randomuser.me shape.
import axios from 'axios'
import type { Profile } from '../types/profile'
import type { RandomUserResponse, RandomUserResult } from '../types/random-user'

const RANDOM_USER_API_URL = import.meta.env.VITE_RANDOM_USER_API_URL ?? 'https://randomuser.me/api'
const DEFAULT_COUNT = 10

// randomuser.me is a distinct origin from our backend, so it gets its own client
// rather than the shared `http` instance (which is scoped to VITE_API_BASE_URL).
const randomUserHttp = axios.create({ baseURL: RANDOM_USER_API_URL })

export function mapRandomUserToProfile(result: RandomUserResult): Profile {
  return {
    id: result.login.uuid,
    firstName: result.name.first,
    lastName: result.name.last,
    gender: result.gender,
    age: result.dob.age,
    yearOfBirth: new Date(result.dob.date).getFullYear(),
    email: result.email,
    phone: result.phone,
    pictureUrl: result.picture.large,
    country: result.location.country,
    city: result.location.city,
    state: result.location.state,
    street: `${result.location.street.number} ${result.location.street.name}`,
  }
}

export const randomUserApi = {
  // GET https://randomuser.me/api?results=<count> — mapped to our Profile type.
  async fetchProfiles(count: number = DEFAULT_COUNT): Promise<Profile[]> {
    const { data } = await randomUserHttp.get<RandomUserResponse>('', {
      params: { results: count },
    })
    return data.results.map(mapRandomUserToProfile)
  },
}
