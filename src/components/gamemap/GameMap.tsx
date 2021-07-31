import React, { useEffect, useRef, useState } from 'react'
import { makeStyles } from '@material-ui/core'
import BackgroundLayer from './BackgroundLayer'
import InfrastructureLayer from './InfrastructureLayer'
import CharacterLayer from './CharacterLayer'
import Calculator from './Calculator'
import { LayerProps } from './LayerProps'
import { useAppDispatch, useAppSelector } from '../../state/hooks'
import { travelOperations } from '../../state/ducks/travel'
import { characterSelectors } from '../../state/ducks/character'

const useStyles = makeStyles(() => ({
  canvas: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    cursor: 'pointer',
  },
}))

const GameMap = (): JSX.Element => {
  const classes = useStyles(),
    dispatch = useAppDispatch(),
    divRef = useRef<HTMLDivElement>(null),
    myCharacter = useAppSelector(characterSelectors.getMyCharacter)

  const minZoomLevel = useRef(400)
  const maxZoomLevel = useRef(400)

  const [layerProps, _setLayerProps] = useState<LayerProps>({
    canvasHeight: 0,
    canvasWidth: 0,
    centerLotX: 0,
    centerLotY: 0,
    lotHeight: 400,
    lotWidth: 400,
  })

  const setLayerProps = (values) => {
    _setLayerProps((state) => {
      return { ...state, ...values }
    })
  }

  const setZoomLevel = (value) => {
    value = Math.ceil(
      Math.max(minZoomLevel.current, Math.min(maxZoomLevel.current, value))
    )
    setLayerProps({
      lotWidth: value,
      lotHeight: value,
    })
  }

  const resized = () => {
    const div = divRef.current
    minZoomLevel.current =
      (Math.min(div.clientWidth, div.clientHeight) / 11) * 4
    maxZoomLevel.current = (Math.min(div.clientWidth, div.clientHeight) / 1) * 4
    setLayerProps({
      canvasWidth: div.clientWidth * 4,
      canvasHeight: div.clientHeight * 4,
    })
    setZoomLevel(layerProps.lotWidth)
  }

  const zoom = (event: WheelEvent) => {
    event.preventDefault()
    const limit = (value) =>
      Math.ceil(
        Math.max(minZoomLevel.current, Math.min(maxZoomLevel.current, value))
      )
    _setLayerProps((state) => ({
      ...state,
      lotWidth: limit(state.lotWidth * (event.deltaY > 0 ? 0.85 : 1.15)),
      lotHeight: limit(state.lotHeight * (event.deltaY > 0 ? 0.85 : 1.15)),
    }))
  }

  function travel() {
    dispatch(
      travelOperations.startTravelAsync({
        characterId: myCharacter.id,
        x: layerProps.hoveredLotX,
        y: layerProps.hoveredLotY,
      })
    )
  }

  const [mouseOffsetX, setMouseOffsetX] = useState<number>()
  const [mouseOffsetY, setMouseOffsetY] = useState<number>()
  const mousemove = (event: MouseEvent) => {
    setMouseOffsetX(event.offsetX)
    setMouseOffsetY(event.offsetY)
  }
  useEffect(() => {
    const calculator = new Calculator(layerProps)
    const lotX = calculator.getLotXByPositionX(mouseOffsetX * 4),
      lotY = calculator.getLotYByPositionY(mouseOffsetY * 4)
    setLayerProps({
      hoveredLotX: lotX,
      hoveredLotY: lotY,
    })
  }, [mouseOffsetX, mouseOffsetY])

  useEffect(() => {
    const div = divRef.current

    window.addEventListener('resize', resized)
    resized()
    setZoomLevel((Math.min(div.clientWidth, div.clientHeight) / 5) * 4)
    div.onwheel = zoom
    div.onmousemove = mousemove
    return () => window.removeEventListener('resize', resized)
  }, [])

  return (
    <>
      <BackgroundLayer className={classes.canvas} {...layerProps} />
      <InfrastructureLayer className={classes.canvas} {...layerProps} />
      <CharacterLayer className={classes.canvas} {...layerProps} />
      <div className={classes.canvas} ref={divRef} onClick={travel}></div>
    </>
  )
}

export default GameMap
