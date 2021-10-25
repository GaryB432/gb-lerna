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
      '@typescript-eslint/eslint-plugin': '^5.1.0',
      '@typescript-eslint/parser': '^5.1.0',
      eslint: '^8.1.0',
      'eslint-config-prettier': '^8.3.0',
      'eslint-plugin-prettier': '^4.0.0',
      'eslint-plugin-jest': '^25.2.2',
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
