import React from 'react'
import Drawer from 'material-ui/Drawer';
import { withStyles } from 'material-ui/styles';
import ShapeOptions from './shapes/ShapeOptions'
import Divider from 'material-ui/Divider';
import ShapePalette from './ShapePalette'

const sidebarWidth = 400

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    height: 430,
    marginTop: theme.spacing.unit * 3,
    zIndex: 1,
    overflow: 'hidden',
  },
  flex: {
    flex: 1,
  },
  divider: {
    marginTop: 20,
    marginBottom: 20
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  appFrame: {
    position: 'absolute',
    display: 'flex',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  appBar: {
    position: 'absolute',
    width: '100%',
    zIndex: 1500
  },
  drawerPaper: {
    position: 'relative',
    height: 'calc(100% - 64px)',
    marginTop: 64,
    width: sidebarWidth,
  },
  drawerHeader: theme.mixins.toolbar,
  content: {
    backgroundColor: theme.palette.background.default,
    width: '100%',
    height: 'calc(100% - 64px)',
    marginTop: 56,
    [theme.breakpoints.up('sm')]: {
      marginTop: 64,
    },
  }
})

const Sidebar = ({classes, shapes, selected, onChangeShape}) =>
  <Drawer
    variant="permanent"
    classes={{
      paper: classes.drawerPaper,
    }}
    anchor='right'
  >
    <ShapePalette />
    <Divider className={classes.divider} />
    <ShapeOptions
      shape={shapes.find(s => s.id === selected[0])}
      onChangeShape={onChangeShape}
    />
  </Drawer>

export default withStyles(styles)(Sidebar)