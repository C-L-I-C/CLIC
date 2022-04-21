const { stringToBinary, binaryToString } = require('../lib/utils/binary');

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
});
