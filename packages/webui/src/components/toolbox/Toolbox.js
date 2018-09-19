import React from 'react'

import {
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListSubheader,
  Avatar,
  Typography
} from '@material-ui/core'
import {withStyles} from '@material-ui/core/styles'
import {
  Brush as BrushIcon,
  InsertEmoticon as InsertEmoticonIcon,
  OpenWith as PanToolIcon
} from '@material-ui/icons'

const styles = theme => ({
  paper: {
    position: 'absolute',
    top: 100,
    left: 50,
    zIndex: 1000,
    width: 300,
    backgroundColor: '#FFF'
  },
  header: {
    margin: theme.spacing.unit * 2,
    color: '#616161'
  },
  selected: {
    backgroundColor: '#ffa000'
  }
})

const Options = ({classes, mode, onSelectMode}) => (
  <Paper elevation={8} className={classes.paper}>
    <Typography variant="headline" component="h3" className={classes.header}>
      Toolbox
    </Typography>
    <List>
      <ListItem button onClick={() => onSelectMode('pan')}>
        <ListItemAvatar>
          <Avatar className={mode === 'pan' ? classes.selected : ''}>
            <PanToolIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Pan" />
      </ListItem>

      <ListSubheader>Draw</ListSubheader>
      <ListItem button onClick={() => onSelectMode('draw')}>
        <ListItemAvatar>
          <Avatar className={mode === 'draw' ? classes.selected : ''}>
            <BrushIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Rectangle" />
      </ListItem>
      <ListItem button onClick={() => onSelectMode('drawIcon')}>
        <ListItemAvatar>
          <Avatar className={mode === 'drawIcon' ? classes.selected : ''}>
            <InsertEmoticonIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Icon" />
      </ListItem>
    </List>
  </Paper>
)

export default withStyles(styles)(Options)
