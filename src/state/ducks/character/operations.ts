import { Dispatch } from '@reduxjs/toolkit'
import { AppState } from '../../store'
import {
  fetchMyCharacterAsync,
  createMyCharacterAsync,
  moveMyCharacter,
  moveNeighbour,
  addNeighbour,
  deleteNeighbour,
} from './actions'

const hideCharacter =
  (characterId: string) =>
  (dispatch: Dispatch, getState: () => AppState): void => {
    const state = getState().character
    if (state.neighbours.find((c) => c.id == characterId))
      dispatch(deleteNeighbour(characterId))
  }

const showCharacter =
  (characterId: string, x: number, y: number) =>
  (dispatch: Dispatch, getState: () => AppState): void => {
    const state = getState().character
    if (state.myCharacter?.id == characterId) dispatch(moveMyCharacter(x, y))
    else {
      const neighbour = state.neighbours.find((c) => c.id == characterId)
      if (neighbour) dispatch(moveNeighbour(characterId, x, y))
      else dispatch(addNeighbour(characterId, x, y))
    }
  }

export default {
  fetchMyCharacterAsync,
  createMyCharacterAsync,
  hideCharacter,
  showCharacter,
}
