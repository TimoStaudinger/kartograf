import React from 'react'
import Dialog from 'material-ui/Dialog'
import {withStyles} from 'material-ui/styles'
import Grid from 'material-ui/Grid'
import Button from 'material-ui/Button'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import IconButton from 'material-ui/IconButton'
import Typography from 'material-ui/Typography'
import CloseIcon from 'material-ui-icons/Close'
import Slide from 'material-ui/transitions/Slide'
import Tooltip from 'material-ui/Tooltip'
import {allIcons} from './IconLibrary'

const styles = {
  appBar: {
    position: 'relative'
  },
  flex: {
    flex: 1
  },
  icon: {
    color: 'rgb(117, 117, 117)',
    fontSize: 52,
    margin: 20
  },
  iconContainer: {
    textAlign: 'center'
  },
  grid: {
    maxWidth: 1000,
    margin: 'auto'
  }
}

function Transition(props) {
  return <Slide direction="up" {...props} />
}

class IconPicker extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      rows: 12
    }
  }

  render() {
    const {onClose, classes, isOpen} = this.props

    return (
      <Dialog
        fullScreen
        open={isOpen}
        onClose={onClose}
        transition={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton color="inherit" onClick={onClose} aria-label="Close">
              <CloseIcon />
            </IconButton>
            <Typography
              variant="title"
              color="inherit"
              className={classes.flex}
            >
              Select an icon
            </Typography>
          </Toolbar>
        </AppBar>
        <Grid className={classes.grid} container spacing={8}>
          {allIcons.slice(0, this.state.rows * 6).map(icon => (
            <Grid key={icon.name} item xs={2} className={classes.iconContainer}>
              <Tooltip title={icon.name}>
                <Button>
                  <icon.component className={classes.icon} fontSize />
                </Button>
              </Tooltip>
            </Grid>
          ))}
        </Grid>
      </Dialog>
    )
  }
}

export default withStyles(styles)(IconPicker)
