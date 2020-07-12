# gb-lerna/cli

Some schematics for creating and maintaining a [Lerna monorepo](https://lerna.js.org/) with Typescript.

## Installation

```
npm install -g @gb-lerna/cli
```

## Create a new monorepo

```properties
mkdir sample-project
cd sample-project
git init
gb-lerna repo --firstPackage @sample/website --no-independent
gb-lerna package --name @sample/api
gb-lerna package --name @sample/admin
npm install
lerna bootstrap
lerna add @sample/api --scope=@sample/website
lerna add @sample/api --scope=@sample/admin
npm test
```

## Add another package to your project

```properties
cd your-app
gb-lerna package --name @sample/tools
```


| schematic | purpose |
|-|-|
| eslint | add eslint to your project |
| package | add a new package to your monorepo |
| prettier | add prettier to your project |
| repository (repo) | create a new monorepo project |
