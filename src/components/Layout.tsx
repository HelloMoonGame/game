import React, { ReactNode, useEffect } from 'react'
import { signIn, signOut, useSession } from 'next-auth/client'
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
  title: {
    flexGrow: 1,
  },
  username: {
    marginLeft: 5,
  },
  pageFooter: {
    position: 'fixed',
    bottom: 0,
    width: '100%',
  },
}))

const Layout = ({ children, title }: Props) => {
  const classes = useStyles()

  const [session, loading] = useSession()

  useEffect(() => {
    if (!session && !loading) signIn('identity-server4')
  }, [session, loading])

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  if (!session) return <></>

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
            <Typography variant="h6" className={classes.title}>
              Hello Moon
            </Typography>
            {session && (
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
                    {session.user.name}
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
