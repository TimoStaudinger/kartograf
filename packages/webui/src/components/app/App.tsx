import React from 'react'

import {
  Button,
  AppBar,
  Toolbar,
  Typography,
  IconButton
} from '@material-ui/core'
import {
  withStyles,
  createStyles,
  WithStyles,
  MuiThemeProvider,
  Theme
} from '@material-ui/core/styles'
import {
  CloudDownload as DownloadIcon,
  Share as ShareIcon,
  Menu as MenuIcon
} from '@material-ui/icons'

import Toolbox from '../toolbox/Toolbox'
import Options from '../Options'

import appTheme from './Theme'

const sidebarWidth = 400

const styles = (theme: Theme) =>
  createStyles({
    title: {
      flex: 1,
      fontFamily: 'Raleway, Roboto, sans-serif'
    },
    menuButton: {
      marginLeft: -12,
      marginRight: 20
    },
    appFrame: {
      position: 'absolute',
      display: 'flex',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    },
    appBar: {
      position: 'absolute',
      width: '100%'
    },
    drawerPaper: {
      position: 'relative',
      height: 'calc(100% - 64px)',
      marginTop: 64,
      width: sidebarWidth
    },
    drawerHeader: theme.mixins.toolbar,
    content: {
      backgroundColor: theme.palette.background.default,
      width: '100%',
      height: 'calc(100% - 64px)',
      marginTop: 56,
      [theme.breakpoints.up('sm')]: {
        marginTop: 64
      }
    },
    button: {
      margin: theme.spacing.unit
    }
  })

interface Props extends WithStyles<typeof styles> {
  selectedShape?: string
  selectedMode: string
  onChangeShape(): void
  onSelectMode(): void
  children: JSX.Element
  theme: Theme
  onDownload(): void
}

const App = ({
  classes,
  selectedShape,
  selectedMode,
  onChangeShape,
  onSelectMode,
  children,
  theme,
  onDownload
}: Props): JSX.Element => (
  <MuiThemeProvider theme={appTheme}>
    <div className={classes.appFrame}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton
            className={classes.menuButton}
            color="inherit"
            aria-label="Menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="title" color="inherit" className={classes.title}>
            Kartograf
          </Typography>
          <Button color="inherit">
            <ShareIcon />
          </Button>
          <Button color="inherit" onClick={onDownload}>
            <DownloadIcon />
          </Button>
          <Button color="inherit">Sign in</Button>
        </Toolbar>
      </AppBar>

      <main className={classes.content}>
        {selectedShape ? (
          <Options
            selectedShape={selectedShape}
            onChangeShape={onChangeShape}
            theme={theme}
          />
        ) : null}

        <Toolbox mode={selectedMode} onSelectMode={onSelectMode} />

        {children}
      </main>
    </div>
  </MuiThemeProvider>
)

export default withStyles(styles)(App)
