const getHostCount = require('./tasks/getHostCount')
const buildAssets = require('./tasks/buildAssets')
const createHosts = require('./tasks/createHosts')
const deployHost = require('./tasks/deployHost')
const addToLoadBalancer = require('./tasks/addToLoadBalancer')
const getOldHosts = require('./tasks/getOldHosts')
const removeFromLoadBalancer = require('./tasks/removeFromLoadBalancer')
const destroyHost = require('./tasks/destroyHost')

Promise.all([getHostCount(), buildAssets()]).then(([hostCount]) => {
  console.log('Creating hosts')
  return createHosts(hostCount)
}).then((newHostList) => {
  console.log('Deploying to hosts')
  return Promise.all(newHostList.map((newHost) => {
    console.log('Deploying to host', newHost)
    return deployHost(newHost).then(() => {
      return addToLoadBalancer(newHost)
    })
  }))
}).then(() => {
  console.log('Getting old host list')
  return getOldHosts()
}).then((hostList) => {
  console.log('Decomissioning hosts')
  return Promise.all(hostList.map((oldHost) => {
    console.log('Decomissioning', oldHost)
    return removeFromLoadBalancer(oldHost).then(() => {
      return destroyHost(oldHost)
    })
  }))
}).then(() => {
  console.log('Deployment complete')
}).catch((err) => {
  console.log('Something went wrong. Wah wah. ]:')
  console.log(err)
})
