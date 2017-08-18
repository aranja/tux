import getMuiTheme from 'material-ui/styles/getMuiTheme'
import {
  lightBlue500,
  lightBlue700,
  cyan400,
  pinkA200,
  grey100,
  grey400,
  grey500,
  darkBlack,
  white,
  grey300,
  fullBlack,
} from 'material-ui/styles/colors'
import { fade } from './color'

export const tuxUITheme = getMuiTheme({
  zIndex: {
    layer: 1000002,
  },
  palette: {
    primary1Color: lightBlue500,
    primary2Color: lightBlue700,
    primary3Color: grey400,
    accent1Color: pinkA200,
    accent2Color: grey100,
    accent3Color: grey500,
    textColor: darkBlack,
    secondaryTextColor: fade(darkBlack, 0.5),
    alternateTextColor: white,
    canvasColor: white,
    borderColor: grey300,
    disabledColor: fade(darkBlack, 0.3),
    pickerHeaderColor: lightBlue500,
    clockCircleColor: fade(darkBlack, 0.07),
    shadowColor: fullBlack
  }
})