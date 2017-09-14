import 'react'

// Augmentation of React:
declare module 'react' {
  interface HTMLAttributes<T> extends DOMAttributes<T> {
    jsx?: boolean
    global?: boolean
  }
}
