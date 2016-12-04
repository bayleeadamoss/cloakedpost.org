const generateId = require('../../lib/generateId')

function generateNames(nameCount) {
  const result = [];
  for (var i=0; i<nameCount; i++) {
    result.push(`cloadedpost-app-${generateId(7)}`)
  }
  return result
}

module.exports = generateNames
