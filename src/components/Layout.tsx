import React, { ReactNode, useEffect, useState } from 'react'
import Head from 'next/head'
import {
  AppBar,
  BottomNavigation,
  BottomNavigationAction,
  Icon,
  IconButton,
  makeStyles,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@material-ui/core'
import AuthService from '../services/AuthService'
import { User } from 'oidc-client'

type Props = {
  children?: ReactNode
  title?: string
}

const useStyles = makeStyles((theme) => ({
  pageMain: {
    position: 'relative',
    width: '100%',
    marginTop: 56,
    marginBottom: 56,
    [theme.breakpoints.up('sm')]: {
      marginTop: 64,
    },
  },
  title: {
    flexGrow: 1,
    display: 'flex',
    margin: 0,
  },
  titleImage: {
    height: 40,
  },
  username: {
    marginLeft: 5,
  },
  pageFooter: {
    position: 'fixed',
    bottom: 0,
    width: '100%',
    boxShadow:
      'rgb(0 0 0 / 20%) 0px -2px 1px -1px, rgb(0 0 0 / 14%) 0px -1px 1px 0px, rgb(0 0 0 / 12%) 0px -1px 3px 0px',
  },
  bottomNavigation: {
    backgroundColor: theme.palette.primary.main,
  },
  bottomNavigationAction: {
    color: theme.palette.primary.light,
    '&.Mui-selected, :hover': {
      color: theme.palette.primary.contrastText,
    },
  },
}))

const Layout = ({ children, title }: Props): JSX.Element => {
  const classes = useStyles()

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const [currentUser, setCurrentUser] = useState<User>()
  useEffect(() => {
    const authService = AuthService.getInstance()
    authService.getUser().then((user) => setCurrentUser(user))
  }, [])

  const signOut = () => {
    AuthService.getInstance().logout()
  }

  return (
    <>
      <Head>
        <title>{title ? title + ' - Hello Moon' : 'Hello Moon'}</title>
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#0b3663" />
        <meta name="msapplication-TileColor" content="#0b3663" />
        <meta name="theme-color" content="#0b3663"></meta>
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
            <h1 className={classes.title}>
              <img
                src="/logo.svg"
                alt="Hello Moon"
                className={classes.titleImage}
              />
            </h1>
            {currentUser && (
              <div>
                <IconButton
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <Icon>account_circle</Icon>
                  <Typography variant="body1" className={classes.username}>
                    {currentUser.profile.email}
                  </Typography>
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={open}
                  onClose={handleClose}
                >
                  <MenuItem onClick={signOut}>Logout</MenuItem>
                </Menu>
              </div>
            )}
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
          className={classes.bottomNavigation}
          value="explore"
        >
          <BottomNavigationAction
            label="Explore"
            value="explore"
            icon={<Icon>location_on</Icon>}
            className={classes.bottomNavigationAction}
          />
        </BottomNavigation>
      </footer>
    </>
  )
}

export default Layout
