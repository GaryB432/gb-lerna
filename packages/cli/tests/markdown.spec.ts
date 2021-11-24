import { tablify } from '../src/markdown';

describe('markdown', () => {
  test('tablify', () => {
    expect(tablify(['a', 'b', 'c'])).toEqual('| a | b | c |');
  });
});
