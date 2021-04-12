import React from 'react'
import { AppProps } from 'next/app'
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
        <Component {...pageProps} />
      </ThemeProvider>
    </React.Fragment>
  )
}
