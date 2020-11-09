import React, { useEffect, useRef } from 'react'
import { LayerProps } from './LayerProps'

import { LocationClient } from '../../grpc/LocationServiceClientPb'
import { Empty, LocationUpdateResponse } from '../../grpc/location_pb'

let characters = []

const redraw = (ctx: CanvasRenderingContext2D, props: LayerProps) => {
  if (ctx) {
    ctx.clearRect(0, 0, props.canvasWidth, props.canvasHeight)

    const centerX = props.canvasWidth / 2,
      centerY = props.canvasHeight / 2,
      lotSize = Math.min(props.lotWidth, props.lotHeight)

    ctx.fillStyle = '#000'

    characters.forEach((c) => {
      const offsetX = (c.x - props.centerLotX) * props.lotWidth
      let offsetY = (c.y - props.centerLotY) * props.lotHeight

      if (c.y % 2 === 0) offsetY -= props.lotHeight * 0.35
      else offsetY += props.lotHeight * 0.35

      const x = centerX + offsetX,
        y = centerY + offsetY

      ctx.beginPath()
      ctx.arc(x, y, lotSize * 0.05, 0, 2 * Math.PI)
      ctx.fill()
    })
  }
}

const CharacterLayer = (props: LayerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

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
    const locationService = new LocationClient(
      process.env.NEXT_PUBLIC_CHARACTERAPI_URL,
      null,
      null
    )

    const request = new Empty()

    characters = []
    const call = locationService.subscribe(request)
    call.on('data', function (response: LocationUpdateResponse) {
      response.getLocationupdatesList().forEach((locationUpdate) => {
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
      redraw(context, props)
    })
  }, [])

  return <canvas ref={canvasRef} className={props.className} />
}

export default CharacterLayer
