import { createAsyncThunk } from '@reduxjs/toolkit'

import * as types from './types'
import { startTravel } from './travelAPI'
import { ApiError, CharacterLocation, StartTravelRequest } from './models'

export const startTravelAsync = createAsyncThunk<
  CharacterLocation,
  StartTravelRequest,
  {
    rejectValue: ApiError<CharacterLocation>
  }
>(types.START_TRAVEL, async (travelRequest, { rejectWithValue }) => {
  try {
    return await startTravel(travelRequest)
  } catch (e) {
    return rejectWithValue({
      errorMessage: `${e.message} (${e.response.statusText})`,
      errorCode: e.response.status,
      data: e.response.data,
    })
  }
})
