import * as minimist from 'minimist';
interface DryRunnableOptions {
  dryRun: boolean;
}
interface AllOptions {
  dryRun: boolean;
  independent: boolean;
  name: string;
  packageName: string;
}
export interface RepoOptions extends DryRunnableOptions {
  schematicName: 'repo';
  options: {
    independent: boolean;
    packageName: string;
  };
}
export interface PackageOptions extends DryRunnableOptions {
  schematicName: 'package';
  options: {
    name: string;
  };
}
type SchematicOptions = RepoOptions | PackageOptions;
export function getRepoMinimistOpts(): minimist.Opts {
  return {
    '--': false,
    alias: { dryRun: 'dry-run', independent: 'i' },
    boolean: ['independent', 'dryRun'],
    default: { dryRun: false, independent: false },
    stopEarly: false,
    string: ['packageName'],
  };
}
function getPackageMinimistOpts(): minimist.Opts {
  return {
    '--': false,
    alias: {},
    boolean: ['dryRun'],
    default: { dryRun: false },
    stopEarly: false,
    string: ['name'],
  };
}
function parseArgs(args: string[]): minimist.ParsedArgs | undefined {
  switch (args[0]) {
    case 'repo':
      return minimist(args, getRepoMinimistOpts());
    case 'package':
      return minimist(args, getPackageMinimistOpts());
  }
}
export function getWorkflowInfo(args: string[]): SchematicOptions | undefined {
  const schematicName = args[0];
  const opts = (parseArgs(args) as unknown) as AllOptions | undefined;
  if (opts) {
    const { dryRun, independent, packageName, name } = opts;
    switch (schematicName) {
      case 'repo':
        return { dryRun, options: { independent, packageName }, schematicName };
      case 'package':
        return { dryRun, options: { name }, schematicName };
    }
  }
}
