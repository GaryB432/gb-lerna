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
  source,
  Source,
  Tree,
  url,
} from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
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

function prettier(s: string, _options: PrettierOptions): string {
  return `${s}\n// here we are again`;
}

interface PrettierOptions {
  semi: boolean;
}

function getPrettierOptions(tree: Tree): PrettierOptions {
  tree.visit((f) => console.log(f, 'xxd'));

  return { semi: true };
}

function format(options: PrettierOptions): Rule {
  console.log(options);
  return (tree: Tree) => {
    tree.visit((path, entry) => {
      if (entry) {
        console.log('format', path);
        tree.overwrite(path, prettier(entry.content.toString(), options));
      }
    });
  };
}

export default function (options: IOptions): Rule {
  const packageInfo = getPackageInfo(options.name);

  if (packageInfo.name.indexOf('/') > -1) {
    throw new Error('invalid package name');
  }

  return (tree: Tree, context: SchematicContext) => {
    const templatedSource = apply(url('./files'), [
      applyTemplates({
        ...packageInfo,
        ...strings,
      }),
    ]);

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
      `/packages/${strings.dasherize(packageInfo.name)}/package.json`,
      JSON.stringify(packageJson, null, 2)
    );

    return branchAndMerge(
      mergeWith(
        apply(templatedSource, [format(getPrettierOptions(tree))]),
        MergeStrategy.Overwrite
      ),
      MergeStrategy.AllowOverwriteConflict
    )(tree, context);

    // return chain([
    //   branchAndMerge(
    //     chain([
    //       mergeWith(
    //         apply(templatedSource, [format(getPrettierOptions(tree))]),
    //         MergeStrategy.Overwrite
    //       ),
    //       // schematic('module', {
    //       //   packageName: options.name,
    //       //   name: 'Greeter',
    //       //   kind: 'class',
    //       //   test: true,
    //       // }),
    //     ]),
    //     MergeStrategy.AllowOverwriteConflict
    //   ),
    // ])(tree, context);
  };
}

// export function formatFiles(options: PrettierOptions): Rule {
//   return () => {
//     return format(options);
//     // return chain([format(options)]);
//   };
// }
