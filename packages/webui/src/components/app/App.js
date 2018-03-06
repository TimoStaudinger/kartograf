import React from 'react'
import PropTypes from 'prop-types'

import Button from 'material-ui/Button'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import IconButton from 'material-ui/IconButton'
import {withStyles} from 'material-ui/styles'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import FileDownloadIcon from 'material-ui-icons/FileDownload'
import ShareIcon from 'material-ui-icons/Share'
import MenuIcon from 'material-ui-icons/Menu'

import Toolbox from '../toolbox/Toolbox'
import Options from '../Options'

import appTheme from './Theme'

const sidebarWidth = 400

const styles = theme => ({
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

const App = ({
  classes,
  selectedShape,
  selectedMode,
  onChangeShape,
  onSelectMode,
  children,
  theme,
  onDownload
}) => (
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
            <FileDownloadIcon />
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

App.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.element,
  selectedShape: PropTypes.object,
  onChangeShape: PropTypes.func.isRequired,
  selectedMode: PropTypes.string.isRequired,
  onSelectMode: PropTypes.func.isRequired
}

export default withStyles(styles)(App)
