# gb-lerna

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

create and maintain lerna monorepo using typescript

## Packages

| Project | Package | Version | Links |
|---|---|---|---|
**schematics** | [`Schematics`](https://npmjs.com/package/@gb-lerna/schematics) | [![latest](https://img.shields.io/npm/v/@gb-lerna/schematics/latest.svg)](https://npmjs.com/package/@gb-lerna/schematics) | [![README](https://img.shields.io/badge/README--green.svg)](/packages/schematics/README.md) 
**cli** | [`CLI`](https://npmjs.com/package/@gb-lerna/cli) | [![latest](https://img.shields.io/npm/v/@gb-lerna/cli/latest.svg)](https://npmjs.com/package/@gb-lerna/cli) | [![README](https://img.shields.io/badge/README--green.svg)](/packages/cli/README.md) 


```
mkdir sample-project
cd .\sample-project\
schematics @gb-lerna/schematics:repo @sample/website --dry-run=false
schematics @gb-lerna/schematics:package @sample/api --dry-run=false
schematics @gb-lerna/schematics:package @sample/admin --dry-run=false
npm install
lerna bootstrap
lerna add @sample/api --scope=@sample/website
lerna add @sample/api --scope=@sample/admin
npm test
```