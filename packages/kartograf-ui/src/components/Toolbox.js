import React from 'react'
import Paper from 'material-ui/Paper'
import { withStyles } from 'material-ui/styles'
import List, {
  ListItem,
  ListItemAvatar,
  ListItemText,
} from 'material-ui/List';
import BrushIcon from 'material-ui-icons/Brush'
import InsertEmoticonIcon from 'material-ui-icons/InsertEmoticon'
import PanToolIcon from 'material-ui-icons/OpenWith'
import Avatar from 'material-ui/Avatar'
import Typography from 'material-ui/Typography'
import ListSubheader from 'material-ui/List/ListSubheader';


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

const Options = ({classes, mode, onChangeMode}) => 
  <Paper elevation={8} className={classes.paper}>
    <Typography variant='headline' component='h3' className={classes.header}>Toolbox</Typography>
    <List>
      <ListItem button onClick={() => onChangeMode('pan')}>
        <ListItemAvatar>
          <Avatar className={mode === 'pan' ? classes.selected : ''}>
            <PanToolIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Pan" />
      </ListItem>

      <ListSubheader>Draw</ListSubheader>
      <ListItem button onClick={() => onChangeMode('draw')}>
        <ListItemAvatar>
          <Avatar className={mode === 'draw' ? classes.selected : ''}>
            <BrushIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Rectangle" />
      </ListItem>
      <ListItem button onClick={() => onChangeMode('drawIcon')}>
        <ListItemAvatar>
          <Avatar className={mode === 'drawIcon' ? classes.selected : ''}>
            <InsertEmoticonIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Icon" />
      </ListItem>
    </List>
  </Paper>


export default withStyles(styles)(Options)
