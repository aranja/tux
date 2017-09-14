import 'jest'
;(<any>global).requestAnimationFrame = function(callback: () => {}) {
  setTimeout(callback, 0)
}
