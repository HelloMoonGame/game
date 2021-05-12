import { AppState } from '../../store'

const getMyCharacter = (state: AppState) => {
  return state?.character?.myCharacter
}

export default { getMyCharacter }
