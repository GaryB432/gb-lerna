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
import path = require('path');

export interface IOptions {
  independent?: boolean;
  packageName?: string;
}

export default function (options: IOptions): Rule {
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
