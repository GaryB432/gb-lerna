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
import { getFromJsonFile, getPackageInfo, IPackageJson } from '../utils';

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

function prettier(s: string, _options: unknown): string {
  return `${s}\n// here we are`;
}

function formatRule(tree: Tree): void {
  tree.visit((path, entry) => {
    if (entry) {
      tree.overwrite(path, prettier(entry.content.toString(), { tbd: true }));
      console.log(path, ' format');
    }
  });
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
    formatRule,
  ]);

  return (tree: Tree, context: SchematicContext) => {
    const packageJson: IPackageJson = {
      name: packageInfo.packageName,
      version: lernaPublishVersion(tree) || '0.0.0',
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
