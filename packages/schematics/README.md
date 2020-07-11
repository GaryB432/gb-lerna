# gb-lerna/schematics

Some schematics for creating and maintaining a [Lerna monorepo](https://lerna.js.org/) with Typescript.

## Installation

```
npm install -g lerna @angular-devkit/schematics-cli
```

## Create a new monorepo

```
mkdir sample-project
cd sample-project
git init
schematics @gb-lerna/schematics:repo @sample/website
schematics @gb-lerna/schematics:package @sample/api
schematics @gb-lerna/schematics:package @sample/admin
npm install
lerna bootstrap
lerna add @sample/api --scope=@sample/website
lerna add @sample/api --scope=@sample/admin
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

| schematic | purpose |
|-|-|
| eslint | add eslint to your project |
| package | add a new package to your monorepo |
| prettier | add prettier to your project |
| repository (repo) | create a new monorepo project |


### See also

* [Angular Schematics](https://github.com/angular/angular-cli/tree/master/packages/schematics/angular)
* [Schematics README](https://github.com/angular/angular-cli/blob/master/packages/angular_devkit/schematics/README.md)
* [Angular Blog](https://blog.angular.io/schematics-an-introduction-dc1dfbc2a2b2)
