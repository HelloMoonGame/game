import React, { ReactNode } from 'react'
import Head from 'next/head'
import {
  AppBar,
  BottomNavigation,
  BottomNavigationAction,
  Icon,
  makeStyles,
  Toolbar,
  Typography,
} from '@material-ui/core'

type Props = {
  children?: ReactNode
  title?: string
}

const useStyles = makeStyles((theme) => ({
  pageMain: {
    position: 'relative',
    width: '100%',
    minHeight: 'calc(100vh - 56px - 56px);',
    top: 56,
    marginBottom: 56,
    [theme.breakpoints.up('sm')]: {
      top: 64,
      minHeight: 'calc(100vh - 56px - 64px);',
    },
  },
  pageFooter: {
    position: 'fixed',
    bottom: 0,
    width: '100%',
  },
}))

const Layout = ({ children, title }: Props) => {
  const classes = useStyles()

  return (
    <>
      <Head>
        <title>{title ? title + ' - Hello Moon' : 'Hello Moon'}</title>
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&amp;display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </Head>
      <header>
        <AppBar position="fixed">
          <Toolbar>
            <Typography variant="h6">Hello Moon</Typography>
          </Toolbar>
        </AppBar>
      </header>
      <main className={classes.pageMain}>{children}</main>
      <footer className={classes.pageFooter}>
        <BottomNavigation
          // value={value}
          // onChange={(event, newValue) => {
          //   setValue(newValue);
          // }}
          showLabels
        >
          <BottomNavigationAction
            label="Explore"
            icon={<Icon>location_on</Icon>}
          />
        </BottomNavigation>
      </footer>
    </>
  )
}

export default Layout
