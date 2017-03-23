import merge from 'lodash.merge'
import { Theme, text, input, button } from './colors'

export default function getTuxTheme(tuxTheme: Object, tuxThemeExtended = {}) {
  tuxTheme = merge({

    floatingActionButton: {
      primaryColor: Theme.primary,
      activeColor: Theme.active,
      iconColor: Theme.light,
      itemAnimationDelay: '0, 0.62, 0.45, 1.13',
    }

  }, tuxThemeExtended)

  return tuxTheme
}
