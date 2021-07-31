import React, { useEffect, useRef } from 'react'
import { LayerProps } from './LayerProps'

const BackgroundLayer = (props: LayerProps): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const drawBackground = (ctx: CanvasRenderingContext2D) => {
    if (!ctx) return
    ctx.fillStyle = '#EDEDDD'
    ctx.fillRect(0, 0, props.canvasWidth, props.canvasHeight)
  }

  const draw = (ctx) => {
    drawBackground(ctx)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    canvas.width = props.canvasWidth
    canvas.height = props.canvasHeight
    draw(context)
  }, [props.canvasWidth, props.canvasHeight])

  return <canvas ref={canvasRef} className={props.className} />
}

export default BackgroundLayer
