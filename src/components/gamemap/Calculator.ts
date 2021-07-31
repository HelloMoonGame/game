import { LayerProps } from './LayerProps'

export default class Calculator {
  props: LayerProps

  constructor(layerProps: LayerProps) {
    this.props = layerProps
  }

  getCenterLotPositionX(): number {
    return Math.round(this.props.canvasWidth / 2 - this.props.lotWidth / 2)
  }

  getCenterLotPositionY(): number {
    return Math.round(this.props.canvasHeight / 2 - this.props.lotHeight / 2)
  }

  getLotXByPositionX(x: number): number {
    const distanceFromCenter = x - this.getCenterLotPositionX()
    return Math.floor(
      this.props.centerLotX + distanceFromCenter / this.props.lotWidth
    )
  }

  getLotYByPositionY(y: number): number {
    const distanceFromCenter = y - this.getCenterLotPositionY()
    return Math.floor(
      this.props.centerLotY + distanceFromCenter / this.props.lotHeight
    )
  }

  getPositionXByLotX(lotX: number): number {
    const lotDistance = lotX - this.props.centerLotX

    return this.getCenterLotPositionX() + lotDistance * this.props.lotWidth
  }

  getPositionYByLotY(lotY: number): number {
    const lotDistance = lotY - this.props.centerLotY

    return this.getCenterLotPositionY() + lotDistance * this.props.lotHeight
  }

  getMinLotX(): number {
    const lotsLeftFromCenter = Math.ceil(
      this.getCenterLotPositionX() / this.props.lotWidth
    )
    return this.props.centerLotX - lotsLeftFromCenter
  }

  getMinLotY(): number {
    const lotsAboveCenter = Math.ceil(
      this.getCenterLotPositionY() / this.props.lotHeight
    )
    return this.props.centerLotY - lotsAboveCenter
  }

  getMaxLotX(): number {
    const positionXRightFromCenter =
        this.getCenterLotPositionX() + this.props.lotWidth,
      lotsRightFromCenter = Math.ceil(
        (this.props.canvasWidth - positionXRightFromCenter) /
          this.props.lotWidth
      )
    return this.props.centerLotX + lotsRightFromCenter
  }

  getMaxLotY(): number {
    const positionYUnderCenter =
        this.getCenterLotPositionY() + this.props.lotHeight,
      lotsUnderCenter = Math.ceil(
        (this.props.canvasHeight - positionYUnderCenter) / this.props.lotWidth
      )
    return this.props.centerLotY + lotsUnderCenter
  }
}
