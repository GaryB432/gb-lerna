import { strings } from '@angular-devkit/core';
import {
  apply,
  applyTemplates,
  branchAndMerge,
  chain,
  MergeStrategy,
  mergeWith,
  Rule,
  SchematicContext,
  Tree,
  url,
} from '@angular-devkit/schematics';
import { getFromJsonFile, IPackageJson } from '../utils';

export default function (): Rule {
  const templatedSource = apply(url('./files'), [
    applyTemplates({ ...strings }),
  ]);

  return (tree: Tree, context: SchematicContext) => {
    const packageJson = getFromJsonFile<IPackageJson>(tree, 'package.json');

    packageJson.devDependencies = packageJson.devDependencies || {};
    packageJson.scripts = packageJson.scripts || {};

    packageJson.devDependencies['prettier'] = '^2.0.5';
    packageJson.scripts['format'] = 'prettier --write "**/*.ts"  "!**/lib/**"';

    tree.overwrite('/package.json', JSON.stringify(packageJson, null, 2));

    return chain([
      branchAndMerge(
        chain([mergeWith(templatedSource, MergeStrategy.Overwrite)]),
        MergeStrategy.AllowOverwriteConflict
      ),
    ])(tree, context);
  };
}
