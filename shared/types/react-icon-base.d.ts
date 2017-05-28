import 'react-icon-base'
import { SVGProps } from 'react'

declare module 'react-icon-base' {
  // Add support for className.
  // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/16731
  interface IconBaseProps extends SVGProps<SVGSVGElement> {
  }
}
