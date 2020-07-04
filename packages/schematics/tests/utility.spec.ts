import { getPackageInfo } from '../src/utils';

describe('Utilities', () => {
  it('handles scope', () => {
    expect(getPackageInfo('@SomePackage/asdf')).toEqual({ scope: 'some-package', name: 'asdf' });
  });
  it('handles no scope', () => {
    expect(getPackageInfo('asdf')).toEqual({ name: 'asdf' });
  });
  it('handles weirdness', () => {
    expect(getPackageInfo('NoAtSign/other/Stuff')).toEqual({ name: 'no-at-sign/other/stuff' });
  });
});
