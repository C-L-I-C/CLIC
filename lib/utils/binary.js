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

function wordToPigLatin(word) {
  const vowels = ['a', 'e', 'i', 'o', 'u'];
  let result = '';

  if (vowels.includes(word[0])) {
    result = word + 'way';
  } else {
    let consonants = '';
    for (let i = 0; i < word.length; i++) {
      if (vowels.includes(word[i])) {
        break;
      }
      consonants += word[i];
    }
    result = word.substring(consonants.length) + consonants + 'ay';
  }

  return result.replace(/[^a-zA-Z ]/g, '');
}

function stringToPigLatin(str) {
  return str
    .split(' ')
    .map((i) => wordToPigLatin(i))
    .join(' ');
}

module.exports = {
  stringToBinary,
  binaryToString,
  wordToPigLatin,
  stringToPigLatin,
};
