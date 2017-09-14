export { default as bundleTux } from './bundleTux'

import verifySame from './verifySame'
import verifyAdminOnly from './verifyAdminOnly'
export const tests = [verifySame, verifyAdminOnly]
