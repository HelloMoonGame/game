import { createSlice } from '@reduxjs/toolkit'

import { createMyCharacterAsync, fetchMyCharacterAsync } from './actions'
import { CharacterState } from './models'

/* State Shape
{
    character: {
      myCharacter: Character
    }
}
*/

const initialState: CharacterState = {
  myCharacter: null,
}

export const counterSlice = createSlice({
  name: 'character',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchMyCharacterAsync.fulfilled, (state, action) => {
      state.myCharacter = action.payload
    }),
      builder.addCase(createMyCharacterAsync.fulfilled, (state, action) => {
        state.myCharacter = action.payload
      }),
      builder.addCase(createMyCharacterAsync.rejected, (state, action) => {
        if (action.payload.data && action.payload.errorCode == 409) {
          state.myCharacter = action.payload.data
        }
      })
  },
})

export default counterSlice.reducer
