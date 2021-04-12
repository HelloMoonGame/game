import { UserManager } from 'oidc-client'
import React, { useEffect } from 'react'

export const SigninCallback = (): JSX.Element => {
  useEffect(() => {
    new UserManager({ response_mode: 'query' })
      .signinRedirectCallback()
      .then(function () {
        window.location.href = '/'
      })
      .catch(function (e) {
        console.error(e)
      })
  }, [])

  return <p>Loading...</p>
}

export default SigninCallback
