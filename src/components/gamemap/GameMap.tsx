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

  const resized = () => {
    const div = divRef.current
    setCanvasWidth(div.clientWidth * 4)
    setCanvasHeight(div.clientHeight * 4)
  }

  useEffect(() => {
    window.addEventListener('resize', resized)
    resized()
    return () => window.removeEventListener('resize', resized)
  }, [])

  return (
    <>
      <BackgroundLayer
        className={classes.canvas}
        canvasWidth={canvasWidth}
        canvasHeight={canvasHeight}
        lotWidth={400}
        lotHeight={400}
      />
      <InfrastructureLayer
        className={classes.canvas}
        canvasWidth={canvasWidth}
        canvasHeight={canvasHeight}
        lotWidth={400}
        lotHeight={400}
      />
      <div className={classes.canvas} ref={divRef}></div>
    </>
  )
}

export default GameMap
