export interface TravelState {
  lastTravelJob: CharacterLocation
}

export interface CharacterLocation {
  characterId: string
  x: number
  y: number
}

export interface StartTravelRequest {
  characterId: string
  x: number
  y: number
}
