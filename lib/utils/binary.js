function stringToBinary(str) {
  return str
    .split('')
    .map((i) => i.charCodeAt(0).toString(2))
    .join(' ');
}

function binaryToString(binary) {
  return binary
    .split(' ')
    .map((i) => String.fromCharCode(parseInt(i, 2)))
    .join('');
}

module.exports = { stringToBinary, binaryToString };
