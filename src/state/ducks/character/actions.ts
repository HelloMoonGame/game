import { createAsyncThunk } from '@reduxjs/toolkit'

import * as types from './types'
import { fetchMyCharacter, createMyCharacter } from './myCharacterAPI'
import { ApiError, Character, CreateCharacterRequest } from './models'

export const fetchMyCharacterAsync = createAsyncThunk<
  Character,
  void,
  {
    rejectValue: ApiError<Character>
  }
>(types.FETCH_MYCHARACTER, async (_, { rejectWithValue }) => {
  try {
    return await fetchMyCharacter()
  } catch (e) {
    return rejectWithValue(e.message)
  }
})

export const createMyCharacterAsync = createAsyncThunk<
  Character,
  CreateCharacterRequest,
  {
    rejectValue: ApiError<Character>
  }
>(types.CREATE_MYCHARACTER, async (character, { rejectWithValue }) => {
  try {
    return await createMyCharacter(character)
  } catch (e) {
    return rejectWithValue({
      errorMessage: `${e.message} (${e.response.statusText})`,
      errorCode: e.response.status,
      data: e.response.data,
    })
  }
})
