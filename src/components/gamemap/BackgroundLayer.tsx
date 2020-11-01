import React, { useEffect, useRef } from 'react'
import { LayerProps } from './LayerProps'

const draw = (ctx, width, height) => {
  if (ctx) {
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = '#EDEDDD'
    ctx.fillRect(0, 0, width, height)
  }
}

const BackgroundLayer = ({ className, width, height }: LayerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    canvas.width = width
    canvas.height = height
    draw(context, width, height)
  }, [width, height])

  return <canvas ref={canvasRef} className={className} />
}

export default BackgroundLayer
