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

let characters = []
let latestProps: LayerProps
let currentUserId: string

const redraw = (ctx: CanvasRenderingContext2D, props: LayerProps) => {
  if (ctx) {
    latestProps = props
    ctx.clearRect(0, 0, props.canvasWidth, props.canvasHeight)

    const centerX = props.canvasWidth / 2,
      centerY = props.canvasHeight / 2,
      lotSize = Math.min(props.lotWidth, props.lotHeight)

    characters.forEach((c) => {
      const offsetX = (c.x - props.centerLotX) * props.lotWidth
      let offsetY = (c.y - props.centerLotY) * props.lotHeight

      if (c.y % 2 === 0) offsetY -= props.lotHeight * 0.35
      else offsetY += props.lotHeight * 0.35

      const x = centerX + offsetX,
        y = centerY + offsetY

      ctx.fillStyle = currentUserId === c.characterId ? '#0F0' : '#000'
      ctx.beginPath()
      ctx.arc(x, y, lotSize * 0.05, 0, 2 * Math.PI)
      ctx.fill()
    })
  }
}

const CharacterLayer = (props: LayerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [currentUser, setCurrentUser] = useState<User>()

  useEffect(() => {
    const authService = AuthService.getInstance()
    authService.getUserOrLogin().then((user) => setCurrentUser(user))
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    canvas.width = props.canvasWidth
    canvas.height = props.canvasHeight
    redraw(context, props)
  }, [props.canvasWidth, props.canvasHeight])

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    redraw(context, props)
  }, [props.lotWidth, props.lotHeight])

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
      currentUserId = currentUser.profile.sub

      response.getLocationupdatesList().forEach(handleLocationUpdate)

      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      redraw(context, latestProps)
    })
  }, [currentUser])

  return <canvas ref={canvasRef} className={props.className} />
}

export default CharacterLayer
