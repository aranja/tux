declare module 'tar' {
  interface ExtractOptions {
    file: string
    cwd: string
  }

  export function extract(options: ExtractOptions, files?: string[]): Promise<void>
}
