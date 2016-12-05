var one = Promise.resolve(1)
var two = Promise.reject(2)


Promise.resolve().then(() => {
  return Promise.all([one, two])
}).then((args) => {
  console.log('ruff', args)
}).catch((meow) => {
  console.log('meow', meow)
})
