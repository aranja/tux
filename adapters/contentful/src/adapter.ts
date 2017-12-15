import BaseAdapter, { Config } from './base-adapter'

export default function createContentfulAdapter(config: Config) {
  return new BaseAdapter(config)
}
