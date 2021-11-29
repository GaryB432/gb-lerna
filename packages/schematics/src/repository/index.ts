import { strings } from '@angular-devkit/core';
import {
  apply,
  applyTemplates,
  branchAndMerge,
  chain,
  MergeStrategy,
  mergeWith,
  Rule,
  schematic,
  SchematicContext,
  Tree,
  url,
} from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import path = require('path');

export interface IOptions {
  independent?: boolean;
  packageName?: string;
  skipInstall?: boolean;
}

export default function (options: IOptions): Rule {
  options.skipInstall = true;
  const appname = path.basename(process.cwd());
  options.packageName = options.packageName || appname;

  const templatedSource = apply(url('./files'), [
    applyTemplates({ ...strings, appname }),
  ]);

  return (tree: Tree, context: SchematicContext) => {
    const lernaJson = {
      packages: ['packages/*', 'tools/*'],
      version: options.independent ? 'independent' : '0.0.0',
    };
    tree.create('lerna.json', JSON.stringify(lernaJson, null, 2));
    if (!options.skipInstall) {
      context.addTask(new NodePackageInstallTask());
    }
    return chain([
      branchAndMerge(
        chain([
          mergeWith(templatedSource, MergeStrategy.Overwrite),
          schematic('package', { name: options.packageName }),
          schematic('prettier', {}),
          schematic('eslint', {}),
        ]),
        MergeStrategy.AllowOverwriteConflict
      ),
    ])(tree, context);
  };
}
