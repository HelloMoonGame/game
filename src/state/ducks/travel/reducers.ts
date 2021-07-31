import { createSlice } from '@reduxjs/toolkit'

import { startTravelAsync } from './actions'
import { TravelState } from './models'

/* State Shape
{
    travel: {
      lastTravelJob: CharacterLocation
    }
}
*/

const initialState: TravelState = {
  lastTravelJob: null,
}

export const counterSlice = createSlice({
  name: 'travel',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(startTravelAsync.fulfilled, (state, action) => {
      state.lastTravelJob = action.payload
    })
  },
})

export default counterSlice.reducer
