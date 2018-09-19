import React from 'react'

import {
  Dialog,
  Grid,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Tooltip,
  Paper,
  InputAdornment,
  TextField,
  Slide
} from '@material-ui/core'
import {withStyles} from '@material-ui/core/styles'
import {Search as SearchIcon, Close as CloseIcon} from '@material-ui/icons'
import {grey} from '@material-ui/core/colors'

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
  },
  searchContainer: {
    margin: 16
  }
}

function Transition(props) {
  return <Slide direction="up" {...props} />
}

class IconPickerButton extends React.PureComponent {
  render() {
    const {icon, classes, onClick} = this.props

    return (
      <Grid item xs={2} className={classes.iconContainer}>
        <Tooltip title={icon.name}>
          <Button onClick={onClick}>
            <icon.component className={classes.icon} fontSize />
          </Button>
        </Tooltip>
      </Grid>
    )
  }
}

const defaultState = {
  rows: 12,
  filter: ''
}

class IconPicker extends React.Component {
  constructor(props) {
    super(props)

    this.onEnter = this.onEnter.bind(this)
    this.onExit = this.onExit.bind(this)
    this.onScroll = this.onScroll.bind(this)

    this.state = defaultState
  }

  onEnter() {
    this.setState(defaultState)

    this.dialogElement = document.getElementById('iconPickerDialog')
    this.dialogElement.addEventListener('scroll', this.onScroll)
  }

  onScroll() {
    const bottomOffset = 300

    const showMore =
      this.dialogElement.scrollHeight -
        this.dialogElement.scrollTop -
        bottomOffset <
      this.dialogElement.clientHeight
    if (showMore) {
      this.setState(state => ({rows: state.rows + 4}))
    }
  }

  onExit() {
    this.dialogElement.removeEventListener('scroll', this.onScroll)
  }

  render() {
    const {onClose, classes, isOpen, onPick} = this.props

    const filteredIcons =
      this.state.filter && this.state.filter.length
        ? allIcons.filter(i =>
            i.name.toLowerCase().includes(this.state.filter.toLowerCase())
          )
        : allIcons
    const slicedIcons = filteredIcons.slice(0, this.state.rows * 6)

    return (
      <Dialog
        PaperProps={{id: 'iconPickerDialog'}}
        ref={ref => (this.dialogRef = ref)}
        fullScreen
        open={isOpen}
        onClose={onClose}
        onEnter={this.onEnter}
        onExit={this.onExit}
        transition={Transition}
      >
        <AppBar className={classes.appBar} style={{position: 'sticky'}}>
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

        <Paper
          style={{
            ...styles.root,
            position: 'sticky',
            top: 64,
            zIndex: 100
          }}
        >
          <div style={styles.searchContainer}>
            <TextField
              onChange={e => this.setState({filter: e.target.value})}
              value={this.state.filter}
              fullWidth
              style={styles.input}
              placeholder="Search"
              InputProps={{
                disableUnderline: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <SearchIcon style={{color: grey[500]}} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </div>
        </Paper>

        <Grid className={classes.grid} container spacing={8}>
          {slicedIcons.map(i => (
            <IconPickerButton
              icon={i}
              classes={classes}
              key={i.name}
              onClick={() => onPick(i.name)}
            />
          ))}
        </Grid>
      </Dialog>
    )
  }
}

export default withStyles(styles)(IconPicker)
