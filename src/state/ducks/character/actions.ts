import { createAction } from '@reduxjs/toolkit'

import * as types from './types'
import { fetchMyCharacter, createMyCharacter } from './myCharacterAPI'
import { createAsyncThunkApi } from '../../utils/thunkUtils'
import { Character, CreateCharacterRequest } from './models'

export const fetchMyCharacterAsync = createAsyncThunkApi(
  types.FETCH_MYCHARACTER,
  fetchMyCharacter
)

export const createMyCharacterAsync = createAsyncThunkApi<
  Character,
  CreateCharacterRequest
>(types.CREATE_MYCHARACTER, createMyCharacter)

export const moveMyCharacter = createAction(
  types.MOVE_MYCHARACTER,
  (x: number, y: number) => ({ payload: { x, y } })
)

export const addNeighbour = createAction(
  types.ADD_NEIGHBOUR,
  (characterId: string, x: number, y: number) => ({
    payload: { characterId, x, y },
  })
)

export const moveNeighbour = createAction(
  types.MOVE_NEIGHBOUR,
  (characterId: string, x: number, y: number) => ({
    payload: { characterId, x, y },
  })
)

export const deleteNeighbour = createAction(
  types.DELETE_NEIGHBOUR,
  (characterId: string) => ({ payload: { characterId } })
)
