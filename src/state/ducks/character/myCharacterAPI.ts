import { getApi, postApi } from '../../utils/apiUtils'
import { Character, CreateCharacterRequest } from './models'

export function fetchMyCharacter(): Promise<Character> {
  return getApi<Character>(
    `${process.env.NEXT_PUBLIC_CHARACTERAPI_URL}/mycharacter`
  )
}

export async function createMyCharacter(
  details: CreateCharacterRequest
): Promise<Character> {
  return postApi(
    `${process.env.NEXT_PUBLIC_CHARACTERAPI_URL}/mycharacter`,
    details
  )
}
