declare module 'pkg-dir' {
  function pkgDir(): Promise<string>

  export = pkgDir
}
