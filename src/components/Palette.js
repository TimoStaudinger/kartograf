import React from 'react'
import Paper from 'material-ui/Paper'
import { withStyles } from 'material-ui/styles'
import ShapePalette from './ShapePalette'
import GridShapePalette from './GridShapePalette'

const styles = theme => ({
  paper: {
    position: 'absolute',
    top: 100,
    right: 50,
    zIndex: 1000,
    width: 300,
    // backgroundColor: '#E1E2E1'
  }
})

const Palette = ({classes}) =>
  <Paper elevation={8} className={classes.paper}>
    <GridShapePalette />
  </Paper>

export default withStyles(styles)(Palette)
