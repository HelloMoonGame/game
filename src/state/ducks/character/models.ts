export interface CharacterState {
  myCharacter: Character
  neighbours: Character[]
}

enum Sex {
  Female = 'Female',
  Male = 'Male',
}

export interface Character {
  id: string
  firstName: string
  lastName: string
  sex: Sex
  location: LotLocation
}

export interface LotLocation {
  x: number
  y: number
}

export interface CreateCharacterRequest {
  firstName: string
  lastName: string
  sex: Sex
}

export interface ApiError<T> {
  errorMessage: string
  errorCode: number
  data: T
}
