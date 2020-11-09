/**
 * @fileoverview gRPC-Web generated client stub for characterApi
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!

/* eslint-disable */
// @ts-nocheck

import * as grpcWeb from 'grpc-web'

import * as location_pb from './location_pb'

export class LocationClient {
  client_: grpcWeb.AbstractClientBase
  hostname_: string
  credentials_: null | { [index: string]: string }
  options_: null | { [index: string]: any }

  constructor(
    hostname: string,
    credentials?: null | { [index: string]: string },
    options?: null | { [index: string]: any }
  ) {
    if (!options) options = {}
    if (!credentials) credentials = {}
    options['format'] = 'text'

    this.client_ = new grpcWeb.GrpcWebClientBase(options)
    this.hostname_ = hostname
    this.credentials_ = credentials
    this.options_ = options
  }

  methodInfoSubscribe = new grpcWeb.AbstractClientBase.MethodInfo(
    location_pb.LocationUpdateResponse,
    (request: location_pb.Empty) => {
      return request.serializeBinary()
    },
    location_pb.LocationUpdateResponse.deserializeBinary
  )

  subscribe(request: location_pb.Empty, metadata?: grpcWeb.Metadata) {
    return this.client_.serverStreaming(
      this.hostname_ + '/characterApi.Location/Subscribe',
      request,
      metadata || {},
      this.methodInfoSubscribe
    )
  }
}
