function generateId (length = 15) {
  const chars = []
  const possible = 'abcdefghijklmnopqrstuvwxyz0123456789'
  const possibleLen = possible.length
  for (let i = 0; i < length; i++) {
    chars.push(possible.charAt(Math.floor(Math.random() * possibleLen)))
  }

  return chars.join('');
}

module.exports = generateId
