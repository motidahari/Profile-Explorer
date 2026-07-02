import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { RandomProfile, RandomProfileProvider } from './random-profile.provider'
import { Gender } from '../enum/gender.enum'

// Minimal shape of the randomuser.me response — only the fields we map. The
// upstream payload is much larger; typing just what we consume keeps the
// mapping honest and the coupling to this specific provider contained here.
interface RandomUserResult {
  login: { uuid: string }
  name: { first: string; last: string }
  gender: string
  dob: { age: number; date: string }
  email: string
  phone: string
  picture: { large: string }
  location: {
    country: string
    city: string
    state: string
    street: { number: number; name: string }
  }
}

interface RandomUserResponse {
  results: RandomUserResult[]
}

@Injectable()
export class RandomUserProvider extends RandomProfileProvider {
  private readonly logger = new Logger(RandomUserProvider.name)
  private readonly apiUrl: string

  constructor(config: ConfigService) {
    super()
    this.apiUrl = config.get<string>('RANDOMUSER_API_URL') ?? 'https://randomuser.me/api'
  }

  async fetchRandom(count: number): Promise<RandomProfile[]> {
    const url = `${this.apiUrl}/?results=${count}`

    let response: Response
    try {
      response = await fetch(url)
    } catch (error) {
      this.logger.error(`Failed to reach randomuser.me: ${String(error)}`)
      throw new ServiceUnavailableException('Random profile provider is unreachable')
    }

    if (!response.ok) {
      this.logger.error(`randomuser.me responded with status ${response.status}`)
      throw new ServiceUnavailableException('Random profile provider returned an error')
    }

    const body = (await response.json()) as RandomUserResponse
    return body.results.map((result) => this.toRandomProfile(result))
  }

  private toRandomProfile(result: RandomUserResult): RandomProfile {
    return {
      id: result.login.uuid,
      firstName: result.name.first,
      lastName: result.name.last,
      gender: result.gender === 'female' ? Gender.FEMALE : Gender.MALE,
      age: result.dob.age,
      yearOfBirth: new Date(result.dob.date).getUTCFullYear(),
      email: result.email,
      phone: result.phone,
      pictureUrl: result.picture.large,
      country: result.location.country,
      city: result.location.city,
      state: result.location.state,
      street: `${result.location.street.number} ${result.location.street.name}`,
    }
  }
}
