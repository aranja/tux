import { LOCALS_LOADER } from './paths'

export default function fixRulesForServer(rules: any) {
  rules.values().forEach((rule: any) => {
    if (rule.loaders.has('css')) {
      rule.loader('css', () => ({ loader: LOCALS_LOADER }))
      rule.loaders.delete('style')
    }
    if (rule.loaders.has('url')) {
      rule.loader('url', fixFileLoader)
    }
    if (rule.loaders.has('file')) {
      rule.loader('file', fixFileLoader)
    }
  })
}

function fixFileLoader(loader: any) {
  return {
    options: {
      ...loader.options,
      emitFile: false,
    },
  }
}
