import { strings } from '@angular-devkit/core';
import { Tree } from '@angular-devkit/schematics';

/* eslint-disable @typescript-eslint/member-ordering*/
export interface IPackageJson {
  author?: string;
  description?: string;
  dependencies?: {
    [index: string]: string;
  };
  devDependencies?: {
    [index: string]: string;
  };
  files?: Array<string>;
  keywords?: Array<string>;
  license?: string;
  main?: string;
  name: string;
  private?: boolean;
  scripts?: {
    [index: string]: string;
  };
  typings?: string;
  version?: string;
}

export interface ModuleInfo {
  srcPath: string;
  path: string;
  name: string;
}

export interface PackageInfo {
  name: string;
  scope?: string;
}

export interface ILernaJson {
  version: string;
  packages: string[];
}
/* eslint-enable @typescript-eslint/member-ordering*/

export function getPackageInfo(input: string): PackageInfo {
  const parts = input.split('/');
  if (parts.length === 2 && parts[0].startsWith('@')) {
    const scope = strings.dasherize(parts[0].slice(1));
    const pname = strings.dasherize(parts[1]);
    return { name: pname, scope };
  }

  const name = strings.dasherize(input);
  return { name };
}

export function getModuleInfo(input: string): ModuleInfo {
  const parts = input.split('/');
  if (parts.length === 1) {
    return { path: '', srcPath: '../src/', name: input };
  } else {
    const name = parts.pop() || '';
    const srcPath = parts
      .concat('')
      .map(() => '..')
      .concat('src')
      .concat(parts.slice(0, parts.length), '')
      .join('/');
    return {
      name,
      path: parts.slice(0, parts.length).join('/'),
      srcPath,
    };
  }
}

export function getFromJsonFile<T extends ILernaJson | IPackageJson>(
  tree: Tree,
  path: string
): T {
  const buffer = tree.read(path);
  if (!buffer) {
    throw new Error(`${path} not found`);
  }
  return JSON.parse(buffer.toString()) as T;
}
