import { postApi } from '../../utils/apiUtils'
import { CharacterLocation, StartTravelRequest } from './models'

export async function startTravel(
  details: StartTravelRequest
): Promise<CharacterLocation> {
  return postApi(`${process.env.NEXT_PUBLIC_CHARACTERAPI_URL}/travel`, details)
}
