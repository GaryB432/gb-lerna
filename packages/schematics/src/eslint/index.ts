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

    packageJson.devDependencies = packageJson.devDependencies || {};

    packageJson.devDependencies['@typescript-eslint/eslint-plugin'] = '^4.14.1';
    packageJson.devDependencies['@typescript-eslint/parser'] = '^4.14.1';
    packageJson.devDependencies['eslint'] = '^7.18.0';
    packageJson.devDependencies['eslint-config-prettier'] = '^7.2.0';
    packageJson.devDependencies['eslint-formatter-friendly'] = '^7.0.0';
    packageJson.devDependencies['eslint-plugin-prettier'] = '^3.3.1';

    packageJson.scripts = packageJson.scripts || {};
    packageJson.scripts['posttest'] = 'eslint --ext js,ts .';
    tree.overwrite('/package.json', JSON.stringify(packageJson, null, 2));

    return chain([
      branchAndMerge(
        chain([mergeWith(templatedSource, MergeStrategy.Overwrite)]),
        MergeStrategy.AllowOverwriteConflict
      ),
    ])(tree, context);
  };
}
