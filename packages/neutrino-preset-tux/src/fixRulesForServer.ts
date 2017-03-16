import { LOCALS_LOADER } from './paths'

export default function fixRulesForServer(neutrino: any) {
  const rules = neutrino.config.module.rules
  rules.values().forEach((rule: any) => {
    if (rule.uses.has('css')) {
      rule.use('css').loader(LOCALS_LOADER)
      rule.uses.delete('style')
    }
    if (rule.uses.has('url')) {
      rule.use('url').tap(fixFileLoader)
    }
    if (rule.uses.has('file')) {
      rule.use('file').tap(fixFileLoader)
    }
  })
}

function fixFileLoader(options: any) {
  return {
    ...options,
    emitFile: false,
  }
}
