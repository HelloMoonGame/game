import { unwrapResult } from '@reduxjs/toolkit'
import { useRouter } from 'next/router'
import { User } from 'oidc-client'
import { useEffect, useState } from 'react'
import AuthService from '../services/AuthService'
import {
  characterSelectors,
  characterOperations,
} from '../state/ducks/character'
import { useAppSelector, useAppDispatch } from '../state/hooks'

const AuthenticationCheck = ({ children }): JSX.Element => {
  const router = useRouter()
  const [user, setUser] = useState<User>()
  const myCharacter = useAppSelector(characterSelectors.getMyCharacter)
  const dispatch = useAppDispatch()

  // Require login, except for authentication pages
  useEffect(() => {
    if (!router.pathname.startsWith('/auth/')) {
      const authService = AuthService.getInstance()
      if (user == null)
        authService.getUserOrLogin().then((newUser) => setUser(newUser))
    }
  }, [user])

  if (router.pathname.startsWith('/auth/')) return children
  if (!user) return null

  // Require character, except for 'new character' page
  if (myCharacter == null) {
    dispatch(characterOperations.fetchMyCharacterAsync())
      .then(unwrapResult)
      .catch(() => {
        if (!router.pathname.startsWith('/character/new'))
          router.push('/character/new')
      })
    if (router.pathname.startsWith('/character/new')) return children
    return null
  }

  return children
}

export default AuthenticationCheck
