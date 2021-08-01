import { createSlice } from '@reduxjs/toolkit'

import {
  addNeighbour,
  createMyCharacterAsync,
  deleteNeighbour,
  fetchMyCharacterAsync,
  moveMyCharacter,
  moveNeighbour,
} from './actions'
import { CharacterState } from './models'

/* State Shape
{
    character: {
      myCharacter: Character
      neighbours: Character[]
    }
}
*/

const initialState: CharacterState = {
  myCharacter: null,
  neighbours: [],
}

export const counterSlice = createSlice({
  name: 'character',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchMyCharacterAsync.fulfilled, (state, action) => {
      state.myCharacter = action.payload
    })
    builder.addCase(createMyCharacterAsync.fulfilled, (state, action) => {
      state.myCharacter = action.payload
    })
    builder.addCase(createMyCharacterAsync.rejected, (state, action) => {
      if (action.payload.data && action.payload.errorCode == 409) {
        state.myCharacter = action.payload.data
      }
    })
    builder.addCase(moveMyCharacter, (state, action) => {
      state.myCharacter.location = action.payload
    })
    builder.addCase(addNeighbour, (state, action) => {
      state.neighbours.push({
        id: action.payload.characterId,
        firstName: null,
        lastName: null,
        sex: null,
        location: {
          x: action.payload.x,
          y: action.payload.y,
        },
      })
    })
    builder.addCase(moveNeighbour, (state, action) => {
      state.neighbours.find(
        (c) => c.id == action.payload.characterId
      ).location = {
        x: action.payload.x,
        y: action.payload.y,
      }
    })
    builder.addCase(deleteNeighbour, (state, action) => {
      state.neighbours = state.neighbours.filter(
        (c) => c.id == action.payload.characterId
      )
    })
  },
})

export default counterSlice.reducer
