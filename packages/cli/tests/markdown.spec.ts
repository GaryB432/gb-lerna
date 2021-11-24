import { tablify, tablifyLine } from '../src/markdown';

describe('markdown', () => {
  test('tablifyLine', () => {
    expect(tablifyLine(['a', 'b', 'c'])).toEqual('| a | b | c |');
  });

  test('tablify', () => {
    expect(
      tablify(
        ['one', 'two', 'three'],
        [
          ['a', 'b', 'c'],
          ['d', 'e', 'f'],
        ]
      )
    ).toEqual(
      '| one | two | three |\n| --- | --- | --- |\n| a | b | c |\n| d | e | f |'
    );
  });
});
