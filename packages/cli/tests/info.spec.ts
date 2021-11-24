import { Info } from '../src/info';

describe('Info', () => {
  let info: Info;
  beforeEach(() => {
    info = new Info({ verbose: true });
  });
  test('exists', () => {
    expect(info).toBeDefined();
  });
});
