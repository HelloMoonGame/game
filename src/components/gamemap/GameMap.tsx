import React, { useEffect, useRef, useState } from 'react'
import { makeStyles } from '@material-ui/core'
import BackgroundLayer from './BackgroundLayer'

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

  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  const resized = () => {
    const div = divRef.current
    setWidth(div.clientWidth)
    setHeight(div.clientHeight)
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
        width={width}
        height={height}
      />
      <div className={classes.canvas} ref={divRef}></div>
    </>
  )
}

export default GameMap
