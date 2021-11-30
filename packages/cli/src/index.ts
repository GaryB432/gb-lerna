#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-member-access */

import { Command, Option } from 'commander';
import { Info } from './info';
import { Runner } from './runner';
import {
  ModuleOptions,
  PackageOptions,
  RepoOptions,
  InfoOptions,
} from './types';

export interface ProgramOptions {
  dryRun: boolean;
  force: boolean;
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
  .version((require('../package.json') as { version: string }).version)
  .option('-f, --force', 'use force on schematics')
  .option('-d, --dryRun', 'dry run only');

program
  .command('repo [initialPackage]')
  .alias('repository')
  .description('create a new monorepo with initial package')
  .option('-i, --independent', 'version packages independently')
  .option('--skip-install', 'skip package install')
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

program
  .command('module <name> [scope]')
  .description('create a new class or module')
  .addOption(
    new Option('-k, --kind <kind>', 'the kind of module')
      .choices(['class', 'functions', 'values'])
      .default('values')
  )
  .option('--no-test', 'skip spec file')
  .action((name: string, packageName: string, options: ModuleOptions) => {
    const { test, kind } = options;
    createRunner(getProgramOptions(program.opts())).createModule({
      kind,
      name,
      packageName,
      test,
    });
  });

program
  .command('info')
  .description('print information about your lerna repo')
  .option('-v, --verbose', 'verbose output')
  .action((options: InfoOptions) => {
    new Info(options)
      .report()
      .then((r) => console.log(r))
      .catch((e) => console.log(e));
  });

// program
//   .command('plop')
//   .description('show messages')
//   .action(() => {
//     createRunner(getProgramOptions(program.opts())).showMessages();
//   });

program.parse(process.argv);
