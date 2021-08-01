import { AppState } from '../../store'
import { Character } from './models'

const getMyCharacter = (state: AppState): Character => {
  return state?.character?.myCharacter
}

const getNeighbours = (state: AppState): Character[] => {
  return state?.character?.neighbours
}

export default { getMyCharacter, getNeighbours }
