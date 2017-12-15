// Patch `framesToPop` into TypeScript's `Error` definition.
interface Error {
  framesToPop?: number
}
