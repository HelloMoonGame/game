import axios from 'axios'
import AuthService from '../../../services/AuthService'
import { Character, CreateCharacterRequest } from './models'

export async function fetchMyCharacter(): Promise<Character> {
  const authService = AuthService.getInstance()
  const user = await authService.getUserOrLogin()
  const result = await axios.get<Character>(
    `${process.env.NEXT_PUBLIC_CHARACTERAPI_URL}/mycharacter`,
    {
      headers: {
        Authorization: `Bearer ${user.access_token}`,
      },
    }
  )
  return result.data
}

export async function createMyCharacter(
  details: CreateCharacterRequest
): Promise<Character> {
  const authService = AuthService.getInstance()
  const user = await authService.getUserOrLogin()
  const result = await axios.post<Character>(
    `${process.env.NEXT_PUBLIC_CHARACTERAPI_URL}/mycharacter`,
    details,
    {
      headers: {
        Authorization: `Bearer ${user.access_token}`,
      },
    }
  )
  return result.data
}
