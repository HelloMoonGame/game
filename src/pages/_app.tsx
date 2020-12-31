import React from 'react'
import { AppProps } from 'next/app'
import { Provider } from 'next-auth/client'
import { createMuiTheme, CssBaseline, ThemeProvider } from '@material-ui/core'
import '../styles/game.css'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#212529',
    },
  },
})

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <React.Fragment>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <Provider session={pageProps.session}>
          <Component {...pageProps} />
        </Provider>
      </ThemeProvider>
    </React.Fragment>
  )
}
