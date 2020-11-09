import * as jspb from 'google-protobuf'

export class Empty extends jspb.Message {
  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): Empty.AsObject
  static toObject(includeInstance: boolean, msg: Empty): Empty.AsObject
  static serializeBinaryToWriter(
    message: Empty,
    writer: jspb.BinaryWriter
  ): void
  static deserializeBinary(bytes: Uint8Array): Empty
  static deserializeBinaryFromReader(
    message: Empty,
    reader: jspb.BinaryReader
  ): Empty
}

export namespace Empty {
  export type AsObject = {}
}

export class LocationUpdateResponse extends jspb.Message {
  getLocationupdatesList(): Array<LocationUpdate>
  setLocationupdatesList(value: Array<LocationUpdate>): LocationUpdateResponse
  clearLocationupdatesList(): LocationUpdateResponse
  addLocationupdates(value?: LocationUpdate, index?: number): LocationUpdate

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): LocationUpdateResponse.AsObject
  static toObject(
    includeInstance: boolean,
    msg: LocationUpdateResponse
  ): LocationUpdateResponse.AsObject
  static serializeBinaryToWriter(
    message: LocationUpdateResponse,
    writer: jspb.BinaryWriter
  ): void
  static deserializeBinary(bytes: Uint8Array): LocationUpdateResponse
  static deserializeBinaryFromReader(
    message: LocationUpdateResponse,
    reader: jspb.BinaryReader
  ): LocationUpdateResponse
}

export namespace LocationUpdateResponse {
  export type AsObject = {
    locationupdatesList: Array<LocationUpdate.AsObject>
  }
}

export class LocationUpdate extends jspb.Message {
  getCharacterid(): string
  setCharacterid(value: string): LocationUpdate

  getOnline(): boolean
  setOnline(value: boolean): LocationUpdate

  getX(): number
  setX(value: number): LocationUpdate

  getY(): number
  setY(value: number): LocationUpdate

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): LocationUpdate.AsObject
  static toObject(
    includeInstance: boolean,
    msg: LocationUpdate
  ): LocationUpdate.AsObject
  static serializeBinaryToWriter(
    message: LocationUpdate,
    writer: jspb.BinaryWriter
  ): void
  static deserializeBinary(bytes: Uint8Array): LocationUpdate
  static deserializeBinaryFromReader(
    message: LocationUpdate,
    reader: jspb.BinaryReader
  ): LocationUpdate
}

export namespace LocationUpdate {
  export type AsObject = {
    characterid: string
    online: boolean
    x: number
    y: number
  }
}
