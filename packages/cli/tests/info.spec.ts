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
      Info.liner({
        path: 'packages/tester/package.json',
        config: {
          name: 'tester',
          description: 'some description',
          version: '1',
          private: false,
        },
      })
    ).toEqual([
      '**packages/tester**',
      '[`tester`](https://npmjs.com/package/tester)',
      '[![latest](https://img.shields.io/npm/v/tester/latest.svg)](https://npmjs.com/package/tester)',
      '[![README](https://img.shields.io/badge/README--green.svg)](/packages/tester/README.md)',
    ]);
  });
});
