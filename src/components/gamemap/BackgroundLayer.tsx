import React, { useEffect, useRef } from 'react'
import { LayerProps } from './LayerProps'

const draw = (ctx, width, height) => {
  if (ctx) {
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = '#EDEDDD'
    ctx.fillRect(0, 0, width, height)
  }
}

const BackgroundLayer = ({
  className,
  canvasWidth,
  canvasHeight,
}: LayerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    canvas.width = canvasWidth
    canvas.height = canvasHeight
    draw(context, canvasWidth, canvasHeight)
  }, [canvasWidth, canvasHeight])

  return <canvas ref={canvasRef} className={className} />
}

export default BackgroundLayer
