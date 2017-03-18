declare module 'neutrino-preset-react'
declare module 'neutrino-middleware-env'
declare module 'css-loader/locals'
declare module 'webpack-node-externals'
declare module 'extract-text-webpack-plugin'

declare module 'webpack-chain' {
  class Chained<Parent> {
    end(): Parent
  }

  class TypedChainedMap<Parent, Value> extends Chained<Parent> {
    clear(): this
    delete(key: string): this
    has(key: string): boolean
    get(key: string): Value
    set(key: string, value: Value): this
    merge(obj: { [key: string]: Value }): this
    entries(): { [key: string]: Value }
    values(): Array<Value>
  }

  class ChainedMap<Parent> extends TypedChainedMap<Parent, any> {}

  class TypedChainedSet<Parent, Value> extends Chained<Parent> {
    add(value: Value): this
    prepend(value: Value): this
    clear(): this
    delete(key: string): this
    has(key: string): boolean
    merge(arr: Array<Value>): this
    values(): Array<Value>
  }

  class ChainedSet<Parent> extends TypedChainedSet<Parent, any> {}

  class Plugins<Parent> extends TypedChainedMap<Parent, Plugin<Parent>> {}

  class Plugin<GrandParent> extends ChainedMap<Plugins<GrandParent>> {
    init(value: any): this
    use(plugin: any, args?: Array<any>): this
    tap(f: (args: Array<any>) => Array<any>): this
  }

  class Module extends ChainedMap<Config> {
    rules: TypedChainedMap<this, Rule>
    rule(name: string): Rule
  }

  class Output extends ChainedMap<Config> {
    chunkFilename(value: any): this
    crossOriginLoading(value: any): this
    filename(value: any): this
    library(value: any): this
    libraryTarget(value: any): this
    devtoolFallbackModuleFilenameTemplate(value: any): this
    devtoolLineToLine(value: any): this
    devtoolModuleFilenameTemplate(value: any): this
    hashFunction(value: any): this
    hashDigest(value: any): this
    hashDigestLength(value: any): this
    hashSalt(value: any): this
    hotUpdateChunkFilename(value: any): this
    hotUpdateFunction(value: any): this
    hotUpdateMainFilename(value: any): this
    jsonpFunction(value: any): this
    path(value: any): this
    pathinfo(value: any): this
    publicPath(value: any): this
    sourceMapFilename(value: any): this
    sourcePrefix(value: any): this
    strictModuleExceptionHandling(value: any): this
    umdNamedDefine(value: any): this
  }

  class DevServer extends ChainedMap<Config> {
    clientLogLevel(value: any): this
    compress(value: any): this
    contentBase(value: any): this
    filename(value: any): this
    headers(value: any): this
    historyApiFallback(value: any): this
    host(value: any): this
    hot(value: any): this
    hotOnly(value: any): this
    https(value: any): this
    inline(value: any): this
    lazy(value: any): this
    noInfo(value: any): this
    overlay(value: any): this
    port(value: any): this
    proxy(value: any): this
    quiet(value: any): this
    setup(value: any): this
    stats(value: any): this
    watchContentBase(value: any): this
  }

  class Performance extends ChainedMap<Config> {
    hints(value: any): this
    maxEntrypointSize(value: any): this
    maxAssetSize(value: any): this
    assetFilter(value: any): this
  }

  class EntryPoints extends TypedChainedMap<Config, ChainedMap<EntryPoints>> {}

  class Resolve extends ChainedMap<Config> {
    alias: ChainedMap<this>
    aliasFields: ChainedSet<this>
    descriptionFiles: ChainedSet<this>
    extensions: ChainedSet<this>
    mainFields: ChainedSet<this>
    mainFiles: ChainedSet<this>
    modules: ChainedSet<this>
    plugins: TypedChainedMap<this, Plugin<this>>

    enforceExtension(value: any): this
    enforceModuleExtension(value: any): this
    unsafeCache(value: any): this
    symlinks(value: any): this
    cachePredicate(value: any): this

    plugin(name: string): Plugin<this>
  }

  class ResolveLoader extends ChainedMap<Config> {
    extensions: ChainedSet<this>
    modules: ChainedSet<this>
    moduleExtensions: ChainedSet<this>
    packageMains: ChainedSet<this>
  }

  class Rule extends ChainedMap<Module> {
    uses: TypedChainedMap<this, Use>
    include: ChainedSet<this>
    exclude: ChainedSet<this>

    parser(value: any): this
    test(value: any): this
    enforce(value: any): this

    use(name: string): Use
    pre(): this
    post(): this
  }

  class Use extends ChainedMap<Rule> {
    loader(value: any): this
    options(value: any): this

    tap(f: (options: any) => any): this
  }

  export default class Config extends ChainedMap<any> {
    devServer: DevServer
    entryPoints: EntryPoints
    module: Module
    node: ChainedMap<this>
    output: Output
    performance: Performance
    plugins: Plugins<this>
    resolve: Resolve
    resolveLoader: ResolveLoader

    amd(value: any): this
    bail(value: any): this
    cache(value: any): this
    devtool(value: any): this
    context(value: any): this
    externals(value: any): this
    loader(value: any): this
    profile(value: any): this
    recordsPath(value: any): this
    recordsInputPath(value: any): this
    recordsOutputPath(value: any): this
    stats(value: any): this
    target(value: any): this
    watch(value: any): this
    watchOptions(value: any): this

    entry(name: string): ChainedSet<this>
    plugin(name: string): Plugin<this>
  }
}

declare module 'neutrino' {
  import Config from 'webpack-chain'

  export default class Neutrino {
    config: Config
    options: any

    use(preset: (neutrino: Neutrino, options: any) => void, options?: any): any
  }
}

declare module 'jsx-html-webpack-plugin' {
  import { Plugin } from 'webpack'
  class JsxHtmlWebpackPlugin extends Plugin {
    constructor(options: any)
  }

  export default JsxHtmlWebpackPlugin
}

declare module 'webpack-manifest-plugin' {
  import { Plugin } from 'webpack'
  class WebpackManifestPlugin extends Plugin {
    constructor(options: any)
  }

  export default WebpackManifestPlugin
}
