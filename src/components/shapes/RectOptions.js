import React from 'react'
import Divider from 'material-ui/Divider';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Input, { InputLabel } from 'material-ui/Input';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import colors from '../../colors'

const styles = theme => ({
  formControl: {
    margin: theme.spacing.unit,
  },
  colorPicker: {
    padding: theme.spacing.unit,
    margin: 0,
    width: '100%'
  },
  header: {
    margin: theme.spacing.unit
  },
  colorPickerPaper: {
    height: 56
  }
})

const applyUpdates = (prevRect, field, value) => ({
  ...prevRect,
  [field]: value
})

const RectOptions = ({classes, shape, onChangeShape}) => [
  <Typography variant='headline' component='h3' className={classes.header}>Options</Typography>,
  <FormControl margin="normal" className={classes.formControl}>
    <InputLabel htmlFor="name-simple">Label</InputLabel>
    <Input id="name-simple" value={shape.label} onChange={e => onChangeShape(applyUpdates(shape, 'label', e.target.value))} />
  </FormControl>,
  <Grid className={classes.colorPicker} container spacing={8}>
    {colors.map((c, i) =>
      <Grid item xs={2}>
        <Paper
          className={classes.colorPickerPaper} style={{background: c.fill}}
          onClick={() => onChangeShape(applyUpdates(shape, 'color', i))}
        ></Paper>
      </Grid>
    )}
  </Grid>
  // <FormControl margin="normal" className={classes.formControl} aria-describedby="name-helper-text">
  //   <InputLabel htmlFor="name-helper">Name</InputLabel>
  //   <Input id="name-helper" onChange={this.handleChange} />
  //   <FormHelperText id="name-helper-text">Some important helper text</FormHelperText>
  // </FormControl>,
  // <Divider />,
  // <FormControl margin="normal" className={classes.formControl} disabled>
  //   <InputLabel htmlFor="name-disabled">Name</InputLabel>
  //   <Input id="name-disabled" value={true} onChange={this.handleChange} />
  //   <FormHelperText>Disabled</FormHelperText>
  // </FormControl>,
  // <FormControl margin="normal" className={classes.formControl} error aria-describedby="name-error-text">
  //   <InputLabel htmlFor="name-error">Name</InputLabel>
  //   <Input  id="name-error" value='asdf' onChange={this.handleChange} />
  //   <FormHelperText id="name-error-text">Error</FormHelperText>
  // </FormControl>
]

export default withStyles(styles)(RectOptions)