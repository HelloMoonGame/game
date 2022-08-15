import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit'

export function createAsyncThunkApi<Returned, ThunkArg = void>(
  typePrefix: string,
  fn: (arg: ThunkArg) => Promise<Returned>
): AsyncThunk<Returned, ThunkArg, { rejectValue: ApiError<Returned> }> {
  return createAsyncThunk<
    Returned,
    ThunkArg,
    {
      rejectValue: ApiError<Returned>
    }
  >(typePrefix, async (arg, { rejectWithValue }) => {
    try {
      return await fn(arg)
    } catch (e) {
      return rejectWithValue({
        errorMessage: `${e.message} (${e.response.statusText})`,
        errorCode: e.response.status,
        data: e.response.data,
      })
    }
  })
}

export interface ApiError<T> {
  errorMessage: string
  errorCode: number
  data: T
}
