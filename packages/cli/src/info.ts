import { PathOrFileDescriptor, readFile as rf } from 'fs';
import { dirname, posix } from 'path';
import { tablify } from './markdown';
import { InfoOptions } from './types';
import fg = require('fast-glob');

interface LernaConfig {
  packages: string[];
  version: string;
}

interface PackageInfo {
  config: PackageConfig;
  path: string;
}

interface PackageConfig {
  description: string;
  name: string;
  private: boolean;
  version: string;
}

async function readFile(path: PathOrFileDescriptor): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    rf(path, (e, buff) => {
      if (e) reject(e);
      resolve(buff);
    });
  });
}

export class Info {
  public constructor(private options: InfoOptions) {
    if (this.options.verbose) {
      throw new Error('verbose is not yet supported');
    }
  }

  public static liner(p: PackageInfo): string[] {
    const { name } = p.config;
    return [
      `**${dirname(p.path)}**`,
      `[\`${name}\`](https://npmjs.com/package/${name})`,
      `[![latest](https://img.shields.io/npm/v/${name}/latest.svg)](https://npmjs.com/package/${name})`,
      `[![README](https://img.shields.io/badge/README--green.svg)](/${dirname(
        p.path
      )}/README.md)`,
    ];
  }

  public async report(): Promise<string> {
    try {
      const config = await readFile('lerna.json');
      const repo = JSON.parse(config.toString()) as LernaConfig;

      const pjs: string[] = await fg(
        repo.packages.map((p) => posix.join(p, 'package.json')),
        { dot: true }
      );

      const pjpaths = await Promise.all(pjs.sort());

      const infos = await Promise.all(
        pjpaths.map(async (path: string): Promise<PackageInfo> => {
          const buff = await readFile(path);
          const config = JSON.parse(buff.toString()) as PackageConfig;
          return { path, config };
        })
      );

      return [
        '# readme packages',
        '',
        tablify(
          ['Project', 'Package', 'Version', 'Links'],
          infos.filter((info) => !info.config.private).map(Info.liner)
        ),
      ].join('\n');
    } catch (e) {
      return 'unknown error';
    }
  }
}
