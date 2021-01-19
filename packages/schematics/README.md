# gb-lerna/schematics

[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![latest](https://img.shields.io/npm/v/@gb-lerna/schematics/latest.svg)](https://npmjs.com/package/@gb-lerna/schematics)

Some schematics for creating and maintaining a [Lerna monorepo](https://lerna.js.org/) with Typescript.

## Installation

```
npm install -g lerna @angular-devkit/schematics-cli
```

## Create a new monorepo

```
mkdir sample-project
cd sample-project
schematics @gb-lerna/schematics:repo --packageName @sample/website --no-independent
schematics @gb-lerna/schematics:package --name @sample/api
schematics @gb-lerna/schematics:package --name @sample/admin
schematics @gb-lerna/schematics:module --name lol --packageName @sample/admin
lerna bootstrap
lerna add @sample/api --scope=@sample/website
lerna add @sample/api --scope=@sample/admin
npm install
npm run format
npm test
```

## Add another package to your project

```
cd your-app
schematics gb-lerna/schematics:package @sample/tools
```

## Schematics

```
schematics gb-lerna/schematics: --list-schematics
```

| schematic         | purpose                                         |
| ----------------- | ----------------------------------------------- |
| eslint            | add eslint to your project                      |
| module            | add a new class or function module to a package |
| package           | add a new package to your monorepo              |
| prettier          | add prettier to your project                    |
| repository (repo) | create a new monorepo project                   |

### See also

- [Angular Schematics](https://github.com/angular/angular-cli/tree/master/packages/schematics/angular)
- [Schematics README](https://github.com/angular/angular-cli/blob/master/packages/angular_devkit/schematics/README.md)
- [Angular Blog](https://blog.angular.io/schematics-an-introduction-dc1dfbc2a2b2)
