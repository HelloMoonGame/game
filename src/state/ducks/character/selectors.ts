import { AppState } from '../../store'
import { Character } from './models'

const getMyCharacter = (state: AppState): Character => {
  return state?.character?.myCharacter
}

export default { getMyCharacter }
