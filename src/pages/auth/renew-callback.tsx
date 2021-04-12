import { UserManager } from 'oidc-client'
import React, { useEffect } from 'react'

export const RenewCallback = (): JSX.Element => {
  useEffect(() => {
    new UserManager({}).signinSilentCallback().catch(function (error) {
      console.error(error)
    })
  }, [])

  return <p>Loading...</p>
}

export default RenewCallback
