import { add, greet } from '../src/lerna';

describe('lerna', () => {
  test('adds', () => {
    expect(add(2, 3)).toEqual(5);
  });
  test('greets', () => {
    expect(greet('world')).toEqual('lerna says: hello to world');
  });
});
