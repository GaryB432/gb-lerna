import { main } from '../src';

import * as minimist from 'minimist';
import {
  getRepoMinimistOpts,
  getWorkflowInfo,
  RepoOptions,
  PackageOptions,
} from '../src/options-utils';

describe('cli module', () => {
  it('should be defined', () => {
    expect(main).toBeDefined();
  });

  it('should make example parsedArgs', () => {
    expect(
      minimist(['repo', '@scope/pn', '-i'], getRepoMinimistOpts())
    ).toEqual<minimist.ParsedArgs>({
      _: ['repo', '@scope/pn'],
      'dry-run': false,
      dryRun: false,
      i: true,
      independent: true,
    });
  });

  it('should parse repo', () => {
    const ro = expect(
      getWorkflowInfo(['repo', '--packageName', 'banana', '-i'])
    ).toEqual<RepoOptions>({
      dryRun: false,
      options: { independent: true, packageName: 'banana' },
      schematicName: 'repo',
    });
  });

  it('should parse package', () => {
    expect(getWorkflowInfo(['package', '--name=apple'])).toEqual<PackageOptions>({
      dryRun: false,
      options: { name: 'apple' },
      schematicName: 'package',
    });
  });

  it('should parse package dryRun', () => {
    expect(getWorkflowInfo(['package', '--name=apple', '--dryRun'])).toEqual<PackageOptions>({
      dryRun: true,
      options: { name: 'apple' },
      schematicName: 'package',
    });
  });

  it('should parse package ignore junk', () => {
    expect(
      getWorkflowInfo(['package', '--name=apple', '--independent', '--packageName', 'pn'])
    ).toEqual<PackageOptions>({
      dryRun: false,
      options: { name: 'apple' },
      schematicName: 'package',
    });
  });
});
