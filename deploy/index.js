const moment = require('moment')
const CURRENT_TAG = 'CLOAKEDPOST-' + moment().format('YYYY-M-DD-H-mm-ss')

const getLatestSnapshot = require('./tasks/getLatestSnapshot')
const getHostCount = require('./tasks/getHostCount')
const getOldHosts = require('./tasks/getOldHosts')
const buildAssets = require('./tasks/buildAssets')
const createHosts = require('./tasks/createHosts')
const deployHost = require('./tasks/deployHost')
const createSnapshot = require('./tasks/createSnapshot')
const decomissionHost = require('./tasks/decomissionHost')

const deleteOldestSnapshot = () => {
  return Promise.resolve()
}

const addToLoadBalancer = (host) => {
  return Promise.resolve()
}

const removeToLoadBalancer = (host) => {
  return Promise.resolve()
}

Promise.all([getHostCount(), getLatestSnapshot(), buildAssets()]).then(([hostCount, lastSnapshot]) => {
  console.log('Creating hosts')
  return createHosts(hostCount, lastSnapshot)
}).then((newHostList) => {
  console.log('Deploying to hosts')
  return Promise.all(newHostList.map((newHost) => {
    console.log('Deploying to host', newHost)
    return deployHost(newHost).then(() => {
      return addToLoadBalancer(newHost)
    })
  }))
}).then(([firstHost]) => {
  console.log('Creating a new snapshot')
  return createSnapshot(firstHost)
}).then(() => {
  console.log('Getting old host list')
  return getOldHosts()
}).then((hostList) => {
  console.log('Decomissioning hosts')
  return Promise.all(hostList.map((oldHost) => {
    console.log('Decomissioning', oldHost)
    return removeFromLoadBalancer(oldHost).then(() => {
      return decomissionHost(oldHost)
    })
  }))
}).then(([firstHost]) => {
  console.log('Deleting oldest snapshot')
  return deleteOldestSnapshot(firstHost)
}).then(() => {
  console.log('Deployment complete')
}).catch((err) => {
  console.log('Something went wrong. Wah wah. ]:')
  console.log(err)
})
