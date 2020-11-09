import React, { useEffect, useRef } from 'react'
import { LayerProps } from './LayerProps'

interface LotDetails {
  lotX: number
  lotY: number
  x: number
  y: number
  width: number
  height: number
}

const halfRoadSize = (lot: LotDetails) => Math.min(lot.width, lot.height) * 0.15

const amountOfLots = (canvasLength: number, lotLength: number) =>
  Math.ceil(canvasLength / lotLength) % 2 == 0
    ? Math.ceil(canvasLength / lotLength) + 1
    : Math.ceil(canvasLength / lotLength)

const startPosition = (canvasLength: number, lotLength: number) =>
  (canvasLength - amountOfLots(canvasLength, lotLength) * lotLength) / 2

const roadOnTop = (lot: LotDetails) => lot.lotY % 2 === 0
const roadOnBottom = (lot: LotDetails) => lot.lotY % 2 !== 0
const roadOnLeft = (lot: LotDetails) => lot.lotX % 2 === 0
const roadOnRight = (lot: LotDetails) => lot.lotX % 2 !== 0

const drawRoadBase = (ctx: CanvasRenderingContext2D, lot: LotDetails) => {
  const roadSize = halfRoadSize(lot)

  ctx.fillStyle = '#4c4c4c'

  if (roadOnTop(lot)) {
    ctx.fillRect(lot.x, lot.y, lot.width, roadSize)
  }
  if (roadOnBottom(lot)) {
    ctx.fillRect(lot.x, lot.y + lot.height, lot.width, -roadSize)
  }

  if (roadOnLeft(lot)) {
    ctx.fillRect(lot.x, lot.y, roadSize, lot.height)
  }
  if (roadOnRight(lot)) {
    ctx.fillRect(lot.x + lot.width, lot.y, -roadSize, lot.height)
  }
}

const drawRoadCorner = (ctx: CanvasRenderingContext2D, lot: LotDetails) => {
  const lotSize = Math.min(lot.height, lot.width),
    radius = lotSize * 0.1

  let startAngle, endAngle, angleX, angleY
  if (roadOnTop(lot) && roadOnLeft(lot)) {
    startAngle = 1.0 * Math.PI
    endAngle = 1.5 * Math.PI
    angleX = lotSize * 0.2
    angleY = lotSize * 0.2
  } else if (roadOnTop(lot) && roadOnRight(lot)) {
    startAngle = 1.5 * Math.PI
    endAngle = 0.0
    angleX = lotSize * 0.8
    angleY = lotSize * 0.2
  } else if (roadOnBottom(lot) && roadOnLeft(lot)) {
    startAngle = 0.5 * Math.PI
    endAngle = 1.0 * Math.PI
    angleX = lotSize * 0.2
    angleY = lotSize * 0.8
  } else if (roadOnBottom(lot) && roadOnRight(lot)) {
    startAngle = 0.0 * Math.PI
    endAngle = 0.5 * Math.PI
    angleX = lotSize * 0.8
    angleY = lotSize * 0.8
  }

  if (typeof startAngle !== undefined) {
    ctx.beginPath()
    ctx.arc(lot.x + angleX, lot.y + angleY, radius, startAngle, endAngle, false)
    ctx.lineWidth = lotSize * 0.1
    ctx.strokeStyle = '#4c4c4c'
    ctx.stroke()
  }

  ctx.fillStyle = '#4c4c4c'
}

const drawRoadLines = (ctx: CanvasRenderingContext2D, lot: LotDetails) => {
  const roadSize = halfRoadSize(lot),
    stripes = 7,
    stripeWidth = roadSize / 12

  ctx.fillStyle = '#fff'
  if (roadOnTop(lot)) {
    const stripeLength = lot.width / stripes,
      minX = roadOnLeft(lot) ? lot.x + roadSize : lot.x,
      maxX = roadOnRight(lot) ? lot.x + lot.width - roadSize : lot.x + lot.width
    for (let stripe = 0; stripe < stripes; stripe++) {
      const expectedEnd = lot.x + stripe * stripeLength + stripeLength * 0.8
      if (lot.x + stripe * stripeLength < maxX && expectedEnd > minX) {
        let newStripeLength = stripeLength * 0.8
        if (maxX < expectedEnd)
          newStripeLength = maxX - lot.x - stripe * stripeLength
        if (minX > lot.x + stripe * stripeLength)
          newStripeLength = expectedEnd - minX

        ctx.fillRect(
          Math.max(minX, lot.x + stripe * stripeLength),
          lot.y + stripeWidth / 2,
          newStripeLength,
          stripeWidth
        )
      }
    }
  }
  if (roadOnLeft(lot)) {
    const stripeLength = lot.height / stripes,
      minY = roadOnTop(lot) ? lot.y + roadSize : lot.y,
      maxY = roadOnBottom(lot)
        ? lot.y + lot.height - roadSize
        : lot.y + lot.height
    for (let stripe = 0; stripe < stripes; stripe++) {
      const expectedEnd = lot.y + stripe * stripeLength + stripeLength * 0.8
      if (lot.y + stripe * stripeLength < maxY && expectedEnd > minY) {
        let newStripeLength = stripeLength * 0.8
        if (maxY < expectedEnd)
          newStripeLength = maxY - lot.y - stripe * stripeLength
        if (minY > lot.y + stripe * stripeLength)
          newStripeLength = expectedEnd - minY

        ctx.fillRect(
          lot.x - stripeWidth / 2,
          Math.max(minY, lot.y + stripe * stripeLength),
          stripeWidth,
          newStripeLength
        )
      }
    }
  }
}

const redraw = (ctx: CanvasRenderingContext2D, props: LayerProps) => {
  const amountOfLotsX = amountOfLots(props.canvasWidth, props.lotWidth),
    amountOfLotsY = amountOfLots(props.canvasHeight, props.lotHeight),
    startX = startPosition(props.canvasWidth, props.lotWidth),
    startY = startPosition(props.canvasHeight, props.lotHeight),
    centerLotX = 0,
    centerLotY = 0,
    lastLotX = centerLotX + amountOfLotsX / 2 - 0.5,
    lastLotY = centerLotY + amountOfLotsY / 2 - 0.5

  if (ctx) {
    ctx.clearRect(0, 0, props.canvasWidth, props.canvasHeight)

    for (let lotY = lastLotY - amountOfLotsY + 1; lotY <= lastLotY; lotY++) {
      for (let lotX = lastLotX - amountOfLotsX + 1; lotX <= lastLotX; lotX++) {
        const x =
            startX + (lotX - lastLotX + amountOfLotsX - 1) * props.lotWidth,
          y = startY + (lotY - lastLotY + amountOfLotsY - 1) * props.lotHeight

        const lotDetails: LotDetails = {
          lotX,
          lotY,
          x,
          y,
          width: props.lotWidth,
          height: props.lotHeight,
        }
        drawRoadBase(ctx, lotDetails)
        drawRoadCorner(ctx, lotDetails)
        drawRoadLines(ctx, lotDetails)

        ctx.fillStyle = '#ff0000'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.font = '40px Arial'
        ctx.fillText(
          `${lotX},${lotY}`,
          lotDetails.x + lotDetails.width / 2,
          lotDetails.y + lotDetails.height / 2,
          80
        )
      }
    }
  }
}

const InfrastructureLayer = (props: LayerProps) => {
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

  return <canvas ref={canvasRef} className={props.className} />
}

export default InfrastructureLayer
