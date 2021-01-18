#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-var-requires */

import { Command } from 'commander';
import { Runner } from './runner';
import { PackageOptions, RepoOptions } from './types';

export const collection = '@gb-lerna/schematics';

export interface ProgramOptions {
  force: boolean;
  dryRun: boolean;
}

function createRunner(o: Partial<ProgramOptions>): Runner {
  const { dryRun, force } = getProgramOptions(o);
  return new Runner(dryRun, force);
}

function getProgramOptions(o: Partial<ProgramOptions>): ProgramOptions {
  const dryRun = o.dryRun || false;
  const force = o.force || false;
  return { dryRun, force };
}

const program = new Command('gb-lerna');
program
  .version(require('../package.json').version)
  .option('-f, --force', 'use force on schematics')
  .option('-d, --dryRun', 'dry run only');

program
  .command('repo <initialPackage>')
  .alias('repository')
  .description('create a new monorepo with initial package')
  .option('-i, --independent', 'version packages independently')
  .action((packageName: string, options: RepoOptions) => {
    options.packageName = packageName;
    createRunner(getProgramOptions(program.opts())).createRepository(options);
  });

program
  .command('package <name>')
  .description('create a new package')
  .action((name: string, options: PackageOptions) => {
    options.name = name;
    createRunner(getProgramOptions(program.opts())).createPackage(options);
  });

program.parse(process.argv);
