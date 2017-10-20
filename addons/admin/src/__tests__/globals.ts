import 'jest'
// tslint:disable
;(<any>global).requestAnimationFrame = function(callback: () => {}) {
  setTimeout(callback, 0)
}
