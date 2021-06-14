import { Box, Container, Typography, Button } from '@material-ui/core'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

const ErrorPage = (): JSX.Element => {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Error - Hello Moon</title>
      </Head>
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container maxWidth="md">
          <Typography align="center" color="textPrimary" variant="h2">
            Error
          </Typography>
          <Typography align="center" color="textPrimary" variant="h6">
            Sorry, something went wrong!
          </Typography>
          <Box textAlign="center" marginTop="20px">
            <Button
              variant="contained"
              color="primary"
              onClick={() => router.push('/')}
            >
              Homepage
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  )
}

export default ErrorPage
