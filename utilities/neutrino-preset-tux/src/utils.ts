import { EntryPoint, Rule } from 'webpack-chain'

// For loaders, the order matters. Since webpack-chain uses Maps, we must
// jump through some hoops to prepend a loader. Maps iterate in insertion
// order so we clear the Map and add the items back in correct order.
export const prependUse = (rule: Rule, cb: (rule: Rule) => void) => {
  const existingUses = rule.uses.entries()
  rule.uses.clear()
  cb(rule)
  rule.uses.merge(existingUses)
}

// Remove entry points matching a pattern.
export const removeEntryPoints = (entry: EntryPoint, pattern: RegExp) => {
  const newValues = entry.values().filter(value => !pattern.test(value))
  entry.clear().merge(newValues)
}
