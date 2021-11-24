import { InfoOptions } from './types';
import { readFile } from 'fs/promises';
import { posix } from 'path';
import fg = require('fast-glob');

interface LernaConfig {
  packages: string[];
  version: string;
}

interface PackageConfig {
  description: string;
  name: string;
  private: boolean;
  version: string;
}

export class Info {
  public constructor(private options: InfoOptions) {}

  public liner(p: PackageConfig): string[] {
    /*    
| Folder | Version | Changelog | Package |
| ------ | ------- | --------- | ------- |
| [/apps/api-documenter](./apps/api-documenter/) | [![npm version](https://badge.fury.io/js/%40microsoft%2Fapi-documenter.svg)](https://badge.fury.io/js/%40microsoft%2Fapi-documenter) | [changelog](./apps/api-documenter/CHANGELOG.md) | [@microsoft/api-documenter](https://www.npmjs.com/package/@microsoft/api-documenter) |
| [/apps/api-extractor](./apps/api-extractor/) | [![npm version](https://badge.fury.io/js/%40microsoft%2Fapi-extractor.svg)](https://badge.fury.io/js/%40microsoft%2Fapi-extractor) | [changelog](./apps/api-extractor/CHANGELOG.md) | [@microsoft/api-extractor](https://www.npmjs.com/package/@microsoft/api-extractor) |
| [/apps/api-extractor-model](./apps/api-extractor-model/) | [![npm version](https://badge.fury.io/js/%40microsoft%2Fapi-extractor-model.svg)](https://badge.fury.io/js/%40microsoft%2Fapi-extractor-model) | [changelog](./apps/api-extractor-model/CHANGELOG.md) | [@microsoft/api-extractor-model](https://www.npmjs.com/package/@microsoft/api-extractor-model) |
| [/apps/heft](./apps/heft/) | [![npm version](https://badge.fury.io/js/%40rushstack%2Fheft.svg)](https://badge.fury.io/js/%40rushstack%2Fheft) | [changelog](./apps/heft/CHANGELOG.md) | [@rushstack/heft](https://www.npmjs.com/package/@rushstack/heft) |
| [/apps/rundown](./apps/rundown/) | [![npm version](https://badge.fury.io/js/%40rushstack%2Frundown.svg)](https://badge.fury.io/js/%40rushstack%2Frundown) | [changelog](./apps/rundown/CHANGELOG.md) | [@rushstack/rundown](https://www.npmjs.com/package/@rushstack/rundown) |
| [/apps/rush](./apps/rush/) | [![npm version](https://badge.fury.io/js/%40microsoft%2Frush.svg)](https://badge.fury.io/js/%40microsoft%2Frush) | [changelog](./apps/rush/CHANGELOG.md) | [@microsoft/rush](https://www.npmjs.com/package/@microsoft/rush) |
| [/apps/rush-lib](./apps/rush-lib/) | [![npm version](https://badge.fury.io/js/%40microsoft%2Frush-lib.svg)](https://badge.fury.io/js/%40microsoft%2Frush-lib) | | [@microsoft/rush-lib](https://www.npmjs.com/package/@microsoft/rush-lib) |




| Project | Package | Version | Links |
|---|---|---|---|
**lerna-typescript** | [`generator-lerna-typescript`](https://npmjs.com/package/generator-lerna-typescript) | [![latest](https://img.shields.io/npm/v/generator-lerna-typescript/latest.svg)](https://npmjs.com/package/generator-lerna-typescript) | [![README](https://img.shields.io/badge/README--green.svg)](/packages/generator-lerna-typescript/README.md) 
**webpack-ts** | [`generator-webpack-ts`](https://npmjs.com/package/generator-webpack-ts) | [![latest](https://img.shields.io/npm/v/generator-webpack-ts/latest.svg)](https://npmjs.com/package/generator-webpack-ts) | [![README](https://img.shields.io/badge/README--green.svg)](/packages/generator-webpack-ts/README.md) 
**web-modules** | [`generator-web-modules`](https://npmjs.com/package/generator-web-modules) | [![latest](https://img.shields.io/npm/v/generator-web-modules/latest.svg)](https://npmjs.com/package/generator-web-modules) | [![README](https://img.shields.io/badge/README--green.svg)](/packages/generator-web-modules/README.md) 
**gb-utility** | [`generator-gb-utility`](https://npmjs.com/package/generator-gb-utility) | [![latest](https://img.shields.io/npm/v/generator-gb-utility/latest.svg)](https://npmjs.com/package/generator-gb-utility) | [![README](https://img.shields.io/badge/README--green.svg)](/packages/generator-gb-utility/README.md) 


*/

    const q = [
      `**${p.name}**`,
      `[\`${p.name}\`](https://npmjs.com/package/${p.name})`,
      `[![latest](https://img.shields.io/npm/v/${p.name}/latest.svg)](https://npmjs.com/package/${p.name})`,
      `[![README](https://img.shields.io/badge/README--green.svg)](/packages/${p.name}/README.md)`,
    ];
    return q;
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

      return buffs
        .map((buff) => JSON.parse(buff.toString()) as PackageConfig)
        .filter((p) => !p.private)
        .map((p) => `${p.name}`)
        .join('\n');
    } catch (e) {
      return 'unknown error';
    }
  }
}
