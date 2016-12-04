function doUntil (fn, timeout = 250) {
  return Promise.resolve().then(() => {
    if (fn()) {
      return true
    } else {
      return new Promise((resolve) => {
        setTimeout(resolve, timeout)
      }).then(doUntil.bind(this, fn, timeout))
    }
  })
}

module.exports = doUntil
