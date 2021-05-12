import React, { useEffect, useRef, useState } from 'react'
import { LayerProps } from './LayerProps'
import AuthService from '../../services/AuthService'
import { User } from 'oidc-client'

import { LocationClient } from '../../grpc/LocationServiceClientPb'
import {
  Empty,
  LocationUpdate,
  LocationUpdateResponse,
} from '../../grpc/location_pb'
import { StatusCode } from 'grpc-web'
import { useAppSelector } from '../../state/hooks'
import { characterSelectors } from '../../state/ducks/character'

let characters = []
let latestProps: LayerProps

const amountOfLots = (canvasLength: number, lotLength: number) =>
  Math.ceil(canvasLength / lotLength) % 2 == 0
    ? Math.ceil(canvasLength / lotLength) + 1
    : Math.ceil(canvasLength / lotLength)

const startPosition = (canvasLength: number, lotLength: number) =>
  (canvasLength - amountOfLots(canvasLength, lotLength) * lotLength) / 2

const redraw = (
  ctx: CanvasRenderingContext2D,
  props: LayerProps,
  currentCharacterId: string
) => {
  if (ctx) {
    const amountOfLotsX = amountOfLots(props.canvasWidth, props.lotWidth),
      amountOfLotsY = amountOfLots(props.canvasHeight, props.lotHeight),
      startX = startPosition(props.canvasWidth, props.lotWidth),
      startY = startPosition(props.canvasHeight, props.lotHeight),
      centerLotX = 0,
      centerLotY = 0,
      lastLotX = centerLotX + amountOfLotsX / 2 - 0.5,
      lastLotY = centerLotY + amountOfLotsY / 2 - 0.5,
      lotSize = Math.min(props.lotWidth, props.lotHeight)

    latestProps = props
    ctx.clearRect(0, 0, props.canvasWidth, props.canvasHeight)

    if (characters.length < 10) {
      for (let i = 0; i < 5; i++)
        characters[characters.length] = {
          x: 0,
          y: 1,
        }

      for (let i = 0; i < 233; i++)
        characters[characters.length] = {
          x: 1,
          y: 1,
        }
    }
    for (let lotY = lastLotY - amountOfLotsY + 1; lotY <= lastLotY; lotY++) {
      for (let lotX = lastLotX - amountOfLotsX + 1; lotX <= lastLotX; lotX++) {
        const x =
          startX + (lotX - lastLotX + amountOfLotsX - 1) * props.lotWidth
        const y =
          startY + (lotY - lastLotY + amountOfLotsY - 1) * props.lotHeight

        const charactersOnLot = characters
          .filter((c) => c.x == lotX && c.y == lotY)
          .sort((a, _) => (a.characterId == currentCharacterId ? 1 : -1))

        const charactersOnLotToShow = charactersOnLot.slice(-15)

        const offsetY = lotSize * (lotY % 2 === 0 ? 0.15 : 0.85)

        charactersOnLotToShow.forEach((character, index) => {
          const characterOffset =
            (charactersOnLotToShow.length - index + 1) * (lotSize * 0.05)
          const offsetX =
            lotX % 2 === 0
              ? lotSize * 0.15 + characterOffset
              : lotSize * 0.85 - characterOffset

          ctx.fillStyle =
            currentCharacterId === character.characterId ? '#0F0' : '#000'
          ctx.beginPath()
          ctx.arc(x + offsetX, y + offsetY, lotSize * 0.05, 0, 2 * Math.PI)
          ctx.fill()
        })

        const charactersNotVisible =
          charactersOnLot.length - charactersOnLotToShow.length
        if (charactersNotVisible > 0) {
          const offsetXForText =
            lotX % 2 === 0 ? lotSize * 0.95 : lotSize * 0.05
          ctx.fillStyle = '#FFF'
          ctx.font = lotSize * 0.075 + 'px Arial'
          ctx.textAlign = lotX % 2 === 0 ? 'right' : 'left'
          ctx.fillText(
            `+${charactersNotVisible}`,
            x + offsetXForText,
            y + offsetY + lotSize * 0.025,
            lotSize
          )
        }
      }
    }
  }
}

const CharacterLayer = (props: LayerProps): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [currentUser, setCurrentUser] = useState<User>()
  const myCharacter = useAppSelector(characterSelectors.getMyCharacter)

  useEffect(() => {
    const authService = AuthService.getInstance()
    authService.getUserOrLogin().then((user) => setCurrentUser(user))
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    canvas.width = props.canvasWidth
    canvas.height = props.canvasHeight
    redraw(context, props, myCharacter?.id)
  }, [props.canvasWidth, props.canvasHeight])

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    redraw(context, props, myCharacter?.id)
  }, [props.lotWidth, props.lotHeight, myCharacter])

  function reAuthenticate() {
    const authService = AuthService.getInstance()
    authService
      .renewToken()
      .then((user) => {
        if (user && user.access_token) setCurrentUser(user)
      })
      .catch(() => {
        authService.login()
      })
  }

  function handleLocationUpdate(locationUpdate: LocationUpdate) {
    const current = characters.find(
      (c) => c.characterId === locationUpdate.getCharacterid()
    )
    if (!locationUpdate.getOnline()) {
      characters = characters.filter((c) => c !== current)
    } else {
      if (current) {
        current.x = locationUpdate.getX()
        current.y = locationUpdate.getY()
      } else {
        characters = [
          ...characters,
          {
            characterId: locationUpdate.getCharacterid(),
            x: locationUpdate.getX(),
            y: locationUpdate.getY(),
          },
        ]
      }
    }
  }

  useEffect(() => {
    if (!currentUser) return

    const locationService = new LocationClient(
      process.env.NEXT_PUBLIC_CHARACTERAPI_URL,
      null,
      null
    )

    const request = new Empty()

    characters = []

    const call = locationService.subscribe(request, {
      Authorization: 'Bearer ' + currentUser.access_token,
    })
    call.on('error', function (e) {
      if (e.code === StatusCode.UNAUTHENTICATED) {
        reAuthenticate()
      }
    })
    call.on('data', function (response: LocationUpdateResponse) {
      response.getLocationupdatesList().forEach(handleLocationUpdate)

      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      redraw(context, latestProps, myCharacter.id)
    })
  }, [currentUser])

  return <canvas ref={canvasRef} className={props.className} />
}

export default CharacterLayer
