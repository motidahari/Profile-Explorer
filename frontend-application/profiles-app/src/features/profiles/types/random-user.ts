// Subset of the randomuser.me response shape that we consume. We only type the
// fields we actually map onto our `Profile` — the API returns far more.
import type { Gender } from './profile'

interface RandomUserName {
  first: string
  last: string
}

interface RandomUserStreet {
  number: number
  name: string
}

interface RandomUserLocation {
  street: RandomUserStreet
  city: string
  state: string
  country: string
}

interface RandomUserLogin {
  uuid: string
}

interface RandomUserDob {
  date: string
  age: number
}

interface RandomUserPicture {
  large: string
  medium: string
  thumbnail: string
}

export interface RandomUserResult {
  gender: Gender
  name: RandomUserName
  location: RandomUserLocation
  email: string
  login: RandomUserLogin
  dob: RandomUserDob
  phone: string
  picture: RandomUserPicture
}

export interface RandomUserResponse {
  results: RandomUserResult[]
}
