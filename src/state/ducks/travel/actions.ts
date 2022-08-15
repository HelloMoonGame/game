import * as types from './types'
import { startTravel } from './travelAPI'
import { CharacterLocation, StartTravelRequest } from './models'
import { createAsyncThunkApi } from '../../utils/thunkUtils'

export const startTravelAsync = createAsyncThunkApi<
  CharacterLocation,
  StartTravelRequest
>(types.START_TRAVEL, startTravel)
