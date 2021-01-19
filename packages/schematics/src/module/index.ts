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
import { getPackageInfo, PackageInfo } from '../utils';

interface IOptions {
  packageName: string;
  name: string;
  kind: string;
  test: boolean;
}

// interface ILernaJson {
//   packages: Array<string>;
//   version: string;
// }

// function lernaPublishVersion(tree: Tree): string | undefined {
//   const { version } = getFromJsonFile<ILernaJson>(tree, 'lerna.json');
//   return version === 'independent' ? '0.0.0' : version;
// }

function packageName(p: PackageInfo): string {
  return p.scope ? `@${p.scope}/${p.name}` : p.name;
}

export default function (options: IOptions): Rule {
  const packageInfo = getPackageInfo(options.packageName);
  const name = options.name;

  const templatedSource = apply(url('./files'), [applyTemplates({ ...packageInfo, ...strings })]);

  return (tree: Tree, context: SchematicContext) => {
    tree.create(`./packages/${strings.dasherize(packageInfo.name)}/fun.txt`, 'coming soon');

    return chain([
      branchAndMerge(
        chain([mergeWith(templatedSource, MergeStrategy.Overwrite)]),
        MergeStrategy.AllowOverwriteConflict
      ),
    ])(tree, context);
  };
}
