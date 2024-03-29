# gb-lerna/cli

[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![latest](https://img.shields.io/npm/v/@gb-lerna/cli/latest.svg)](https://npmjs.com/package/@gb-lerna/cli)

Create and maintain a [Lerna monorepo](https://lerna.js.org/) with Typescript.

## Installation

```
npm install -g @gb-lerna/cli
```

## Create a new monorepo

```shell
mkdir sample-project
cd sample-project
git init
gb-lerna repo @sample/website
gb-lerna package @sample/api
gb-lerna package @sample/admin
gb-lerna module --kind values personnel @sample/admin
gb-lerna module --kind class student @sample/admin
npm install
lerna bootstrap
lerna add @sample/api --scope @sample/website
lerna add @sample/api --scope @sample/admin
npm test
```

## Add another package to your project

```shell
cd your-app
gb-lerna package @sample/tools
```

## Commands

### repo|repository [options] &lt;initialPackage>

create a new monorepo with initial package

```
Options:
  -i, --independent  version packages independently
  -h, --help         display help for command
```

### package [options] &lt;name>

create a new package

```
Options:
  -h, --help  display help for command
```

### module [options] &lt;name> [scope]

create a new class or funtions module

Optionally you can prepend a path to the name argument such as `path/to/name`.

Use `--kind class` to create a JavaScript class and test. Use `--kind values` (the default) to create a new module for exporting functions, objects or primitive values and a test for the module.

```
Options:
  -k, --kind <kind>  the kind of module (choices: "class", "values")
  --no-test          skip spec file
  -h, --help         display help for command
```

### info [options]

print out a markdown table listing the packages in your monorepo.

```
Options:
  -v, --verbose  verbose output
  -h, --help     display help for command
```

### [options] [command]

```
Options:
  -V, --version                    output the version number
  -f, --force                      use force on schematics
  -d, --dryRun                     dry run only
  -h, --help                       display help for command

Commands:
  repo [options] [initialPackage]  create a new monorepo with initial package
  package <name>                   create a new package
  module [options] <name> [scope]  create a new class or module
  info [options]                   print information about your lerna repo
  help [command]                   display help for command
```
