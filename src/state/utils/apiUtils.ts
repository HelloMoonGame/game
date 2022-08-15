import axios from 'axios'
import AuthService from '../../services/AuthService'

export async function getApi<T>(url: string): Promise<T> {
  const authService = AuthService.getInstance()
  const user = await authService.getUserOrLogin()
  const result = await axios.get<T>(url, {
    headers: {
      Authorization: `Bearer ${user.access_token}`,
    },
  })
  return result.data
}

export async function postApi<TBody, TReturn>(
  url: string,
  content: TBody
): Promise<TReturn> {
  const authService = AuthService.getInstance()
  const user = await authService.getUserOrLogin()
  const result = await axios.post<TReturn>(url, content, {
    headers: {
      Authorization: `Bearer ${user.access_token}`,
    },
  })
  return result.data
}
