# gb-lerna/cli

[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![latest](https://img.shields.io/npm/v/@gb-lerna/cli/latest.svg)](https://npmjs.com/package/@gb-lerna/cli)

Create and maintain a [Lerna monorepo](https://lerna.js.org/) with Typescript.

## Installation

```
npm install -g @gb-lerna/cli
```

## Create a new monorepo

```properties
mkdir sample-project
cd sample-project
git init
gb-lerna repo @sample/website --no-independent
gb-lerna package @sample/api
gb-lerna package @sample/admin
npm install
lerna bootstrap
lerna add @sample/api --scope @sample/website
lerna add @sample/api --scope @sample/admin
npm test
```

## Add another package to your project

```properties
cd your-app
gb-lerna package @sample/tools
```

## Commands

### repo|repository [options] <initialPackage>

create a new monorepo with initial package

```
Options:
  -i, --independent  version packages independently
  -h, --help         display help for command
```

### package [options] <name>

create a new package

```
Options:
  -h, --help  display help for command
```

### [options] [command]

```
Options:
  -V, --version                    output the version number
  -f, --force                      use force on schematics
  -d, --dryRun                     dry run only
  -h, --help                       display help for command

Commands:
  repo [options] <initialPackage>  create a new monorepo with initial package
  package <name>                   create a new package
  help [command]                   display help for command
```
