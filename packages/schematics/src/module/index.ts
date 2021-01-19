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
import { getPackageInfo } from '../utils';

interface IOptions {
  packageName: string;
  name: string;
  kind: string;
  test: boolean;
}

export default function (options: IOptions): Rule {
  const packageInfo = getPackageInfo(options.packageName);
  const moduleName = options.name;

  const templatedSource = apply(url('./files'), [
    applyTemplates({ ...packageInfo, ...strings, moduleName }),
  ]);

  return (tree: Tree, context: SchematicContext) => {
    // tree.create(`./packages/${strings.dasherize(packageInfo.name)}/src/.gitkeep`, '');

    return chain([
      branchAndMerge(
        chain([mergeWith(templatedSource, MergeStrategy.Overwrite)]),
        MergeStrategy.AllowOverwriteConflict
      ),
    ])(tree, context);
  };
}
