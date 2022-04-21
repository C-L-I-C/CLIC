function stringToBinary(str) {
  return str
    .split('')
    .map((i) => i.charCodeAt(0).toString(2))
    .join(' ');
}

function binaryToString(binary) {
  const isBinary = binary
    .split('')
    .every((i) => i === '1' || i === '0' || i === ' ');

  if (isBinary) {
    return binary
      .split(' ')
      .map((i) => String.fromCharCode(parseInt(i, 2)))
      .join('');
  } else {
    return 'Invalid input';
  }
}

module.exports = { stringToBinary, binaryToString };
