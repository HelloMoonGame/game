import React, { useEffect, useRef } from 'react'
import { LayerProps } from './LayerProps'

import { useAppSelector } from '../../state/hooks'
import { characterSelectors } from '../../state/ducks/character'
import Calculator from './Calculator'
import { Character } from '../../state/ducks/character/models'

const redraw = (
  ctx: CanvasRenderingContext2D,
  props: LayerProps,
  neighbours: Character[],
  myCharacter: Character
) => {
  if (ctx) {
    const calculator = new Calculator(props),
      minLotX = calculator.getMinLotX(),
      minLotY = calculator.getMinLotY(),
      maxLotX = calculator.getMaxLotX(),
      maxLotY = calculator.getMaxLotY()

    ctx.clearRect(0, 0, props.canvasWidth, props.canvasHeight)

    for (let lotY = minLotY; lotY <= maxLotY; lotY++) {
      const y = calculator.getPositionYByLotY(lotY)
      for (let lotX = minLotX; lotX <= maxLotX; lotX++) {
        const x = calculator.getPositionXByLotX(lotX)

        const charactersOnLot = neighbours.filter(
          (c) => c.location && c.location.x == lotX && c.location.y == lotY
        )
        if (
          myCharacter.location &&
          myCharacter.location.x == lotX &&
          myCharacter.location.y == lotY
        ) {
          charactersOnLot.push(myCharacter)
        }

        const charactersOnLotToShow = charactersOnLot.slice(-15)

        const offsetY = props.lotHeight * (lotY % 2 === 0 ? 0.15 : 0.85)

        charactersOnLotToShow.forEach((character, index) => {
          const characterOffsetX =
            (charactersOnLotToShow.length - index + 1) * (props.lotWidth * 0.05)
          const offsetX =
            lotX % 2 === 0
              ? props.lotWidth * 0.15 + characterOffsetX
              : props.lotWidth * 0.85 - characterOffsetX

          ctx.fillStyle = myCharacter === character ? '#0F0' : '#000'
          ctx.beginPath()
          ctx.arc(
            x + offsetX,
            y + offsetY,
            props.lotWidth * 0.05,
            0,
            2 * Math.PI
          )
          ctx.fill()
        })

        const charactersNotVisible =
          charactersOnLot.length - charactersOnLotToShow.length
        if (charactersNotVisible > 0) {
          const offsetXForText =
            lotX % 2 === 0 ? props.lotWidth * 0.95 : props.lotHeight * 0.05
          ctx.fillStyle = '#FFF'
          ctx.font = props.lotHeight * 0.075 + 'px Arial'
          ctx.textAlign = lotX % 2 === 0 ? 'right' : 'left'
          ctx.fillText(
            `+${charactersNotVisible}`,
            x + offsetXForText,
            y + offsetY + props.lotHeight * 0.025,
            props.lotWidth
          )
        }
      }
    }
  }
}

const CharacterLayer = (props: LayerProps): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const myCharacter = useAppSelector(characterSelectors.getMyCharacter)
  const neighbours = useAppSelector(characterSelectors.getNeighbours)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    canvas.width = props.canvasWidth
    canvas.height = props.canvasHeight
    redraw(context, props, neighbours, myCharacter)
  }, [props.canvasWidth, props.canvasHeight])

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    redraw(context, props, neighbours, myCharacter)
  }, [
    props.lotWidth,
    props.lotHeight,
    props.centerLotX,
    props.centerLotY,
    neighbours,
    myCharacter,
  ])

  return <canvas ref={canvasRef} className={props.className} />
}

export default CharacterLayer
