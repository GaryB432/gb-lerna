import { strings } from '@angular-devkit/core';
import {
  apply,
  applyTemplates,
  branchAndMerge,
  chain,
  FileEntry,
  MergeStrategy,
  mergeWith,
  noop,
  Rule,
  SchematicContext,
  Tree,
  url,
} from '@angular-devkit/schematics';
import minimatch = require('minimatch');
import {
  getFromJsonFile,
  getPackageInfo,
  ILernaJson,
  IPackageJson,
} from '../utils';

interface IOptions {
  packageName: string;
  name: string;
  kind: string;
  test: boolean;
}

function getPackageNames(tree: Tree): string[] {
  const names: string[] = [];
  const { packages } = getFromJsonFile<ILernaJson>(tree, 'lerna.json');
  const packageJsons = packages.map((packageGlob) =>
    packageGlob.concat('/package.json')
  );
  tree.visit((path, file?: Readonly<FileEntry> | null) => {
    if (file) {
      for (const packageJson of packageJsons) {
        const match = minimatch(
          path.startsWith('/') ? path.slice(1) : path,
          packageJson,
          {
            matchBase: false,
          }
        );
        if (match) {
          const pkg: IPackageJson = JSON.parse(file.content.toString());
          names.push(pkg.name);
        }
      }
    }
  });
  return names;
}

export default function (options: IOptions): Rule {
  const moduleName = options.name;

  return (tree: Tree, context: SchematicContext) => {
    const packageNames = getPackageNames(tree);
    const packageInfo = getPackageInfo(options.packageName || packageNames[0]);
    const templatedSource = apply(url('./files/functions/src'), [
      applyTemplates({ ...packageInfo, ...strings, moduleName }),
    ]);
    const templatedTests = apply(url('./files/functions/test'), [
      applyTemplates({ ...packageInfo, ...strings, moduleName }),
    ]);

    return chain([
      branchAndMerge(
        chain([
          mergeWith(templatedSource, MergeStrategy.Overwrite),
          options.test
            ? mergeWith(templatedTests, MergeStrategy.Overwrite)
            : noop(),
        ]),
        MergeStrategy.AllowOverwriteConflict
      ),
    ])(tree, context);
  };
}
