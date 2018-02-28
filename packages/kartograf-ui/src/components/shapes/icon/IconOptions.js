import React from 'react'
import {withStyles} from 'material-ui/styles'
import Button from 'material-ui/Button';

import Paper from 'material-ui/Paper'
import Grid from 'material-ui/Grid'
import Typography from 'material-ui/Typography'
import colors from '../../../colors'
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
  constructor (props) {
    super(props)

    this.state = {
      showIconPicker: false
    }
  }

  render () {
    return [
      <Typography variant='headline' component='h3' className={this.props.classes.header}>Options</Typography>,
      // <FormControl margin='normal' className={classes.formControl}>
      //   <InputLabel htmlFor='name-simple'>Label</InputLabel>
      //   <Input id='name-simple' value={shape.label} onChange={e => onChangeShape(applyUpdates(shape, 'label', e.target.value))} />
      // </FormControl>,
      <IconPicker
        isOpen={this.state.showIconPicker}
        onPick={() => this.setState({showIconPicker: false})}
        onClose={() => this.setState({showIconPicker: false})}
      />,
      <Button
        className={this.props.classes.pickIconButton}
        variant="raised"
        size="large"
        color="primary"
        onClick={() => this.setState({showIconPicker: true})}
      >Pick icon</Button>,
      <Grid className={this.props.classes.colorPicker} container spacing={8}>
        {colors.map((c, i) =>
          <Grid className={this.props.classes.colorPickerGridItem} item xs={1}>
            <Paper
              square
              elevation={1}
              className={this.props.classes.colorPickerPaper} style={{background: c.primary}}
              onClick={() => this.props.onChangeShape(applyUpdates(this.props.shape, 'color', i))}
            />
          </Grid>
        )}
      </Grid>
    ]
  }
}

export default withStyles(styles)(IconOptions)
