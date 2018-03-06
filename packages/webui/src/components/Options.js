import React from 'react'
import PropTypes from 'prop-types'

import Paper from 'material-ui/Paper'
import { withStyles } from 'material-ui/styles'

import ShapeOptions from './shapes/ShapeOptions'

const styles = theme => ({
  paper: {
    position: 'absolute',
    top: 100,
    right: 50,
    zIndex: 1000,
    width: 300,
    backgroundColor: '#FFF'
  }
})

const Options = ({classes, selectedShape, onChangeShape, theme}) =>
  <Paper elevation={8} className={classes.paper}>
    <ShapeOptions
      shape={selectedShape}
      theme={theme}
      onChangeShape={onChangeShape}
    />
  </Paper>

Options.propTypes = {
  classes: PropTypes.object.isRequired,
  selectedShape: PropTypes.object.isRequired,
  onChangeShape: PropTypes.func.isRequired
}

export default withStyles(styles)(Options)
