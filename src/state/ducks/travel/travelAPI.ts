import axios from 'axios'
import AuthService from '../../../services/AuthService'
import { CharacterLocation, StartTravelRequest } from './models'

export async function startTravel(
  details: StartTravelRequest
): Promise<CharacterLocation> {
  const authService = AuthService.getInstance()
  const user = await authService.getUserOrLogin()
  const result = await axios.post<CharacterLocation>(
    `${process.env.NEXT_PUBLIC_CHARACTERAPI_URL}/travel`,
    details,
    {
      headers: {
        Authorization: `Bearer ${user.access_token}`,
      },
    }
  )
  return result.data
}
