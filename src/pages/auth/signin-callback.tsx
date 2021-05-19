import { Typography, Container, Box, Button } from '@material-ui/core'
import { UserManager } from 'oidc-client'
import React, { useEffect, useState } from 'react'
import AuthService from '../../services/AuthService'

export const SigninCallback = (): JSX.Element => {
  const [title, setTitle] = useState('Checking...')
  const [message, setMessage] = useState<string>()

  useEffect(() => {
    new UserManager({ response_mode: 'query' })
      .signinRedirectCallback()
      .then(function () {
        setTitle('Login succes')
        window.location.href = '/'
      })
      .catch(function (e: Error) {
        if (e.message) setMessage(e.message)
        setTitle('Login failed')
      })
  }, [])

  const retry = () => {
    AuthService.getInstance().login()
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100%"
      justifyContent="center"
    >
      <Container maxWidth="md">
        <Typography align="center" color="textPrimary" variant="h2">
          {title}
        </Typography>
        <Typography align="center" color="textPrimary" variant="h6">
          {message}
        </Typography>
        <Box textAlign="center" marginTop="20px">
          <Button variant="contained" color="primary" onClick={retry}>
            Try again
          </Button>
        </Box>
      </Container>
    </Box>
  )
}

export default SigninCallback
