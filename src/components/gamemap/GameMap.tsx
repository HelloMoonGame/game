import React, { useEffect, useRef, useState } from 'react'
import { makeStyles } from '@material-ui/core'
import BackgroundLayer from './BackgroundLayer'
import InfrastructureLayer from './InfrastructureLayer'

const useStyles = makeStyles(() => ({
  canvas: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
}))

const GameMap = () => {
  const classes = useStyles(),
    divRef = useRef<HTMLDivElement>(null)

  const [canvasWidth, setCanvasWidth] = useState(0)
  const [canvasHeight, setCanvasHeight] = useState(0)
  const [zoomLevel, _setZoomLevel] = useState(400)
  const zoomLevelRef = React.useRef(zoomLevel)
  const [minZoomLevel, _setMinZoomLevel] = useState(400)
  const minZoomLevelRef = React.useRef(minZoomLevel)
  const [maxZoomLevel, _setMaxZoomLevel] = useState(400)
  const maxZoomLevelRef = React.useRef(maxZoomLevel)

  const setMinZoomLevel = (value) => {
    _setMinZoomLevel(value)
    minZoomLevelRef.current = value
  }
  const setMaxZoomLevel = (value) => {
    _setMaxZoomLevel(value)
    maxZoomLevelRef.current = value
  }

  const setZoomLevel = (value) => {
    value = Math.ceil(
      Math.max(
        minZoomLevelRef.current,
        Math.min(maxZoomLevelRef.current, value)
      )
    )
    _setZoomLevel(value)

    zoomLevelRef.current = value
  }

  const resized = () => {
    const div = divRef.current
    setCanvasWidth(div.clientWidth * 4)
    setCanvasHeight(div.clientHeight * 4)
    setMinZoomLevel((Math.min(div.clientWidth, div.clientHeight) / 11) * 4)
    setMaxZoomLevel((Math.min(div.clientWidth, div.clientHeight) / 1) * 4)
    setZoomLevel(zoomLevelRef.current)
  }

  const zoom = (event: WheelEvent) => {
    event.preventDefault()
    setZoomLevel(zoomLevelRef.current * (event.deltaY > 0 ? 0.85 : 1.15))
  }

  useEffect(() => {
    const div = divRef.current

    window.addEventListener('resize', resized)
    resized()
    setZoomLevel((Math.min(div.clientWidth, div.clientHeight) / 5) * 4)
    div.onwheel = zoom
    return () => window.removeEventListener('resize', resized)
  }, [])

  return (
    <>
      <BackgroundLayer
        className={classes.canvas}
        canvasWidth={canvasWidth}
        canvasHeight={canvasHeight}
        lotWidth={zoomLevel}
        lotHeight={zoomLevel}
        centerLotX={0}
        centerLotY={0}
      />
      <InfrastructureLayer
        className={classes.canvas}
        canvasWidth={canvasWidth}
        canvasHeight={canvasHeight}
        lotWidth={zoomLevel}
        lotHeight={zoomLevel}
        centerLotX={0}
        centerLotY={0}
      />
      <div className={classes.canvas} ref={divRef}></div>
    </>
  )
}

export default GameMap
