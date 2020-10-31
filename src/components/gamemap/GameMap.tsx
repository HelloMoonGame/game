import React from 'react'
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
  const classes = useStyles()

  return (
    <>
      <BackgroundLayer className={classes.canvas} />
    </>
  )
}

export default GameMap
