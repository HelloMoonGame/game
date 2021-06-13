import React from 'react'
import { AppProps } from 'next/app'
import { createMuiTheme, CssBaseline, ThemeProvider } from '@material-ui/core'
import Layout from '../components/Layout'
import { Provider } from 'react-redux'

import store from '../state/store'
import AuthenticationCheck from '../components/AuthenticationCheck'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#0b3663',
    },
    secondary: {
      main: '#fdd300',
    },
  },
})

export default function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <Provider store={store}>
      <CssBaseline />
      <AuthenticationCheck>
        <ThemeProvider theme={theme}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>
      </AuthenticationCheck>
    </Provider>
  )
}
