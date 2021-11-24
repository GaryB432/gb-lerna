import { readFile } from 'fs/promises';
import { posix } from 'path';
import { tablify } from './markdown';
import { InfoOptions } from './types';
import fg = require('fast-glob');

interface LernaConfig {
  packages: string[];
  version: string;
}

interface PackageInfo {
  path: string;
  config: PackageConfig;
}

interface PackageConfig {
  description: string;
  name: string;
  private: boolean;
  version: string;
}

export class Info {
  public constructor(private options: InfoOptions) {
    if (this.options.verbose) {
      throw new Error('verbose is not yet supported');
    }
  }

  public liner(p: PackageConfig): string[] {
    const { name } = p;
    return [
      `**${name}**`,
      `[\`${name}\`](https://npmjs.com/package/${name})`,
      `[![latest](https://img.shields.io/npm/v/${name}/latest.svg)](https://npmjs.com/package/${name})`,
      `[![README](https://img.shields.io/badge/README--green.svg)](/packages/${name}/README.md)`,
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

      const buffs = await Promise.all(pjs.sort().map((p) => readFile(p)));

      const ff = [
        '# readme packages',
        '',
        tablify(
          ['Project', 'Package', 'Version', 'Links'],
          buffs
            .map((buff) => JSON.parse(buff.toString()) as PackageConfig)
            .filter((p) => !p.private)
            .map((p) => this.liner(p))
        ),
      ];

      return ff.join('\n');
    } catch (e) {
      return 'unknown error';
    }
  }
}
