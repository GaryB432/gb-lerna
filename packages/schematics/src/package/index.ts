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
import {
  getFromJsonFile,
  getPackageInfo,
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

function packageName(p: PackageInfo): string {
  return p.scope ? `@${p.scope}/${p.name}` : p.name;
}

export default function (options: IOptions): Rule {
  const packageInfo = getPackageInfo(options.name);

  const templatedSource = apply(url('./files'), [
    applyTemplates({ ...packageInfo, ...strings }),
  ]);

  return (tree: Tree, context: SchematicContext) => {
    /* eslint-disable sort-keys */
    const packageJson: IPackageJson = {
      name: packageName(packageInfo),
      version: lernaPublishVersion(tree) || '0.0.0',
      description: '',
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
        build: 'tsc --pretty',
        prepare: 'npm run build',
      },
      typings: 'lib/index.d.ts',
    };

    tree.create(
      `./packages/${strings.dasherize(packageInfo.name)}/package.json`,
      JSON.stringify(packageJson, null, 2)
    );

    return chain([
      branchAndMerge(
        chain([
          mergeWith(templatedSource, MergeStrategy.Overwrite),
          // schematic('module', {
          //   packageName: options.name,
          //   name: 'Greeter',
          //   kind: 'class',
          //   test: true,
          // }),
        ]),
        MergeStrategy.AllowOverwriteConflict
      ),
    ])(tree, context);
  };
}
