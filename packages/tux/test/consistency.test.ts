import { tests, bundleTux } from './consistency'

/**
 * Builds admin and prod bundles of tux and manually runs
 * tests, passing each bundle's exports. These tests are
 * critical for keeping production small, fast and safe.
 */
describe('Admin vs Prod consistency', () => {
  // Webpack build takes more time than jasmine normally allows.
  const originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000

  // Build two bundles of tux,
  let adminTux, prodTux
  beforeAll(async () => {
    [adminTux, prodTux] = await Promise.all([
      bundleTux('admin'),
      bundleTux('prod'),
    ])

    // Reset timeout.
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout
  })

  // Run all the different tests
  tests.forEach(test => {
    it(test.label, () => test.handler(prodTux, adminTux))
  })
})
