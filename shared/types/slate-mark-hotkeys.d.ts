declare module 'slate-mark-hotkeys' {
  import { Plugin } from 'slate-react'

  interface Options {
    keysToMark: { [key: string]: string }
    ignoreIn: string[] | string | ((node: string) => void)
    onlyIn: string[] | string | ((node: string) => void)
  }

  export default function markHotkeys(options?: Options): Plugin
}
