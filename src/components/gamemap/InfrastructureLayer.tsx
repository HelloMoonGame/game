import React, { useEffect, useRef } from 'react'
import Calculator from './Calculator'
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

const hasRiverTop = (lot: LotDetails) => (lot.lotY + 5) % 12 == 0
const hasRiverBottom = (lot: LotDetails) => (lot.lotY + 6) % 12 == 0
const hasRiverLeft = (lot: LotDetails) => (lot.lotX + 5) % 12 == 0
const hasRiverRight = (lot: LotDetails) => (lot.lotX + 6) % 12 == 0
const hasRiver = (lot: LotDetails) =>
  hasRiverRight(lot) ||
  hasRiverLeft(lot) ||
  hasRiverTop(lot) ||
  hasRiverBottom(lot)

const drawWater = (ctx: CanvasRenderingContext2D, lot: LotDetails) => {
  ctx.fillStyle = '#425f91'

  if (hasRiverRight(lot)) {
    ctx.fillRect(lot.x + lot.width, lot.y, lot.width / -2, lot.height)
  }

  if (hasRiverLeft(lot)) {
    ctx.fillRect(lot.x, lot.y, lot.width / 2, lot.height)
  }

  if (hasRiverBottom(lot)) {
    ctx.fillRect(lot.x, lot.y + lot.height, lot.width, lot.height / -2)
  }

  if (hasRiverTop(lot)) {
    ctx.fillRect(lot.x, lot.y, lot.width, lot.height / 2)
  }
}

const hasParkBottomRight = (lot: LotDetails) =>
  lot.lotX % 12 == 0 && lot.lotY % 12 == 0
const hasParkBottomLeft = (lot: LotDetails) =>
  (lot.lotX - 1) % 12 == 0 && lot.lotY % 12 == 0
const hasParkTopRight = (lot: LotDetails) =>
  lot.lotX % 12 == 0 && (lot.lotY - 1) % 12 == 0
const hasParkTopLeft = (lot: LotDetails) =>
  (lot.lotX - 1) % 12 == 0 && (lot.lotY - 1) % 12 == 0
const hasPark = (lot: LotDetails) =>
  hasParkBottomLeft(lot) ||
  hasParkBottomRight(lot) ||
  hasParkTopLeft(lot) ||
  hasParkTopRight(lot)

const drawPark = (ctx: CanvasRenderingContext2D, lot: LotDetails) => {
  ctx.fillStyle = '#33691e'
  if (hasPark(lot)) {
    ctx.fillRect(lot.x, lot.y, lot.width, lot.height)
  }

  if (hasParkTopLeft(lot)) {
    ctx.beginPath()
    ctx.fillStyle = '#6b3a2b'
    ctx.fillRect(
      lot.x - lot.width + halfRoadSize(lot),
      lot.y - lot.height * 0.075,
      (lot.width - halfRoadSize(lot)) * 2,
      lot.height * 0.15
    )
    ctx.fillRect(
      lot.x - lot.width * 0.075,
      lot.y - lot.height + halfRoadSize(lot),
      lot.width * 0.15,
      (lot.height - halfRoadSize(lot)) * 2
    )
    ctx.arc(lot.x, lot.y, lot.width / 2.5, 0, 2 * Math.PI, false)
    ctx.fill()

    ctx.beginPath()
    ctx.fillStyle = '#7b7b7b'
    ctx.arc(lot.x, lot.y, lot.width / 3.5, 0, 2 * Math.PI, false)
    ctx.fill()

    ctx.beginPath()
    ctx.fillStyle = '#9d9d9d'
    ctx.arc(
      lot.x - lot.width * 0.01,
      lot.y - lot.width * 0.01,
      lot.width / 3.5,
      0,
      2 * Math.PI,
      false
    )
    ctx.fill()

    ctx.beginPath()
    ctx.fillStyle = '#7b7b7b'
    ctx.arc(
      lot.x - lot.width * 0.01,
      lot.y - lot.width * 0.01,
      lot.width / 3.8,
      0,
      2 * Math.PI,
      false
    )
    ctx.fill()

    ctx.beginPath()
    ctx.fillStyle = '#425f91'
    ctx.arc(
      lot.x - lot.width * 0.008,
      lot.y - lot.width * 0.008,
      lot.width / 3.9,
      0,
      2 * Math.PI,
      false
    )
    ctx.fill()
  }
}

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
  if (ctx) {
    ctx.clearRect(0, 0, props.canvasWidth, props.canvasHeight)

    const calculator = new Calculator(props),
      minLotX = calculator.getMinLotX(),
      minLotY = calculator.getMinLotY(),
      maxLotX = calculator.getMaxLotX(),
      maxLotY = calculator.getMaxLotY()

    for (let lotY = minLotY; lotY <= maxLotY; lotY++) {
      const y = calculator.getPositionYByLotY(lotY)
      for (let lotX = minLotX; lotX <= maxLotX; lotX++) {
        const x = calculator.getPositionXByLotX(lotX)
        const lotDetails: LotDetails = {
          lotX,
          lotY,
          x,
          y,
          width: props.lotWidth,
          height: props.lotHeight,
        }
        drawWater(ctx, lotDetails)
        drawPark(ctx, lotDetails)
        drawRoadBase(ctx, lotDetails)
        drawRoadCorner(ctx, lotDetails)
        drawRoadLines(ctx, lotDetails)

        if (!hasRiver(lotDetails) && !hasPark(lotDetails)) {
          ctx.fillStyle = '#ff0000'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.font = props.lotHeight / 5 + 'px Arial'
          ctx.fillText(
            `${lotX},${lotY}`,
            x + lotDetails.width / 2,
            y + lotDetails.height / 2,
            props.lotWidth
          )
        }
      }
    }
  }
}

const InfrastructureLayer = (props: LayerProps): JSX.Element => {
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
  }, [props.lotWidth, props.lotHeight, props.centerLotX, props.centerLotY])

  return <canvas ref={canvasRef} className={props.className} />
}

export default InfrastructureLayer
