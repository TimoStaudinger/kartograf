import React from 'react'
import Paper from 'material-ui/Paper'
import GridList, { GridListTile, GridListTileBar } from 'material-ui/GridList';
import Grid from 'material-ui/Grid'
import AddIcon from 'material-ui-icons/Add'
import { withStyles } from 'material-ui/styles'
import { DragSource } from 'react-dnd'
import IconButton from 'material-ui/IconButton';
import rect from './rect.png'
import Typography from 'material-ui/Typography'

const styles = theme => ({
  formControl: {
    margin: theme.spacing.unit
  },
  header: {
    margin: theme.spacing.unit
  },
  colorPicker: {
    padding: theme.spacing.unit,
    margin: 0,
    width: '100%'
  },
  colorPickerPaper: {
    height: 56,
    textAlign: 'center',
    fontSize: 40
  },
  icon: {
    // margin: theme.spacing.unit
    color: 'white'
  },
  gridList: {
    width: '100%',
    height: 300,
  },
})

const shapeDragSource = {
  beginDrag (props) {
    return {
      type: props.type
    }
  },
  endDrag (props, monitor) {
    console.log(monitor.getClientOffset())
    console.log(monitor.getDropResult())
    console.log(monitor.getItem())
  }
}

const shapeTypes = [
  {name: 'Box', type: 'rect'},
  {name: 'Icon', type: 'rect'},
  {name: 'Decision', type: 'rect'},
  {name: 'Foobar', type: 'rect'},
  {name: 'Box', type: 'rect'},
  {name: 'Icon', type: 'rect'},
  {name: 'Decision', type: 'rect'},
  {name: 'Foobar', type: 'rect'}
]

const ShapePalette = ({classes}) => [
  <Typography variant='headline' component='h3' className={classes.header}>Palette</Typography>,
  <GridList cellHeight={100} className={classes.gridList}>
    {/* <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
      <Subheader component="div">December</Subheader>
    </GridListTile> */}
    {shapeTypes.map(type => (
      <GridListTile key={type.type}>
        <img src={rect} alt={type.name} />
        <GridListTileBar
          title={type.name}
          actionIcon={
            <IconButton className={classes.icon}>
              <AddIcon />
            </IconButton>
          }
        />
      </GridListTile>
    ))}
  </GridList>
]

export default withStyles(styles)(ShapePalette)
