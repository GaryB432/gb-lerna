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
  getModuleInfo,
  getPackageInfo,
  ILernaJson,
  IPackageJson,
} from '../utils';

export interface ModuleOptions {
  kind?: 'class' | 'functions';
  name: string;
  packageName?: string;
  test?: boolean;
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
          const pkg = JSON.parse(file.content.toString()) as IPackageJson;
          names.push(pkg.name);
        }
      }
    }
  });
  return names;
}

export default function (options: ModuleOptions): Rule {
  const info = getModuleInfo(options.name);
  const { srcPath, path: modulePath, name: moduleName } = info;
  // const modulePath = info.path;
  // const moduleName = info.name;
  const kind = options.kind || 'functions';

  return (tree: Tree, context: SchematicContext) => {
    const packageNames = getPackageNames(tree);
    const packageInfo = getPackageInfo(
      options.packageName || packageNames[0] || 'package1'
    );
    const templatedSource = apply(url(`./files/${kind}/src`), [
      applyTemplates({
        ...packageInfo,
        ...strings,
        modulePath,
        moduleName,
        srcPath,
      }),
    ]);
    const templatedTests = apply(url(`./files/${kind}/test`), [
      applyTemplates({
        ...packageInfo,
        ...strings,
        modulePath,
        moduleName,
        srcPath,
      }),
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
