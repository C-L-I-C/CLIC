const {
  stringToBinary,
  binaryToString,
  wordToPigLatin,
  stringToPigLatin,
} = require('../lib/utils/binary');

describe('/ command functions', () => {
  it('should be able to convert a string to its value in binary code', () => {
    const string = 'Hello World';
    const binary = stringToBinary(string);
    expect(binary).toEqual(
      '1001000 1100101 1101100 1101100 1101111 100000 1010111 1101111 1110010 1101100 1100100'
    );
  });

  it('should be able to convert a binary code to its string value', () => {
    const binary =
      '1001000 1100101 1101100 1101100 1101111 100000 1010111 1101111 1110010 1101100 1100100';
    const string = binaryToString(binary);
    expect(string).toEqual('Hello World');
  });

  it('should return Invalid input if input is not a binary code', () => {
    const binary = '1001000 helloworld 1100100';
    const string = binaryToString(binary);
    expect(string).toEqual('Invalid input');
  });

  it('should return the Pig Latin version of the single word string input', () => {
    const strVowel = 'animal';
    const strCons = 'world';
    const pigLatinVowel = wordToPigLatin(strVowel);
    const pigLatinCons = wordToPigLatin(strCons);

    expect(pigLatinVowel).toEqual('animalway');
    expect(pigLatinCons).toEqual('orldway');
  });

  it('should return the Pig Latin version of the string input', () => {
    const str = 'hello world, are you okay?';
    const pigLatin = stringToPigLatin(str);

    expect(pigLatin).toEqual('ellohay orldway areway ouyay okayway');
  });
});
