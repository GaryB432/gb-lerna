import * as minimist from 'minimist';
interface DryRunnableOptions {
  dryRun: boolean;
  force: boolean;
}
interface AllOptions extends DryRunnableOptions {
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
    alias: { dryRun: 'dry-run', force: 'f', independent: 'i' },
    boolean: ['independent', 'dryRun', 'force'],
    default: { dryRun: false, force: false, independent: false },
    stopEarly: false,
    string: ['packageName'],
  };
}
function getPackageMinimistOpts(): minimist.Opts {
  return {
    '--': false,
    alias: { force: 'f' },
    boolean: ['dryRun', 'force'],
    default: { dryRun: false, force: false },
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
    const { dryRun, force, independent, packageName, name } = opts;
    switch (schematicName) {
      case 'repo':
        return { dryRun, force, options: { independent, packageName }, schematicName };
      case 'package':
        return { dryRun, force, options: { name }, schematicName };
    }
  }
}
