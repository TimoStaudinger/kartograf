import React from 'react'
import {withStyles} from 'material-ui/styles'
import Button from 'material-ui/Button'

import Paper from 'material-ui/Paper'
import Grid from 'material-ui/Grid'
import Typography from 'material-ui/Typography'
import IconPicker from '../../IconPicker'

const styles = theme => ({
  formControl: {
    margin: theme.spacing.unit
  },
  colorPicker: {
    padding: theme.spacing.unit,
    margin: 0,
    width: '100%'
  },
  pickIconButton: {
    margin: theme.spacing.unit * 2,
    width: 'calc(100% - 32px)'
  },
  header: {
    margin: theme.spacing.unit * 2,
    color: '#616161'
  },
  colorPickerPaper: {
    height: 20
  },
  colorPickerGridItem: {
    padding: '2px !important'
  }
})

const applyUpdates = (prevRect, field, value) => ({
  ...prevRect,
  [field]: value
})

class IconOptions extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showIconPicker: false
    }
  }

  render() {
    const {onChangeShape, shape, theme, classes} = this.props

    return [
      <Typography
        key="headline"
        variant="headline"
        component="h3"
        className={classes.header}
      >
        Options
      </Typography>,

      <IconPicker
        key="iconPicker"
        isOpen={this.state.showIconPicker}
        onPick={icon => {
          this.setState({showIconPicker: false})
          onChangeShape(applyUpdates(shape, 'icon', icon))
        }}
        onClose={() => this.setState({showIconPicker: false})}
      />,

      <Button
        key="iconPickerButton"
        className={classes.pickIconButton}
        variant="raised"
        size="large"
        color="primary"
        onClick={() => this.setState({showIconPicker: true})}
      >
        Pick icon
      </Button>,

      <Grid
        className={classes.colorPicker}
        container
        spacing={8}
        key="colorPicker"
      >
        {theme.colors.map((c, i) => (
          <Grid key={c.primary} className={classes.colorPickerGridItem} item xs={1}>
            <Paper
              square
              elevation={1}
              className={classes.colorPickerPaper}
              style={{background: c.primary}}
              onClick={() => onChangeShape(applyUpdates(shape, 'color', i))}
            />
          </Grid>
        ))}
      </Grid>
    ]
  }
}

export default withStyles(styles)(IconOptions)
