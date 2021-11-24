import { Info } from '../src/info';

describe('Info', () => {
  let info: Info;
  beforeEach(() => {
    info = new Info({ verbose: false });
  });
  test('exists', () => {
    expect(info).toBeDefined();
  });

  test('liner', () => {
    expect(
      info.liner({
        name: 'tester',
        description: 'some description',
        version: '1',
        private: false,
      })
    ).toEqual([
      '**tester**',
      '[`tester`](https://npmjs.com/package/tester)',
      '[![latest](https://img.shields.io/npm/v/tester/latest.svg)](https://npmjs.com/package/tester)',
      '[![README](https://img.shields.io/badge/README--green.svg)](/packages/tester/README.md)',
    ]);
  });
});
