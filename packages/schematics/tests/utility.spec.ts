import { getModuleInfo, getPackageInfo } from '../src/utils';

describe('Utilities', () => {
  it('handles scope', () => {
    expect(getPackageInfo('@SomePackage/asdf')).toEqual({
      name: 'asdf',
      scope: 'some-package',
    });
  });
  it('handles no scope', () => {
    expect(getPackageInfo('asdf')).toEqual({ name: 'asdf' });
  });
  it('handles weirdness', () => {
    expect(getPackageInfo('NoAtSign/other/Stuff')).toEqual({
      name: 'no-at-sign/other/stuff',
    });
  });
});

describe('Module Info', () => {
  it('handles blank', () => {
    expect(getModuleInfo('')).toEqual({
      name: '',
      path: '',
      srcPath: '../src/',
    });
  });
  it('handles name', () => {
    expect(getModuleInfo('asdf')).toEqual({
      name: 'asdf',
      path: '',
      srcPath: '../src/',
    });
  });

  it('handles path', () => {
    expect(getModuleInfo('a/b/asdf')).toEqual({
      name: 'asdf',
      path: 'a/b',
      srcPath: '../../../src/a/b/',
    });
  });
});
