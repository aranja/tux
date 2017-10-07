import LocalStorageAdapter, { Config } from './LocalStorageAdapter'

export default function createLocalStorageAdapter(config: Config) {
  return new LocalStorageAdapter(config)
}
