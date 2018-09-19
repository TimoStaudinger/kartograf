import {createMuiTheme} from '@material-ui/core/styles'

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#6668d0',
      main: '#2f3e9e',
      dark: '#00186f',
      contrastText: '#fff'
    },
    secondary: {
      light: '#ffd149',
      main: '#ffa000',
      dark: '#c67100',
      contrastText: '#000'
    }
  }
})

export default theme
