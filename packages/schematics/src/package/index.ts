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
import { getFromJsonFile, getPackageInfo, IPackageJson, PackageInfo } from '../utils';

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

function packageName(p: PackageInfo): string {
  return p.scope ? `@${p.scope}/${p.name}` : p.name;
}

export default function (options: IOptions): Rule {
  const packageInfo = getPackageInfo(options.name);

  const templatedSource = apply(url('./files'), [applyTemplates({ ...packageInfo, ...strings })]);

  return (tree: Tree, context: SchematicContext) => {
    // const rootPackage: IPackageJson = {
    //   "name": "root",
    //   "private": true,
    //   "devDependencies": {
    //     "@types/jest": "^26.0.3",
    //     "@types/node": "^14.0.14",
    //     "jest": "^26.1.0",
    //     "ts-jest": "^26.1.1",
    //     "typescript": "^3.9.6"
    //   },
    //   "scripts": {
    //     "test": "jest"
    //   },
    //   "dependencies": {
    //     "lerna": "^3.22.1"
    //   }
    // };

    // if (!tree.exists('package.json')){
    //   tree.create('package.json', JSON.stringify(rootPackage, null,2));
    // }

    const packageJson: IPackageJson = {
      author: '',
      description: '',
      devDependencies: {
        typescript: '^3.7.2',
      },
      files: ['lib'],
      keywords: [],
      license: 'ISC',
      main: 'lib/index.js',
      name: packageName(packageInfo),
      private: false,
      scripts: {
        build: 'tsc --pretty',
        prepare: 'npm run build',
      },
      typings: 'lib/index.d.ts',
      version: lernaPublishVersion(tree) || '0.0.0',
    };

    tree.create(
      `./packages/${strings.dasherize(packageInfo.name)}/package.json`,
      JSON.stringify(packageJson, null, 2)
    );

    return chain([
      branchAndMerge(
        chain([mergeWith(templatedSource, MergeStrategy.Overwrite)]),
        MergeStrategy.AllowOverwriteConflict
      ),
    ])(tree, context);
  };
}
