import React from 'react'
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import CheckboxOutlineBlankIcon from 'material-ui-icons/CheckBoxOutlineBlank';
import InsertEmoticonIcon from 'material-ui-icons/InsertEmoticon';
import { withStyles } from 'material-ui/styles';
import { DragSource } from 'react-dnd'
import Typography from 'material-ui/Typography';

const styles = theme => ({
  formControl: {
    margin: theme.spacing.unit,
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
    margin: theme.spacing.unit
  }
})

const shapeDragSource = {
  beginDrag(props) {
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
  {type: 'rect', Icon: CheckboxOutlineBlankIcon},
  {type: 'symbol', Icon: InsertEmoticonIcon}
]

const Option = DragSource('shape', shapeDragSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))(({connectDragSource, classes, Icon}) =>
  <Grid item xs={4}>
  {connectDragSource(<div>
    <Paper
      className={classes.colorPickerPaper}
    ><Icon fontSize={true} className={classes.icon} /></Paper>
    </div>)}
  </Grid>
)

const ShapePalette = ({classes}) => [
  <Typography variant='headline' component='h3' className={classes.header}>Palette</Typography>,
  <Grid className={classes.colorPicker} container spacing={8}>
    {shapeTypes.map(type => <Option key={type.type} classes={classes} {...type} />)}
  </Grid>
]

export default withStyles(styles)(ShapePalette)
