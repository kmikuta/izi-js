const isDebug = false

export function getCallerLineProvider (stackOffset: number): Function {
  if (!isDebug) {
    return function () {
      return 'Line numbers are available only in debug version of izi-js'
    }
  }
  const error = Error()

  return function getCallerLine () {
    if (error.stack) {
      // WebKit / FireFox / Opera
      const callStack = error.stack.split('\n')
      const index = navigator.userAgent.indexOf('WebKit') > -1
        ? 3 + stackOffset // Chrome
        : 1 + stackOffset // Firefox and Opera
      return callStack[index]
    } else {
      // IE
      return ' [IE doesn\'t provide line number in call stack]'
    }
  }
}
