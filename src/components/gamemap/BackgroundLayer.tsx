import React, { useEffect, useRef } from 'react'
import Calculator from './Calculator'
import { LayerProps } from './LayerProps'

const BackgroundLayer = (props: LayerProps): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const drawBackground = (ctx: CanvasRenderingContext2D) => {
    if (!ctx) return
    ctx.fillStyle = '#EDEDDD'
    ctx.fillRect(0, 0, props.canvasWidth, props.canvasHeight)
  }

  const drawHover = (ctx: CanvasRenderingContext2D) => {
    if (!ctx || props.hoveredLotX == null || props.hoveredLotY == null) return
    const calculator = new Calculator(props),
      x = calculator.getPositionXByLotX(props.hoveredLotX),
      y = calculator.getPositionYByLotY(props.hoveredLotY)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.fillRect(x, y, props.lotWidth, props.lotHeight)
  }

  const draw = (ctx) => {
    drawBackground(ctx)
    drawHover(ctx)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    canvas.width = props.canvasWidth
    canvas.height = props.canvasHeight
    draw(context)
  }, [
    props.canvasWidth,
    props.canvasHeight,
    props.hoveredLotX,
    props.hoveredLotY,
  ])

  return <canvas ref={canvasRef} className={props.className} />
}

export default BackgroundLayer
