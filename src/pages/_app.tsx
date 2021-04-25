import React from 'react'
import { AppProps } from 'next/app'
import { createMuiTheme, CssBaseline, ThemeProvider } from '@material-ui/core'
import Layout from '../components/Layout'
import '../styles/game.css'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#212529',
    },
  },
})

export default function MyApp({ Component, pageProps, router }: AppProps) {
  return (
    <React.Fragment>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        {router.pathname.startsWith('/auth/') ? (
          <Component {...pageProps} />
        ) : (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        )}
      </ThemeProvider>
    </React.Fragment>
  )
}
