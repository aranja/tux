import merge from 'lodash.merge'
import { Theme, text, input, button } from './colors'
import { decelerationCurve, sharpCurve } from './utils/curves'
import { darken, lighten, fade } from './utils/color'

export default function getTuxTheme(tuxThemeExtended = {}, tuxTheme?: Object) {
  tuxTheme = merge({
    alertBar: {
      backgroundColor: Theme.alert,
    },
    btn: {
      color: button.default.text,
      backgroundColor: 'transparent',
      raisedBackgroundColor: button.default.background,
      raisedBorderColor: button.default.border,
      raisedBoxShadow: `${fade('#000', 0.1)} 0px 1px 6px, ${fade('#000', 0.1)} 0px 1px 4px`,
      primaryColor: button.primary.text,
      primaryBackgroundColor: button.primary.background,
      primaryBorderColor: button.primary.border,
      primaryHoverBackgroundColor: `${lighten(button.primary.background, 0.2)}`,
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
    floatingActionButton: {
      color: Theme.secondary,
      activeColor: Theme.active,
      iconColor: Theme.light,
      itemAnimationEase: '0, 0.62, 0.45, 1.13',
      itemAnimationDelay: 50, // ms
    },
    markdownField: {
      borderColor: input.default.border,
      color: text.dark,
    },
    modal: {
      backgroundColor: '#FFFFFF',
      titleColor: `${text.dark}`,
      maxWidth: 650, // px
      topBarBackgroundColor: 'F2F3F6',
      topBarBorderBottomColor: 'rgba(203, 203, 203, 0.5)',
      topBarHeight: 100, // px
      metaTextColor: `${fade(text.gray, 0.5)};`,
    },
    spinner: {
      colorFrom: fade(Theme.primary, 0.2),
      colorTo: fade(Theme.primary, 0.7)
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
  }, tuxThemeExtended)

  return tuxTheme
}
