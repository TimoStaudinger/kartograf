import React from 'react'
import {FormControl} from 'material-ui/Form'
import Input, {InputLabel} from 'material-ui/Input'
import {withStyles} from 'material-ui/styles'
import Paper from 'material-ui/Paper'
import Grid from 'material-ui/Grid'
import Typography from 'material-ui/Typography'

const styles = theme => ({
  formControl: {
    margin: theme.spacing.unit
  },
  colorPicker: {
    padding: theme.spacing.unit,
    margin: 0,
    width: '100%'
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

const RectOptions = ({classes, shape, onChangeShape, theme}) => [
  <Typography
    variant="headline"
    component="h3"
    className={classes.header}
    key="headline"
  >
    Options
  </Typography>,

  <FormControl key="labelInput" margin="normal" className={classes.formControl}>
    <InputLabel htmlFor="name-simple">Label</InputLabel>
    <Input
      id="name-simple"
      value={shape.label}
      onChange={e =>
        onChangeShape(applyUpdates(shape, 'label', e.target.value))
      }
    />
  </FormControl>,

  <Grid key="colorPicker" className={classes.colorPicker} container spacing={8}>
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

export default withStyles(styles)(RectOptions)
