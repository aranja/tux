import { fade } from './utils/color'

export const Theme = {
  primary: '#3BB172',
  secondary: '#3A82DF',
  alert: '#E8008A',
  active: '#F11B9E',
  disabled: 'fade(#000, 0.5)',
  gray: '#E7E7E7',
  light: '#FFFFFF',
}

export const text = {
  dark: '#313131',
  gray: '#3C4858',
}

export const input = {
  default: {
    border: '#CBCBCB',
    labelText: '#888888',
  },
  primary: {
    border: `${Theme.primary}`,
  }
}

export const button = {
  default: {
    background: '#E5E6ED',
    border: '#C3CFD5',
    text: '#536171',
  },
  primary: {
    background: `${Theme.primary}`,
    border: '#CBCBCB',
    text: '#FFFFFF',
  }
}
