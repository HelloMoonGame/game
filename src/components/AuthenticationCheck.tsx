import { unwrapResult } from '@reduxjs/toolkit'
import { useRouter } from 'next/router'
import { User } from 'oidc-client'
import { useEffect, useState } from 'react'
import AuthService from '../services/AuthService'
import {
  characterSelectors,
  characterOperations,
} from '../state/ducks/character'
import { LocationClient } from '../grpc/LocationServiceClientPb'
import {
  Empty,
  LocationUpdate,
  LocationUpdateResponse,
} from '../grpc/location_pb'
import { StatusCode } from 'grpc-web'
import { useAppSelector, useAppDispatch } from '../state/hooks'

type Props = {
  children?: JSX.Element
}

const AuthenticationCheck = ({ children }: Props): JSX.Element => {
  const router = useRouter()
  const [user, setUser] = useState<User>()
  const myCharacter = useAppSelector(characterSelectors.getMyCharacter)
  const dispatch = useAppDispatch()

  function reAuthenticate() {
    const authService = AuthService.getInstance()
    authService
      .renewToken()
      .then((newUser) => {
        if (newUser && newUser.access_token) setUser(newUser)
      })
      .catch(() => {
        authService.login()
      })
  }

  function handleLocationUpdate(locationUpdate: LocationUpdate) {
    if (!locationUpdate.getOnline()) {
      dispatch(
        characterOperations.hideCharacter(locationUpdate.getCharacterid())
      )
    } else {
      dispatch(
        characterOperations.showCharacter(
          locationUpdate.getCharacterid(),
          locationUpdate.getX(),
          locationUpdate.getY()
        )
      )
    }
  }

  // Require login, except for authentication pages
  useEffect(() => {
    if (!router.pathname.startsWith('/auth/')) {
      const authService = AuthService.getInstance()
      if (user == null)
        authService.getUserOrLogin().then((newUser) => setUser(newUser))
    }
  }, [user])

  useEffect(() => {
    if (!user) return

    const locationService = new LocationClient(
      process.env.NEXT_PUBLIC_CHARACTERAPI_URL,
      null,
      null
    )

    const request = new Empty()

    const call = locationService.subscribe(request, {
      Authorization: 'Bearer ' + user.access_token,
    })
    call.on('error', function (e) {
      if (e.code === StatusCode.UNAUTHENTICATED) {
        reAuthenticate()
      }
    })
    call.on('data', function (response: LocationUpdateResponse) {
      response.getLocationupdatesList().forEach(handleLocationUpdate)
    })
  }, [user])

  if (router.pathname.startsWith('/auth/')) return children
  if (!user) return null

  // Require character, except for 'new character' page
  if (myCharacter == null) {
    dispatch<any>(characterOperations.fetchMyCharacterAsync())
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
