const { exec } = require('child_process')
const buildAssets = () => {
  return new Promise((resolve, reject) => {
    exec('npm run build', (err, stuff) => {
      err ? reject(err) : resolve()
    })
  })
}

module.exports = buildAssets
