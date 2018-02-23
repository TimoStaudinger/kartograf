import React from 'react'
import Paper from 'material-ui/Paper'
import { withStyles } from 'material-ui/styles'
import ShapeOptions from '../shapes/ShapeOptions'

const styles = theme => ({
  paper: {
    position: 'absolute',
    top: 258,
    right: 50,
    zIndex: 1000,
    width: 300,
    backgroundColor: '#E1E2E1'
  }
})

const Options = ({classes, shapes, selected, onChangeShape}) =>
  <Paper elevation={8} className={classes.paper}>
    <ShapeOptions
      shape={shapes.find(s => s.id === selected[0])}
      onChangeShape={onChangeShape}
    />
  </Paper>

export default withStyles(styles)(Options)