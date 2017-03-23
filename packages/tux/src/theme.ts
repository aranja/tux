import merge from 'lodash.merge'
import { Theme, text, input, button } from './colors'
import { decelerationCurve, sharpCurve } from './utils/curves'
import { darken, fade } from './utils/color'

export default function getTuxTheme(tuxThemeExtended = {}, tuxTheme?: Object) {
  tuxTheme = merge({
    floatingActionButton: {
      color: Theme.secondary,
      activeColor: Theme.active,
      iconColor: Theme.light,
      itemAnimationEase: '0, 0.62, 0.45, 1.13',
      itemAnimationDelay: 50, // ms
    },
    dayPicker: {
      arrowColor: button.default.text,
      backgroundColor: '#FFFFFF',
      backgroundColorDisabled: '#EFF1F1',
      backgroundColorOutside: '#FAFAFA',
      backgroundColorSelected: Theme.primary,
      inputBorder: input.default.border,
      inputColor: text.dark,
      textColor: '#DCE0E0',
      textColorSelected: '#FFFFFF',
      textColorToday: Theme.primary,
    },
    tagEditor: {
      backgroundColor: Theme.gray,
      borderColor: input.default.border,
      textColor: input.default.labelText,
      buttonTextColor: Theme.gray,
      buttonBackgroundColor: darken(Theme.gray, 0.22),
      activeUnderlineColor: Theme.primary,
      activeUnderlineEase: decelerationCurve,
    },
    spinner: {
      colorFrom: fade(Theme.primary, 0.2),
      colorTo: fade(Theme.primary, 0.7)
    },
    alertBar: {
      backgroundColor: Theme.alert,
    }
  }, tuxThemeExtended)

  return tuxTheme
}
