import React from 'react'
import { AppProps } from 'next/app'
import { createMuiTheme, CssBaseline, ThemeProvider } from '@material-ui/core'
import Layout from '../components/Layout'
import '../styles/game.css'
import { Provider } from 'react-redux'

import store from '../state/store'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#212529',
    },
  },
})

export default function MyApp({ Component, pageProps, router }: AppProps) {
  return (
    <Provider store={store}>
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
    </Provider>
  )
}
