export interface Options {
  ssr?: boolean,
  admin?: boolean,
  port?: number,
  host?: string,
  use: string[],
}

export interface CliOptions extends Options {
  env?: string,
}
