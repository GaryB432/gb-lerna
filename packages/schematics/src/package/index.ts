import { strings } from '@angular-devkit/core';
import {
  apply,
  applyTemplates,
  branchAndMerge,
  MergeStrategy,
  mergeWith,
  Rule,
  SchematicContext,
  source,
  Tree,
  url,
} from '@angular-devkit/schematics';
import {
  formatFiles,
  getFromJsonFile,
  getPackageInfo,
  getPrettierOptions,
  IPackageJson,
  PackageInfo,
} from '../utils';

interface IOptions {
  name: string;
}

interface ILernaJson {
  packages: Array<string>;
  version: string;
}

function lernaPublishVersion(tree: Tree): string | undefined {
  const { version } = getFromJsonFile<ILernaJson>(tree, 'lerna.json');
  return version === 'independent' ? '0.0.0' : version;
}

function addPackageJson(packageInfo: PackageInfo, host: Tree): Rule {
  const packageJson: IPackageJson = {
    name: packageInfo.packageName,
    version: lernaPublishVersion(host) || '0.0.0',
    description: packageInfo.description,
    private: false,
    devDependencies: {
      rimraf: '^3.0.2',
      typescript: '^4.1.3',
    },
    files: ['lib'],
    keywords: [],
    license: 'ISC',
    main: 'lib/index.js',
    scripts: {
      prebuild: 'rimraf lib',
      build: 'tsc',
      prepare: 'npm run build',
    },
    typings: 'lib/index.d.ts',
  };

  return (tree: Tree) => {
    tree.create(
      `/packages/${strings.dasherize(packageInfo.name)}/package.json`,
      JSON.stringify(packageJson, null, 2)
    );
    return mergeWith(source(tree), MergeStrategy.Error);
  };
}

export default function (options: IOptions): Rule {
  const packageInfo = getPackageInfo(options.name);

  if (packageInfo.name.indexOf('/') > -1) {
    throw new Error('invalid package name');
  }

  const templatedSource = apply(url('./files'), [
    applyTemplates({
      ...packageInfo,
      ...strings,
    }),
  ]);

  return (tree: Tree, context: SchematicContext) => {
    return branchAndMerge(
      mergeWith(
        apply(templatedSource, [
          addPackageJson(packageInfo, tree),
          formatFiles(getPrettierOptions(tree)),
        ]),
        MergeStrategy.Overwrite
      ),
      MergeStrategy.AllowOverwriteConflict
    )(tree, context);
  };
}
