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
import { IPackageJson, getFromJsonFile } from '../utils';

export default function (): Rule {
  const templatedSource = apply(url('./files'), [
    applyTemplates({ ...strings }),
  ]);

  return (tree: Tree, context: SchematicContext) => {
    const packageJson = getFromJsonFile<IPackageJson>(tree, '/package.json');

    packageJson.devDependencies = {
      ...packageJson.devDependencies,
      '@typescript-eslint/eslint-plugin': '^4.21.0',
      '@typescript-eslint/parser': '^4.21.0',
      eslint: '^7.23.0',
      'eslint-config-prettier': '^8.1.0',
      'eslint-plugin-prettier': '^3.3.1',
    };

    packageJson.scripts = packageJson.scripts || {};
    packageJson.scripts['posttest'] = 'eslint --ext ts .';
    tree.overwrite('/package.json', JSON.stringify(packageJson, null, 2));

    return chain([
      branchAndMerge(
        chain([mergeWith(templatedSource, MergeStrategy.Overwrite)]),
        MergeStrategy.AllowOverwriteConflict
      ),
    ])(tree, context);
  };
}
