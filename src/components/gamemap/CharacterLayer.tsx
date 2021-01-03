import React, { useEffect, useRef } from 'react'
import { LayerProps } from './LayerProps'

import { LocationClient } from '../../grpc/LocationServiceClientPb'
import { Empty, LocationUpdateResponse } from '../../grpc/location_pb'
import { useSession } from 'next-auth/client'

let characters = []
let latestProps: LayerProps
let currentUser: string

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

      ctx.fillStyle = currentUser === c.characterId ? '#0F0' : '#000'
      ctx.beginPath()
      ctx.arc(x, y, lotSize * 0.05, 0, 2 * Math.PI)
      ctx.fill()
    })
  }
}

const CharacterLayer = (props: LayerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [session] = useSession()

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

  useEffect(() => {
    if (!session) return

    const locationService = new LocationClient(
      process.env.NEXT_PUBLIC_CHARACTERAPI_URL,
      null,
      null
    )

    const request = new Empty()

    characters = []
    const call = locationService.subscribe(request, {
      Authorization: 'Bearer ' + session.accessToken,
    })
    call.on('data', function (response: LocationUpdateResponse) {
      response.getLocationupdatesList().forEach((locationUpdate) => {
        if (!characters.length) currentUser = locationUpdate.getCharacterid()

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
      })

      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      redraw(context, latestProps)
    })
  }, [session])

  return <canvas ref={canvasRef} className={props.className} />
}

export default CharacterLayer
