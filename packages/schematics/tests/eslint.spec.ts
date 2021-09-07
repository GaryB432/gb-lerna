import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { getFromJsonFile, IPackageJson } from '../src/utils';

const collectionPath = path.join(__dirname, '../src/collection.json');
const packageInfo = `{
  "devDependencies": {
  },
  "scripts": {
    "test": "yes please"
  }
}`;

describe('eslint', () => {
  it('works', async () => {
    const seedTree = Tree.empty();
    seedTree.create('/package.json', packageInfo);
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const tree = await runner
      .runSchematicAsync('eslint', {}, seedTree)
      .toPromise();

    expect(tree.files).toEqual([
      '/package.json',
      '/.eslintignore',
      '/.eslintrc.js',
    ]);

    const packageJson: IPackageJson = getFromJsonFile(tree, 'package.json');
    packageJson.devDependencies = packageJson.devDependencies || {};
    packageJson.scripts = packageJson.scripts || {};

    expect(
      packageJson.devDependencies['@typescript-eslint/eslint-plugin']
    ).toBeDefined();
    expect(
      packageJson.devDependencies['@typescript-eslint/parser']
    ).toBeDefined();
    expect(packageJson.devDependencies['eslint']).toBeDefined();
    expect(packageJson.devDependencies['eslint-config-prettier']).toBeDefined();
    expect(packageJson.devDependencies['eslint-plugin-prettier']).toBeDefined();
    expect(packageJson.devDependencies['eslint-plugin-jest']).toBeDefined();
    expect(packageJson.scripts['test']).toEqual('yes please');
    expect(packageJson.scripts['posttest']).toEqual('eslint --ext ts .');
  });
});
