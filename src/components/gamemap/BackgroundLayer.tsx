import React, { useEffect, useRef } from 'react'

const draw = (ctx, width, height) => {
  if (ctx) {
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = '#EDEDDD'
    ctx.fillRect(0, 0, width, height)
  }
}

const BackgroundLayer = (props) => {
  const canvasRef = useRef(null)

  const resized = () => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight
    draw(context, canvas.clientWidth, canvas.clientHeight)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    window.addEventListener('resize', resized)
    resized()
    return () => canvas.removeEventListener('resize', resized)
  })

  return <canvas ref={canvasRef} {...props} />
}

export default BackgroundLayer
